const { validationResult } =
  require("express-validator");

const authService =
  require("../services/auth.service");

const { generateToken } =
  require("../utils/jwt");

exports.register = async (req, res) => {

  try {

    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const user =
      await authService.registerUser(
        req.body
      );

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

exports.login = async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const user =
      await authService.loginUser(
        email,
        password
      );

    const token =
      generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: error.message
    });

  }
};