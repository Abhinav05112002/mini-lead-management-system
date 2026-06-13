const bcrypt = require("bcryptjs");
const query = require("../utils/query");

const registerUser = async (userData) => {

  const { name, email, password, role } = userData;

  const existingUser = await query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users
     (name,email,password,role)
     VALUES($1,$2,$3,$4)
     RETURNING id,name,email,role`,
    [name, email, hashedPassword, role]
  );

  return result.rows[0];
};

module.exports = {
  registerUser
};

const loginUser = async (email, password) => {

  const result = await query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser
};