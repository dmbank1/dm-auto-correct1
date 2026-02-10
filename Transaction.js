const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Deposit request
router.post('/deposit', auth, async (req, res) => {
  const { amount, method } = req.body;
  const tx = new Transaction({ user: req.user.id, type: 'Deposit', amount, method });
  await tx.save();
  res.json({ message: 'Deposit requested', transaction: tx });
});

// Withdraw request
router.post('/withdraw', auth, async (req, res) => {
  const { amount, method } = req.body;
  const user = await User.findById(req.user.id);
  if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

  const tx = new Transaction({ user: req.user.id, type: 'Withdraw', amount, method });
  await tx.save();
  res.json({ message: 'Withdraw requested', transaction: tx });
});

// Get user's transactions
router.get('/my', auth, async (req, res) => {
  const txs = await Transaction.find({ user: req.user.id });
  res.json(txs);
});

module.exports = router;