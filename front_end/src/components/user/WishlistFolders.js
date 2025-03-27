import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaFolderPlus, FaEdit, FaTrash, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const WishlistFolders = () => {
  const [folders, setFolders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolders();
    fetchWishlistProducts();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/wishlist/folders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFolders(response.data.folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    }
  };

  const fetchWishlistProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/wishlist/folders', 
        { name: newFolderName },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      setFolders([...folders, response.data.folder]);
      setNewFolderName('');
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleUpdateFolder = async (folderId, newName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/wishlist/folders/${folderId}`,
        { name: newName },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      setFolders(folders.map(folder => 
        folder._id === folderId ? { ...folder, name: newName } : folder
      ));
      setEditingFolder(null);
      toast.success('Folder updated successfully');
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm('Are you sure you want to delete this folder?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/wishlist/folders/${folderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setFolders(folders.filter(folder => folder._id !== folderId));
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  const handleMoveToFolder = async (productId, folderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/wishlist/move-to-folder`,
        { productId, folderId },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      // Update local state to reflect the change
      setProducts(products.map(product => 
        product._id === productId ? { ...product, folderId } : product
      ));
      toast.success('Product moved successfully');
    } catch (error) {
      console.error('Error moving product:', error);
      toast.error('Failed to move product');
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Wishlist Folders</h2>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleCreateFolder}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <FaFolderPlus /> Create Folder
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <div key={folder._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                {editingFolder === folder._id ? (
                  <input
                    type="text"
                    value={folder.name}
                    onChange={(e) => setFolders(folders.map(f => 
                      f._id === folder._id ? { ...f, name: e.target.value } : f
                    ))}
                    onBlur={() => handleUpdateFolder(folder._id, folder.name)}
                    className="p-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FaFolder className="text-orange-500" />
                    <h3 className="font-semibold">{folder.name}</h3>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingFolder(folder._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {products
                  .filter(product => product.folderId === folder._id)
                  .map(product => (
                    <div key={product._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 relative overflow-hidden rounded-md">
                          <img
                            src={product.image ? `http://localhost:5000/uploads/${product.image}` : '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('Image load error for product:', product.name, 'Image path:', product.image);
                              e.target.src = '/placeholder.jpg';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        <span>{product.name}</span>
                      </div>
                      <select
                        onChange={(e) => handleMoveToFolder(product._id, e.target.value)}
                        className="text-sm border rounded-md p-1"
                        value={product.folderId || ''}
                      >
                        <option value="">Move to...</option>
                        {folders.map(f => (
                          <option key={f._id} value={f._id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Unfiled Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products
            .filter(product => !product.folderId)
            .map(product => (
              <div key={product._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-red-500" />
                  <span>{product.name}</span>
                </div>
                <select
                  onChange={(e) => handleMoveToFolder(product._id, e.target.value)}
                  className="text-sm border rounded-md p-1"
                  value=""
                >
                  <option value="">Move to folder...</option>
                  {folders.map(folder => (
                    <option key={folder._id} value={folder._id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistFolders;