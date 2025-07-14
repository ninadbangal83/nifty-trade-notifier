const axios = require("axios");

let session = axios.create({
  baseURL: "https://www.nseindia.com",
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
    "Connection": "keep-alive",
  },
});

// Call homepage first to set cookies
async function initSession() {
  await session.get("/");
}

async function optionScanner() {
  try {
    await initSession();

    const response = await session.get(
      "/api/option-chain-indices?symbol=NIFTY"
    );

    const data = response.data.records.data;
    const options = [];

    for (const strike of data) {
      const ce = strike.CE;
      const pe = strike.PE;

      if (ce && ce.lastPrice >= 18 && ce.lastPrice <= 24) {
        options.push({
          symbol: ce.symbol,
          price: ce.lastPrice,
          type: "CE",
        });
      }

      if (pe && pe.lastPrice >= 18 && pe.lastPrice <= 24) {
        options.push({
          symbol: pe.symbol,
          price: pe.lastPrice,
          type: "PE",
        });
      }
    }

    console.log(`[optionScanner] Fetched ${options.length} entries in range ₹18–24.`);
    return options;
  } catch (err) {
    console.error("[optionScanner] Failed to fetch:", err.message);
    return [];
  }
}

module.exports = optionScanner;
