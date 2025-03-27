import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';  // Add this import
import imageCompression from 'browser-image-compression';

const SellProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const validFiles = files.filter(file => validImageTypes.includes(file.type));
        
        if (validFiles.length !== files.length) {
          toast.error('Some files were not images. Only images are allowed.');
          return;
        }

        // Set the single image
        const newImage = validFiles[0];
        setFormData(prev => ({
          ...prev,
          image: newImage // Set the single image
        }));
      } catch (error) {
        console.error('Error handling images:', error);
        toast.error('Error uploading images');
      }
    }
  };

  // Remove this standalone input component
  // <input
  //   type="file"
  //   accept="image/*"
  //   onChange={handleImageUpload}
  //   className="mt-1 block w-full"
  //   required={formData.images.length === 0}
  // />

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      if (!formData.image) {
        throw new Error('Please select an image for the product');
      }

      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
  
      const productData = new FormData();
      productData.append('name', formData.name);
      productData.append('description', formData.description);
      productData.append('price', Number(formData.price));
      productData.append('category', formData.category);
      
      if (formData.image instanceof File) {
        const compressedFile = await imageCompression(formData.image, compressionOptions);
        productData.append('image', compressedFile, compressedFile.name);
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/products',
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data.success) {
        toast.success('Product created successfully!');
        navigate('/artist/shop-profile');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error creating product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 pt-20 overflow-y-auto h-[calc(100vh-4rem)] relative">
      <div className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Paintings">Paintings</option>
            <option value="Sculptures">Sculptures</option>
            <option value="Textiles">Textiles</option>
            <option value="Pottery">Pottery</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Wood Carving">Wood Carving</option>
            <option value="crafts">Crafts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required={!formData.image}
          />
          
          {/* Preview uploaded image */}
          {formData.image && (
            <div className="mt-2">
              <div className="relative inline-block">
                <img
                  src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default SellProduct;