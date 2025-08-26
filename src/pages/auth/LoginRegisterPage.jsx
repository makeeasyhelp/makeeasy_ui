import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';
import Icon from '../../components/ui/Icon';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const auth = useContext(AuthContext);
  const { actions } = useContext(AppContext);
  const { setAuth } = auth || {};
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  // Improved login handler with role check and proper refresh
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.auth.login({
        email: loginForm.email,
        password: loginForm.password
      });
      
      if (response.success && response.token && response.data) {
        // Update auth context
        if (auth && auth.setAuth) {
          auth.setAuth({ token: response.token, user: response.data });
        }
        // Set user in app context if available
        if (actions && actions.setUser) {
          actions.setUser(response.data);
        }
        // Navigate to home page
        navigate('/');
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Improved register handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (!auth || !auth.register) {
        throw new Error('Authentication context is not available');
      }

      const result = await auth.register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone
      });

      if (result.success) {
        // Set user in app context if available
        if (actions && actions.setUser) {
          actions.setUser(result.data);
        }
        navigate('/');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-pink py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Icon name="user" size={48} className="mx-auto mb-4 text-brand-indigo" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-1 font-medium text-brand-purple hover:text-brand-pink transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
              <Icon name="alert-circle" size={20} className="text-red-500" />
              <span>{error}</span>
            </div>
          )}
          {isLogin ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="mail" size={16} className="mr-1 text-brand-indigo" /> Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="lock" size={16} className="mr-1 text-brand-indigo" /> Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-indigo hover:text-brand-purple transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-brand-purple hover:text-brand-pink transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? <Icon name="loader" size={20} className="animate-spin mr-2" /> : null}
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="user" size={16} className="mr-1 text-brand-indigo" /> Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reg-email" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="mail" size={16} className="mr-1 text-brand-indigo" /> Email address
                </label>
                <div className="mt-1">
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="phone" size={16} className="mr-1 text-brand-indigo" /> Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="lock" size={16} className="mr-1 text-brand-indigo" /> Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-indigo hover:text-brand-purple transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-brand-indigo mb-1">
                  <Icon name="lock" size={16} className="mr-1 text-brand-indigo" /> Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
                    Terms of Service
                  </a>{' '}and{' '}
                  <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? <Icon name="loader" size={20} className="animate-spin mr-2" /> : null}
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}
          {/* Social login options */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 text-sm font-semibold text-gray-700 hover:bg-brand-purple/10 transition-all items-center gap-2"
              >
                <Icon name="google" size={20} className="text-brand-indigo" />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-gradient-to-r from-white to-gray-50 text-sm font-semibold text-gray-700 hover:bg-brand-pink/10 transition-all items-center gap-2"
              >
                <Icon name="facebook" size={20} className="text-brand-purple" />
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
