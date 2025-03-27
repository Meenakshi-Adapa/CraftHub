import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to CraftHub
          </h1>
          <p className="text-xl mb-8">
            Discover unique handcrafted items from talented artists around the world
          </p>
          <div className="space-x-4">
            <Link
              to="/categories"
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-orange-100 transition-colors"
            >
              Explore Products
            </Link>
            <Link
              to="/artist/start-selling"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;