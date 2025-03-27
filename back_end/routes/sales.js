const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Sale = require('../models/Sale');

// Get all sales
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('product')
      .populate('buyer', 'name email')
      .populate('seller', 'name email');
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get sales by seller
router.get('/seller', auth, async (req, res) => {
  try {
    const sales = await Sale.find({ seller: req.user._id })
      .populate('product')
      .populate('buyer', 'name email');
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new sale
router.post('/', auth, async (req, res) => {
  try {
    const sale = new Sale({
      ...req.body,
      seller: req.user._id
    });
    const savedSale = await sale.save();
    res.status(201).json({ success: true, data: savedSale });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;