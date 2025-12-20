import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Package, Filter, Search, ChevronDown, Check, X } from 'lucide-react';
import { rentalAPI } from '../../services/rentalAPI';

const AdminRentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', city: '', search: '' });
  const [selectedRental, setSelectedRental] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({ date: '', timeSlot: '9-12', address: '' });

  useEffect(() => {
    fetchRentals();
  }, [filters]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalAPI.getAllRentals(filters);
      if (response.success) setRentals(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDelivery = async () => {
    try {
      await rentalAPI.scheduleDelivery(selectedRental._id, deliveryData);
      alert('Delivery scheduled successfully!');
      setShowDeliveryModal(false);
      fetchRentals();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (rentalId, status) => {
    if (!confirm(`Change status to ${status}?`)) return;
    try {
      await rentalAPI.updateRentalStatus(rentalId, status);
      alert('Status updated!');
      fetchRentals();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveExtension = async (rentalId, extensionId) => {
    try {
      await rentalAPI.approveExtension(rentalId, extensionId);
      alert('Extension approved!');
      fetchRentals();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rental Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by user or product..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
            </select>
            <button
              onClick={() => setFilters({ status: '', city: '', search: '' })}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Rentals Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rentals.map(rental => (
                <tr key={rental._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{rental.user?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{rental.product?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rental.city}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rental.status === 'active' ? 'bg-green-100 text-green-700' :
                      rental.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(rental.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {rental.status === 'confirmed' && (
                        <button
                          onClick={() => { setSelectedRental(rental); setShowDeliveryModal(true); }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
                        >
                          Schedule Delivery
                        </button>
                      )}
                      {rental.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(rental._id, 'confirmed')}
                          className="px-3 py-1 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delivery Modal */}
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Schedule Delivery</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={deliveryData.date}
                    onChange={(e) => setDeliveryData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Slot</label>
                  <select
                    value={deliveryData.timeSlot}
                    onChange={(e) => setDeliveryData(prev => ({ ...prev, timeSlot: e.target.value }))}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    <option value="9-12">9 AM - 12 PM</option>
                    <option value="12-3">12 PM - 3 PM</option>
                    <option value="3-6">3 PM - 6 PM</option>
                    <option value="6-9">6 PM - 9 PM</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleScheduleDelivery}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => setShowDeliveryModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRentalManagement;
