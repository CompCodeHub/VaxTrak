const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    sideEffects: { type: [String] },
    origin: { type: String, required: true },
    dosesRequired: { type: Number, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Vaccine", vaccineSchema);
