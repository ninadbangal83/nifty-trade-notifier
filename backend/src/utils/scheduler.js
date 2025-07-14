const axios = require("axios");
const cron = require("node-cron");

function scheduleAutoStartStop() {
  // 🕘 Start bot at 9:15 AM (Mon–Fri)
  cron.schedule("15 9 * * 1-5", async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/start");
      console.log("✅ Auto-started bot at 9:15 AM:", res.data);
    } catch (err) {
      console.error("❌ Auto-start error:", err.message);
    }
  });

  // 🛑 Stop bot at 3:30 PM (Mon–Fri)
  cron.schedule("30 15 * * 1-5", async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/stop");
      console.log("🛑 Auto-stopped bot at 3:30 PM:", res.data);
    } catch (err) {
      console.error("❌ Auto-stop error:", err.message);
    }
  });
}

module.exports = scheduleAutoStartStop;
