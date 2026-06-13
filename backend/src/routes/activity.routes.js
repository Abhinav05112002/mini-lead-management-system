router.get(
 "/",
 auth,
 authorize(
   "ADMIN",
   "MANAGER"
 ),
 activityController.getLogs
);

module.exports = router;