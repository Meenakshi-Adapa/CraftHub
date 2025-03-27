import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShopName = () => {
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(null); // Changed from false to null
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkShopName = async () => {
    try {
      if (!shopName.trim()) {
        setError('Shop name is required');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        navigate('/login'); // Redirect to login if no token
        return;
      }

      const response = await axios.post('http://localhost:5000/api/shop/check-name', 
        { shopName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.available) {
        setIsAvailable(true);
        setError('');
      } else {
        setIsAvailable(false);
        setError('This shop name is already taken');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Error checking shop name');
      }
      setIsAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable) {
      setError('Please check shop name availability first');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to create a shop');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/shop/create',
        { shopName: shopName.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Store shop data
        localStorage.setItem('shopData', JSON.stringify(response.data.data));
        
        // Show success message
        toast.success('Shop created successfully!', {
          position: "top-center",
          autoClose: 2000
        });

        // Navigate to shop profile after short delay
        setTimeout(() => {
          navigate('/artist/shop-profile');
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create shop');
      setError(err.response?.data?.message || 'Error creating shop');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">Name Your Shop</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
              Choose a unique shop name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="shopName"
                value={shopName}
                onChange={(e) => {
                  setShopName(e.target.value);
                  setIsAvailable(null); // Reset availability on change
                  setError('');
                }}
                onBlur={checkShopName}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter shop name"
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {isAvailable && <p className="mt-2 text-sm text-green-600">This shop name is available!</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isAvailable === null || !isAvailable || isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isAvailable && !isLoading
                  ? 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer' 
                  : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {isLoading ? 'Creating Shop...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopName;