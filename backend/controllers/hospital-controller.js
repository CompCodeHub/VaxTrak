const Hospital = require("../models/hospitalModel");
const Admin = require("../models/adminModel");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../utils/cloudinaryConfig");

const registerHospital = async (req, res) => {
  // Get details from req body
  const {
    name,
    address,
    type,
    charges,
    openingTime,
    closingTime,
    image,
    contact,
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
      return res
        .status(400)
        .json({ error: "Hospital with given name already registered!" });
    }

    // Upload image to cloudinary
    const uploadedImageData = await uploadToCloudinary(image, "hospitals");

    // Create hospital
    const hospital = new Hospital({
      name,
      address,
      type,
      charges,
      image: uploadedImageData,
      contact,
      openingTime,
      closingTime,
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
    const hospitals = await Hospital.find().populate("vaccines");
    return res.status(200).json({ hospitals });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getHospitalById = async (req, res) => {
  const { id } = req.params;

  try {
    const hospital = await Hospital.findById(id);
    return res.status(200).json({ hospital });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addVaccineToHospital = async (req, res) => {
  const { id } = req.params;
  const { vaccineId } = req.body;

  try {
    const hospital = await Hospital.findById(id);
    if (hospital.vaccines.includes(vaccineId)) {
      return res
        .status(400)
        .json({ error: "Vaccine already available at your hospital!" });
    }
    hospital.vaccines.push(vaccineId);
    await hospital.save();
    return res
      .status(200)
      .json({ message: "Vaccine made available for your hospital!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const removeVaccineFromHospital = async (req, res) => {
  const { id } = req.params;
  const { vaccineId } = req.body;

  try {
    const hospital = await Hospital.findById(id);
    if (!hospital.vaccines.includes(vaccineId)) {
      return res
        .status(400)
        .json({ error: "Vaccine not available at your hospital!" });
    }
    hospital.vaccines = hospital.vaccines.filter(
      (vaccine) => vaccine.toString() !== vaccineId
    );
    await hospital.save();
    return res
      .status(200)
      .json({ message: "Vaccine removed from your hospital!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerHospital,
  getAllHospitals,
  getHospitalById,
  addVaccineToHospital,
  removeVaccineFromHospital,
};
