import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ArtistHome = () => {
  const [hasShop, setHasShop] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('shopData');
    navigate('/login');
  };

  useEffect(() => {
    const checkShop = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/shop/check', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setHasShop(response.data.hasShop);
          if (response.data.hasShop) {
            localStorage.setItem('shopData', JSON.stringify(response.data.shop));
          }
        }
      } catch (error) {
        console.error('Error checking shop:', error);
        toast.error('Failed to check shop status');
      } finally {
        setLoading(false);
      }
    };
    checkShop();
  }, []);

  const handleGetStarted = () => {
    // Check if user has completed onboarding before
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
      navigate('/artist/shop-preferences');
    } else {
      navigate('/artist/seller-onboarding');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-orange-600">CraftHub</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {hasShop ? 'Manage Your Shop' : 'Ready to Start Selling?'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {hasShop 
              ? 'Your creative journey continues here. Manage your listings and connect with customers.'
              : 'Millions of shoppers can\'t wait to see what you have in store'}
          </p>
          
          {!hasShop ? (
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Get started
            </button>
          ) : (
            <button
              onClick={() => navigate('/artist/shop-profile')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Go to Shop Dashboard
            </button>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Feature Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Great value</h3>
            <p className="text-gray-600 text-center">
              List your first item for just 0.20 USD — you only pay when you make a sale.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Powerful tools</h3>
            <p className="text-gray-600 text-center">
              Our tools and services make it easy to manage, promote and grow your business.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">Support and education</h3>
            <p className="text-gray-600 text-center">
              Reach out to CraftHub support specialists anytime you need help.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            {hasShop ? 'Grow your business today' : 'Start selling today'}
          </h2>
          <button
            onClick={hasShop ? () => navigate('/artist/shop-profile') : handleGetStarted}
            className="bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
          >
            {hasShop ? 'View Shop Analytics' : 'Open your CraftHub shop'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistHome;