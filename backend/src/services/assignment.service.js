const query = require("../utils/query");

const getLeastLoadedAgent = async () => {

  const result = await query(
    `
    SELECT
      u.id,
      COUNT(l.id) AS lead_count

    FROM users u

    LEFT JOIN leads l
    ON u.id = l.assigned_to

    WHERE u.role='AGENT'

    GROUP BY u.id

    ORDER BY lead_count ASC

    LIMIT 1
    `
  );

  return result.rows[0];
};

module.exports = {
  getLeastLoadedAgent
};