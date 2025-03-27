const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get products by category
router.get('/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    // Convert URL-friendly format back to display format (e.g., 'wood-carving' to 'Wood Carving')
    // Handle special cases and plurals
    let processedCategory = categoryName;
    
    // Don't convert certain categories to singular
    const keepPluralCategories = ['crafts', 'paintings'];
    const specialCategories = {
      'sculptures': 'sculpture',
      'sculpture': 'sculpture'
    };

    if (specialCategories[categoryName.toLowerCase()]) {
      processedCategory = specialCategories[categoryName.toLowerCase()];
    } else if (!keepPluralCategories.includes(categoryName.toLowerCase())) {
      processedCategory = categoryName.endsWith('s') ? categoryName.slice(0, -1) : categoryName;
    }
    
    // Then format it with proper capitalization
    const formattedCategory = processedCategory
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const products = await Product.find({ 
      category: { $regex: new RegExp('^' + formattedCategory + '$', 'i') }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

module.exports = router;