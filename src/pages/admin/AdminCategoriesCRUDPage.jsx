import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminCategoriesCRUDPage = () => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', key: '', icon: '', path: '' });

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
    setForm(category);
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await categoriesAPI.updateCategory(editing, form);
        toast.success('Category updated successfully');
      } else {
        await categoriesAPI.createCategory(form);
        toast.success('Category created successfully');
      }
      setForm({ name: '', key: '', icon: '', path: '' });
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Name" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <input 
            name="key" 
            value={form.key} 
            onChange={handleChange} 
            placeholder="Key" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <input 
            name="icon" 
            value={form.icon} 
            onChange={handleChange} 
            placeholder="Icon" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <input 
            name="path" 
            value={form.path} 
            onChange={handleChange} 
            placeholder="Path" 
            className="border px-3 py-2 rounded" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-brand-indigo text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : (editing ? 'Update' : 'Add')} Category
        </button>
        {editing && (
          <button 
            type="button" 
            className="ml-4 text-gray-500" 
            onClick={() => { 
              setEditing(null); 
              setForm({ name: '', key: '', icon: '', path: '' }); 
            }}
          >
            Cancel
          </button>
        )}
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
                  <td colSpan="5" className="text-center py-4 text-gray-500">No categories found</td>
                </tr>
              ) : (
                categories.map(category => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
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
