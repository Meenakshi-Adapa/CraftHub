import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items on initial load
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calculate total price whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
    setCartCount(cartItems.reduce((count, item) => count + item.quantity, 0));
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setCartItems(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return false;
      }
      
      const response = await axios.post('http://localhost:5000/api/cart', 
        { productId, quantity }, 
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        // Refresh cart items after adding
        await fetchCartItems();
        toast.success('Item added to cart');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage cart');
        return false;
      }

      // Optimistically update UI
      setCartItems(prevItems => prevItems.filter(item => item._id !== productId));

      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Revert on error
      fetchCartItems(); // Refresh the entire cart state
      toast.error('Failed to remove item from cart');
      return false;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return false;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage cart');
        return false;
      }

      // Optimistically update UI
      setCartItems(prevItems => 
        prevItems.map(item => 
          item._id === productId ? {...item, quantity: newQuantity} : item
        )
      );

      await axios.put(`http://localhost:5000/api/cart/${productId}`, 
        { quantity: newQuantity },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );
      
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert on error
      fetchCartItems(); // Refresh the entire cart state
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage cart');
        return false;
      }

      // Optimistically update UI
      setCartItems([]);

      await axios.delete('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Revert on error
      fetchCartItems(); // Refresh the entire cart state
      toast.error('Failed to clear cart');
      return false;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      totalPrice,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart: fetchCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);