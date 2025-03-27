const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Check if product already in cart
    const productIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex > -1) {
      // Update quantity if product already in cart
      cart.products[productIndex].quantity += parseInt(quantity);
    } else {
      // Add new product to cart
      cart.products.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add item to cart (alternative endpoint for compatibility)
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Check if product already in cart
    const productIndex = cart.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex > -1) {
      // Update quantity if product already in cart
      cart.products[productIndex].quantity += parseInt(quantity);
    } else {
      // Add new product to cart
      cart.products.push({ product: productId, quantity: parseInt(quantity) });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get cart items
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: '_id name description price category images'
      });

    if (!cart) {
      return res.json({
        success: true,
        products: []
      });
    }

    // Filter out any null products and map the valid ones
    const validProducts = cart.products
      .filter(item => item && item.product)
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        category: item.product.category,
        images: item.product.images || [],
        quantity: item.quantity
      }));

    res.json({
      success: true,
      products: validProducts
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid quantity is required' });
    }

    const cart = await Cart.findOneAndUpdate(
      { 
        user: req.user._id,
        'products.product': productId
      },
      { 
        $set: { 'products.$.quantity': parseInt(quantity) }
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: { product: req.params.productId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.json({ success: true, message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { products: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.json({ success: true, message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;