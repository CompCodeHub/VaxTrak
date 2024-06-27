const Vaccine = require("../models/vaccineModel");

const getAllVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find();
    res.json({ vaccines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVaccine = async (req, res) => {
  try {
    const { name, description, sideEffects, origin, dosesRequired } = req.body;

    // Validate input data
    if (!name || !description || !sideEffects || !origin || !dosesRequired) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Create vaccine
    const vaccine = new Vaccine({ name, description });
    await vaccine.save();

    return res.status(201).json({ vaccine });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllVaccines,
  createVaccine,
};
