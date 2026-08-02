const Bed = require("../models/Bed");
const createCrudController = require("./crudFactory");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const { emitBedAvailability } = require("../services/socket.service");
const { releaseExpiredHolds } = require("../services/bookingHold.service");

const allowedStatuses = ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"];
const statusAliases = {
  Available: "AVAILABLE",
  Occupied: "OCCUPIED",
  Reserved: "RESERVED",
  Maintenance: "MAINTENANCE",
  HELD: "RESERVED",
  BOOKED: "RESERVED"
};

const normalizeStatus = (status) => statusAliases[status] || String(status || "").toUpperCase();

const crud = createCrudController(Bed, {
  populate: "branch room currentResident",
  filterFields: ["branch", "room", "status"]
});

const list = catchAsync(async (req, res) => {
  await releaseExpiredHolds();
  const filter = {};
  ["branch", "room", "status", "bedType", "cotCode", "berthPosition"].forEach((field) => {
    if (req.query[field] !== undefined) filter[field] = req.query[field];
  });
  const data = await Bed.find(filter).populate("branch room currentResident").sort({ cotCode: 1, berthPosition: 1, label: 1 });
  res.json({ success: true, data });
});

const create = catchAsync(async (req, res) => {
  const payload = { ...req.body };
  if (payload.status) {
    payload.status = normalizeStatus(payload.status);
    if (!allowedStatuses.includes(payload.status)) {
      throw new ApiError(422, "Invalid bed availability status.");
    }
  }

  const bed = await Bed.create(payload);
  emitBedAvailability(bed);
  res.status(201).json({ success: true, data: bed });
});

const update = catchAsync(async (req, res) => {
  const existingBed = await Bed.findById(req.params.id);
  if (!existingBed) throw new ApiError(404, "Bed not found.");

  const isWarden = req.user.role === "WARDEN";
  if (isWarden) {
    if (!req.user.branch || existingBed.branch.toString() !== req.user.branch.toString()) {
      throw new ApiError(403, "Wardens can update availability only for their assigned branch.");
    }

    const requestedFields = Object.keys(req.body);
    if (requestedFields.length !== 1 || !requestedFields.includes("status")) {
      throw new ApiError(403, "Wardens can update availability status only.");
    }
  }

  const payload = { ...req.body };
  if (payload.status) {
    payload.status = normalizeStatus(payload.status);
    if (!allowedStatuses.includes(payload.status)) {
      throw new ApiError(422, "Invalid bed availability status.");
    }
  }

  const bed = await Bed.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
    .populate("branch room currentResident");
  emitBedAvailability(bed);
  res.json({ success: true, data: bed });
});

module.exports = { ...crud, list, create, update };
