const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
  getAllUsers,
} = require("../controllers/user-controller");
const { userAuth } = require("../middleware/authMiddleware");

router.route("/").post(signupUser).get(userAuth, getAllUsers);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

// Route for verifying authorization
router.route("/auth").get(userAuth);

module.exports = router;
