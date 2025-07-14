const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
  symbol: String,
  time: String,
  type: String,
  price: Number,
  status: String,
});

module.exports = mongoose.model('Signal', signalSchema);
