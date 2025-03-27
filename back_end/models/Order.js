const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: Number, 
    required: true 
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderConfirmation: {
    confirmed: {
      type: Boolean,
      default: false
    },
    confirmationDate: {
      type: Date
    },
    estimatedDeliveryDate: {
      type: Date
    }
  },
  trackingDetails: {
    trackingNumber: String,
    carrier: String,
    trackingUrl: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);