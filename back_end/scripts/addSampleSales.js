const mongoose = require('mongoose');
const Sale = require('../models/Sale');

mongoose.connect('mongodb://127.0.0.1:27017/CraftHub')
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Connection error:', err));

const sampleSale = {
  product: "ObjectId('67ce331306fc96daa18d87ff')", // Replace with actual product ID
  seller: "ObjectId('67cda672ff110a62751a2654')",   // Replace with actual seller ID
  buyer: "ObjectId('67ce3ad58e99e5c0319c120b')",     // Replace with actual buyer ID
  quantity: 1,
  amount: 1500,
  status: 'pending',
  deliveryAddress: {
    street: "123 Test Street",
    city: "Test City",
    state: "Test State",
    pincode: "123456",
    country: "India"
  }
};

const addSample = async () => {
  try {
    const sale = new Sale(sampleSale);
    await sale.save();
    console.log('Sample sale added');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addSample();