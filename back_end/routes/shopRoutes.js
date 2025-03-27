const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');
const auth = require('../middleware/authMiddleware');
const Shop = require('../models/Shop');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

router.get('/check', auth, async (req, res) => {
  try {
    console.log('User ID from token:', req.user._id);
    console.log('Full user object:', req.user);
    
    const shop = await Shop.findOne({ owner: req.user._id });
    console.log('Shop query:', { owner: req.user._id });
    console.log('Found shop:', shop);
    
    res.json({
      success: true,
      hasShop: !!shop,
      shop: shop,
      userId: req.user._id
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      success: false,
      error: 'Error checking shop status',
      details: error.message
    });
  }
});

// Check shop name availability
router.post('/check-name', auth, async (req, res) => {
  try {
    const { shopName } = req.body;
    
    if (!shopName || shopName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Shop name is required'
      });
    }

    const existingShop = await Shop.findOne({ 
      name: { $regex: new RegExp(`^${shopName.trim()}$`, 'i') }
    });
    
    res.json({
      success: true,
      available: !existingShop,
      message: existingShop ? 'Shop name already taken' : 'Shop name available'
    });
  } catch (error) {
    console.error('Shop name check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking shop name'
    });
  }
});

// Create shop
router.post('/create', auth, async (req, res) => {
  try {
    console.log('Creating shop with data:', req.body);
    console.log('User from token:', req.user);

    const shop = new Shop({
      name: req.body.shopName.trim(), // Using shopName from request body for backward compatibility
      owner: req.user._id
    });

    console.log('Shop model created:', shop);
    
    const savedShop = await shop.save();
    console.log('Shop saved:', savedShop);

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (error) {
    console.error('Shop creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating shop'
    });
  }
});

// Get shop details
router.get('/details', auth, async (req, res) => {
  try {
    console.log('Fetching shop details for user:', req.user._id);
    const shop = await Shop.findOne({ owner: req.user._id });
    console.log('Shop query result:', shop);

    if (!shop) {
      console.log('No shop found for user:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }
    
    console.log('Successfully found shop:', shop._id);
    res.json({
      success: true,
      data: shop
    });
  } catch (error) {
    console.error('Error in /details route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shop details',
      error: error.message
    })
  }
});

// Add this new route for fetching shop sales
router.get('/sales', auth, async (req, res) => {
  console.log('Sales route accessed');
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Fetch sales data for the shop
    const sales = await Sale.find({ seller: req.user._id })
      .populate('product')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data'
    });
  }
});

// Update the products route to use auth middleware instead of verifyToken
router.get('/products', auth, async (req, res) => {
  try {
    console.log('Shop products route accessed');
    console.log('User from token:', req.user);
    
    if (!req.user || !req.user._id) {
      console.error('Invalid user data in request');
      return res.status(401).json({
        success: false,
        message: 'User authentication failed'
      });
    }
    
    const artistId = req.user._id;
    console.log('Artist ID for product query:', artistId);
    
    const products = await Product.find({ artist: artistId })
      .sort({ createdAt: -1 })
      .select('name description price category images createdAt');
    
    console.log(`Found ${products.length} products for artist ${artistId}`);
    console.log('Products:', JSON.stringify(products, null, 2));
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching shop products', 
      error: error.message 
    });
  }
});

module.exports = router;