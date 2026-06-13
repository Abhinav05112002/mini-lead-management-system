const { validationResult } =
  require("express-validator");

const leadService =
  require("../services/lead.service");

exports.createLead = async (
  req,
  res
) => {

  try {

    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {

      return res.status(400).json({
        errors: errors.array()
      });

    }

    const lead =
      await leadService.createLead(
        req.body,
        req.user.id
      );

    res.status(201).json({
      success: true,
      data: lead
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getAllLeads =
async (req,res) => {

 try {

   const leads =
   await leadService
   .getAllLeads(req.query);

   res.json({
     success:true,
     data:leads
   });

 } catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.getLeadById =
async (req,res) => {

 try {

   const lead =
   await leadService
   .getLeadById(
      req.params.id
   );

   res.json({
      success:true,
      data:lead
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};

exports.updateLead =
async (req,res)=>{

 try {

   const lead =
   await leadService
   .updateLead(
      req.params.id,
      req.body,
      req.user.id
   );

   res.json({
      success:true,
      data:lead
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};

exports.deleteLead =
async (req,res)=>{

 try {

   const lead =
   await leadService
   .deleteLead(
      req.params.id
   );

   res.json({
      success:true,
      data:lead
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};

exports.getMyLeads =
async (req,res)=>{

 try {

   const leads =
   await leadService
   .getAgentLeads(
      req.user.id
   );

   res.json({
      success:true,
      data:leads
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};

exports.updateMyLeadStatus =
async (req,res)=>{

 try {

   const lead =
   await leadService
   .updateLeadStatus(
      req.params.id,
      req.body.status,
      req.user.id
   );

   res.json({
      success:true,
      data:lead
   });

 } catch(error){

   res.status(500).json({
      message:error.message
   });

 }

};