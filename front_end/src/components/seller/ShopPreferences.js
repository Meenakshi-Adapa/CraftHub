 
 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    language: 'English',
    country: '',
    currency: ''
  });

  const handleInputChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'll add API call to save preferences
    navigate('/artist/shop-name');
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">1</div>
          <div className="flex-1 h-1 mx-4 bg-orange-200"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">2</div>
          <div className="flex-1 h-1 mx-4 bg-gray-200"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">3</div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Shop preferences</h1>
          <p className="text-center text-gray-600 mb-8">
            Let's get started! Tell us about you and your shop.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Shop language <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 block">
                  This will be the default language for describing your items
                </span>
              </label>
              <select
                name="language"
                value={preferences.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Shop country <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 block">
                  Tell us where your shop is based
                </span>
              </label>
              <select
                name="country"
                value={preferences.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select a country</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Shop currency <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 block">
                  This is the currency you'll use to price your items
                </span>
              </label>
              <select
                name="currency"
                value={preferences.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select a currency</option>
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                type="submit"
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
                disabled={!preferences.country || !preferences.currency}
              >
                Save and continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopPreferences;