const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/tokenGenerator");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login admin
    const admin = await Admin.login(email, password);

    // Generate token
    generateToken(res, admin._id);

    const adminToSend = {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      hospital: admin.hospital,
    };

    return res
      .status(200)
      .json({ message: "Admin logged in successfully!", admin: adminToSend });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginAdmin,
};