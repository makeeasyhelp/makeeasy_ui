import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';

const AdminProductsCRUDPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
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
  };

  const handleDelete = async (id) => {
    try {
      const response = await productsAPI.deleteProduct(id);
      if (response.success) {
        setProducts(products.filter(p => p._id !== id));
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
    try {
      if (editing) {
        const response = await productsAPI.updateProduct(editing, form);
        if (response.success) {
          setProducts(products.map(p => p._id === editing ? response.data : p));
          setEditing(null);
        }
      } else {
        const response = await productsAPI.createProduct(form);
        if (response.success) {
          setProducts([...products, response.data]);
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

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-background-faint">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form className="bg-white p-6 rounded-xl shadow-lg mb-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Title" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <input 
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="Price" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <input 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            placeholder="Location" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.key}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="available" 
                checked={form.available} 
                onChange={handleChange}
              />
              Available
            </label>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="featured" 
                checked={form.featured} 
                onChange={handleChange}
              />
              Featured
            </label>
          </div>
        </div>
        <button 
          type="submit" 
          className="bg-brand-indigo text-white px-6 py-2 rounded-lg font-bold"
        >
          {editing ? 'Update' : 'Add'} Product
        </button>
        {editing && (
          <button 
            type="button" 
            className="ml-4 text-gray-500" 
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
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Featured</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b">
                <td className="p-3">{product.title}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.location}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${product.featured ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.featured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td className="p-3">
                  <button 
                    className="text-brand-indigo mr-2" 
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-500" 
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsCRUDPage;
