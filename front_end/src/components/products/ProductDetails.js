import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useWishlist } from '../../context/WishlistContext';
import { useParams, useNavigate } from 'react-router-dom';
import { BsShare } from 'react-icons/bs';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const { isProductWishlisted, toggleWishlist } = useWishlist();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const handleRatingClick = (rating) => {
    setNewRating(rating);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Check if user is guest
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      toast.info('Please login or register to submit a review');
      return;
    }
    
    if (!newRating) {
      toast.error('Please select a rating');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to submit a review');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/products/${productId}/reviews`, {
        rating: newRating,
        comment: newComment
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setNewRating(0);
        setNewComment('');
        // Refresh reviews
        const reviewsResponse = await axios.get(`http://localhost:5000/api/products/${productId}/reviews`);
        setReviews(reviewsResponse.data.reviews);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product?._id) {
        toast.error('Product information not available');
        return;
      }

      if (quantity < 1) {
        toast.error('Please select a valid quantity');
        return;
      }

      // Check if user is guest
      const isGuest = localStorage.getItem('isGuest') === 'true';
      if (isGuest) {
        toast.info('Please login or register to add items to cart');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/cart/add', {
        productId: product._id,
        quantity: quantity
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
      } else if (error.response?.status === 404) {
        toast.error('Product not found');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;
    
    // Check if user is guest
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      toast.info('Please login or register to add items to wishlist');
      return;
    }
    
    await toggleWishlist(product._id);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!productId) {
          toast.error('Invalid product ID');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        if (!response.data.data) {
          toast.error('Product not found');
          return;
        }
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response?.status === 404) {
          toast.error('Product not found');
        } else {
          toast.error(error.response?.data?.message || 'Failed to load product details');
        }
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${productId}/reviews`);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProductDetails();
    fetchReviews();
  }, [productId]);

  if (!product) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={`http://localhost:5000/uploads/${product.images?.[0] || product.image}`}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              {product && isProductWishlisted(product._id) ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl" />
              )}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <BsShare className="text-gray-500 text-xl" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-xl text-gray-500 mt-2">{product.category}</p>
            </div>
            <div className="flex items-center">
              <div className="flex mr-2">{renderStars(product.averageRating || 0)}</div>
              <span className="text-gray-600">({reviews.length} Ratings & {reviews.length} Reviews)</span>
            </div>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold text-gray-900">₹{product.price ? product.price.toLocaleString() : '0'}</p>
              {product.originalPrice && (
                <p className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</p>
              )}
              {product.discountPercentage && (
                <p className="text-lg text-green-600">{product.discountPercentage}% off</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available offers</h3>
            <div className="space-y-2">
              <p className="text-sm">🏷️ Partner Offer Buy this & get upto₹250 off on Furniture</p>
              <p className="text-sm">🏷️ Special Price Get extra 6% off (price inclusive of cashback/coupon)</p>
              <p className="text-sm">🏷️ Combo Offer Buy 2 items save ₹15; Buy 3 save ₹35; Buy 4+ save ₹75</p>
              <p className="text-sm">🏷️ Bank Offer 5% Unlimited Cashback on Credit Card</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold">Description</h3>
            <p>{product.description}</p>
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
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3 bg-gray-50 p-6 rounded-lg">
            <div className="text-center">
              <div className="text-5xl font-bold">{product.averageRating ? product.averageRating.toFixed(1) : '0.0'}</div>
              <div className="flex justify-center my-2">{renderStars(product.averageRating || 0)}</div>
              <div className="text-sm text-gray-500">{reviews.length} Ratings &</div>
              <div className="text-sm text-gray-500">{reviews.length} Reviews</div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="mt-8 border-t pt-8">
              <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="focus:outline-none"
                        >
                          <FaStar
                            className={`w-6 h-6 ${star <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={newComment}
                      onChange={handleCommentChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="4"
                      placeholder="Share your thoughts about this product..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, index) => (
                            <FaStar
                              key={index}
                              className={`w-5 h-5 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600">{review.user?.name || 'Anonymous'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;