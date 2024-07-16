const express = require("express");
const router = express.Router();
const {
  getAvailableAppointments,
  createAppointment,
  getAppointmentsByDate,
  getUserAppointmentsByDate,
  payUserAppointmentCharges,
  cancelAppointment,
  getUnapprovedAppointments,
  approveAppointment,
  markAppointmentAsCompleted
} = require("../controllers/appointment-controller");
const { userAuth, adminAuth } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(userAuth, createAppointment)
  .get(adminAuth, getAppointmentsByDate);
router.get("/available-slots", userAuth, getAvailableAppointments);
router.get("/user-appointments", userAuth, getUserAppointmentsByDate);
router.delete("/:id", cancelAppointment);
router.put("/:id/pay", userAuth, payUserAppointmentCharges);
router.get("/unapproved", adminAuth, getUnapprovedAppointments);
router.put("/:id/approve", adminAuth, approveAppointment);
router.put("/:id/complete", adminAuth, markAppointmentAsCompleted);

module.exports = router;
