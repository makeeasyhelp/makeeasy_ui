import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Icon from '../../components/ui/Icon';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: Reset password
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { success: true };

      if (response.success) {
        setSuccess(`A verification code has been sent to ${emailOrPhone}.`);
        setStep(2);
      } else {
        setError('Failed to send verification code. Please check the email or phone number.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { success: true };

      if (response.success) {
        setSuccess('Code verified successfully. You can now reset your password.');
        setStep(3);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { success: true };

      if (response.success) {
        setSuccess('Password has been reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                <Icon name="mail" size={16} />
              </span>
              <input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="form-field-enhanced appearance-none block w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 border-gray-200 bg-white/70"
                placeholder="Enter your email or phone"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-enhanced w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all duration-300 transform hover:scale-105 btn-glow"
              >
                {loading ? <LoadingSpinner size="small" color="white" text={null} /> : 'Send Code'}
              </button>
            </div>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                <Icon name="key-round" size={16} />
              </span>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="form-field-enhanced appearance-none block w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 border-gray-200 bg-white/70"
                placeholder="Enter the code"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-enhanced w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all duration-300 transform hover:scale-105 btn-glow"
              >
                {loading ? <LoadingSpinner size="small" color="white" text={null} /> : 'Verify Code'}
              </button>
            </div>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative">
               <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                <Icon name="lock" size={16} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-field-enhanced appearance-none block w-full pl-11 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 border-gray-200 bg-white/70"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-purple"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
            <div className="relative">
               <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                <Icon name="lock" size={16} />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-field-enhanced appearance-none block w-full pl-11 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 border-gray-200 bg-white/70"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-purple"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-enhanced w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all duration-300 transform hover:scale-105 btn-glow"
              >
                {loading ? <LoadingSpinner size="small" color="white" text={null} /> : 'Reset Password'}
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden login-container">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 enhanced-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-brand-indigo/20 to-brand-blue/20 enhanced-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-brand-indigo to-brand-purple rounded-full flex items-center justify-center mb-6 shadow-lg pulse-glow">
            <Icon name="key-round" size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2 animated-gradient-text">
            Forgot Password
          </h2>
          <p className="text-lg text-gray-600">
            {step === 1 && "No worries, we'll send you reset instructions."}
            {step === 2 && "Check your inbox for the verification code."}
            {step === 3 && "Time to create a new, secure password."}
          </p>
        </div>

        <div className="glass-morphism py-8 px-8 shadow-2xl rounded-3xl border border-white/50 animate-fade-in-up card-hover-effect">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg animate-fade-in-down error-shake">
              <div className="flex items-center">
                <Icon name="alert-circle" size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          {success && (
             <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-lg animate-fade-in-down">
             <div className="flex items-center">
               <Icon name="check-circle" size={20} className="text-green-500 mr-3 flex-shrink-0" />
               <span className="text-sm font-medium">{success}</span>
             </div>
           </div>
          )}
          {renderStep()}
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="font-medium text-brand-purple hover:text-brand-pink transition-colors">
            <Icon name="arrow-left" className="inline-block mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
