const dashboardService =
require("../services/dashboard.service");

exports.getStats =
async (req,res)=>{

 try {

   const stats =
   await dashboardService
   .getDashboardStats();

   res.json({
      success:true,
      data:stats
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};