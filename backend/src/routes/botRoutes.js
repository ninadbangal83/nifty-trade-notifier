const express = require("express");
const Signal = require("../models/Signal");
const exportSignalsToCSV = require("../utils/exportLogs");
const router = express.Router();

let botRunning = false;

router.post("/start", (req, res) => {
  botRunning = true;
  res.json({ status: "Bot started" });
});

router.post("/stop", (req, res) => {
  botRunning = false;
  res.json({ status: "Bot stopped" });
});

router.get("/status", (req, res) => {
  res.json({ running: botRunning });
});

router.get("/signals", async (req, res) => {
  const signals = await Signal.find().sort({ time: -1 }).limit(100);
  res.json(signals);
});

// ✅ New route: export signals to CSV
router.get("/export", async (req, res) => {
  try {
    const filePath = await exportSignalsToCSV();
    if (!filePath) return res.status(404).json({ error: "No signals to export" });

    res.download(filePath, "signals.csv");
  } catch (err) {
    console.error("Export error:", err.message);
    res.status(500).json({ error: "Export failed" });
  }
});

module.exports = {
  router,
  getBotStatus: () => botRunning,
};
