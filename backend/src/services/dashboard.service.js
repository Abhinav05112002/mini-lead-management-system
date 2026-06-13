const getDashboardStats =
async ()=>{

 const result =
 await query(
 `
 SELECT

 COUNT(*) total,

 COUNT(*) FILTER
 (WHERE status='NEW')
 AS new_leads,

 COUNT(*) FILTER
 (WHERE status='CONTACTED')
 AS contacted,

 COUNT(*) FILTER
 (WHERE status='WON')
 AS won,

 COUNT(*) FILTER
 (WHERE status='LOST')
 AS lost

 FROM leads
 `
 );

 return result.rows[0];
};

module.exports = {
 getDashboardStats
};