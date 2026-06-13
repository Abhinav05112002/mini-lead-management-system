const pool = require("../config/db");

const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

module.exports = query;