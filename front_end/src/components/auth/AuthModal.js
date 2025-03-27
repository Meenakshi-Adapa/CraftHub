import React, { useState, useEffect, useRef } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/AuthModal.css';
import bgFront from '../../assets/bgfront.jpg';

const AuthModal = ({ onAuthSuccess }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const buttonsRef = useRef(null);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleGuestAccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess({ 
        role: 'guest',
        isGuest: true
      });
    }
    localStorage.setItem('isGuest', 'true');
    // Add animation before navigation
    gsap.to(modalRef.current, {
      duration: 0.3,
      opacity: 0,
      scale: 0.95,
      onComplete: () => {
        navigate('/');
      }
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const requestData = {
        ...formData,
        userType,
        name: formData.fullName
      };
      
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        requestData
      );

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userType', user.role || userType);
        
        toast.success(`${authMode === 'login' ? 'Login' : 'Registration'} successful!`);
        
        // Trigger success callback if provided
        if (onAuthSuccess) {
          onAuthSuccess(user);
        }

        // Immediate hard navigation for artists
        if (user.role === 'artist') {
          window.location.href = '/artist/home';
          return; // Exit early to prevent double navigation
        } else {
          // Regular navigation for non-artists
          navigate('/user/home', { replace: true });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err.response?.data?.message || 
        `${authMode === 'login' ? 'Login' : 'Registration'} failed`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleTransition = (callback) => {
    gsap.to(contentRef.current, {
      duration: 0.3,
      opacity: 0,
      y: -20,
      ease: "power2.inOut",
      onComplete: () => {
        callback();
        gsap.to(contentRef.current, {
          duration: 0.4,
          opacity: 1,
          y: 0,
          ease: "back.out(1.2)"
        });
      }
    });
  };

  const handleUserTypeClick = (type) => {
    handleTransition(() => setUserType(type));
  };

  const handleAuthModeClick = (mode) => {
    handleTransition(() => setAuthMode(mode));
  };

  const renderUserTypeSelection = () => (
    <div className="w-full text-center">
      <div ref={headingRef} className="mb-8">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to CraftHub
        </h2>
        <h3 className="text-2xl text-orange-900 dark:text-orange-100 font-semibold">
          Continue as
        </h3>
      </div>
      
      <div className="space-y-4" ref={buttonsRef}>
        <button 
          onClick={() => handleUserTypeClick('artist')}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-xl font-medium hover:from-orange-600 hover:to-pink-600"
        >
          Artist
        </button>
        <button 
          onClick={() => handleUserTypeClick('user')}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-xl font-medium hover:from-pink-600 hover:to-orange-600"
        >
          User/Buyer
        </button>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
          </div>
        </div>
        <button 
          onClick={handleGuestAccess}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          View as Guest
        </button>
      </div>
    </div>
  );

  const renderAuthForm = () => (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-8 text-center text-orange-900 dark:text-orange-100">
        {authMode === 'login' ? 'Login' : 'Sign Up'} as {userType === 'artist' ? 'Artist' : 'User'}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {authMode === 'signup' && (
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full px-5 py-3 border border-orange-200 dark:border-orange-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        )}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email Address"
          className="w-full px-5 py-3 border border-orange-200 dark:border-orange-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full px-5 py-3 border border-orange-200 dark:border-orange-900 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium hover:from-orange-600 hover:to-pink-600 mt-4"
        >
          {authMode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        {authMode === 'login' && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-orange-200 dark:border-orange-900"></div>
              <span className="px-4 text-orange-900 dark:text-orange-100">OR</span>
              <div className="flex-1 border-t border-orange-200 dark:border-orange-900"></div>
            </div>
            <button 
              type="button"
              className="w-full flex items-center justify-center space-x-2 border border-orange-200 dark:border-orange-900 text-orange-900 dark:text-orange-100 py-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span>Continue with Google</span>
            </button>
          </>
        )}
      </form>
      <div className="mt-6 text-center">
        <button 
          onClick={() => handleTransition(() => setAuthMode(null))}
          className="text-orange-700 dark:text-orange-300 hover:text-orange-500 font-medium"
        >
          ← Back
        </button>
      </div>
    </div>
  );

  const renderAuthTypeSelection = () => (
    <div className="w-full text-center">
      <h2 className="text-3xl font-bold mb-8 text-orange-900 dark:text-orange-100">
        {userType === 'artist' ? 'Artist Portal' : 'User Portal'}
      </h2>
      <div className="space-y-4">
        <button 
          onClick={() => handleAuthModeClick('login')}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium hover:from-orange-600 hover:to-pink-600"
        >
          Login
        </button>
        <button 
          onClick={() => handleAuthModeClick('signup')}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium hover:from-pink-600 hover:to-orange-600"
        >
          Sign Up
        </button>
      </div>
      <button 
        onClick={() => setUserType(null)}
        className="mt-6 text-orange-700 dark:text-orange-300 hover:text-orange-500 font-medium"
      >
        ← Back
      </button>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 bg-blend-overlay"
      ref={modalRef}
      style={{
        backgroundImage: `url(${bgFront})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="bg-white/95 dark:bg-gray-900/95 rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl border border-orange-200 dark:border-orange-900 relative overflow-hidden"
        ref={contentRef}
      >
        <div 
          className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bgFront})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
          }}
        />
        {!userType && renderUserTypeSelection()}
        {userType && !authMode && renderAuthTypeSelection()}
        {userType && authMode && renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthModal;