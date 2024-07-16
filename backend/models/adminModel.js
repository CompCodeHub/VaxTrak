const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { versionKey: false }
);

adminSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password,
  hospital
) {
  // Check for all fields
  if (!firstName || !lastName || !email || !password || !hospital) {
    throw Error("All fields must be filled");
  }

  // Check for valid email
  if (!validator.isEmail(email)) {
    throw Error("Invalid email");
  }

  // Check for strong password (Uncomment in production)
  // if(!validator.isStrongPassword(password)){
  //   throw Error("Password is not strong enough");
  // }

  // Check for duplicate email
  const exists = await this.findOne({ email });
  if (exists) {
      throw Error("Admin email is already registered for other hospital!");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const admin = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
    hospital,
  });

  return admin;
};

adminSchema.statics.login = async function (email, password) {
  // Check for all fields
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // Check email
  const admin = await this.findOne({ email });
  if (!admin) {
    throw Error("Admin account with given email doesn't exist!");
  }

  // Check password
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw Error("Incorrect password!");
  }

  return admin;
};

module.exports = mongoose.model("Admin", adminSchema);
