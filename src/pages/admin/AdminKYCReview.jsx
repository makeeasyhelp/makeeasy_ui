import React, { useState, useEffect } from 'react';
import { Eye, Check, X, FileText, AlertCircle } from 'lucide-react';
import { kycAPI } from '../../services/kycAPI';

const AdminKYCReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedKYC, setSelectedKYC] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await kycAPI.getAllKYCSubmissions({ status: filter });
      if (response.success) setSubmissions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await kycAPI.getKYCStats();
      if (response.success) setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (kycId) => {
    if (!confirm('Verify this KYC submission?')) return;
    try {
      await kycAPI.verifyKYC(kycId);
      alert('KYC verified successfully!');
      fetchSubmissions();
      fetchStats();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (kycId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await kycAPI.rejectKYC(kycId, rejectionReason);
      alert('KYC rejected!');
      fetchSubmissions();
      fetchStats();
      setShowModal(false);
      setRejectionReason('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkUnderReview = async (kycId) => {
    try {
      await kycAPI.markUnderReview(kycId);
      alert('Marked as under review!');
      fetchSubmissions();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">KYC Review Panel</h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-md p-6">
            <h3 className="text-yellow-800 text-sm mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-md p-6">
            <h3 className="text-green-800 text-sm mb-2">Verified</h3>
            <p className="text-3xl font-bold text-green-600">{stats.verified || 0}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-md p-6">
            <h3 className="text-red-800 text-sm mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{stats.rejected || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            {['all', 'pending', 'under_review', 'verified', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* KYC Submissions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No KYC submissions found</p>
            </div>
          ) : (
            submissions.map(kyc => (
              <div key={kyc._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {kyc.user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600">{kyc.user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(kyc.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    kyc.status === 'verified' ? 'bg-green-100 text-green-700' :
                    kyc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    kyc.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {kyc.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ID Proof</p>
                    <p className="font-medium">{kyc.idProofType}: {kyc.idProofNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address Proof</p>
                    <p className="font-medium">{kyc.addressProofType}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-sm">
                      {kyc.address?.line1}, {kyc.address?.city}, {kyc.address?.state} - {kyc.address?.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedKYC(kyc); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {kyc.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(kyc._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                      >
                        <Check className="w-4 h-4" />
                        Verify
                      </button>
                      <button
                        onClick={() => { setSelectedKYC(kyc); setShowModal(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleMarkUnderReview(kyc._id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Mark Under Review
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {showModal && selectedKYC && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">KYC Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">ID Proof Document</h4>
                    {selectedKYC.idProofDocument ? (
                      <img
                        src={selectedKYC.idProofDocument}
                        alt="ID Proof"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    ) : (
                      <p className="text-gray-500">No document</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Address Proof Document</h4>
                    {selectedKYC.addressProofDocument ? (
                      <img
                        src={selectedKYC.addressProofDocument}
                        alt="Address Proof"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    ) : (
                      <p className="text-gray-500">No document</p>
                    )}
                  </div>
                </div>

                {selectedKYC.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Rejection Reason (optional)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide reason if rejecting..."
                      className="w-full border rounded-lg px-4 py-2"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedKYC.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(selectedKYC._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                      >
                        Verify KYC
                      </button>
                      <button
                        onClick={() => handleReject(selectedKYC._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        Reject KYC
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Close
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

export default AdminKYCReview;
