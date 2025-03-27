import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft, FaCreditCard, FaMoneyBill, FaMobile } from 'react-icons/fa';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  // Fetch user's saved addresses on component mount
  useEffect(() => {
    if (cartItems.length === 0) {
      // Redirect to cart if no items
      navigate('/cart');
      return;
    }
    
    fetchSavedAddresses();
  }, [cartItems, navigate]);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSavedAddresses(response.data.addresses || []);
        // If there's a default address, select it
        const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load saved addresses');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine1 || 
        !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      
      const response = await axios.post(
        'http://localhost:5000/api/users/address', 
        addressForm,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      if (response.data.success) {
        toast.success('Address saved successfully');
        // Refresh addresses and move to next step
        await fetchSavedAddresses();
        setSelectedAddress(response.data.address._id);
        setStep(2);
      } else {
        toast.error(response.data.message || 'Failed to save address');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
      setLoading(false);
    }
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
  };

  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [confirmedAddress, setConfirmedAddress] = useState(null);

  const proceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    const selectedAddressDetails = savedAddresses.find(addr => addr._id === selectedAddress);
    setConfirmedAddress(selectedAddressDetails);
    setShowAddressConfirmation(true);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      toast.error('Please enter your UPI ID');
      return;
    }

    // Basic UPI ID validation
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    // Card payment validation
    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.length !== 16) {
        toast.error('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardDetails.cardHolder.trim()) {
        toast.error('Please enter the card holder name');
        return;
      }
      if (!cardDetails.expiryDate || !cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
        toast.error('Please enter a valid CVV');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      
      const orderData = {
        addressId: selectedAddress,
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders', 
        orderData,
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      if (response.data.success) {
        toast.success('Order placed successfully!');
        // Clear cart after successful order
        await clearCart();
        // Redirect to order confirmation
        navigate(`/order-confirmation/${response.data.order.orderId}`);
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={goBack}
          className="mr-4 text-gray-600 hover:text-orange-500"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      </div>

      {/* Checkout Steps */}
      <div className="flex mb-8">
        <div className={`flex-1 text-center py-2 ${step === 1 ? 'border-b-2 border-orange-500 text-orange-500 font-medium' : 'border-b border-gray-300'}`}>
          1. Delivery Address
        </div>
        <div className={`flex-1 text-center py-2 ${step === 2 ? 'border-b-2 border-orange-500 text-orange-500 font-medium' : 'border-b border-gray-300'}`}>
          2. Payment Options
        </div>
      </div>

      {showAddressConfirmation && confirmedAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delivery Address</h3>
            <div className="border rounded-lg p-4 mb-4">
              <p className="font-medium">{confirmedAddress.fullName}</p>
              <p className="text-sm text-gray-600">{confirmedAddress.phone}</p>
              <p className="mt-2">{confirmedAddress.addressLine1}</p>
              {confirmedAddress.addressLine2 && <p>{confirmedAddress.addressLine2}</p>}
              <p>{confirmedAddress.city}, {confirmedAddress.state} {confirmedAddress.pincode}</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddressConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Edit Address
              </button>
              <button
                onClick={() => {
                  setShowAddressConfirmation(false);
                  setStep(2);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 1 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Select Delivery Address</h2>
          
          {/* Saved Addresses */}
          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Saved Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map(address => (
                  <div 
                    key={address._id}
                    className={`border rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-colors ${selectedAddress === address._id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                    onClick={() => handleAddressSelection(address._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{address.fullName}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                    <p className="mt-2">{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.pincode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Address Form */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Add New Address</h3>
            <form onSubmit={handleAddressSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={addressForm.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back to Cart
                </button>
                {savedAddresses.length > 0 ? (
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={proceedToPayment}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Save & Continue
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          
          <div className="space-y-4">
            {/* Credit/Debit Card Option */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-colors ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
              onClick={() => handlePaymentSelection('card')}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FaCreditCard className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">Pay securely with your card</p>
                </div>
              </div>
              {paymentMethod === 'card' && (
                <div className="mt-4 ml-12 space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength="16"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      value={cardDetails.cardHolder}
                      onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength="5"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      maxLength="3"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* UPI Option */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-colors ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
              onClick={() => handlePaymentSelection('upi')}
            >
              <div>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FaMobile className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-600">Pay using UPI apps like Google Pay, PhonePe, etc.</p>
                  </div>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 ml-12">
                    <input
                      type="text"
                      placeholder="Enter your UPI ID (e.g. name@upi)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cash on Delivery Option */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer hover:border-orange-500 transition-colors ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
              onClick={() => handlePaymentSelection('cod')}
            >
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <FaMoneyBill className="text-yellow-600 w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Items ({cartItems.reduce((count, item) => count + item.quantity, 0)}):</p>
                <p>₹{totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping:</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <p className="font-bold">Order Total:</p>
                <p className="font-bold">₹{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={goBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Address
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={!paymentMethod}
              className={`px-6 py-2 rounded-md text-white ${paymentMethod ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;