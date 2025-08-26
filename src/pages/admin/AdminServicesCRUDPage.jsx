import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../services/api';

const AdminServicesCRUDPage = () => {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: '', price: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      setServices(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service._id);
    setForm(service);
  };

  const handleDelete = async (id) => {
    try {
      await servicesAPI.deleteService(id);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete service');
      console.error('Error deleting service:', err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await servicesAPI.updateService(editing, form);
        setServices(services.map(s => s._id === editing ? updated.data : s));
        setEditing(null);
      } else {
        const created = await servicesAPI.createService(form);
        setServices([...services, created.data]);
      }
      setForm({ title: '', description: '', icon: '', price: '' });
    } catch (err) {
      setError(err.message || 'Failed to save service');
      console.error('Error saving service:', err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-background-faint">
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form className="bg-white p-6 rounded-xl shadow-lg mb-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Title" 
            className="border px-3 py-2 rounded" 
            required 
          />
          <input 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description" 
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
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="Price" 
            className="border px-3 py-2 rounded" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-brand-indigo text-white px-6 py-2 rounded-lg font-bold"
          disabled={loading}
        >
          {loading ? 'Processing...' : (editing ? 'Update' : 'Add')} Service
        </button>
        {editing && <button type="button" className="ml-4 text-gray-500" onClick={() => { setEditing(null); setForm({ title: '', description: '', icon: '', price: '' }); }}>Cancel</button>}
      </form>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service._id} className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-xl mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-indigo-600 font-semibold mb-4">₹{service.price}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServicesCRUDPage;
