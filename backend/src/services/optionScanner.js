const axios = require("axios");

let session = axios.create({
  baseURL: "https://www.nseindia.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.nseindia.com/",
    Connection: "keep-alive",
  },
});

const trackedSymbols = new Set(); // Track options beyond ₹24 for momentum

function formatExpiry(dateStr) {
  const [day, mon, year] = dateStr.split("-");
  return `${day}${mon.toUpperCase()}${year.slice(-2)}`; // e.g. "25JUL24"
}

async function initSession() {
  try {
    await session.get("/");
  } catch (err) {
    console.error("[initSession] Failed to initialize session:", err.message);
  }
}

async function optionScanner() {
  try {
    await initSession();

    const response = await session.get(
      "/api/option-chain-indices?symbol=NIFTY"
    );

    const allData = response.data.records.data;
    const expiries = response.data.records.expiryDates;

    if (!expiries || expiries.length === 0) {
      console.error("❌ No expiry dates available.");
      return [];
    }

    const nearestExpiry = expiries[0]; // Use only current expiry
    const options = [];

    for (const strike of allData) {
      const ce = strike.CE;
      const pe = strike.PE;

      if (ce && ce.expiryDate === nearestExpiry && ce.lastPrice !== undefined) {
        const ceSymbol = `NIFTY${formatExpiry(ce.expiryDate)}${ce.strikePrice}CE`;
        if (
          (ce.lastPrice >= 18 && ce.lastPrice <= 24) ||
          trackedSymbols.has(ceSymbol)
        ) {
          trackedSymbols.add(ceSymbol);
          options.push({
            symbol: ceSymbol,
            price: ce.lastPrice,
            type: "CE",
          });
        }
      }

      if (pe && pe.expiryDate === nearestExpiry && pe.lastPrice !== undefined) {
        const peSymbol = `NIFTY${formatExpiry(pe.expiryDate)}${pe.strikePrice}PE`;
        if (
          (pe.lastPrice >= 18 && pe.lastPrice <= 24) ||
          trackedSymbols.has(peSymbol)
        ) {
          trackedSymbols.add(peSymbol);
          options.push({
            symbol: peSymbol,
            price: pe.lastPrice,
            type: "PE",
          });
        }
      }
    }

    console.log(
      `[optionScanner] 📅 Using expiry: ${nearestExpiry} | 📦 ${options.length} entries`
    );
    return options;
  } catch (err) {
    console.error("[optionScanner] Failed to fetch:", err.message);
    return [];
  }
}

module.exports = optionScanner;
