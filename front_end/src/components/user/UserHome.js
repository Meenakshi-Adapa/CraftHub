import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaHeart, FaClock, FaUser, FaSignOutAlt, FaEnvelope, FaCalendar, FaUserTag } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Categories from '../products/Categories';

const UserHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('shopData');
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      {/* User Profile Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-8 mb-8 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">Welcome Back, {user?.name || 'Guest'}!</h1>
            <p className="text-lg opacity-90 mb-4">Discover unique handcrafted items from our talented artists.</p>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold">Email:</span>
                <span className="opacity-90">{user?.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Member Since:</span>
                <span className="opacity-90">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Account Type:</span>
                <span className="opacity-90 capitalize">{user?.role || 'Regular User'}</span>
              </p>
            </div>
          </div>
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
            <FaUser className="w-12 h-12 text-white/80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Link to="/user/profile" className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-orange-50">
          <FaUser className="text-orange-500 w-7 h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-lg">Profile</h3>
            <p className="text-sm text-gray-600">Manage your account</p>
          </div>
        </Link>

        <Link to="/user/orders" className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-orange-50">
          <FaShoppingBag className="text-orange-500 w-7 h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-lg">Orders</h3>
            <p className="text-sm text-gray-600">Track your orders</p>
          </div>
        </Link>

        <Link to="/user/wishlist" className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-orange-50">
          <FaHeart className="text-orange-500 w-7 h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-lg">Wishlist</h3>
            <p className="text-sm text-gray-600">Saved items</p>
          </div>
        </Link>

        <Link to="/user/history" className="flex items-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 hover:bg-orange-50">
          <FaClock className="text-orange-500 w-7 h-7 mr-4" />
          <div>
            <h3 className="font-semibold text-lg">History</h3>
            <p className="text-sm text-gray-600">Browsing history</p>
          </div>
        </Link>
      </div>

      {/* Categories Section with enhanced styling */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Browse Categories</h2>
        <Categories />
      </div>

      {/* Featured Products with enhanced styling */}
      <div className="mb-12 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-orange-50 rounded-xl shadow-md hover:shadow-lg transition-all">
            <p className="text-gray-600 text-center">Featured products coming soon...</p>
          </div>
        </div>
      </div>

      {/* Recent Orders with enhanced styling */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Recent Orders</h2>
        <div className="bg-orange-50 rounded-xl p-6">
          <p className="text-gray-600 text-center">No recent orders</p>
        </div>
      </div>
    </div>
  );
};

export default UserHome;