const Appointment = require("../models/appointmentModel");
const Hospital = require("../models/hospitalModel");

// Helper function for parsint a time string
const parseTimeString = (timeString) => {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":");
  let date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  if (period === "PM" && hours !== "12") {
    date.setHours(date.getHours() + 12);
  }
  return date;
};

// Helper function for generating time slots
const generateTimeSlots = (startTime, endTime) => {
  const timeSlots = [];
  let currentTime = new Date(startTime);
  while (currentTime <= endTime) {
    timeSlots.push(
      currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  return timeSlots;
};

// Fetches available appointment slots for a given vaccine and hospital
const getAvailableAppointments = async (req, res) => {
  // Get details from query
  const { hospitalId, date } = req.query; // Assuming date is provided in the query

  // Input validation
  if (!hospitalId || !date) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({ error: "Hospital not found" });
    }

    // Parse opening and closing times to Date objects
    const openingTime = parseTimeString(hospital.openingTime);
    const closingTime = parseTimeString(hospital.closingTime);

    // Generate time slots between openingTime and closingTime
    const timeSlots = generateTimeSlots(openingTime, closingTime);

    // Fetch existing appointments for the given hospital and date
    const existingAppointments = await Appointment.find({
      hospital: hospitalId,
      date: new Date(date),
    });

    // Extract appointment times from existing appointments
    const bookedTimes = existingAppointments.map(
      (appointment) => appointment.time
    );

    // Filter out booked times from time slots to get available slots
    const availableSlots = timeSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    return res.status(200).json({ availableSlots });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Creates a new appointment
const createAppointment = async (req, res) => {
  const { hospitalId, vaccineId, date, time, userId } = req.body;

  // Input validation
  if (!hospitalId || !vaccineId || !date || !time || !userId) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({ error: "Hospital not found" });
    }

    // Check if the slot is available
    const existingAppointment = await Appointment.findOne({
      hospital: hospitalId,
      date: new Date(date),
      time: time,
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "Time slot is already booked" });
    }

    // Create a new appointment
    const appointment = new Appointment({
      hospital: hospitalId,
      vaccine: vaccineId,
      date: new Date(date),
      time: time,
      user: userId,
      charges: hospital.charges,
    });

    await appointment.save();

    return res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Fetches appointments for a given hospital and date
const getAppointmentsByDate = async (req, res) => {
  const { hospitalId, date } = req.query;

  // Input validation
  if (!hospitalId || !date) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({ error: "Hospital not found" });
    }

    // Fetch existing appointments for the given hospital and date
    const appointments = await Appointment.find({
      hospital: hospitalId,
      date: new Date(date),
    }).populate([{ path: "user", select: "-password" }, { path: "vaccine" }]);

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getUserAppointmentsByDate = async (req, res) => {
  const { userId, date } = req.query;

  // Input validation
  if (!userId || !date) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Fetch existing appointments for the given user and date
    const appointments = await Appointment.find({
      user: userId,
      date: new Date(date),
    }).populate([{ path: "vaccine" }, { path: "hospital", select: "name" }]);

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const payUserAppointmentCharges = async (req, res) => {
  const { id } = req.params;

  // Input validation
  if (!id) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(400).json({ error: "Appointment not found" });
    }

    // Mark appointment as paid
    appointment.paid = true;
    await appointment.save();

    return res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  const { id } = req.params;

  // Input validation
  if (!id) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(400).json({ error: "Appointment not found" });
    }

    // Cancel appointment
    appointment.status = "Cancelled";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment canceled successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getUnapprovedAppointments = async (req, res) => {
  const { hospitalId } = req.query;
  try {
    // Get the current date and set the time to the start of the day
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      status: "Scheduled",
      date: { $gte: today }, // Filter for dates that are today or in the future
      hospital: hospitalId,
    }).populate([{ path: "user", select: "-password" }, { path: "vaccine" }]);

    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const approveAppointment = async (req, res) => {
  const { id } = req.params;

  // Input validation
  if (!id) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(400).json({ error: "Appointment not found" });
    }

    // Approve appointment
    appointment.status = "Confirmed";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment approved successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const markAppointmentAsCompleted = async (req, res) => {
  const { id } = req.params;

  // Input validation
  if (!id) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(400).json({ error: "Appointment not found" });
    }

    // Mark appointment as completed
    appointment.status = "Completed";
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment marked as completed" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAvailableAppointments,
  createAppointment,
  getAppointmentsByDate,
  getUserAppointmentsByDate,
  payUserAppointmentCharges,
  cancelAppointment,
  getUnapprovedAppointments,
  approveAppointment,
  markAppointmentAsCompleted,
};
