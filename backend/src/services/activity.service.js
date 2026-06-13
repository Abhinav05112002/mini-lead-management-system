const query = require("../utils/query");

const createActivityLog = async (
  leadId,
  action,
  userId,
  description
) => {

  await query(
    `
    INSERT INTO activity_logs
    (
      lead_id,
      action,
      performed_by,
      description
    )
    VALUES($1,$2,$3,$4)
    `,
    [
      leadId,
      action,
      userId,
      description
    ]
  );
};

const getActivityLogs =
async ()=>{

 const result =
 await query(
 `
 SELECT

 al.*,

 u.name AS user_name,

 l.name AS lead_name

 FROM activity_logs al

 LEFT JOIN users u
 ON al.performed_by=u.id

 LEFT JOIN leads l
 ON al.lead_id=l.id

 ORDER BY
 al.created_at DESC
 `
 );

 return result.rows;
};

module.exports = {
  createActivityLog,
  getActivityLogs
};