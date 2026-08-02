const Bed = require("../models/Bed");
const Booking = require("../models/Booking");
const { emitBedAvailability } = require("./socket.service");

const releaseExpiredHolds = async () => {
  const now = new Date();
  const expiredBookings = await Booking.find({ status: "BLOCKED", holdExpiresAt: { $lte: now } });
  if (!expiredBookings.length) return 0;

  for (const booking of expiredBookings) {
    booking.status = "CANCELLED";
    booking.cancellationReason = "Bed hold expired";
    await booking.save();
    const bed = await Bed.findById(booking.bed);
    if (bed?.status === "RESERVED" && bed.holdExpiresAt && bed.holdExpiresAt <= now) {
      bed.status = "AVAILABLE";
      bed.holdExpiresAt = undefined;
      await bed.save();
      emitBedAvailability(bed);
    }
  }
  return expiredBookings.length;
};

module.exports = { releaseExpiredHolds };
