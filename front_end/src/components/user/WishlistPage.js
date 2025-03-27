import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useWishlist } from '../../context/WishlistContext';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        toast.error('Please login to view your wishlist');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.products && Array.isArray(response.data.products)) {
        setWishlistItems(response.data.products);
      } else {
        setWishlistItems([]);
        console.warn('No wishlist products found or invalid response format');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to load wishlist items');
      setWishlistItems([]);
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      // Update the local state to reflect the removal
      setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/cart', { productId }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Item added to cart');
        
        // You can uncomment the following line if you want to remove the item from wishlist after adding to cart
        // await handleRemoveFromWishlist(productId);
      } else {
        toast.error(response.data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-orange-50 rounded-xl">
          <p className="text-lg text-gray-600">Your wishlist is empty</p>
          <p className="text-sm text-gray-500 mt-2">Start adding items you love!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={item.images && item.images.length > 0 ? `http://localhost:5000/uploads/${item.images[0]}` : '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.warn(`Image load error for product "${item.name}":`, {
                      productId: item._id,
                      hasImages: Array.isArray(item.images),
                      imageCount: Array.isArray(item.images) ? item.images.length : 0,
                      firstImage: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null
                    });
                    e.target.src = '/placeholder.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2">₹{item.price}</p>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => addToCart(item._id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;