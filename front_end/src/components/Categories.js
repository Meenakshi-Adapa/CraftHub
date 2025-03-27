import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([
    { name: 'Paintings', image: '/images/paintings.svg', description: 'Discover unique paintings from talented artists' },
    { name: 'Sculptures', image: '/images/sculptures.svg', description: 'Explore handcrafted sculptures in various materials' },
    { name: 'Textiles', image: '/images/textiles.svg', description: 'Browse beautiful handwoven and crafted textiles' },
    { name: 'Handicrafts', image: '/images/handicrafts.svg', description: 'Find unique handmade crafts and decorative items' }
  ]);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    // Convert category name to URL-friendly format
    const urlCategory = categoryName.toLowerCase().replace(/ /g, '-');
    navigate(`/category/${urlCategory}`);
  };

  return (
    <div className="categories-section p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Art Categories</h2>
      <div className="categories-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-card bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="h-48 bg-gray-200 relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;