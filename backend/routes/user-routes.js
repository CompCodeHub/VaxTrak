const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getVaccinationReport,
} = require("../controllers/user-controller");
const { userAuth } = require("../middleware/authMiddleware");

router.route("/").post(signupUser).get(userAuth, getAllUsers);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/vaccination-report").get(userAuth, getVaccinationReport);

// Route for verifying authorization
router.route("/auth").get(userAuth);

module.exports = router;
