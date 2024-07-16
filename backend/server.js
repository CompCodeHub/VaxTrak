const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
const hospitalRoutes = require("./routes/hospital-routes");
const vaccineRoutes = require("./routes/vaccine-routes");
const adminRoutes = require("./routes/admin-routes");
const appointmentRoutes = require("./routes/appointment-routes");
const reportRoutes = require("./routes/report-routes");


// middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/vaccines", vaccineRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);


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
