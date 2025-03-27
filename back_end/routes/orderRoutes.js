const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');
const User = require('../models/userModel');
const Product = require('../models/Product');

// Valid order status transitions
const validStatusTransitions = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: []
};

// Validate order status transition
const isValidStatusTransition = (currentStatus, newStatus) => {
  return validStatusTransitions[currentStatus]?.includes(newStatus);
};

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { addressId, paymentMethod, items } = req.body;

    if (!addressId || !paymentMethod || !items || !items.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Verify the address exists for this user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);
    if (!addressExists) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Calculate total amount and verify products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product with ID ${item.productId} not found` 
        });
      }

      // Use the product's actual price from database for security
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create the order with confirmation details
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5); // Delivery in 5 days

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      addressId,
      paymentMethod,
      totalAmount,
      status: 'processing',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderConfirmation: {
        confirmed: true,
        confirmationDate: new Date(),
        estimatedDeliveryDate
      },
      trackingDetails: {
        trackingNumber: `TRK${Date.now()}`,
        carrier: 'Express Delivery',
        trackingUrl: `https://tracking.delivery/track/${Date.now()}`
      }
    });

    await order.save();

    // Update product orders array (optional)
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $push: { orders: order._id }
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      order: {
        orderId: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        estimatedDelivery: order.orderConfirmation.estimatedDeliveryDate,
        trackingNumber: order.trackingDetails.trackingNumber,
        trackingUrl: order.trackingDetails.trackingUrl,
        carrier: order.trackingDetails.carrier,
        orderDate: order.orderConfirmation.confirmationDate
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get all orders for the current user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images price');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ 
      _id: req.params.orderId,
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Validate the new status
    if (!validStatusTransitions.hasOwnProperty(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order status' 
      });
    }

    // Check if the status transition is valid
    if (!isValidStatusTransition(order.status, status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot transition order from ${order.status} to ${status}` 
      });
    }

    // Update order status
    order.status = status;
    if (status === 'delivered') {
      order.orderConfirmation.confirmed = true;
      order.orderConfirmation.confirmationDate = new Date();
    }

    await order.save();

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: {
        orderId: order._id,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get a specific order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId,
      user: req.user._id 
    }).populate('items.productId', 'name images price');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;