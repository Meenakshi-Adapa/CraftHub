const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const upload = require('../middleware/multer');

router.post('/', auth, (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      // Debug logging
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      const { name, description, price, category } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'An image is required' 
        });
      }

      // Validate price
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }

      const product = new Product({
        name,
        description,
        price: Number(price),
        category,
        images: [req.file.filename],
        artist: req.user._id
      });

      const savedProduct = await product.save();
      res.json({ success: true, data: savedProduct });
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
        file: req.file
      });
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error creating product'
      });
    }
  });
});

// Add delete product route
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id,
      artist: req.user._id 
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to delete it' 
      });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// Get artist's products
router.get('/artist', auth, async (req, res) => {
  try {
    const products = await Product.find({ artist: req.user._id });
    const totalProducts = await Product.countDocuments({ artist: req.user._id });

    res.json({
      success: true,
      data: products,
      totalCount: totalProducts
    });
  } catch (error) {
    console.error('Error fetching artist products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// Add this new route after your existing routes
// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id)
      .populate('artist', 'name email')
      .populate({
        path: 'comments.user',
        select: 'name email'
      })
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product details',
      error: error.message
    });
  }
});

// Add comment to product
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { rating, text } = req.body;
    const productId = req.params.id;

    if (!rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment text are required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Add the new comment
    product.comments.push({
      user: req.user._id,
      rating: Number(rating),
      text
    });

    // Update average rating
    const totalRating = product.comments.reduce((sum, comment) => sum + comment.rating, 0);
    product.averageRating = totalRating / product.comments.length;

    await product.save();

    // Populate user information for the new comment
    await product.populate('comments.user', 'name email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: product
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

router.get('/artist', auth, async (req, res) => {
  try {
    const products = await Product.find({ artist: req.user._id });
    const totalProducts = await Product.countDocuments({ artist: req.user._id });

    res.json({
      success: true,
      data: products,
      totalCount: totalProducts
    });
  } catch (error) {
    console.error('Error fetching artist products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});
// Update product route
router.put('/update/:id', auth, (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      const { name, description, price, category } = req.body;
      const productId = req.params.id;

      // Validate price if provided
      if (price && (isNaN(price) || price <= 0)) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }

      // Find the product and verify ownership
      const product = await Product.findOne({ 
        _id: productId,
        artist: req.user._id 
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or you do not have permission to update it'
        });
      }

      // Update the product fields
      const updateData = {
        name: name || product.name,
        description: description || product.description,
        price: price ? Number(price) : product.price,
        category: category || product.category
      };

      // Add new image if provided
      if (req.file) {
        updateData.images = [req.file.filename];
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );

      res.json({ 
        success: true, 
        message: 'Product updated successfully',
        data: updatedProduct 
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Error updating product'
      });
    }
  });
});

module.exports = router;