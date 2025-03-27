const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WishlistFolder',
      default: null
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const wishlistFolderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const WishlistFolder = mongoose.model('WishlistFolder', wishlistFolderSchema);

module.exports = { Wishlist, WishlistFolder };