const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Order =require('../models/order')

router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items', success: false });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      payment: {
        status: 'Pending'
      }
    });

    const savedOrder = await order.save();
    res.status(201).json({ data: savedOrder, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});


router.get('/my', protect,  async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name brand'); // Optional: populate product details

    res.status(200).json({ data: orders, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});
router.get('/:id', protect,async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name brand price'); 

    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    // Only allow: the owner or an admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized', success: false });
    }

    res.json({ data: order, success: true });

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    // Only allow the owner or an admin to delete
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized to delete this order', success: false });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order deleted successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});





router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') //  user info
      .populate('orderItems.product', 'name brand'); //  product info

    res.status(200).json({ data: orders, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    // Now update status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json({ data: updatedOrder, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

router.patch('/:id/payment', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    // Update payment details
    order.payment = {
      ...order.payment,
      ...req.body.payment,
      paidAt: req.body.payment?.status === 'Paid' ? new Date() : order.payment?.paidAt
    };

    const updatedOrder = await order.save();

    res.status(200).json({ data: updatedOrder, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Order deleted successfully', success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});


module.exports = router;
