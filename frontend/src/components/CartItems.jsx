import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const CartItems = () => {
  const token = useSelector(state => state.auth.token);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cart);
      if (data.cart?.items) {
        const qtys = {};
        data.cart.items.forEach(item => {
          qtys[item.product._id] = item.quantity;
        });
        setQuantities(qtys);
      }
    } catch {
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const updateQuantity = async (productId) => {
    const quantity = quantities[productId];
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }
    try {
      const { data } = await axios.patch(
        'http://localhost:5000/api/cart/update',
        { product: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Quantity updated');
      setCart(data.data);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await axios.delete('http://localhost:5000/api/cart/remove', {
        headers: { Authorization: `Bearer ${token}` },
        data: { product: productId },
      });
      toast.success('Item removed from cart');
      setCart(data.data);
      setQuantities(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600 dark:text-gray-300">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-20 text-gray-600 dark:text-gray-300">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Cart</h1>

      {cart.items.map(item => (
        <Card key={item.product._id} className="mb-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center flex-wrap">
              {/* Make only this part clickable */}
              <Link
                to={`/order/${item.product._id}`}
                className="space-y-1 text-left"
              >
                <p className="font-semibold text-gray-800 dark:text-white">{item.product.name}</p>
                <p className="text-gray-500 text-sm">{item.product.brand}</p>
                <p className="text-gray-700 dark:text-gray-300">₹{item.product.price}</p>
              </Link>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <input
                  type="number"
                  min={1}
                  value={quantities[item.product._id] ?? item.quantity}
                  onChange={(e) =>
                    setQuantities(prev => ({
                      ...prev,
                      [item.product._id]: Math.max(1, Number(e.target.value)),
                    }))
                  }
                  className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                />
                <Button
                  onClick={() => updateQuantity(item.product._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => removeItem(item.product._id)}
                  className="hover:bg-red-600 transition-colors"
                >
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CartItems;
