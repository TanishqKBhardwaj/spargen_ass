const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const userRoutes = require('./routes/user'); 
const productRoutes=require('./routes/product')
const orderRoutes=require('./routes/order');
const cartRoutes=require('./routes/cart')
const wishlistRoutes=require('./routes/wishlist');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/product',productRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/wishlist',wishlistRoutes);

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI
  ).then(() => {
  console.log('MongoDB Connected');
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
}).catch((err) => console.error(err));
