const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["BOOKING_BLOCKED"], required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    recipientRole: { type: String, enum: ["SUPER_ADMIN"], default: "SUPER_ADMIN" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    delivery: { type: String, enum: ["DASHBOARD", "EMAIL"], required: true },
    status: { type: String, enum: ["PENDING", "SENT", "FAILED", "READ"], default: "PENDING" },
    deliveredAt: { type: Date },
    readAt: { type: Date },
    error: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
