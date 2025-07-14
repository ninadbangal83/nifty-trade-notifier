require("dotenv").config();
const mongoose = require("mongoose");
const strategyEngine = require("../services/strategyEngine");
const Signal = require("../models/Signal");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/niftyBot";

const prices = [
  20, 20.8, 21.1, 20.9, 20.5, 20.2,
  20, 24, 32, 26, 22.8, 19.5,
  18, 25, 30, 32, 34, 35,
  29, 28.5, 30, 29.2, 28.8,
  18, 22, 30, 26, 23.5, 20,
];

const symbol = "NIFTY24JUL21500CE";
const type = "CE";

async function simulate() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    console.log(`[${symbol} (CANDLE)] ₹${price}`);

    const options = [{ symbol, price, type }];
    const signals = strategyEngine(options);
    console.log("📊 Signals:", signals);

    for (const signal of signals) {
      await Signal.create(signal);
      console.log(`📌 Signal: ${signal.status} @ ₹${signal.price}`);
    }

    await new Promise((r) => setTimeout(r, 10000)); // Wait 1 minute
  }

  console.log("✅ Mock simulation completed");
  process.exit();
}

simulate();

