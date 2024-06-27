const express = require("express");
const router = express.Router();
const {
  registerHospital,
  getAllHospitals,
} = require("../controllers/hospital-controller");
const { userAuth } = require("../middleware/authMiddleware");

router.route("/").post(registerHospital).get(userAuth, getAllHospitals);

module.exports = router;
