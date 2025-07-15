const Signal = require("../models/Signal");
const optionScanner = require("./optionScanner");
const strategyEngine = require("./strategyEngine");

async function runLiveEngine() {
  setInterval(async () => {
    try {
      const options = await optionScanner(); // Get CE/PE in 18–24 range
      const signals = strategyEngine(options); // Apply retracement logic

      if (signals.length) {
        await Signal.insertMany(signals); // Save to DB
        signals.forEach((s) =>
          console.log(`📌 Signal: ${s.status} @ ₹${s.price}`)
        );
      }
    } catch (err) {
      console.error("🔥 Live Engine Error:", err.message);
    }
  }, 10000); // every 10 seconds
}

runLiveEngine();
