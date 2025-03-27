import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import UserNavbar from './components/user/UserNavbar';
import ArtistNavbar from './components/artist/ArtistNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UserTypeSelection from './components/auth/UserTypeSelection';
import UserDashboard from './components/user/UserDashboard';
import ArtistDashboard from './components/artist/ArtistDashboard';
import ArtistHome from './components/artist/ArtistHome';
import ProductList from './components/products/ProductList';
import Workshops from './components/workshops/Workshops';
import Events from './components/events/Events';
import './styles/Navbar.css';
import './styles/Home.css';
import AuthModal from './components/auth/AuthModal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SellerOnboarding from './components/seller/SellerOnboarding';
import ShopPreferences from './components/seller/ShopPreferences';
import ShopName from './components/seller/ShopName';
import ShopProfile from './components/seller/ShopProfile';
import SellProduct from './components/seller/SellProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SalesHistory from './components/seller/SalesHistory';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedArtistRoute from './components/auth/ProtectedArtistRoute';
import UserHome from './components/user/UserHome';
import Categories from './components/products/Categories';
import CategoryProducts from './components/products/CategoryProducts';
import WishlistPage from './components/user/WishlistPage';
import ProductDetails from './components/products/ProductDetails';
import CartPage from './components/user/CartPage';
import CheckoutPage from './components/user/CheckoutPage';
import OrderConfirmation from './components/user/OrderConfirmation';
import UserOrders from './components/user/UserOrders';
import UserProfile from './components/user/UserProfile';

const AppContent = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const isGuest = localStorage.getItem('isGuest');

    if (token && user) {
      const userData = JSON.parse(user);
      setIsAuthenticated(true);
      setShowAuth(false);
      setUserType(userData.role);
    } else if (isGuest === 'true') {
      setIsAuthenticated(false);
      setShowAuth(false);
      setUserType('guest');
    } else {
      setIsAuthenticated(false);
      setShowAuth(true);
      setUserType('');
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    if (userData && userData.role) {
      setIsAuthenticated(true);
      setShowAuth(false);
      setUserType(userData.role);
      localStorage.setItem('userType', userData.role);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Ensure token is set before navigation
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Force navigation to the correct route based on role
      const targetPath = userData.role === 'artist' ? '/artist/home' : '/user/home';
      navigate(targetPath, { replace: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('shopData');
    setIsAuthenticated(false);
    setUserType('');
    setShowAuth(true);
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="min-h-screen flex flex-col">
        {userType === 'artist' ? (
          <ArtistNavbar userType={userType} onLogout={handleLogout} />
        ) : (
          <UserNavbar onLogout={handleLogout} isGuest={userType === 'guest'} />
        )}
        <main className={`flex-grow ${userType !== 'artist' ? 'pt-16' : ''}`}>
          {showAuth && !isAuthenticated ? (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <AuthModal onAuthSuccess={handleAuthSuccess} />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                !isAuthenticated && userType !== 'guest' ? (
                  <Navigate to="/login" replace />
                ) : userType === 'artist' ? (
                  <Navigate to="/artist/home" replace />
                ) : userType === 'guest' ? (
                  <Home />
                ) : (
                  <Navigate to="/user/home" replace />
                )
              } />
              
              <Route path="/login" element={
                !isAuthenticated ? (
                  <LoginPage onAuthSuccess={handleAuthSuccess} />
                ) : (
                  <Navigate to={userType === 'artist' ? '/artist/home' : '/user/home'} />
                )
              } />
  
              <Route path="/signup" element={
                !isAuthenticated ? (
                  <SignupPage />
                ) : (
                  <Navigate to={userType === 'artist' ? '/artist/home' : '/user/home'} />
                )
              } />
  
  // Update your artist routes section to:
<Route path="/artist/*" element={
  <ProtectedArtistRoute>
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<ArtistHome />} />
      <Route path="seller-onboarding" element={<SellerOnboarding />} />
      <Route path="shop-preferences" element={<ShopPreferences />} />
      <Route path="shop-profile/*" element={<ShopProfile />} />
      <Route path="shop-name" element={<ShopName />} />
   
      <Route path="sell-product" element={<SellProduct />} />
      <Route path="sales-history" element={<SalesHistory />} />
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  </ProtectedArtistRoute>
} />
  
              <Route path="/user/home" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/user/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/user/orders" element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              {/* These routes are accessible to all users including guests */}
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryName" element={<CategoryProducts />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
            </Routes>
          )}
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;