import React from 'react';

const AdminDashboardPage = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-background-faint p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <a href="/admin/products" className="bg-white p-6 rounded-xl shadow-lg text-center hover:bg-brand-indigo/10 transition">
          <h2 className="text-xl font-bold mb-2">Manage Products</h2>
          <p>View, add, edit, or delete products</p>
        </a>
        <a href="/admin/categories" className="bg-white p-6 rounded-xl shadow-lg text-center hover:bg-brand-indigo/10 transition">
          <h2 className="text-xl font-bold mb-2">Manage Categories</h2>
          <p>View, add, edit, or delete categories</p>
        </a>
        <a href="/admin/services" className="bg-white p-6 rounded-xl shadow-lg text-center hover:bg-brand-indigo/10 transition">
          <h2 className="text-xl font-bold mb-2">Manage Services</h2>
          <p>View, add, edit, or delete services</p>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
