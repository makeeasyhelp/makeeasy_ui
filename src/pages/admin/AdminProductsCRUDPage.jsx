import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';
import { Upload, X, Trash2, Edit, Save, Plus, Image as ImageIcon, Eye, XCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config/apiConfig';

const AdminProductsCRUDPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    description: '',
    price: '', 
    location: '', 
    category: '',
    available: true,
    featured: false 
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Clear messages after 5 seconds
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await productsAPI.deleteProduct(id);
      if (response.success) {
        setProducts(products.filter(p => p._id !== id));
        setSuccess('Product deleted successfully!');
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (editing) {
        const response = await productsAPI.updateProduct(editing, form);
        if (response.success) {
          setProducts(products.map(p => p._id === editing ? response.data : p));
          setSuccess('Product updated successfully!');
          setEditing(null);
        }
      } else {
        const response = await productsAPI.createProduct(form);
        if (response.success) {
          setProducts([...products, response.data]);
          setSuccess('Product created successfully!');
        }
      }
      setForm({ 
        title: '', 
        description: '',
        price: '', 
        location: '', 
        category: '',
        available: true,
        featured: false 
      });
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleImageUpload = async (productId) => {
    if (selectedFiles.length === 0) {
      setError('Please select images to upload');
      return;
    }

    setUploadingImages(true);
    setError('');
    setSuccess('');

    try {
      const response = await productsAPI.uploadProductImages(productId, selectedFiles);
      if (response.success) {
        // Update the product in the list
        setProducts(products.map(p => p._id === productId ? response.data : p));
        setSuccess(`${response.uploadedImages.length} image(s) uploaded successfully!`);
        setSelectedFiles([]);
        setPreviewUrls([]);
        // Clear file input
        const fileInput = document.getElementById(`file-input-${productId}`);
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (productId, imageIndex) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await productsAPI.deleteProductImage(productId, imageIndex);
      if (response.success) {
        setProducts(products.map(p => p._id === productId ? response.data : p));
        setSuccess('Image deleted successfully!');
        // Update selected product if modal is open
        if (selectedProduct && selectedProduct._id === productId) {
          setSelectedProduct(response.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to delete image');
    }
  };

  const openImageModal = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-indigo mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-brand-indigo to-brand-purple rounded-2xl shadow-xl p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Products</h1>
          <p className="text-white/90 text-sm md:text-base">Add, edit, and manage your product inventory with image uploads</p>
        </div>
      </div>
      
      {/* Alerts */}
      <div className="max-w-7xl mx-auto mb-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg shadow-md flex items-center justify-between mb-4 animate-slideIn">
            <span className="font-medium">{error}</span>
            <button onClick={() => setError('')} className="text-red-800 hover:text-red-900">
              <XCircle size={20} />
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center justify-between mb-4 animate-slideIn">
            <span className="font-medium">{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-800 hover:text-green-900">
              <XCircle size={20} />
            </button>
          </div>
        )}
      </div>
      
      {/* Add/Edit Product Form */}
      <div className="max-w-7xl mx-auto mb-8">
        <form className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            {editing ? <Edit className="text-brand-indigo" size={28} /> : <Plus className="text-brand-purple" size={28} />}
            {editing ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title *</label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="e.g., Smart TV 55 inch" 
                className="w-full border-2 border-gray-300 focus:border-brand-indigo px-4 py-3 rounded-lg transition-colors outline-none" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
              <input 
                name="price" 
                type="number" 
                value={form.price} 
                onChange={handleChange} 
                placeholder="499" 
                className="w-full border-2 border-gray-300 focus:border-brand-indigo px-4 py-3 rounded-lg transition-colors outline-none" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
              <input 
                name="location" 
                value={form.location} 
                onChange={handleChange} 
                placeholder="e.g., Delhi, Mumbai" 
                className="w-full border-2 border-gray-300 focus:border-brand-indigo px-4 py-3 rounded-lg transition-colors outline-none" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 focus:border-brand-indigo px-4 py-3 rounded-lg transition-colors outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Describe the product features, specifications, and benefits..." 
                className="w-full border-2 border-gray-300 focus:border-brand-indigo px-4 py-3 rounded-lg transition-colors outline-none h-24 resize-none" 
                required 
              />
            </div>

            {/* Image Upload Field */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-indigo/10 file:text-brand-indigo hover:file:bg-brand-indigo/20"
              />
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img src={url} alt={`Preview ${idx+1}`} className="object-cover w-full h-full" />
                      <button type="button" className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:text-red-700" onClick={() => {
                        setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                        setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                      }}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">You can select and upload up to 5 images. Supported formats: jpg, jpeg, png, gif, webp.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="available" 
                  checked={form.available} 
                  onChange={handleChange}
                  className="w-5 h-5 text-brand-indigo focus:ring-brand-indigo border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-indigo transition-colors">Available</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="featured" 
                  checked={form.featured} 
                  onChange={handleChange}
                  className="w-5 h-5 text-brand-purple focus:ring-brand-purple border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-purple transition-colors">Featured</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-gradient-to-r from-brand-indigo to-brand-purple text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Save size={20} />
              {editing ? 'Update Product' : 'Add Product'}
            </button>
            
            {editing && (
              <button 
                type="button" 
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors" 
                onClick={() => { 
                  setEditing(null); 
                  setForm({ 
                    title: '', 
                    description: '',
                    price: '', 
                    location: '', 
                    category: '',
                    available: true,
                    featured: false 
                  }); 
                }}
              >
                <X size={20} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden border border-gray-200">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`${API_BASE_URL}${product.images[0]}`}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : product.imageUrl ? (
                  <img 
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon size={48} className="text-gray-300" />
                  </div>
                )}
                
                {/* Image Count Badge */}
                {product.images && product.images.length > 0 && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <ImageIcon size={14} />
                    {product.images.length}
                  </div>
                )}
                
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-brand-purple">₹{product.price}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <span className="font-medium">Location:</span> {product.location}
                </div>
                
                {/* Image Upload Section */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <label htmlFor={`file-input-${product._id}`} className="block mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer hover:text-brand-indigo transition-colors">
                      <Upload size={16} />
                      Upload Images (max 5)
                    </div>
                  </label>
                  <input
                    id={`file-input-${product._id}`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      handleFileSelect(e);
                      // Store product ID for upload
                      e.target.dataset.productId = product._id;
                    }}
                    className="hidden"
                  />
                  
                  {previewUrls.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-2 flex-wrap mb-2">
                        {previewUrls.map((url, idx) => (
                          <img key={idx} src={url} alt={`Preview ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-brand-indigo" />
                        ))}
                      </div>
                      <button
                        onClick={() => handleImageUpload(product._id)}
                        disabled={uploadingImages}
                        className="w-full bg-brand-indigo text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-indigo-dark transition-colors disabled:opacity-50"
                      >
                        {uploadingImages ? 'Uploading...' : `Upload ${selectedFiles.length} Image(s)`}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openImageModal(product)}
                    className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                    title="View Images"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  
                  <button 
                    onClick={() => handleEdit(product)}
                    className="flex items-center justify-center gap-1 bg-indigo-50 text-brand-indigo py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No products found. Add your first product!</p>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showImageModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={closeImageModal}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-bold text-gray-800">{selectedProduct.title} - Images</h3>
              <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProduct.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={`${API_BASE_URL}${image}`}
                        alt={`${selectedProduct.title} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => handleDeleteImage(selectedProduct._id, index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        title="Delete Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No images uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsCRUDPage;
