import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Icon from '../../components/ui/Icon';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.auth.adminLogin({
        email,
        password
      });
      
      if (response.success && response.token && response.data) {
        // Verify the user is an admin
        if (response.data.role !== 'admin') {
          throw new Error('Not authorized as admin');
        }

        // Update auth context
        if (setAuth) {
          setAuth({ token: response.token, user: response.data });
        }
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-pink">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Icon name="shield" size={48} className="mx-auto mb-4 text-brand-indigo" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
              <Icon name="alert-circle" size={20} className="text-red-500" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brand-indigo mb-1">
                <Icon name="mail" size={16} className="mr-1 text-brand-indigo" /> Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-brand-indigo mb-1">
                <Icon name="lock" size={16} className="mr-1 text-brand-indigo" /> Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? <Icon name="loader" size={20} className="animate-spin mr-2" /> : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="/admin/forgot-password" className="text-sm font-medium text-brand-purple hover:text-brand-pink transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
