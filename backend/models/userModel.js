const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

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
    existingMedicalConditions: { type: [String] },
    medicalCertificate: { type: String },
  },
  { versionKey: false }
);

// Static signup method
userSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password,
  dob,
  bloodGroup,
  age,
  profession,
  contact,
  address,
  gender,
  existingMedicalConditions,
) {
  // Validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !dob ||
    !bloodGroup ||
    !age ||
    !profession ||
    !contact ||
    !address ||
    !gender
  ) {
    throw Error("All fields must be filled!");
  }

  // Check if valid email
  if (!validator.isEmail(email)) {
    throw Error("Invalid email!");
  }

  // Check if valid password (Uncomment before going to production)
  // if (!validator.isStrongPassword(password)) {
  //   return res.status(400).json({ error: "Password isn't strong enough" });
  // }

  // Check if user exists
  const duplicateEmail = await this.findOne({ email });
  if (duplicateEmail) {
    throw Error("Email already in use!");
  }

  // Validate date of birth
  if (!validator.isDate(dob)) {
    throw Error("Invalid date of birth!");
  }

  // Ensure date of birth is before the current date
  if (!validator.isBefore(dob, new Date().toISOString())) {
    throw Error("Invalid date of birth!");
  }

  // Check for duplicate contact
  const duplicateContact = await this.findOne({ contact });
  if (duplicateContact) {
    throw Error("Contact already in use!");
  }

  // Generate bcrypt salt and hash
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create user
  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
    dob,
    bloodGroup,
    age,
    profession,
    contact,
    address,
    gender,
    existingMedicalConditions,
  });
  return user;
};

// static login method
userSchema.statics.login = async function (email, password, res) {
  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: "All fields must be filled!" });
  }

  // Check if user exists
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Account with given email doesn't exist!");
  }

  // Compare passwords
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password!");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
