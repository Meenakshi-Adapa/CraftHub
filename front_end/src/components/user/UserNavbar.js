import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaSearch, FaHeart, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import SideNav from './SideNav';

const UserNavbar = ({ onLogout, isGuest }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const { wishlistedProducts } = useWishlist();
  const { cartCount } = useCart();

  useEffect(() => {
    if (wishlistedProducts) {
      setWishlistCount(Object.keys(wishlistedProducts).length);
    }
  }, [wishlistedProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to={isGuest ? "/" : "/user/home"} className="text-2xl font-bold text-orange-500">CraftHub</Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for handcrafted items..."
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500"
                  >
                    <FaSearch className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              {isGuest ? (
                <>
                  <Link 
                    to="/login"
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <FaSignInAlt className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 text-sm font-medium"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/user/home"
                    className="nav-link text-gray-600 hover:text-orange-500 flex items-center space-x-2"
                  >
                    <FaHome className="w-5 h-5" />
                    <span className="text-sm hidden md:inline">Home</span>
                  </Link>
                  <Link 
                    to="/categories" 
                    className="nav-link hidden md:block hover:text-orange-500 transition-colors font-medium"
                  >
                    Categories
                  </Link>
                  <Link 
                    to="/user/wishlist" 
                    className="nav-link text-gray-600 hover:text-orange-500 relative hidden md:flex items-center space-x-2"
                  >
                    <FaHeart className="w-5 h-5" />
                    <span className="text-sm">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/cart" 
                    className="nav-link text-gray-600 hover:text-orange-500 relative flex items-center space-x-2"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span className="text-sm hidden md:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/user/profile"
                    className="nav-link text-gray-600 hover:text-orange-500 hidden md:flex items-center space-x-2"
                  >
                    <FaUser className="w-5 h-5" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="nav-link text-gray-600 hover:text-orange-500 hidden md:flex items-center space-x-2"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setIsSideNavOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                aria-label="Open menu"
              >
                <FaBars className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <SideNav
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        onLogout={onLogout}
        isGuest={isGuest}
      />
    </div>
  );
};

export default UserNavbar;