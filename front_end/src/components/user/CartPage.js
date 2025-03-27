import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, loading, totalPrice, removeFromCart, updateQuantity, refreshCart } = useCart();

  useEffect(() => {
    // Refresh cart items when component mounts
    refreshCart();
  }, [refreshCart]);

  const handleRemoveFromCart = async (productId) => {
    await removeFromCart(productId);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Your Cart is empty</h2>
          <p className="text-gray-600 mb-4">Check your Saved for later items below or continue shopping.</p>
          <button 
            onClick={() => navigate('/user/home')} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-6 rounded-md font-medium"
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button className="text-blue-600 hover:text-blue-800 hover:underline">
                  Deselect all items
                </button>
              </div>
              <div className="border-b border-gray-200 mb-4"></div>
              
              {cartItems.map((item) => (
                <div key={item._id} className="flex flex-col md:flex-row py-4 border-b border-gray-200">
                  <div className="md:w-1/5 mb-4 md:mb-0">
                    <img
                      src={item.images && item.images.length > 0 ? `http://localhost:5000/uploads/${item.images[0]}` : '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-32 object-contain"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="md:w-4/5 md:pl-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                        <p className="text-green-600 text-sm mb-2">In Stock</p>
                        <p className="text-sm text-gray-500 mb-2">Eligible for FREE Shipping</p>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            Delete
                          </button>
                          
                          <button className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                            Save for later
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="font-bold text-lg">₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-4">
                <p className="text-lg font-bold">
                  Subtotal ({cartItems.reduce((count, item) => count + item.quantity, 0)} items): 
                  <span className="ml-2">₹{totalPrice.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <p className="text-green-600 mb-2">
                  <span className="inline-block mr-2">✓</span>
                  Your first order qualifies for FREE Delivery.
                </p>
                <p className="text-sm text-gray-600">Select this option at checkout.</p>
              </div>
              
              <div className="mb-4">
                <p className="text-lg font-bold">
                  Subtotal ({cartItems.reduce((count, item) => count + item.quantity, 0)} items): 
                  <span className="ml-2">₹{totalPrice.toFixed(2)}</span>
                </p>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">This order contains a gift</span>
                </label>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md font-medium mb-4"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;