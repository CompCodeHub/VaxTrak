const express = require("express");
const router = express.Router();
const {
  registerHospital,
  getAllHospitals,
  getHospitalById,
  addVaccineToHospital,
  removeVaccineFromHospital,
} = require("../controllers/hospital-controller");
const { userAuth, adminAuth } = require("../middleware/authMiddleware");

router.route("/").post(registerHospital).get(userAuth, getAllHospitals);
router.route("/:id").get(getHospitalById);
router
  .route("/:id/vaccines")
  .put(adminAuth, addVaccineToHospital)
  .delete(adminAuth, removeVaccineFromHospital);

module.exports = router;
