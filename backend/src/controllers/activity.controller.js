const activityService =
require("../services/activity.service");

exports.getLogs =
async (req,res)=>{

 try {

   const logs =
   await activityService
   .getActivityLogs();

   res.json({
      success:true,
      data:logs
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};