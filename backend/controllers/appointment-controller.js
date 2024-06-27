const Appointment = require("../models/appointmentModel");
const Hospital = require("../models/hospitalModel");

// Allows hospital admins to create appointment slots for their hospital
const createAppointmentSlots = async (req, res) => {
  // Get details from body
  const { vaccine, slots } = req.body;
  const admin = req.admin;

  // Input validation
  if (!vaccine || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Find hospital
    const hospital = await Hospital.findOne({ _id: admin.hospital });

    // Check if hospital offers given vaccines
    if (!hospital.vaccines.includes(vaccine)) {
      return res
        .status(400)
        .json({
            error: "Your hospital does not offer the specified vaccine!",
        });
    }

    // Create appointment objects for each slot
    const appointments = slots.map((slot) => ({
      hospital,
      vaccine,
      slot: new Date(slot),
      status: "Available",
    }));

    // Insert appointments into database
    await Appointment.insertMany(appointments);

    return res.status(201).json({
      message: "Appointment slots created successfully!",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Allows user to make an appointment
const makeAppointment = async (req, res) => {
  // Get details from body
  const { hospital, vaccine, slot } = req.body;
  const user = req.user;

  // Input validation
  if (!hospital || !vaccine || !slot) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Find appointment
    const appointment = await Appointment.findOne({
      hospital,
      vaccine,
      slot,
      status: "Available",
    });

    if (!appointment) {
      return res
        .status(400)
        .json({
            error: "No available appointment for the given slot was found!",
        });
    }

    // Update appointment status and user
    appointment.status = "Scheduled";
    appointment.user = user._id;
    await appointment.save();

    return res.status(201).json({
      message: "Your appointment was scheduled successfully!",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Fetches available appointment slots for a given vaccine and hospital
const getAvailableAppointments = async (req, res) => {
  // Get details from query
  const { hospital, vaccine } = req.query;

  // Input validation
  if (!hospital || !vaccine) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Find appointments
    const appointments = await Appointment.find({
      hospital,
      vaccine,
      status: "Available",
    }).sort({ slot: 1 });

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  makeAppointment,
  createAppointmentSlots,
  getAvailableAppointments,
};
