const Notification = require("../models/Notification");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const list = catchAsync(async (_req, res) => {
  const data = await Notification.find({ recipientRole: "SUPER_ADMIN" })
    .populate({ path: "booking", populate: ["branch", "room", "bed"] })
    .sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const markRead = catchAsync(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError(404, "Notification not found.");
  notification.status = "READ";
  notification.readAt = new Date();
  await notification.save();
  res.json({ success: true, data: notification });
});

module.exports = { list, markRead };
