const connectDB = require("../config/db");
const Branch = require("../models/Branch");
const Room = require("../models/Room");
const Bed = require("../models/Bed");
const Booking = require("../models/Booking");
const Resident = require("../models/Resident");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const User = require("../models/User");

const branchDefinitions = [
  { code: "MC-ANN", name: "Mom's Care PG House - Anna Nagar", address: "Anna Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600040", gender: "Girls", latitude: 13.0878, longitude: 80.2089, demoRoomName: "101" },
  { code: "MC-VIR", name: "Mom's Care PG House - Virugambakkam", address: "Virugambakkam", city: "Chennai", state: "Tamil Nadu", pincode: "600092", gender: "Girls", latitude: 13.0527, longitude: 80.191, demoRoomName: "102" }
];

const seed = async () => {
  await connectDB();
  const allowedCodes = branchDefinitions.map(({ code }) => code);
  const retiredBranches = await Branch.find({ code: { $nin: allowedCodes } }).select("_id");
  const retiredBranchIds = retiredBranches.map(({ _id }) => _id);

  if (retiredBranchIds.length) {
    const retiredBookings = await Booking.find({ branch: { $in: retiredBranchIds } }).select("_id");
    const retiredBookingIds = retiredBookings.map(({ _id }) => _id);
    await Promise.all([
      Payment.deleteMany({ branch: { $in: retiredBranchIds } }),
      Notification.deleteMany({ booking: { $in: retiredBookingIds } }),
      Booking.deleteMany({ branch: { $in: retiredBranchIds } }),
      Resident.deleteMany({ branch: { $in: retiredBranchIds } }),
      Bed.deleteMany({ branch: { $in: retiredBranchIds } }),
      Room.deleteMany({ branch: { $in: retiredBranchIds } }),
      User.deleteMany({ role: "WARDEN", branch: { $in: retiredBranchIds } })
    ]);
    await Branch.deleteMany({ _id: { $in: retiredBranchIds } });
    console.log(`[seed] Removed ${retiredBranchIds.length} non-launch branch record(s) and their dependent rooms, beds, bookings, residents, payments, notifications, and wardens.`);
  }

  for (const definition of branchDefinitions) {
    const branch = await Branch.findOneAndUpdate({ code: definition.code }, definition, { new: true, upsert: true, setDefaultsOnInsert: true });
    const room = await Room.findOneAndUpdate(
      { branch: branch._id, name: definition.demoRoomName },
      { branch: branch._id, name: definition.demoRoomName, floor: "1", sharingType: 3, roomType: "AC", monthlyRent: 18000, tokenAmount: 3000, isActive: true },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const inventory = [
      { label: "Bed A", bedType: "SINGLE_COT", berthPosition: "SINGLE", position: { row: 1, col: 1 } },
      { label: "Cot C1 Upper", bedType: "DOUBLE_COT", cotCode: "C1", berthPosition: "UPPER", position: { row: 1, col: 2 } },
      { label: "Cot C1 Lower", bedType: "DOUBLE_COT", cotCode: "C1", berthPosition: "LOWER", position: { row: 2, col: 2 } }
    ];
    for (const bed of inventory) {
      await Bed.findOneAndUpdate(
        { room: room._id, label: bed.label },
        { ...bed, branch: branch._id, room: room._id, status: "AVAILABLE" },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }
  }
  console.log("[seed] Mom's Care two-branch demo inventory created.");
  process.exit(0);
};

seed().catch((error) => { console.error(error); process.exit(1); });
