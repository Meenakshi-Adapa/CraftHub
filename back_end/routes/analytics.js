const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

router.get('/performance', auth, async (req, res) => {
  try {
    const artistId = req.user._id;
    
    // Get products for the artist
    const products = await Product.find({ artist: artistId });
    
    // Get all sales for the artist
    const sales = await Sale.find({ seller: artistId })
      .populate('product')
      .populate('buyer', 'name');

    // Calculate statistics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const uniqueCustomers = new Set(sales.map(sale => sale.buyer._id.toString())).size;
    
    // Calculate average rating if you have ratings
    const averageRating = 4.5; // Placeholder - implement actual rating calculation

    // Get recent sales
    const recentSales = sales.slice(0, 5).map(sale => ({
      productName: sale.product.name,
      customerName: sale.buyer.name,
      date: sale.createdAt,
      amount: sale.amount
    }));

    res.json({
      success: true,
      data: {
        totalSales,
        totalRevenue,
        totalCustomers,
        averageRating,
        recentSales,
        products // Add products to the response
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance data'
    });
  }
});

module.exports = router;