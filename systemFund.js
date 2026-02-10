const mongoose = require('mongoose');

const systemFundSchema = new mongoose.Schema({
  totalBalance: { type: Number, default: 500000000 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemFund', systemFundSchema);