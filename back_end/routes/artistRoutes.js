const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Artist = require('../models/artistModel');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if artist already exists
    let artist = await Artist.findOne({ email });
    if (artist) {
      return res.status(400).json({
        success: false,
        message: 'Artist already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new artist
    artist = new Artist({
      name,
      email,
      password: hashedPassword,
      role: role || 'artist'
    });

    await artist.save();

    // Create token
    const token = jwt.sign(
      { id: artist._id, email: artist.email, role: artist.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: artist._id,
        name: artist.name,
        email: artist.email,
        role: artist.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
