import React, { useState, useEffect } from 'react';
import { Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import { serviceRequestAPI } from '../../services/serviceRequestAPI';

const AdminServiceRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '', priority: '' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'assign', 'schedule', 'resolve'
  const [formData, setFormData] = useState({ engineerId: '', date: '', timeSlot: '9-12', resolution: '' });

  useEffect(() => {
    fetchRequests();
    fetchStats();
    fetchEngineers();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await serviceRequestAPI.getAllServiceRequests(filters);
      if (response.success) setRequests(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await serviceRequestAPI.getServiceRequestStats();
      if (response.success) setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEngineers = async () => {
    try {
      const response = await serviceRequestAPI.getServiceEngineers();
      if (response.success) setEngineers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!formData.engineerId) {
      alert('Please select an engineer');
      return;
    }
    try {
      await serviceRequestAPI.assignServiceRequest(selectedRequest._id, formData.engineerId);
      alert('Engineer assigned successfully!');
      setShowModal(false);
      fetchRequests();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSchedule = async () => {
    if (!formData.date || !formData.timeSlot) {
      alert('Please select date and time slot');
      return;
    }
    try {
      await serviceRequestAPI.scheduleVisit(selectedRequest._id, {
        date: formData.date,
        timeSlot: formData.timeSlot
      });
      alert('Visit scheduled successfully!');
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolve = async () => {
    if (!formData.resolution.trim()) {
      alert('Please provide resolution details');
      return;
    }
    try {
      await serviceRequestAPI.resolveServiceRequest(selectedRequest._id, formData.resolution);
      alert('Service request resolved!');
      setShowModal(false);
      fetchRequests();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkInProgress = async (requestId) => {
    try {
      await serviceRequestAPI.markInProgress(requestId);
      alert('Marked as in progress!');
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClose = async (requestId) => {
    if (!confirm('Close this service request?')) return;
    try {
      await serviceRequestAPI.closeServiceRequest(requestId);
      alert('Service request closed!');
      fetchRequests();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const openModal = (request, type) => {
    setSelectedRequest(request);
    setModalType(type);
    setShowModal(true);
    setFormData({ engineerId: '', date: '', timeSlot: '9-12', resolution: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Request Management</h1>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-yellow-50 rounded-lg shadow-md p-4">
            <h3 className="text-yellow-800 text-xs mb-1">Open</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.byStatus?.open || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow-md p-4">
            <h3 className="text-blue-800 text-xs mb-1">Assigned</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.byStatus?.assigned || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg shadow-md p-4">
            <h3 className="text-purple-800 text-xs mb-1">In Progress</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.byStatus?.in_progress || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-4">
            <h3 className="text-green-800 text-xs mb-1">Resolved</h3>
            <p className="text-2xl font-bold text-green-600">{stats.byStatus?.resolved || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow-md p-4">
            <h3 className="text-gray-800 text-xs mb-1">Closed</h3>
            <p className="text-2xl font-bold text-gray-600">{stats.byStatus?.closed || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Types</option>
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="relocation">Relocation</option>
              <option value="swap">Swap</option>
              <option value="complaint">Complaint</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              onClick={() => setFilters({ status: '', type: '', priority: '' })}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Service Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map(request => (
                <tr key={request._id}>
                  <td className="px-4 py-3 text-sm text-gray-900">#{request._id.slice(-6)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{request.user?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{request.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      request.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      request.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                      request.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {request.status === 'open' && (
                        <button
                          onClick={() => openModal(request, 'assign')}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                        >
                          Assign
                        </button>
                      )}
                      {request.status === 'assigned' && (
                        <>
                          <button
                            onClick={() => openModal(request, 'schedule')}
                            className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs hover:bg-purple-100"
                          >
                            Schedule
                          </button>
                          <button
                            onClick={() => handleMarkInProgress(request._id)}
                            className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100"
                          >
                            Start
                          </button>
                        </>
                      )}
                      {request.status === 'in_progress' && (
                        <button
                          onClick={() => openModal(request, 'resolve')}
                          className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs hover:bg-green-100"
                        >
                          Resolve
                        </button>
                      )}
                      {request.status === 'resolved' && (
                        <button
                          onClick={() => handleClose(request._id)}
                          className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs hover:bg-gray-100"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {modalType === 'assign' ? 'Assign Engineer' :
                 modalType === 'schedule' ? 'Schedule Visit' :
                 'Resolve Request'}
              </h2>

              {modalType === 'assign' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Engineer</label>
                    <select
                      value={formData.engineerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, engineerId: e.target.value }))}
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="">Choose engineer</option>
                      {engineers.map(eng => (
                        <option key={eng._id} value={eng._id}>{eng.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAssign}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'schedule' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Slot</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
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
                      onClick={handleSchedule}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'resolve' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Resolution Details</label>
                    <textarea
                      value={formData.resolution}
                      onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                      placeholder="Describe how the issue was resolved..."
                      className="w-full border rounded-lg px-4 py-2"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResolve}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServiceRequestManagement;
