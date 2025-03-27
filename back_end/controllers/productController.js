const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      artist: req.user._id // This comes from the auth middleware
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

exports.getArtistProducts = async (req, res) => {
  try {
    const products = await Product.find({ artist: req.user._id });
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};