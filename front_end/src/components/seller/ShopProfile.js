import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FaBoxOpen, FaChartLine, FaVideo, FaChalkboardTeacher, FaHistory, FaPlus, FaUpload } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import EditProductForm from './EditProductForm';
import { toast } from 'react-toastify';
import SalesHistory from './SalesHistory';
import Performance from './Performance';
import Workshops from './Workshops';
import Webinars from './Webinars';

const calculateTotalLikes = (products) => {
  if (!Array.isArray(products)) return 0;
  return products.reduce((total, product) => total + (product.likes?.length || 0), 0);
};

const calculateTotalOrders = (products) => {
  if (!Array.isArray(products)) return 0;
  return products.reduce((total, product) => total + (product.orders?.length || 0), 0);
};

const ShopProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null); // Make sure this is set to 'products'
  const [shopLogo, setShopLogo] = useState(null);
  const [shopDetails, setShopDetails] = useState({
    shopName: '',
    description: ''
  });
  const [productUpdateTrigger, setProductUpdateTrigger] = useState(0);
  const contentRef = useRef(null);
  const logoRef = useRef(null);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          toast.success('Product deleted successfully');
          setProductUpdateTrigger(prev => prev + 1); // This will trigger a refresh
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'salesHistory':
        return <SalesHistory />;  // Render component directly
      case 'analytics':
        return <Performance />;   // Render Performance component directly
      case 'workshops':
        return <Workshops />;
      case 'webinars':
        return <Webinars />;
      case 'products':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6">My Products</h3>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img 
                        src={`http://localhost:5000/uploads/${product.images?.[0] || product.image}`}
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg'; // Fallback image
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-lg">{product.name}</h4>
                      <p className="text-gray-600 mt-1">₹{product.price}</p>
                      <p className="text-sm text-gray-500 mt-2">{product.description}</p>
                      <p className="text-sm text-orange-600 mt-1 capitalize">{product.category}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No products yet. Add your first product!</p>
            )}
          </div>
        );    }  // Add this missing closing bracket
  };

  useEffect(() => {
    const loadShopDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shop/details', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
  
        if (response.data && response.data.success) {
          const shopData = response.data.data;
          setShopDetails({
            shopName: shopData.name,
            description: shopData.description || 'Create and sell your unique artwork'
          });
          setShopLogo(shopData.logo);
          localStorage.setItem('shopDetails', JSON.stringify(shopData));
          
          // Load products after shop details are loaded
          const token = localStorage.getItem('token');
          const productsResponse = await axios.get('http://localhost:5000/api/products/artist', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (productsResponse.data && productsResponse.data.data) {
            setProducts(productsResponse.data.data);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error loading shop details or products:', err);
        setLoading(false);
        toast.error('Failed to load shop data');
      }
    };
  
    loadShopDetails();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    const loadProducts = async () => {
      try {
        setLoading(true); // Set loading state
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/products/artist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Shop products response:', response.data);
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        } else {
          setProducts([]);
        }
        setLoading(false); // Clear loading state
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products');
        setProducts([]);
        setLoading(false); // Clear loading state on error
      }
    };

    if (user && user._id) {
      loadProducts();
    }
  }, [productUpdateTrigger]); // Remove the nested useEffect and keep the dependency

  // Remove the standalone button and move it into the JSX
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newLogo = e.target.result;
        setShopLogo(newLogo);

        const updatedDetails = { ...shopDetails, logo: newLogo };
        setShopDetails(updatedDetails);
        localStorage.setItem('shopDetails', JSON.stringify(updatedDetails));

        try {
          await axios.post('http://localhost:5000/api/shop/update-logo', 
            { logo: newLogo },
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
          );
        } catch (err) {
          console.error('Error updating logo:', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const totalLikes = calculateTotalLikes(products);
  const totalOrders = calculateTotalOrders(products);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Creative Studio
          </h2>
        </div>
        <nav className="mt-6 px-4">
          {[
            { id: 'products', label: 'My Products', icon: <FaBoxOpen />, description: 'Manage products' },
            { id: 'salesHistory', label: 'My Sales', icon: <FaHistory />, description: 'Track your orders' },
            { id: 'analytics', label: 'Performance', icon: <FaChartLine />, description: 'View analytics' },
            { id: 'workshops', label: 'Workshops', icon: <FaChalkboardTeacher />, description: 'Teach your skills' },
            { id: 'webinars', label: 'Webinars', icon: <FaVideo />, description: 'Host online sessions' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-4 mb-2 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-4">{item.icon}</span>
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8" ref={contentRef}>
        {/* Shop Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-8" ref={logoRef}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-orange-200 shadow-lg flex items-center justify-center">
                  {shopLogo ? (
                    <img src={shopLogo} alt="Shop Logo" className="w-full h-full object-cover" />
                  ) : (
                    <FaUpload className="text-5xl text-gray-400" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                  Change Logo
                </label>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mt-4">
                {shopDetails.shopName || 'Your Shop Name'}
              </h1>
              <p className="text-gray-600 mt-2">{shopDetails.description || 'Create and sell your unique artwork'}</p>
            </div>
            
            <button
              onClick={() => navigate('/artist/sell-product')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaPlus className="text-lg" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total Likes</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">{totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes}</p>
          </div>
        </div>

        {/* Render tab content */}
        {renderTabContent()}
        {editingProduct && (
          <EditProductForm
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onUpdate={(updatedProduct) => {
              setProducts(products.map(p =>
                p._id === updatedProduct._id ? updatedProduct : p
              ));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ShopProfile;
