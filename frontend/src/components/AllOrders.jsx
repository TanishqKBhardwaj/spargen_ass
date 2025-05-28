import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";

const AllOrders = () => {
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/order/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(data.data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [token]);

  if (!orders.length) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        No orders found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-l-8 pl-2 border-amber-600 rounded-md">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <Card
            key={order._id}
            onClick={() => navigate(`/orderDetails/${order._id}`)}
            className="cursor-pointer hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-4 space-y-2">
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                Order ID: {order._id}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Status: <span className="font-medium">{order.status}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Items: {order.orderItems.map(item => item.product?.name).join(', ')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Total: <span className="font-semibold">${order.totalPrice || 'N/A'}</span>
              </p>
              <p className="text-sm text-gray-500">
                Placed On: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
