import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistedProducts, setWishlistedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all wishlisted products on initial load
  useEffect(() => {
    fetchWishlistStatus();
  }, []);

  const fetchWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Convert array of products to a map for easier lookup
      const wishlistMap = {};
      response.data.products.forEach(product => {
        wishlistMap[product._id] = true;
      });

      setWishlistedProducts(wishlistMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist status:', error);
      setLoading(false);
    }
  };

  // Check if a specific product is wishlisted
  const isProductWishlisted = (productId) => {
    return !!wishlistedProducts[productId];
  };

  // Toggle wishlist status for a product
  const toggleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage wishlist');
        return false;
      }

      // Optimistically update UI
      const currentStatus = wishlistedProducts[productId];
      setWishlistedProducts(prev => ({
        ...prev,
        [productId]: !currentStatus
      }));

      const response = await axios.post('http://localhost:5000/api/wishlist/toggle', {
        productId
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(!currentStatus ? 'Added to wishlist!' : 'Removed from wishlist!');
        return true;
      } else {
        // Revert on failure
        setWishlistedProducts(prev => ({
          ...prev,
          [productId]: currentStatus
        }));
        toast.error('Failed to update wishlist');
        return false;
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
      // Revert on error
      setWishlistedProducts(prev => ({
        ...prev,
        [productId]: wishlistedProducts[productId]
      }));
      toast.error('Failed to update wishlist');
      return false;
    }
  };

  // Remove a product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return false;
      }

      // Optimistically update UI
      setWishlistedProducts(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });

      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('Item removed from wishlist');
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Revert on error
      fetchWishlistStatus(); // Refresh the entire wishlist state
      if (error.response?.status === 404) {
        toast.error('Item not found in wishlist');
      } else {
        toast.error('Failed to remove item from wishlist');
      }
      return false;
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistedProducts,
      isProductWishlisted,
      toggleWishlist,
      removeFromWishlist,
      loading,
      refreshWishlist: fetchWishlistStatus
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);