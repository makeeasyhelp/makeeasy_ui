import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, MapPin, AlertCircle, CheckCircle, 
  Clock, XCircle, ArrowLeft, Eye, X 
} from 'lucide-react';
import { kycAPI } from '../services/kycAPI';
import { AuthContext } from '../context/AuthContext';

/**
 * KYC Upload Page
 * Allows users to submit KYC documents for verification
 */
const KYCUploadPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    idProofType: 'aadhaar',
    idProofNumber: '',
    addressProofType: 'aadhaar',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [files, setFiles] = useState({
    idProofDocument: null,
    addressProofDocument: null
  });

  const [previews, setPreviews] = useState({
    idProofDocument: null,
    addressProofDocument: null
  });

  const [errors, setErrors] = useState({});

  // Fetch existing KYC status
  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        setLoading(true);
        const response = await kycAPI.getKYCStatus();
        
        if (response.success && response.data) {
          setKycData(response.data);
          
          // Pre-fill form if KYC exists
          if (response.data.status === 'pending' || response.data.status === 'rejected') {
            setFormData({
              idProofType: response.data.idProofType || 'aadhaar',
              idProofNumber: response.data.idProofNumber || '',
              addressProofType: response.data.addressProofType || 'aadhaar',
              addressLine1: response.data.address?.line1 || '',
              addressLine2: response.data.address?.line2 || '',
              city: response.data.address?.city || '',
              state: response.data.address?.state || '',
              pincode: response.data.address?.pincode || '',
              landmark: response.data.address?.landmark || ''
            });
          }
        }
      } catch (err) {
        console.error('Error fetching KYC:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchKYCStatus();
    }
  }, [user]);

  const idProofTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'voter_id', label: 'Voter ID' }
  ];

  const addressProofTypes = [
    ...idProofTypes,
    { value: 'utility_bill', label: 'Utility Bill' },
    { value: 'rent_agreement', label: 'Rent Agreement' }
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Chandigarh', 'Jammu and Kashmir', 'Ladakh'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }));
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fieldName]: 'Only JPEG, PNG, and PDF files are allowed' }));
        return;
      }

      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setErrors(prev => ({ ...prev, [fieldName]: null }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => ({ ...prev, [fieldName]: 'pdf' }));
      }
    }
  };

  const removeFile = (fieldName) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setPreviews(prev => ({ ...prev, [fieldName]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idProofType) newErrors.idProofType = 'ID proof type is required';
    if (!formData.idProofNumber) newErrors.idProofNumber = 'ID proof number is required';
    if (!formData.addressProofType) newErrors.addressProofType = 'Address proof type is required';
    if (!formData.addressLine1) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode (6 digits required)';

    if (!files.idProofDocument && !kycData?.idProofDocument) {
      newErrors.idProofDocument = 'ID proof document is required';
    }
    if (!files.addressProofDocument && !kycData?.addressProofDocument) {
      newErrors.addressProofDocument = 'Address proof document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append('idProofType', formData.idProofType);
      formDataToSend.append('idProofNumber', formData.idProofNumber);
      formDataToSend.append('addressProofType', formData.addressProofType);
      formDataToSend.append('addressLine1', formData.addressLine1);
      formDataToSend.append('addressLine2', formData.addressLine2);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('pincode', formData.pincode);
      formDataToSend.append('landmark', formData.landmark);

      if (files.idProofDocument) {
        formDataToSend.append('idProofDocument', files.idProofDocument);
      }
      if (files.addressProofDocument) {
        formDataToSend.append('addressProofDocument', files.addressProofDocument);
      }

      let response;
      if (kycData && (kycData.status === 'pending' || kycData.status === 'rejected')) {
        response = await kycAPI.updateKYC(formDataToSend);
      } else {
        response = await kycAPI.submitKYC(formDataToSend);
      }

      if (response.success) {
        alert('KYC submitted successfully! Your documents are under review.');
        navigate('/profile');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit KYC. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const configs = {
      verified: { icon: CheckCircle, color: 'green', text: 'Verified' },
      pending: { icon: Clock, color: 'yellow', text: 'Pending Review' },
      under_review: { icon: Clock, color: 'blue', text: 'Under Review' },
      rejected: { icon: XCircle, color: 'red', text: 'Rejected' },
      not_submitted: { icon: AlertCircle, color: 'gray', text: 'Not Submitted' }
    };

    const config = configs[status] || configs.not_submitted;
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${config.color}-100 text-${config.color}-700`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{config.text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KYC details...</p>
        </div>
      </div>
    );
  }

  // If already verified, show status
  if (kycData?.status === 'verified') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">KYC Verified!</h1>
            <p className="text-gray-600 mb-6">
              Your KYC documents have been verified. You can now rent products.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
              <p className="text-gray-600">Submit your documents for verification</p>
            </div>
            {kycData && getStatusBadge(kycData.status)}
          </div>

          {/* Rejection Notice */}
          {kycData?.status === 'rejected' && kycData.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">KYC Rejected</h3>
                  <p className="text-red-800 text-sm">{kycData.rejectionReason}</p>
                  <p className="text-red-700 text-sm mt-2">Please update your documents and resubmit.</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ID Proof Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                ID Proof
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Proof Type *
                  </label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {idProofTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Proof Number *
                  </label>
                  <input
                    type="text"
                    name="idProofNumber"
                    value={formData.idProofNumber}
                    onChange={handleInputChange}
                    placeholder="Enter ID number"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.idProofNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.idProofNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.idProofNumber}</p>
                  )}
                </div>
              </div>

              {/* ID Proof Upload */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload ID Proof Document * (JPEG, PNG, PDF - Max 5MB)
                </label>
                
                {!previews.idProofDocument && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileChange(e, 'idProofDocument')}
                      className="hidden"
                    />
                  </label>
                )}

                {previews.idProofDocument && (
                  <div className="relative">
                    {previews.idProofDocument === 'pdf' ? (
                      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-10 h-10 text-red-500" />
                          <span className="text-sm font-medium">{files.idProofDocument.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('idProofDocument')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previews.idProofDocument}
                          alt="ID Proof Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('idProofDocument')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {errors.idProofDocument && (
                  <p className="text-red-500 text-xs mt-1">{errors.idProofDocument}</p>
                )}
              </div>
            </div>

            {/* Address Proof Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                Address Proof
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Proof Type *
                </label>
                <select
                  name="addressProofType"
                  value={formData.addressProofType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {addressProofTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Address Proof Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Address Proof Document * (JPEG, PNG, PDF - Max 5MB)
                </label>
                
                {!previews.addressProofDocument && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileChange(e, 'addressProofDocument')}
                      className="hidden"
                    />
                  </label>
                )}

                {previews.addressProofDocument && (
                  <div className="relative">
                    {previews.addressProofDocument === 'pdf' ? (
                      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-10 h-10 text-red-500" />
                          <span className="text-sm font-medium">{files.addressProofDocument.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('addressProofDocument')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previews.addressProofDocument}
                          alt="Address Proof Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('addressProofDocument')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {errors.addressProofDocument && (
                  <p className="text-red-500 text-xs mt-1">{errors.addressProofDocument}</p>
                )}
              </div>
            </div>

            {/* Address Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Address Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name"
                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Street, Area, Locality"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Nearby landmark"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit KYC'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• All documents must be clear and readable</li>
            <li>• File size should not exceed 5MB</li>
            <li>• Accepted formats: JPEG, PNG, PDF</li>
            <li>• KYC verification typically takes 24-48 hours</li>
            <li>• You will be notified once your KYC is verified</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KYCUploadPage;
