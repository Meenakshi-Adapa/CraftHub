const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { Wishlist, WishlistFolder } = require('../models/Wishlist');

// Toggle product in wishlist
router.post('/toggle', auth, async (req, res) => {
  try {
    console.log('Toggle wishlist request:', {
      body: req.body,
      userId: req.user.id,
      headers: req.headers
    });

    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      console.warn('Toggle wishlist attempt without productId');
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const productIndex = wishlist.products.findIndex(
      item => item.product.toString() === productId
    );

    if (productIndex > -1) {
      // Remove product if it exists
      wishlist.products.splice(productIndex, 1);
    } else {
      // Add product if it doesn't exist
      wishlist.products.push({ product: productId });
    }

    await wishlist.save();

    res.json({
      success: true,
      message: productIndex > -1 ? 'Product removed from wishlist' : 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Wishlist toggle error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      productId: req.body?.productId
    });
    res.status(500).json({ success: false, message: 'Server error', details: error.message });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isWishlisted = wishlist?.products.some(
      item => item.product.toString() === req.params.productId
    );

    res.json({ success: true, isWishlisted });
  } catch (error) {
    console.error('Wishlist check error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check multiple products wishlist status
router.get('/check-multiple', auth, async (req, res) => {
  try {
    const { productIds } = req.query;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    const wishlistedProducts = {};
    if (productIds && wishlist) {
      productIds.forEach(productId => {
        wishlistedProducts[productId] = wishlist.products.some(
          item => item.product.toString() === productId
        );
      });
    }

    res.json({ success: true, wishlistedProducts });
  } catch (error) {
    console.error('Multiple wishlist check error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all wishlist items
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/wishlist');
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);
    console.log('Request params:', req.params);

    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: '_id name description price category images'
      });

    if (!wishlist) {
      return res.json({
        success: true,
        products: []
      });
    }

    // Filter out any null products and map the valid ones
    const validProducts = wishlist.products
      .filter(item => item && item.product)
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        category: item.product.category,
        images: item.product.images || [],
        folderId: item.folderId
      }));

    res.json({
      success: true,
      products: validProducts
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create wishlist folder
router.post('/folders', auth, async (req, res) => {
  try {
    console.log('Create folder request:', {
      body: req.body,
      userId: req.user._id
    });

    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      console.warn('Folder creation attempt without name');
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }

    const folder = new WishlistFolder({
      user: req.user._id,
      name: name.trim()
    });

    await folder.save();
    res.json({ success: true, folder });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all folders
router.get('/folders', auth, async (req, res) => {
  try {
    const folders = await WishlistFolder.find({ user: req.user._id });
    res.json({ success: true, folders });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update folder
router.put('/folders/:folderId', auth, async (req, res) => {
  try {
    const folder = await WishlistFolder.findOneAndUpdate(
      { _id: req.params.folderId, user: req.user._id },
      { $set: { name: req.body.name } },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    res.json({ success: true, folder });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete folder
router.delete('/folders/:folderId', auth, async (req, res) => {
  try {
    const folder = await WishlistFolder.findOneAndDelete({
      _id: req.params.folderId,
      user: req.user._id
    });

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Remove folder reference from wishlist items
    await Wishlist.updateOne(
      { user: req.user._id },
      { $set: { 'products.$[elem].folderId': null } },
      { arrayFilters: [{ 'elem.folderId': req.params.folderId }] }
    );

    res.json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    console.log('Delete from wishlist request:', {
      productId: req.params.productId,
      userId: req.user._id
    });

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    const productIndex = wishlist.products.findIndex(
      item => item.product.toString() === req.params.productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
    }

    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Delete from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Move product to folder
router.put('/move-to-folder', auth, async (req, res) => {
  try {
    console.log('Move to folder request:', {
      body: req.body,
      userId: req.user._id
    });

    const { productId, folderId } = req.body;
    
    if (!productId) {
      console.warn('Move to folder attempt without productId');
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    
    if (folderId) {
      const folderExists = await WishlistFolder.exists({
        _id: folderId,
        user: req.user._id
      });

      if (!folderExists) {
        return res.status(404).json({ success: false, message: 'Folder not found' });
      }
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { 
        user: req.user._id,
        'products.product': productId
      },
      { 
        $set: { 'products.$.folderId': folderId || null }
      },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
    }

    res.json({ success: true, message: 'Product moved successfully' });
  } catch (error) {
    console.error('Move to folder error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;