import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaStore } from 'react-icons/fa';
import SideNav from '../user/SideNav';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('user');
  const isGuest = !isAuthenticated;
  const isUserHome = location.pathname === '/user/home';
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  const handleLoginClick = () => {
    if (isAuthenticated && !isGuest) {
      toast.info('You are already logged in!');
    } else if (isGuest) {
      navigate('/user/home');
    } else {
      navigate('/login');
    }
  };

  const handleSignupClick = () => {
    if (isAuthenticated && !isGuest) {
      toast.info('You are already logged in!');
    } else {
      navigate('/signup');
    }
  };

  const renderArtistNav = () => (
    <div className="flex items-center space-x-4">
      <Link to="/artist/home" className="nav-link">HOME</Link>
      <Link 
        to="/artist/shop-profile" 
        className="flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-200 flex items-center justify-center">
          <FaStore className="text-orange-500 w-4 h-4" />
        </div>
        <span className="font-medium text-gray-800">MY SHOP</span>
      </Link>
      <button
        onClick={onLogout}
        className="nav-link text-gray-600 hover:text-orange-500"
      >
        Logout
      </button>
    </div>
  );

  const renderUserNav = () => (
    <div className="flex items-center space-x-4">
      <Link to="/user/home" className="nav-link">HOME</Link>
      <Link to="/cart" className="nav-link text-gray-600 hover:text-orange-500 relative">
        <FaShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
      <button
        onClick={() => setIsSideNavOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <FaBars className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );

  const renderGuestNav = () => (
    <div className="flex items-center space-x-4">
      <Link to="/" className="nav-link">HOME</Link>
      <Link to="/login" className="nav-link hover:text-orange-500">Login</Link>
      <Link
        to="/signup"
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <div>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-orange-500">CraftHub</Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && userType === 'artist' && renderArtistNav()}
              {isAuthenticated && userType === 'user' && renderUserNav()}
              {(!isAuthenticated || isGuest) && renderGuestNav()}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation for regular users */}
      {isAuthenticated && userType === 'user' && (
        <SideNav
          isOpen={isSideNavOpen}
          onClose={() => setIsSideNavOpen(false)}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};

export default Navbar;
// In your Navbar component
<Link
  to="/start-selling"
  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all"
>
  Start Selling
</Link>
