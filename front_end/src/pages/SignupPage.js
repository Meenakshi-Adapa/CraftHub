import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import signupImg from '../assets/signin.jpg';

const SignupPage = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'user' // Default to regular user
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== passwordConfirm) {
        setError('Passwords do not match');
        toast.error('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        toast.error('Password must be at least 6 characters long');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', formData.userType);
        toast.success('Signup successful!');
        if (onAuthSuccess) {
          onAuthSuccess(response.data.user);
        }
        navigate(formData.userType === 'artist' ? '/artist/home' : '/user/home');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data);
      setError(err.response?.data?.message || 'Error during signup');
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2">
        <img 
          src={signupImg} 
          alt="Sign up" 
          className="w-full h-screen object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Link to="/" className="text-gray-600 hover:text-[#FF6B00] mb-8 inline-block">
            ← Back to Home
          </Link>
          
          <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Join CraftHub</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Start your journey with CraftHub</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">I want to</label>
              <select
                id="userType"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              >
                <option value="user">Buy handcrafted items</option>
                <option value="artist">Sell my artwork</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                id="passwordConfirm"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF6B00] focus:border-[#FF6B00] dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00]"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF6B00] hover:text-[#FF8533] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;