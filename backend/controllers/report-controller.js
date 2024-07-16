const Appointment = require("../models/appointmentModel");
const mongoose = require("mongoose");

const getVaccinatedByGender = async (req, res) => {
  const { hospitalId } = req.params;
  const genders = ["Male", "Female", "Non-Binary"];
  try {
    const report = await Appointment.aggregate([
      {
        $match: {
          hospital: new mongoose.Types.ObjectId(hospitalId),
          status: "Completed",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: {
            gender: "$userDetails.gender",
            user: "$user",
          },
        },
      },
      {
        $group: {
          _id: "$_id.gender",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);

    const formattedReport = genders.map((gender) => {
      const genderData = report.find((item) => item.name === gender);
      return {
        name: gender,
        value: genderData ? genderData.value : 0,
      };
    });

    return res.status(200).json({ report: formattedReport });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getVaccinatedByVaccineType = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const report = await Appointment.aggregate([
      {
        $match: {
          hospital: new mongoose.Types.ObjectId(hospitalId),
          status: "Completed",
        },
      },
      {
        $lookup: {
          from: "vaccines",
          localField: "vaccine",
          foreignField: "_id",
          as: "vaccineDetails",
        },
      },
      { $unwind: "$vaccineDetails" },
      {
        $group: {
          _id: "$vaccineDetails.name",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);

    return res.status(200).json({ report });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getVaccinatedByAgeGroup = async (req, res) => {
  const { hospitalId } = req.params;

  const ageGroups = [
    { name: "0-25", range: [0, 25] },
    { name: "26-50", range: [26, 50] },
    { name: "50+", range: [51, Infinity] },
  ];

  try {
    const report = await Appointment.aggregate([
      {
        $match: {
          hospital: new mongoose.Types.ObjectId(hospitalId),
          status: "Completed",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: {
            $cond: [
              { $lte: ["$userDetails.age", 25] },
              "0-25",
              {
                $cond: [{ $lte: ["$userDetails.age", 50] }, "26-50", "50+"],
              },
            ],
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count",
        },
      },
    ]);

    // Initialize the result with 0 for each age group
    const formattedReport = ageGroups.map((group) => {
      const ageData = report.find((item) => item.name === group.name);
      return {
        name: group.name,
        value: ageData ? ageData.value : 0,
      };
    });

    return res.status(200).json({ report: formattedReport });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTotalVaccinatedUsersWithGenderDistribution = async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      { $match: { status: "Completed" } }, // Match completed appointments
      { $group: { _id: "$user" } }, // Group by user to get unique users
      {
        $lookup: {
          from: "users", // Collection to join with
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" }, // Deconstruct the array field userDetails
      {
        $group: {
          _id: "$userDetails.gender",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalVaccinatedUsers: { $sum: "$count" },
          genderDistribution: {
            $push: {
              gender: "$_id",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalVaccinatedUsers: 1,
          genderDistribution: 1,
        },
      },
    ]);

    const response = result[0]
      ? result[0]
      : { totalVaccinatedUsers: 0, genderDistribution: [] };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getVaccinatedByGender,
  getVaccinatedByVaccineType,
  getVaccinatedByAgeGroup,
  getTotalVaccinatedUsersWithGenderDistribution,
};
