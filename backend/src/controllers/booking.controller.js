const Bed = require("../models/Bed");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Resident = require("../models/Resident");
const Room = require("../models/Room");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const { emitBedAvailability, emitBookingBlocked, emitPaymentUpdate } = require("../services/socket.service");
const { releaseExpiredHolds } = require("../services/bookingHold.service");
const { notifyBookingBlocked } = require("../services/notification.service");

const HOLD_DURATION_MS = 24 * 60 * 60 * 1000;

// This is deliberately a compare-and-set update, rather than a read followed by
// a save. MongoDB evaluates the status predicate when it writes the document,
// so two requests can never both change the same AVAILABLE berth to RESERVED.
const claimAvailableBed = (bed, room, branch, holdExpiresAt) => {
  const update = holdExpiresAt
    ? { $set: { status: "RESERVED", holdExpiresAt } }
    : { $set: { status: "RESERVED" }, $unset: { holdExpiresAt: 1 } };

  return Bed.findOneAndUpdate(
    { _id: bed, room, branch, status: "AVAILABLE" },
    update,
    { new: true, runValidators: true }
  );
};

const releaseClaimAfterFailedBooking = (bed) =>
  Bed.findOneAndUpdate(
    {
      _id: bed._id,
      status: "RESERVED",
      holdExpiresAt: bed.holdExpiresAt
    },
    { $set: { status: "AVAILABLE" }, $unset: { holdExpiresAt: 1 } },
    { new: true }
  );

const list = catchAsync(async (req, res) => {
  await releaseExpiredHolds();
  const filter = {};
  if (req.user.role === "GUEST") filter.guest = req.user._id;
  if (req.user.role === "WARDEN" && req.user.branch) filter.branch = req.user.branch;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.branch && req.user.role === "SUPER_ADMIN") filter.branch = req.query.branch;

  const data = await Booking.find(filter)
    .populate("guest branch room bed approvedBy")
    .sort({ createdAt: -1 });

  res.json({ success: true, data });
});

const create = catchAsync(async (req, res) => {
  const { branch, room, bed, moveInDate, notes, guestName, guestPhone, mobileNumber } = req.body;
  await releaseExpiredHolds();
  const roomDoc = await Room.findById(room);
  if (!roomDoc) throw new ApiError(404, "Room not found.");

  const selectedBed = await claimAvailableBed(bed, room, branch, new Date(Date.now() + HOLD_DURATION_MS));
  if (!selectedBed) throw new ApiError(409, "Selected bed is already reserved or no longer available.");

  let booking;
  try {
    booking = await Booking.create({
      guest: req.user._id,
      branch,
      room,
      bed,
      guestName: guestName || req.user.name,
      guestPhone: guestPhone || mobileNumber || req.user.phone,
      moveInDate,
      notes,
      tokenAmount: roomDoc.tokenAmount,
      status: "BLOCKED",
      holdExpiresAt: selectedBed.holdExpiresAt
    });
  } catch (error) {
    await releaseClaimAfterFailedBooking(selectedBed);
    throw error;
  }

  emitBedAvailability(selectedBed);
  emitBookingBlocked(booking);
  await notifyBookingBlocked(booking);
  res.status(201).json({ success: true, data: booking });
});

const createDirect = catchAsync(async (req, res) => {
  const { branch, room, bed, moveInDate, notes, guestName, guestPhone, guestEmail, source = "WALK_IN" } = req.body;
  if (!guestName || !guestPhone) throw new ApiError(422, "Guest name and mobile number are required.");

  await releaseExpiredHolds();
  const roomDoc = await Room.findById(room);
  if (!roomDoc) throw new ApiError(404, "Room not found.");

  const selectedBed = await claimAvailableBed(bed, room, branch, undefined);
  if (!selectedBed) throw new ApiError(409, "Selected bed is already reserved or no longer available.");

  let booking;
  try {
    const email = String(guestEmail || `walkin-${Date.now()}@pgstay.local`).toLowerCase();
    let guest = await User.findOne({ email });
    if (!guest) {
      guest = await User.create({ name: guestName, email, phone: guestPhone, role: "GUEST", provider: "local" });
    }

    booking = await Booking.create({
      guest: guest._id,
      branch,
      room,
      bed,
      guestName,
      guestPhone,
      source: source === "PHONE" ? "PHONE" : "WALK_IN",
      moveInDate,
      notes,
      tokenAmount: roomDoc.tokenAmount,
      status: "BLOCKED"
    });
  } catch (error) {
    await releaseClaimAfterFailedBooking(selectedBed);
    throw error;
  }

  emitBedAvailability(selectedBed);
  emitBookingBlocked(booking);
  await notifyBookingBlocked(booking);
  res.status(201).json({ success: true, data: booking });
});

const approve = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found.");
  if (!["BLOCKED", "PENDING_APPROVAL"].includes(booking.status)) throw new ApiError(409, "Booking is not pending approval.");

  const amountReceived = Number(req.body.amount || req.body.amountReceived || booking.tokenAmount || 0);
  if (!amountReceived || amountReceived <= 0) throw new ApiError(422, "Amount received is required for manual confirmation.");

  const bed = await Bed.findById(booking.bed);
  if (!bed || !["RESERVED", "AVAILABLE"].includes(bed.status)) throw new ApiError(409, "Bed cannot be approved.");

  booking.status = "APPROVED";
  booking.approvedBy = req.user._id;
  booking.approvedAt = new Date();
  booking.holdExpiresAt = undefined;
  bed.status = "OCCUPIED";
  bed.holdExpiresAt = undefined;

  const resident = await Resident.create({
    user: booking.guest,
    booking: booking._id,
    branch: booking.branch,
    room: booking.room,
    bed: booking.bed,
    moveInDate: booking.moveInDate
  });

  const payment = await Payment.create({
    booking: booking._id,
    guest: booking.guest,
    branch: booking.branch,
    amount: amountReceived,
    type: req.body.paymentType || "TOKEN",
    status: "PAID",
    method: req.body.method || "CASH",
    reference: req.body.reference || req.body.referenceNumber,
    receiptNumber: req.body.receiptNumber,
    collectedBy: req.user._id,
    collectedByName: req.user.name,
    paidAt: req.body.paidAt ? new Date(req.body.paidAt) : new Date()
  });
  emitPaymentUpdate(payment);

  bed.currentResident = resident._id;
  await booking.save();
  await bed.save();
  emitBedAvailability(bed);

  res.json({ success: true, data: booking });
});

const reject = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found.");

  const bed = await Bed.findById(booking.bed);
  booking.status = "REJECTED";
  booking.rejectionReason = req.body.reason || "Rejected by Super Admin";
  booking.holdExpiresAt = undefined;
  if (bed && bed.status !== "OCCUPIED") {
    bed.status = "AVAILABLE";
    bed.holdExpiresAt = undefined;
    await bed.save();
    emitBedAvailability(bed);
  }
  await booking.save();

  res.json({ success: true, data: booking });
});

module.exports = { list, create, createDirect, approve, reject };
