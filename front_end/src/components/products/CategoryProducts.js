import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useWishlist } from '../../context/WishlistContext';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isProductWishlisted, toggleWishlist } = useWishlist();

  const handleWishlist = async (productId) => {
    // Check if user is guest
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      toast.info('Please login or register to add items to wishlist');
      return;
    }
    
    await toggleWishlist(productId);
  };



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/category/${categoryName}`);
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white capitalize">
        {categoryName.replace('-', ' ')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.warn(`Image load error for product "${product.name}":`, {
                    productId: product._id,
                    hasImages: Array.isArray(product.images),
                    imageCount: Array.isArray(product.images) ? product.images.length : 0,
                    firstImage: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null
                  });
                  e.target.src = '/placeholder.svg';
                  e.target.onerror = null;
                }}
              />
              <button
                onClick={() => handleWishlist(product._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                {isProductWishlisted(product._id) ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-xl" />
                )}
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-500 font-bold">₹{product.price}</span>
                <button 
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;