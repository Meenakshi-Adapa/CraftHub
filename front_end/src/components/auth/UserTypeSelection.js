import React from 'react';

const UserTypeSelection = ({ onSelect }) => {
  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to CraftHub
        </h2>
        <h3 className="text-2xl text-orange-900 dark:text-orange-100 font-semibold">
          Continue as
        </h3>
      </div>
      
      <div className="space-y-6">
        <button 
          onClick={() => onSelect('artist')}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-xl font-medium hover:from-orange-600 hover:to-pink-600"
        >
          Artist
        </button>
        <button 
          onClick={() => onSelect('user')}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-xl font-medium hover:from-pink-600 hover:to-orange-600"
        >
          User/Buyer
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection;