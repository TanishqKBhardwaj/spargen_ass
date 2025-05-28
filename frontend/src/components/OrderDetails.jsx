import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "./ui/alert-dialog";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(data.data);
      } catch (error) {
        toast.error('Failed to fetch order details');
      }
    };

    fetchOrderDetails();
  }, [id, token]);

  const cancelOrder = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Order cancelled successfully');
      navigate('/allOrders');
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-l-8 pl-2 border-amber-600 rounded-md">Order Details</h1>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Order ID: {order._id}
          </p>
          <p>User ID: {order.user}</p>
          <p>Status: <span className="font-medium">{order.status}</span></p>
          <p>Total Price: ₹{order.totalPrice}</p>
          <p>Payment Status: {order.payment.status}</p>
          <p>Payment Method: {order.payment.paymentMethod}</p>
          <p className="text-sm text-gray-500">
            Created At: {new Date(order.createdAt).toLocaleString()}
          </p>

          {/* Alert Dialog for Cancel Confirmation */}
          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto hover:bg-red-600 transition-colors"
                >
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your order. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    No, keep order
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={cancelOrder}
                    className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    Yes, cancel it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Shipping Address</h2>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Order Items</h2>
          {order.orderItems.map((item, index) => (
            <div key={index} className="border-b pb-2 last:border-b-0">
              <p><span className="font-medium">Product:</span> {item.product?.name} ({item.product?.brand})</p>
              <p><span className="font-medium">Price:</span> ₹{item.product?.price}</p>
              <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
