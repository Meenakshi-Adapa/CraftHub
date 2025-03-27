import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaHeart, FaClock, FaUser, FaSignOutAlt, FaTimes, FaSignInAlt, FaUserPlus, FaHome, FaList } from 'react-icons/fa';

const SideNav = ({ isOpen, onClose, onLogout, isGuest }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Side Navigation */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          <div className="mt-8 space-y-4">
            {isGuest ? (
              // Guest user navigation options
              <>
                <Link
                  to="/"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaHome className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Home</h3>
                    <p className="text-sm text-gray-600">Go to homepage</p>
                  </div>
                </Link>
                <Link
                  to="/categories"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaList className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Categories</h3>
                    <p className="text-sm text-gray-600">Browse products</p>
                  </div>
                </Link>

                <Link
                  to="/login"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaSignInAlt className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Login</h3>
                    <p className="text-sm text-gray-600">Access your account</p>
                  </div>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaUserPlus className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Sign Up</h3>
                    <p className="text-sm text-gray-600">Create an account</p>
                  </div>
                </Link>
              </>
            ) : (
              // Registered user navigation options
              <>
                <Link
                  to="/user/profile"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaUser className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Profile</h3>
                    <p className="text-sm text-gray-600">Manage your account</p>
                  </div>
                </Link>

                <Link
                  to="/user/orders"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaShoppingBag className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Orders</h3>
                    <p className="text-sm text-gray-600">Track your orders</p>
                  </div>
                </Link>

                <Link
                  to="/user/wishlist"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaHeart className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Wishlist</h3>
                    <p className="text-sm text-gray-600">Saved items</p>
                  </div>
                </Link>

                <Link
                  to="/user/history"
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  <FaClock className="text-orange-500 w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">History</h3>
                    <p className="text-sm text-gray-600">Browsing history</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg hover:bg-orange-50 transition-colors w-full"
                >
                  <FaSignOutAlt className="text-orange-500 w-5 h-5 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold">Logout</h3>
                    <p className="text-sm text-gray-600">Sign out safely</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;