const Hospital = require("../models/hospitalModel");
const Admin = require("../models/adminModel");
const mongoose = require("mongoose");

const registerHospital = async (req, res) => {
  // Get details from req body
  const {
    name,
    address,
    type,
    charges,
    adminFname,
    adminLname,
    adminEmail,
    adminPassword,
  } = req.body;

  // start a mongoose transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ name });
    if (existingHospital) {
      return res.status(400).json({ error: "Hospital with given name already registered!" });
    }

    // Create hospital
    const hospital = new Hospital({
      name,
      address,
      type,
      charges,
    });
    await hospital.save();

    // Signup admin for the hospital
    const newAdmin = await Admin.signup(
      adminFname,
      adminLname,
      adminEmail,
      adminPassword,
      hospital._id
    );

    // add new admin to hospital admin list
    hospital.admins.push(newAdmin._id);

    // Save hospital
    await hospital.save();

    // end transaction
    await session.commitTransaction();
    session.endSession();


    return res.status(201).json({
      message: "Hospital registered successfully!",
      hospital,
      initialAdmin: {
        _id: newAdmin._id,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        hospital: newAdmin.hospital,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    return res.status(200).json({ hospitals });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { registerHospital, getAllHospitals };
