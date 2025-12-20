import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Package, AlertCircle, Plus, Pause, 
  Play, XCircle, ArrowRight, TrendingUp, CheckCircle, Star
} from 'lucide-react';
import { rentalAPI } from '../services/rentalAPI';
import { serviceRequestAPI } from '../services/serviceRequestAPI';

/**
 * User Rental Dashboard
 * Shows active rentals, past rentals, and service requests
 */
const UserRentalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // active, past, service
  const [rentals, setRentals] = useState({ active: [], past: [] });
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRentals();
    fetchServiceRequests();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalAPI.getRentals();
      
      if (response.success) {
        const active = response.data.filter(r => 
          ['pending', 'confirmed', 'active', 'paused'].includes(r.status)
        );
        const past = response.data.filter(r => 
          ['completed', 'cancelled', 'closed'].includes(r.status)
        );
        
        setRentals({ active, past });
      }
    } catch (err) {
      console.error('Error fetching rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await serviceRequestAPI.getServiceRequests();
      if (response.success) {
        setServiceRequests(response.data);
      }
    } catch (err) {
      console.error('Error fetching service requests:', err);
    }
  };

  const handleExtension = async (rentalId) => {
    const months = prompt('How many months would you like to extend? (1-12)');
    if (!months || isNaN(months) || months < 1 || months > 12) {
      alert('Please enter a valid number of months (1-12)');
      return;
    }

    try {
      const response = await rentalAPI.requestExtension(rentalId, parseInt(months));
      if (response.success) {
        alert('Extension request submitted successfully!');
        fetchRentals();
      }
    } catch (err) {
      alert(err.message || 'Failed to request extension');
    }
  };

  const handlePause = async (rentalId) => {
    if (!confirm('Are you sure you want to pause this rental?')) return;

    try {
      const response = await rentalAPI.pauseRental(rentalId, new Date());
      if (response.success) {
        alert('Rental paused successfully!');
        fetchRentals();
      }
    } catch (err) {
      alert(err.message || 'Failed to pause rental');
    }
  };

  const handleResume = async (rentalId) => {
    try {
      const response = await rentalAPI.resumeRental(rentalId, new Date());
      if (response.success) {
        alert('Rental resumed successfully!');
        fetchRentals();
      }
    } catch (err) {
      alert(err.message || 'Failed to resume rental');
    }
  };

  const handleEarlyClosure = async (rentalId) => {
    const reason = prompt('Please provide a reason for early closure:');
    if (!reason) return;

    if (!confirm('Early closure may include penalty charges. Continue?')) return;

    try {
      const response = await rentalAPI.requestEarlyClosure(rentalId, reason);
      if (response.success) {
        alert('Closure request submitted successfully!');
        fetchRentals();
      }
    } catch (err) {
      alert(err.message || 'Failed to request closure');
    }
  };

  const handleRateService = async (serviceRequestId) => {
    const rating = prompt('Rate your experience (1-5 stars):');
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      alert('Please enter a valid rating (1-5)');
      return;
    }

    const feedback = prompt('Any feedback? (optional)');

    try {
      const response = await serviceRequestAPI.rateServiceRequest(serviceRequestId, {
        rating: parseInt(rating),
        feedback: feedback || ''
      });
      
      if (response.success) {
        alert('Thank you for your feedback!');
        fetchServiceRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit rating');
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'yellow', text: 'Pending' },
      confirmed: { color: 'blue', text: 'Confirmed' },
      active: { color: 'green', text: 'Active' },
      paused: { color: 'orange', text: 'Paused' },
      completed: { color: 'gray', text: 'Completed' },
      cancelled: { color: 'red', text: 'Cancelled' },
      closed: { color: 'gray', text: 'Closed' }
    };

    const config = configs[status] || { color: 'gray', text: status };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-${config.color}-100 text-${config.color}-700`}>
        {config.text}
      </span>
    );
  };

  const getDaysUntilNextBilling = (nextBillingDate) => {
    const days = Math.ceil((new Date(nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rentals</h1>
          <p className="text-gray-600">Manage your active and past rentals</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'active'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active Rentals ({rentals.active.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'past'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Past Rentals ({rentals.past.length})
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === 'service'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Service Requests ({serviceRequests.length})
            </button>
          </div>
        </div>

        {/* Active Rentals Tab */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {rentals.active.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Rentals</h3>
                <p className="text-gray-600 mb-6">You don't have any active rentals at the moment</p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              rentals.active.map((rental) => (
                <div key={rental._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        {rental.product?.images?.[0] ? (
                          <img
                            src={rental.product.images[0]}
                            alt={rental.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {rental.product?.name || 'Product'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{rental.city}</p>
                        {getStatusBadge(rental.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{rental.monthlyRent?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-semibold">
                          {new Date(rental.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-semibold">
                          {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Next Billing</p>
                        <p className="text-sm font-semibold">
                          {getDaysUntilNextBilling(rental.nextBillingDate)} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="text-sm font-semibold">
                          {rental.remainingMonths || 0} months
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    <button
                      onClick={() => handleExtension(rental._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      <Plus className="w-4 h-4" />
                      Extend
                    </button>
                    
                    {rental.status === 'active' && (
                      <button
                        onClick={() => handlePause(rental._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                    
                    {rental.status === 'paused' && (
                      <button
                        onClick={() => handleResume(rental._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        <Play className="w-4 h-4" />
                        Resume
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEarlyClosure(rental._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <XCircle className="w-4 h-4" />
                      Close
                    </button>
                    
                    <button
                      onClick={() => navigate(`/service-request/create?rentalId=${rental._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 ml-auto"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Create Service Request
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Past Rentals Tab */}
        {activeTab === 'past' && (
          <div className="space-y-6">
            {rentals.past.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Rentals</h3>
                <p className="text-gray-600">Your rental history will appear here</p>
              </div>
            ) : (
              rentals.past.map((rental) => (
                <div key={rental._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        {rental.product?.images?.[0] ? (
                          <img
                            src={rental.product.images[0]}
                            alt={rental.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {rental.product?.name || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{rental.city}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>Total Paid: ₹{rental.totalAmountPaid?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(rental.status)}
                  </div>

                  {rental.depositRefund && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Deposit of ₹{rental.deposit?.toLocaleString('en-IN')} refunded
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Service Requests Tab */}
        {activeTab === 'service' && (
          <div className="space-y-6">
            {serviceRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Service Requests</h3>
                <p className="text-gray-600">You haven't created any service requests yet</p>
              </div>
            ) : (
              serviceRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{request.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                          request.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                          request.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                          request.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {request.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Priority: {request.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {request.status === 'resolved' && !request.userRating && (
                    <button
                      onClick={() => handleRateService(request._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100"
                    >
                      <Star className="w-4 h-4" />
                      Rate Service
                    </button>
                  )}

                  {request.userRating && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Your rating:</span>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < request.userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRentalDashboard;
