const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  sideEffects: { type: [String] },
  origin: { type: String, required: true },
  dosesRequired: { type: Number, required: true },
  otherInfo: { type: String },
}, { versionKey: false });

module.exports = mongoose.model('Vaccine', vaccineSchema);
