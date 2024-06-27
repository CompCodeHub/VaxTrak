const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
const hospitalRoutes = require("./routes/hospital-routes");
const vaccineRoutes = require("./routes/vaccine-routes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/vaccines", vaccineRoutes);

//Handles unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Unknown route" });
});

try {
  // Connect to database
  mongoose.connect(process.env.MONGO_URI);

  console.log("Connected to database!");

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
} catch (error) {
  console.log(error);
}
