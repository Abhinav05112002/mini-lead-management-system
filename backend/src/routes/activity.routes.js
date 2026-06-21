const express = require("express");

const router = express.Router();

const auth =
require("../middleware/auth.middleware");

const authorize =
require("../middleware/role.middleware");

const activityController =
require("../controllers/activity.controller");

router.get(
  "/",
  auth,
  authorize("ADMIN", "MANAGER"),
  activityController.getLogs
);

module.exports = router;