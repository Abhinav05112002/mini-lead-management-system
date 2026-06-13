const { body } = require("express-validator");

exports.registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),

  body("role")
    .isIn(["ADMIN", "MANAGER", "AGENT"])
    .withMessage("Invalid role")
];

exports.loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty()
];