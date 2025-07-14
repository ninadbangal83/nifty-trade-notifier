require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const botRoutes = require("./routes/botRoutes");
const scheduleAutoStartStop = require("./utils/scheduler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", botRoutes.router);

// MongoDB Connection
connectDB();

// Schedule bot auto start/stop (9:15 AM and 3:30 PM)
scheduleAutoStartStop();

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend live at http://localhost:${PORT}`);
});
