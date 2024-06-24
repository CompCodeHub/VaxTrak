const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    bloodGroup: { type: String, required: true },
    age: { type: Number, required: true },
    profession: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    exitingMedicalConditions: { type: [String] },
    medicalCertificate: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
