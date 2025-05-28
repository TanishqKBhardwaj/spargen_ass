const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.json({ success: true,  cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.post('/', protect, async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({ success: false, message: 'Product and quantity are required' });
    }

    
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
     
      cart = new Cart({
        user: req.user._id,
        items: [{ product, quantity }]
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new product to items
        cart.items.push({ product, quantity });
      }
    }

    await cart.save();
    const updatedCart = await cart.populate('items.product');

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/update', protect, async (req, res) => {
  try {
    const { product, quantity } = req.body;

    if (!product || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product and quantity are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    const updatedCart = await cart.populate('items.product');

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/remove', protect, async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    // Remove the product
    cart.items.splice(itemIndex, 1);

    await cart.save();
    const updatedCart = await cart.populate('items.product');

    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



module.exports = router;
