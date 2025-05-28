const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET; 

// POST /api/user/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address,isAdmin } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.', success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.', success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      address,
      isAdmin
      
    });

    await newUser.save();

    // Generate JWT token
    const payload = {
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully.',
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        isAdmin: newUser.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password} = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.', success: false });
    }


    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email ', success: false });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid  password.', success: false });
    }

    // Create JWT token
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', success: false });
  }
});

module.exports = router;
