const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth.middleware");

const dashboardController =
require("../controllers/dashboard.controller");

router.get(
 "/stats",
 auth,
 dashboardController.getStats
);

module.exports = router;