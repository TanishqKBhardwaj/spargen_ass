const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require("../utils/multer");

router.post("/upload",protect,adminOnly, upload.array("images", 5), (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path); // Cloudinary URLs
    res.json({ imageUrls });
  } catch (err) {
    res.status(500).json({ error: "Image upload failed" });
  }
});



// Create Product
router.post('/create', protect, adminOnly, async (req, res) => {
  try {
    const { brand, name } = req.body;

    // Check if product already exists with same brand and name
    const existingProduct = await Product.findOne({ brand, name });

    if (existingProduct) {
      return res.status(409).json({
        message: 'Product with this brand and name already exists',
        success: false
      });
    }

    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ data: saved, success: true });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
});


// Update Product
router.put('/update/:id', protect, adminOnly, async (req, res) => {
  try {
    const product=await Product.findById(req.params.id)
    if(!product)
        return res.status(404).json({ message: 'Product not found',success:false });

    const updated = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not updated',success:false });
    res.json({data:updated,success:true});
  } catch (err) {
    res.status(400).json({ error: err.message,success:false });
  }
});

router.put('/rate/:id', protect, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value', success: false });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    const totalRating = product.rating * product.numReviews + rating;
    const newNumReviews = product.numReviews + 1;
    const newRating = totalRating / newNumReviews;

    product.rating = newRating;
    product.numReviews = newNumReviews;

    const updated = await product.save();

    res.json({ data: updated, success: true });
  } catch (err) {
    res.status(400).json({ error: err.message, success: false });
  }
});


// Delete Product
router.delete('/delete/:id', protect, adminOnly, async (req, res) => {
  try {
    const product=await Product.findById(req.params.id)
    if(!product)
        return res.status(404).json({ message: 'Product not found',success:false });
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Deletion failed',success:false });
    res.json({ message: 'Product deleted successfully',success:true });
  } catch (err) {
    res.status(400).json({ error: err.message,success:false });
  }
});

router.get('/', protect,async (req, res) => {
  try {
    const {
      q,                     // keyword search
      brand,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort = 'createdAt',    // default sort field
      order = 'desc',        // default sort order
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Search by name or description
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by brand
    if (brand) {
      filter.brand = brand;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // Filter in-stock products
    if (inStock === 'true') {
      filter.countInStock = { $gt: 0 };
    }

    // Pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Sort
    const sortBy = { [sort]: order === 'asc' ? 1 : -1 };

    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(pageSize);

    const total = await Product.countDocuments(filter);

    res.json({
      data: products,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      success: true
    });

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true,  product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});




module.exports = router;
