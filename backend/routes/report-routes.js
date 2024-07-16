const express = require("express");
const router = express.Router();
const {
  getVaccinatedByGender,
  getVaccinatedByVaccineType,
  getVaccinatedByAgeGroup,
  getTotalVaccinatedUsersWithGenderDistribution
} = require("../controllers/report-controller");
const { adminAuth } = require("../middleware/authMiddleware");

router.get("/byGender/:hospitalId", adminAuth, getVaccinatedByGender);
router.get("/byVaccineType/:hospitalId", adminAuth, getVaccinatedByVaccineType);
router.get("/byAgeGroup/:hospitalId", adminAuth, getVaccinatedByAgeGroup);
router.get("/watchlist", getTotalVaccinatedUsersWithGenderDistribution);

module.exports = router;
