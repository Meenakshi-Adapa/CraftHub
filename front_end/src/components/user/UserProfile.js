import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaCalendar, FaUserTag } from 'react-icons/fa';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <FaUser className="w-12 h-12 text-white/80" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{user?.name || 'Guest'}</h1>
              <p className="text-lg opacity-90">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Details</h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-orange-500 w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaCalendar className="text-orange-500 w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">Join Date</p>
                <p className="text-lg">{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaUserTag className="text-orange-500 w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="text-lg capitalize">{user?.role || 'Regular User'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates about your orders and account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">Marketing Communications</h3>
                <p className="text-sm text-gray-600">Receive updates about new products and offers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;