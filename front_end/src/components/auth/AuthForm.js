import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthForm = ({ mode, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const requestData = {
        email: formData.email,
        password: formData.password,
        userType: localStorage.getItem('userType') || 'user', // Get userType from localStorage or default to 'user'
        ...(mode === 'signup' && { name: formData.name })
      };
      
      const apiResponse = await axios.post(
        `http://localhost:5000${endpoint}`, 
        requestData
      );
      
      if (apiResponse.data.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', apiResponse.data.token);
        localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
        localStorage.setItem('userType', apiResponse.data.user.role || requestData.userType);
        
        // Show success message
        toast.success(mode === 'signup' ? 'Registration successful!' : 'Login successful!');
        
        // Call onAuthSuccess if provided
        if (onAuthSuccess) {
          onAuthSuccess(apiResponse.data.user);
        }
        
        // Handle successful login/register
        if (mode === 'signup') {
          navigate('/login');
        } else {
          const redirectPath = apiResponse.data.user.role === 'artist' ? '/artist/home' : '/user/home';
          navigate(redirectPath);
        }
      } else {
        throw new Error(apiResponse.data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || err.message || 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B00] hover:bg-[#FF8533] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00]"
      >
        {mode === 'signup' ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
};

export default AuthForm;