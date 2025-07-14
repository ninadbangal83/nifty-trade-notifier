require("dotenv").config();
const mongoose = require("mongoose");
const Signal = require("../models/Signal");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/niftyBot";

async function insertDummySignals() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing signals (optional)
  await Signal.deleteMany({});
  console.log("🧹 Cleared existing signals");

  const now = new Date();
  const symbols = ["NIFTY24JUL21500CE", "BANKNIFTY24JUL47000PE"];

  const dummy = [];

  // Create fake candle movements for each symbol
  for (const symbol of symbols) {
    const basePrice = 20;
    const high = basePrice + 12;

    dummy.push({ symbol, price: basePrice, type: "CANDLE", time: new Date(now.getTime() + 0 * 60000) }); // t0
    dummy.push({ symbol, price: high, type: "CANDLE", time: new Date(now.getTime() + 1 * 60000) }); // t1

    // Now simulate retracement levels
    dummy.push({ symbol, price: high - 0.7 * 12, type: "CANDLE", time: new Date(now.getTime() + 2 * 60000) }); // 70%
    dummy.push({ symbol, price: high - 0.9 * 12, type: "CANDLE", time: new Date(now.getTime() + 3 * 60000) }); // 90%
    dummy.push({ symbol, price: basePrice, type: "CANDLE", time: new Date(now.getTime() + 4 * 60000) }); // 100%
    dummy.push({ symbol, price: basePrice - 0.5, type: "CANDLE", time: new Date(now.getTime() + 5 * 60000) }); // 101%
  }

  await Signal.insertMany(dummy);
  console.log("✅ Dummy signals inserted");
  process.exit();
}

insertDummySignals();
