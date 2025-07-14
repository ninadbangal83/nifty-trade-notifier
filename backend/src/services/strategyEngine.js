// backend/src/services/strategyEngine.js

const candles = {}; // { SYMBOL: [candle1, candle2, ...] }
const momentumMap = {}; // { SYMBOL: { startIndex, open, close, momentum, entryGiven, warningGiven, exitGiven } }

function buildCandle(symbol, price) {
  const now = new Date();
  const minute = `${now.getHours()}:${now.getMinutes()}`; // Simulate per-minute candle
  const last = candles[symbol]?.at(-1);

  if (!last || last.time !== minute) {
    if (!candles[symbol]) candles[symbol] = [];
    candles[symbol].push({
      time: minute,
      open: price,
      high: price,
      low: price,
      close: price,
    });
  } else {
    last.high = Math.max(last.high, price);
    last.low = Math.min(last.low, price);
    last.close = price;
  }

  if (candles[symbol].length > 10) candles[symbol].shift(); // Keep candle array bounded
}

function strategyEngine(options) {
  const signals = [];

  for (const opt of options) {
    const { symbol, price, type } = opt;
    buildCandle(symbol, price);

    const recent = candles[symbol];
    if (!recent || recent.length < 2) continue;

    // Detect momentum if not tracked
    if (!momentumMap[symbol]) {
      for (let i = 0; i < recent.length - 1; i++) {
        const open = recent[i].open;
        const close = recent[i + 1].close;
        const move = close - open;
        if (move >= 10) {
          momentumMap[symbol] = {
            startIndex: i,
            open,
            close,
            momentum: move,
            entryGiven: false,
            warningGiven: false,
            exitGiven: false,
          };
          console.log(`📈 ${symbol} Momentum: ${move.toFixed(2)} ✅`);
          break;
        }
      }
    }

    const track = momentumMap[symbol];
    if (track) {
      const retraced = track.close - price;
      const totalMove = track.close - track.open;
      const retracementPercent = (retraced / totalMove) * 100;
      console.log(`🔁 Retracement: ${retracementPercent.toFixed(1)}%`);

      const signalTime = new Date().toISOString();

if (retracementPercent >= 95 && retracementPercent <= 105 && !track.exitGiven) {
  signals.push({
    symbol,
    price,
    time: signalTime,
    type: "EXIT",
    status: "Exit — 100% retraced",
    retracement: retracementPercent.toFixed(1),
  });
  track.exitGiven = true;
  delete momentumMap[symbol]; // clear
} else if (retracementPercent >= 80 && retracementPercent < 95 && !track.warningGiven) {
  signals.push({
    symbol,
    price,
    time: signalTime,
    type: "WARNING",
    status: "Warning — 80–95% retraced",
    retracement: retracementPercent.toFixed(1),
  });
  track.warningGiven = true;
} else if (retracementPercent >= 60 && retracementPercent < 80 && !track.entryGiven) {
  signals.push({
    symbol,
    price,
    time: signalTime,
    type: "Entry",
    status: "Entry — 60–80% retraced",
    retracement: retracementPercent.toFixed(1),
  });
  track.entryGiven = true;
}

    }
  }

  return signals;
}

module.exports = strategyEngine;
