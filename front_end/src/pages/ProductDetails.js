import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProductReview from '../components/products/ProductReview';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        setLoading(false);
      }
    };

    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`http://localhost:5000/api/wishlist/check/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setIsWishlisted(response.data.isWishlisted);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    fetchProduct();
    checkWishlistStatus();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId,
        quantity
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Added to cart!');
        // Re-check wishlist status to ensure heart icon state is maintained
        checkWishlistStatus();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage wishlist');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/wishlist/toggle', {
        productId
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist!' : 'Added to wishlist!');
      }
    } catch (error) {
      console.error('Error managing wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={`http://localhost:5000/uploads/${product.images?.[0] || product.image}`}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
              e.target.onerror = null;
            }}
          />
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-gray-500 text-xl" />
            )}
          </button>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl text-gray-500 capitalize">{product.category}</p>
          <p className="text-2xl font-semibold text-gray-900">
            ₹{product.price.toLocaleString()}
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border-r hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* Product Reviews Section */}
      <ProductReview productId={productId} />
    </div>
  );
};

export default ProductDetails;