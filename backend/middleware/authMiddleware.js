const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Hospital = require("../models/hospitalModel");

const userAuth = async (req, res, next) => {
  // Check for jwt in cookie
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized request!" });
  }

  try {
    // Get id from the token
    const { id } = jwt.verify(token, process.env.SECRET);
    // Attach user id for further requests
    req.user = await User.findOne({ _id: id }).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized request!" });
  }
};

const adminAuth = async (req, res, next) => {
  // Check for jwt in cookie
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized request!" });
  }

  try {
    // Get id from the token
    const { id } = jwt.verify(token, process.env.SECRET);

    // Find admin
    const admin = await Admin.findOne({ _id: id }).select("-password");
    // Check if admin exists
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized request!" });
    }

    // Check if hospital for the admin exists
    const hospital = await Hospital.findOne({ _id: admin.hospital });
    if (!hospital) {
      return res.status(401).json({ error: "Unauthorized request!" });
    }

    // Check if the admin is part of the hospital
    if (!hospital.admins.includes(admin._id)) {
      return res.status(401).json({ error: "Unauthorized request!" });
    }

    // Attach admin info and hospital info for further requests
    req.admin = admin;
    req.hospital = hospital;

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized request!" });
  }
};

module.exports = { userAuth, adminAuth };
