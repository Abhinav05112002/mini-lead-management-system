const express =
require("express");

const router =
express.Router();

const auth =
require("../middleware/auth.middleware");

const authorize =
require("../middleware/role.middleware");

const leadController =
require("../controllers/lead.controller");

const {
 createLeadValidation
}
=
require("../validations/lead.validation");

router.post(
 "/",
 auth,
 authorize(
   "MANAGER",
   "ADMIN"
 ),
 createLeadValidation,
 leadController.createLead
);

router.get(
 "/",
 auth,
 leadController.getAllLeads
);

router.get(
 "/:id",
 auth,
 leadController.getLeadById
);

router.put(
 "/:id",
 auth,
 authorize(
   "MANAGER",
   "ADMIN"
 ),
 leadController.updateLead
);

router.delete(
 "/:id",
 auth,
 authorize(
   "MANAGER",
   "ADMIN"
 ),
 leadController.deleteLead
);

router.get(
 "/my-leads",
 auth,
 authorize("AGENT"),
 leadController.getMyLeads
);

router.patch(
 "/:id/status",
 auth,
 authorize("AGENT"),
 leadController.updateMyLeadStatus
);

module.exports = router;