import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';

const AdminCategoriesCRUDPage = () => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', key: '', icon: '', image: null, imagePreview: null, path: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditing(category._id);
    setForm({
      ...category,
      image: null,
      imagePreview: category.image || null
    });
  };

  const handleDelete = async (id) => {
    try {
      await categoriesAPI.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setForm({
      ...form,
      image: null,
      imagePreview: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('key', form.key);
      formData.append('icon', form.icon);
      formData.append('path', form.path);
      if (form.image) {
        formData.append('image', form.image);
      }

      if (editing) {
        await categoriesAPI.updateCategory(editing, formData);
        toast.success('Category updated successfully');
      } else {
        await categoriesAPI.createCategory(formData);
        toast.success('Category created successfully');
      }
      setForm({ name: '', key: '', icon: '', image: null, imagePreview: null, path: '' });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  return (
    <div className="p-8 min-h-screen bg-background-faint">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      <form className="bg-white p-6 rounded-xl shadow-lg mb-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Category Name" 
              className="w-full border px-3 py-2 rounded" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key *</label>
            <input 
              name="key" 
              value={form.key} 
              onChange={handleChange} 
              placeholder="Key (e.g., electronics)" 
              className="w-full border px-3 py-2 rounded" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon Name</label>
            <input 
              name="icon" 
              value={form.icon} 
              onChange={handleChange} 
              placeholder="Icon (e.g., Tv)" 
              className="w-full border px-3 py-2 rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Path *</label>
            <input 
              name="path" 
              value={form.path} 
              onChange={handleChange} 
              placeholder="Path (e.g., /electronics)" 
              className="w-full border px-3 py-2 rounded" 
              required 
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-brand-indigo transition-colors">
            <div className="flex flex-col items-center justify-center">
              {form.imagePreview ? (
                <div className="relative">
                  <img 
                    src={form.imagePreview} 
                    alt="Preview" 
                    className="h-40 w-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageInput"
            />
            <label htmlFor="imageInput" className="block mt-2 cursor-pointer">
              <span className="sr-only">Choose image</span>
            </label>
          </div>
          <label htmlFor="imageInput" className="block mt-2 text-center cursor-pointer">
            <span className="text-brand-indigo text-sm font-medium hover:underline">Choose file</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-brand-indigo text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Processing...' : (editing ? 'Update' : 'Add')} Category
          </button>
          {editing && (
            <button 
              type="button" 
              className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100" 
              onClick={() => { 
                setEditing(null); 
                setForm({ name: '', key: '', icon: '', image: null, imagePreview: null, path: '' }); 
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Key</th>
                <th className="p-3 text-left">Icon</th>
                <th className="p-3 text-left">Path</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No categories found</td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {category.image && (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.key}</td>
                    <td className="p-3">{category.icon}</td>
                    <td className="p-3">{category.path}</td>
                    <td className="p-3">
                      <button 
                        className="text-brand-indigo mr-2 hover:underline" 
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-500 hover:underline" 
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesCRUDPage;
