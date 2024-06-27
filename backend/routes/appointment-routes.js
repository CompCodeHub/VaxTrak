const express = require("express");
const router = express.Router();
const { makeAppointment } = require("../controllers/appointment-controller");
const { userAuth } = require("../middleware/authMiddleware");

router.route("/").post(userAuth, makeAppointment);

module.exports = router;
