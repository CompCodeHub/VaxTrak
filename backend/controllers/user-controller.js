const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const { generateToken } = require("../utils/tokenGenerator");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");

const signupUser = async (req, res) => {
  // Extract details from user body
  const {
    firstName,
    lastName,
    email,
    password,
    dob,
    bloodGroup,
    age,
    profession,
    contact,
    address,
    gender,
    existingMedicalConditions,
  } = req.body;

  try {
    // Sign up user
    const user = await User.signup(
      firstName,
      lastName,
      email,
      password,
      dob,
      bloodGroup,
      age,
      profession,
      contact,
      address,
      gender,
      existingMedicalConditions,
      res
    );

    // generate jwt cookie
    generateToken(res, user._id);

    // Send back everything except password
    const userToSend = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      bloodGroup: user.bloodGroup,
      age: user.age,
      profession: user.profession,
      contact: user.contact,
      address: user.address,
      gender: user.gender,
      existingMedicalConditions: user.existingMedicalConditions,
    };

    return res
      .status(201)
      .json({ message: "User registered successfully!", user: userToSend });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login user
    const user = await User.login(email, password, res);

    // generate jwt cookie
    generateToken(res, user._id);

    // Send back everything except password
    const userToSend = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      bloodGroup: user.bloodGroup,
      age: user.age,
      profession: user.profession,
      contact: user.contact,
      address: user.address,
      gender: user.gender,
      exitingMedicalConditions: user.exitingMedicalConditions,
    };

    return res
      .status(200)
      .json({ message: "User logged in successfully!", user: userToSend });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Logs out a user
const logoutUser = (req, res) => {
  // Delete the cookie
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ message: "Logged out successfully!" });
};

// Gets all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Read html template for vaccination report
const html = fs.readFileSync(
  path.join(__dirname, "../utils/reportTemplate.html"),
  "utf8"
);
const options = {
  format: "A4",
  orientation: "landscape",
  border: "10mm",
};

const getVaccinationReport = async (req, res) => {
  // Get user from auth middleware
  const user = req.user;

  try {

    const appointments = await Appointment.find({
      user: user._id,
      status: "Completed",
    }).populate("hospital vaccine");

    // Create needed objects
    const vaccines = appointments.map((appointment) => ({
      name: appointment.vaccine.name,
      company: appointment.vaccine.company,
      hospital: appointment.hospital.name,
      date: appointment.date.toISOString().split("T")[0],
      time: appointment.time,
    }));

    // create vaccination data object
    const vaccinationData = {
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob.toISOString().split("T")[0],
      age: user.age,
      gender: user.gender,
      bloodGroup: user.bloodGroup,
      vaccines,
    };

    const document = {
      html: html,
      data: vaccinationData,
      path: path.join(
        __dirname,
        `../reports/${user.firstName}_${user.lastName}_vaccination_report.pdf`
      ),
    };

    const report = await pdf.create(document, options);

    return res.status(200).download(report.filename);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getVaccinationReport,
};
