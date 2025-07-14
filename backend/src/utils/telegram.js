const axios = require('axios');
require('dotenv').config();

async function sendTelegramAlert(signal) {
  const msg = `📢 *Trade Alert!*\nSymbol: ${signal.symbol}\nType: ${signal.type}\nPrice: ₹${signal.price}\nStatus: ${signal.status}`;
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: msg,
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('[Telegram] Failed to send:', err.message);
  }
}

module.exports = sendTelegramAlert;
