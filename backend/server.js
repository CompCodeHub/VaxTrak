const express = require("express");
const app = express();
const userRoutes = require("./routes/user-routes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", userRoutes);

//Handles unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Unknown route" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
