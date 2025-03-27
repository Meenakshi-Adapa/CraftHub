const mongoose = require('mongoose');
const Product = require('../models/product');

mongoose.connect('mongodb://127.0.0.1:27017/CraftHub')
  .then(async () => {
    const products = await Product.find({});
    console.log('Total products:', products.length);
    console.log('Products by category:', products.map(p => p.category));
    mongoose.connection.close();
  })
  .catch(console.error);