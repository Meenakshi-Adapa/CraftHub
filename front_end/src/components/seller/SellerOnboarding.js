import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerOnboarding = () => {
  const [sellerType, setSellerType] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (sellerType) {
      localStorage.setItem('sellerType', sellerType);
      navigate('/artist/shop-preferences');
    }
  };

  const handleSkip = () => {
    // Mark onboarding as completed and go directly to preferences
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/artist/shop-preferences');
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          What brings you to CraftHub?
        </h1>
        <p className="text-lg text-center mb-12 text-gray-600">
          We'll help guide you to success, whether you're a pro or brand new to selling.
        </p>

        <div className="space-y-4">
          <label className="block p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 cursor-pointer transition-all">
            <input
              type="radio"
              name="sellerType"
              value="newSeller"
              className="mr-3"
              onChange={(e) => setSellerType(e.target.value)}
            />
            I'm just starting to sell for the first time ever
          </label>

          <label className="block p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 cursor-pointer transition-all">
            <input
              type="radio"
              name="sellerType"
              value="businessSeller"
              className="mr-3"
              onChange={(e) => setSellerType(e.target.value)}
            />
            I have a business and want to sell online for the first time
          </label>

          <label className="block p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 cursor-pointer transition-all">
            <input
              type="radio"
              name="sellerType"
              value="expandSeller"
              className="mr-3"
              onChange={(e) => setSellerType(e.target.value)}
            />
            I want to expand my online business by selling on CraftHub
          </label>

          <label className="block p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 cursor-pointer transition-all">
            <input
              type="radio"
              name="sellerType"
              value="explore"
              className="mr-3"
              onChange={(e) => setSellerType(e.target.value)}
            />
            I'm mainly here to explore
          </label>
        </div>

        <div className="mt-8 flex justify-between">
          <button 
            onClick={handleSkip}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Skip this question
          </button>
          <button 
            onClick={handleNext}
            className={`px-8 py-3 rounded-xl text-white font-medium transition-all ${
              sellerType 
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!sellerType}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboarding;