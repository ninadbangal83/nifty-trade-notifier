const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const Signal = require("../models/Signal");

async function exportSignalsToCSV() {
  try {
    const signals = await Signal.find().sort({ time: -1 });

    if (!signals || signals.length === 0) return null;

    // Clean data and format timestamp
    const cleanSignals = signals.map(s => ({
      symbol: s.symbol,
      price: s.price,
      type: s.type,
      time: new Date(s.time).toISOString()
    }));

    const fields = ["symbol", "price", "type", "time"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(cleanSignals);

    const filePath = path.join(__dirname, "../../exports/signals.csv");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, csv);

    return filePath;
  } catch (err) {
    console.error("Export to CSV failed:", err.message);
    return null;
  }
}

module.exports = exportSignalsToCSV;
