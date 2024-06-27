const jwt = require("jsonwebtoken");

// Generates a token and sets cookie
const generateToken = (res, id) => {
  // Token expires in 3 days
  const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });

  //Set JWT as http only cookie
  res.cookie("jwt", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
};

module.exports = { generateToken };