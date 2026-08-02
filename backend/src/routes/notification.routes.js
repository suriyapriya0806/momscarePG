const express = require("express");
const controller = require("../controllers/notification.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/error.middleware");
const { mongoId } = require("../validators/common.validators");

const router = express.Router();
router.use(authenticate, authorize("SUPER_ADMIN"));
router.get("/", controller.list);
router.patch("/:id/read", mongoId(), validate, controller.markRead);
module.exports = router;
