const User = require("../models/userModel");
const { generateToken } = require("../utils/tokenGenerator");

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
    exitingMedicalConditions,
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
      exitingMedicalConditions,
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
      exitingMedicalConditions: user.exitingMedicalConditions,
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

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getAllUsers,
};
