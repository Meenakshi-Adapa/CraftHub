import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import paintingImg from '../../assets/painting.jpeg';
import sculptureImg from '../../assets/sculpture.jpeg';
import textileImg from '../../assets/textile.jpeg';
import potteryImg from '../../assets/pottery.jpeg';
import jewelryImg from '../../assets/jewelry.jpeg';
import woodcarvingImg from '../../assets/woodcarving.jpeg';
import craftsImg from '../../assets/crafts.jpg';

const Categories = () => {
  const categories = [
    { 
      id: 1, 
      name: 'Paintings', 
      image: paintingImg,
      description: 'Discover unique Indian paintings'
    },
    { 
      id: 2, 
      name: 'Sculptures', 
      image: sculptureImg,
      description: 'Handcrafted sculptures and statues'
    },
    { 
      id: 3, 
      name: 'Textiles', 
      image: textileImg,
      description: 'Traditional Indian textiles and fabrics'
    },
    { 
      id: 4, 
      name: 'Pottery', 
      image: potteryImg,
      description: 'Handmade pottery and ceramics'
    },
    { 
      id: 5, 
      name: 'Jewelry', 
      image: jewelryImg,
      description: 'Traditional and modern jewelry'
    },
    { 
      id: 6, 
      name: 'Wood Carving', 
      image: woodcarvingImg,
      description: 'Intricately carved wooden art'
    },
    { 
      id: 7, 
      name: 'Crafts', 
      image: craftsImg,
      description: 'Traditional Indian handicrafts'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Explore Indian Art Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-w-16 aspect-h-10">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;