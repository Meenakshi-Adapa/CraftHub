import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view orders');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error('Failed to fetch orders');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No orders found</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Order #{order._id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    } capitalize`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <dl className="divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <div key={item._id} className="py-4 flex items-center space-x-4">
                          <div className="flex-shrink-0 w-20 h-20">
                            <img
                              src={`http://localhost:5000/uploads/${item.productId.images?.[0] || 'placeholder.jpg'}`}
                              alt={item.productId.name}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                e.target.src = '/placeholder.svg';
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <dt className="text-sm font-medium text-gray-900">{item.productId.name}</dt>
                            <dd className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</dd>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹{order.totalAmount.toFixed(2)}</dd>
                      </div>

                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{order.paymentStatus}</dd>
                      </div>

                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Estimated Delivery</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {new Date(order.orderConfirmation?.estimatedDeliveryDate || Date.now()).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </dd>
                      </div>

                      {order.trackingDetails?.trackingNumber && (
                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-sm font-medium text-gray-500">Tracking Details</dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>Carrier: {order.trackingDetails.carrier}</p>
                            <p className="mt-1">Tracking Number: {order.trackingDetails.trackingNumber}</p>
                            {order.trackingDetails.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-500 mt-2 inline-block"
                              >
                                Track Order
                              </a>
                            )}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;