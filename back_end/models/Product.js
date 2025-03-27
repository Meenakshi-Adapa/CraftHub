const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
  artist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  comments: [commentSchema],
  averageRating: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true,
  collection: 'products' // Explicitly set collection name
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);