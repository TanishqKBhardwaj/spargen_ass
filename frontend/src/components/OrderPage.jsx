import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const OrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);

  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [submit, setOnSubmit] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/cart/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(data);
        const item = data.cart.items.find(item =>
          item?.product?._id?.toString().trim() === productId.trim()
        );

        if (item) {
          setProductDetails(item.product);
          setQuantity(item.quantity);
        } else {
          toast.error('Product not found in cart');
        }
      } catch (error) {
        toast.error('Failed to fetch cart data');
      }
    };

    fetchCartData();
  }, [productId, token]);

  const isShippingAddressValid = () => {
    return Object.values(shippingAddress).every(field => field.trim() !== '');
  };

  const handleOrderSubmit = async () => {

    if (!productDetails) return;

    if (!isShippingAddressValid()) {
      toast.error('Please fill all shipping address fields');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    const orderPayload = {
      orderItems: [
        {
          product: productDetails._id,
          quantity
        }
      ],
      shippingAddress,
      paymentMethod: 'Cash On Delivery',
      totalPrice: productDetails.price * quantity,
      status: 'Pending'
    };

    try {
      setOnSubmit(true);
      const { data } = await axios.post('http://localhost:5000/api/order/', orderPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Order placed successfully!');
      navigate('/orders'); // Redirect after success
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setOnSubmit(false);
    }
  };

  if (!productDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-300">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-l-8 pl-2 border-amber-600 rounded-md">Confirm Your Order</h1>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={productDetails.images[0]}
          alt={productDetails.name}
          className="w-48 h-48 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{productDetails.name}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{productDetails.description}</p>
          <p className="text-gray-700 dark:text-gray-300 mb-1">
            Price: <span className="font-semibold">${productDetails.price}</span>
          </p>

          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold" htmlFor="quantityInput">
            Quantity:
          </label>
          <input
            id="quantityInput"
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-24 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition mb-4"
          />

          <p className="text-gray-700 dark:text-gray-300 font-semibold">
            Total: ${productDetails.price * quantity}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">Shipping Address</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleOrderSubmit();
          }}
          className="space-y-5"
          noValidate
        >
          {['address', 'city', 'postalCode', 'country'].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={shippingAddress[field]}
              onChange={e => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              required
            />
          ))}

          <button
            type="submit"
            disabled={submit}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
