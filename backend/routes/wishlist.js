const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        items: [{ product: productId }]
      });
    } else {
      const alreadyExists = wishlist.items.find(item => item.product.toString() === productId);
      if (alreadyExists) {
        return res.status(200).json({ success: true, message: 'Product already in wishlist' });
      }
      wishlist.items.push({ product: productId });
    }

    await wishlist.save();
    const populated = await wishlist.populate('items.product');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

    if (!wishlist) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: wishlist.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    // Remove the item
    wishlist.items = wishlist.items.filter(item => item.product.toString() !== productId);

    await wishlist.save();

    const updatedWishlist = await wishlist.populate('items.product');

    res.status(200).json({ success: true, data: updatedWishlist.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete('/', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    wishlist.items = []; // Clear all items

    await wishlist.save();

    res.status(200).json({ success: true, message: 'Wishlist cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports=router;