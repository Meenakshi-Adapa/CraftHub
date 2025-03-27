const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const auth = require('../middleware/authMiddleware');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user addresses
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Add new address
router.post('/address', auth, async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
    
    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create new address object
    const newAddress = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      isDefault: isDefault || false
    };

    // If this address is set as default, unset any existing default
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add the new address
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Address added successfully', 
      address: user.addresses[user.addresses.length - 1] 
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update address
router.put('/address/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the address to update
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Update address fields
    if (fullName) user.addresses[addressIndex].fullName = fullName;
    if (phone) user.addresses[addressIndex].phone = phone;
    if (addressLine1) user.addresses[addressIndex].addressLine1 = addressLine1;
    if (addressLine2 !== undefined) user.addresses[addressIndex].addressLine2 = addressLine2;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (pincode) user.addresses[addressIndex].pincode = pincode;
    
    // Handle default address setting
    if (isDefault) {
      // Unset any existing default address
      user.addresses.forEach((addr, index) => {
        user.addresses[index].isDefault = (index === addressIndex);
      });
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Address updated successfully',
      address: user.addresses[addressIndex]
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete address
router.delete('/address/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the address to delete
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Check if it's the default address
    const isDefault = user.addresses[addressIndex].isDefault;
    
    // Remove the address
    user.addresses.splice(addressIndex, 1);
    
    // If the deleted address was the default and there are other addresses, set the first one as default
    if (isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
