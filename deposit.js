const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

router.post('/', auth, async(req,res)=>{
  const {amount} = req.body;

  const tx = await Transaction.create({
    user: req.user.id,
    type: 'Deposit',
    amount
  });

  res.json(tx);
});

module.exports = router;