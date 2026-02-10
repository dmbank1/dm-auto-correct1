require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ===== SYSTEM MONEY =====
let SYSTEM_BALANCE = 5000000000;

// ===== Connect to MongoDB =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log('MongoDB connection error ❌', err));

// ===== Test route =====
app.get('/', (req, res) => {
  res.send('DM AUTO CORRECT Backend is running 🚀');
});

// ===== PORT =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));