const Notification = require("../models/Notification");
const { emitNotification } = require("./socket.service");

const deliverEmail = async (notification) => {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL;
  if (!webhookUrl) return { status: "FAILED", error: "EMAIL_WEBHOOK_URL is not configured." };
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: notification.title, text: notification.message, notificationId: notification._id })
  });
  if (!response.ok) return { status: "FAILED", error: `Email webhook returned ${response.status}.` };
  return { status: "SENT" };
};

const notifyBookingBlocked = async (booking) => {
  await booking.populate("branch room bed");
  const branchName = booking.branch?.name || "Branch";
  const roomName = booking.room?.name || "room";
  const berth = booking.bed?.berthPosition && booking.bed.berthPosition !== "SINGLE" ? ` ${booking.bed.berthPosition.toLowerCase()} berth` : "";
  const location = `${branchName}, ${roomName}, ${booking.bed?.label || "bed"}${berth}`;
  const message = `${booking.guestName} (${booking.guestPhone}) blocked ${location}.`;
  const dashboard = await Notification.create({ type: "BOOKING_BLOCKED", booking: booking._id, title: "Bed blocked", message, delivery: "DASHBOARD", status: "SENT", deliveredAt: new Date() });
  emitNotification(dashboard);
  const email = await Notification.create({ type: "BOOKING_BLOCKED", booking: booking._id, title: "Mom's Care: bed blocked", message, delivery: "EMAIL" });
  try {
    const result = await deliverEmail(email);
    email.status = result.status;
    email.error = result.error;
    email.deliveredAt = result.status === "SENT" ? new Date() : undefined;
    await email.save();
  } catch (error) {
    email.status = "FAILED";
    email.error = error.message;
    await email.save();
  }
  return { dashboard, email };
};

module.exports = { notifyBookingBlocked };
