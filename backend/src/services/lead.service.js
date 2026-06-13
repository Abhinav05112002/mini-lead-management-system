const query = require("../utils/query");

const {
  getLeastLoadedAgent
} = require("./assignment.service");

const {
  createActivityLog
} = require("./activity.service");

const createLead = async (
  leadData,
  managerId
) => {

  const {
    name,
    email,
    phone,
    source,
    notes
  } = leadData;

  const agent =
    await getLeastLoadedAgent();

  if (!agent) {
    throw new Error(
      "No agent available"
    );
  }

  const result = await query(
    `
    INSERT INTO leads
    (
      name,
      email,
      phone,
      source,
      status,
      notes,
      assigned_to,
      created_by
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8)

    RETURNING *
    `,
    [
      name,
      email,
      phone,
      source,
      "NEW",
      notes,
      agent.id,
      managerId
    ]
  );

  const lead =
    result.rows[0];

  await createActivityLog(
    lead.id,
    "LEAD_CREATED",
    managerId,
    `Lead created and assigned to agent ${agent.id}`
  );

  return lead;
};

const getLeadById = async (id) => {

  const result = await query(
    `
    SELECT
      l.*,
      u.name AS assigned_agent

    FROM leads l

    LEFT JOIN users u
    ON l.assigned_to = u.id

    WHERE l.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const deleteLead = async (id) => {

  const result = await query(
    `
    DELETE FROM leads
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

const updateLead = async (
  id,
  data,
  userId
) => {

  const {
    name,
    email,
    phone,
    source,
    status,
    notes
  } = data;

  const existing =
    await getLeadById(id);

  if (!existing) {
    throw new Error(
      "Lead not found"
    );
  }

  const result = await query(
    `
    UPDATE leads

    SET
      name=$1,
      email=$2,
      phone=$3,
      source=$4,
      status=$5,
      notes=$6

    WHERE id=$7

    RETURNING *
    `,
    [
      name,
      email,
      phone,
      source,
      status,
      notes,
      id
    ]
  );

  if (
    existing.status !== status
  ) {

    await createActivityLog(
      id,
      "STATUS_CHANGED",
      userId,
      `${existing.status} -> ${status}`
    );

  }

  await createActivityLog(
    id,
    "LEAD_UPDATED",
    userId,
    "Lead updated"
  );

  return result.rows[0];
};

const getAllLeads = async (
  queryParams
) => {

  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    source,
    sort = "created_at",
    order = "DESC"
  } = queryParams;

  const offset =
    (page - 1) * limit;

  let sql = `
  SELECT *
  FROM leads
  WHERE 1=1
  `;

  const values = [];

  let count = 1;

if (search) {

  sql += `
  AND (
      name ILIKE $${count}
      OR email ILIKE $${count}
      OR phone ILIKE $${count}
  )
  `;

  values.push(
    `%${search}%`
  );

  count++;
}

if (status) {

  sql += `
  AND status = $${count}
  `;

  values.push(status);

  count++;
}

if (source) {

  sql += `
  AND source = $${count}
  `;

  values.push(source);

  count++;
}

sql += `
ORDER BY ${sort} ${order}
`;

sql += `
LIMIT $${count}
OFFSET $${count + 1}
`;

values.push(limit);
values.push(offset);

const result =
await query(
  sql,
  values
);

return result.rows;
};

const getAgentLeads = async (
  agentId
) => {

  const result = await query(
    `
    SELECT *
    FROM leads

    WHERE assigned_to=$1

    ORDER BY created_at DESC
    `,
    [agentId]
  );

  return result.rows;
};

const updateLeadStatus =
async (
 leadId,
 status,
 agentId
)=>{

 const result =
 await query(
 `
 UPDATE leads

 SET status=$1

 WHERE
   id=$2
   AND assigned_to=$3

 RETURNING *
 `,
 [
   status,
   leadId,
   agentId
 ]
 );

 return result.rows[0];


await createActivityLog(
 leadId,
 "STATUS_CHANGED",
 agentId,
 `Status changed to ${status}`);
};

module.exports = {
  createLead,
  getLeadById,
  getAllLeads,
  updateLead,
  deleteLead,
  getAgentLeads,
  updateLeadStatus
};
