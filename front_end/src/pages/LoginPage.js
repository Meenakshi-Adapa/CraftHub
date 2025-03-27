import React from 'react';
import { Link } from 'react-router-dom';
// Change this line
import AuthForm from '../components/auth/AuthForm';
import loginImg from '../assets/signin.jpg';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2">
        <img 
          src={loginImg} 
          alt="Sign in" 
          className="w-full h-screen object-cover"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 py-12 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Link to="/" className="text-gray-600 hover:text-[#FF6B00] mb-8 inline-block">
            ← Back to Home
          </Link>
          
          <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to continue your journey</p>
          
          <AuthForm mode="login" />

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FF6B00] hover:text-[#FF8533] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;