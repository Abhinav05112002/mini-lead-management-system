const express = require("express");

const auth =
require("../middleware/auth.middleware");

const authorize =
require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/manager",
  auth,
  authorize("MANAGER"),
  (req,res)=>{
      res.json({
        message:
        "Manager Access Granted"
      });
  }
);

module.exports = router;