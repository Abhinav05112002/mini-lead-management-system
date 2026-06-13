const { body } = require("express-validator");

exports.createLeadValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone required"),

  body("source")
    .notEmpty()
    .withMessage("Source required")
];