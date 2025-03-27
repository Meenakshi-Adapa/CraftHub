import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ArtistDashboard = () => {
  const [stats] = useState({
    products: 12,
    workshops: 3,
    followers: 156,
    earnings: 25000
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Artist Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Products Listed</h3>
            <p className="text-2xl font-bold">{stats.products}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Active Workshops</h3>
            <p className="text-2xl font-bold">{stats.workshops}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Followers</h3>
            <p className="text-2xl font-bold">{stats.followers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Total Earnings</h3>
            <p className="text-2xl font-bold">₹{stats.earnings}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/artist/add-product" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
            <p className="text-gray-600">List your artworks for sale</p>
          </Link>
          <Link to="/artist/create-workshop" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Create Workshop</h3>
            <p className="text-gray-600">Host online teaching sessions</p>
          </Link>
          <Link to="/artist/organize-mela" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Organize Mela</h3>
            <p className="text-gray-600">Plan cultural events and exhibitions</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">New order received</p>
                <p className="text-sm text-gray-500">Traditional Painting - Blue Pottery</p>
              </div>
              <span className="text-green-600 font-medium">₹2,500</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Workshop Registration</p>
                <p className="text-sm text-gray-500">5 new participants for Madhubani Workshop</p>
              </div>
              <span className="text-blue-600 font-medium">+5 Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;