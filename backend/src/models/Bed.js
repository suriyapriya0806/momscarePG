const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    label: { type: String, required: true, trim: true },
    bedType: { type: String, enum: ["SINGLE_COT", "DOUBLE_COT"], default: "SINGLE_COT" },
    // A double cot is represented by two independently bookable Bed documents
    // sharing this code: one UPPER berth and one LOWER berth.
    cotCode: { type: String, trim: true },
    berthPosition: { type: String, enum: ["SINGLE", "UPPER", "LOWER"], default: "SINGLE" },
    position: { row: Number, col: Number },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"],
      default: "AVAILABLE"
    },
    currentResident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
    holdExpiresAt: { type: Date }
  },
  { timestamps: true }
);

bedSchema.index({ room: 1, label: 1 }, { unique: true });
bedSchema.index(
  { room: 1, cotCode: 1, berthPosition: 1 },
  { unique: true, partialFilterExpression: { cotCode: { $type: "string" } } }
);

module.exports = mongoose.model("Bed", bedSchema);
