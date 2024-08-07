const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, enum: ["Government", "Private"], required: true },
    charges: { type: Number, required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],
    vaccines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine' }],
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    image: {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    contact: { type: String, required: true }, 
  },
  { versionKey: false }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
