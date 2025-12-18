import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';
import Icon from '../../components/ui/Icon';
import { FcGoogle, FaFacebook } from '../../components/ui/ReactIcons';
import { signInWithGoogle } from '../../config/firebase';
import { isProfileComplete, getProfileCompletionMessage } from '../../utils/profileValidation';

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formAnimating, setFormAnimating] = useState(false);
  const auth = useContext(AuthContext);
  const { actions } = useContext(AppContext);
  const { loginWithGoogle } = auth || {};
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

  // Form validation states
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      // Step 1: Sign in with Firebase
      const result = await signInWithGoogle();
      const firebaseUser = result.user;

      console.log('Google Sign-In successful:', firebaseUser);

      // Step 2: Send user data to backend
      const googleUserData = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        providerId: firebaseUser.uid,
        photoURL: firebaseUser.photoURL,
      };

      // Step 3: Authenticate with backend and store user in database
      const response = await loginWithGoogle(googleUserData);

      if (response.success) {
        // Step 4: Check if profile is complete
        const profileComplete = response.isProfileComplete || isProfileComplete(response.data);
        
        if (actions && actions.showToast) {
          actions.showToast('success', 'Successfully signed in with Google!');
        }

        // Step 5: Redirect based on profile completion
        if (!profileComplete) {
          // Profile incomplete - redirect to profile page with message
          if (actions && actions.showToast) {
            const message = getProfileCompletionMessage(response.data);
            actions.showToast('warning', message);
          }
          navigate('/profile', { 
            state: { 
              message: 'Please complete your profile by adding missing information',
              missingFields: !response.data.phone ? ['phone'] : []
            } 
          });
        } else {
          // Profile complete - redirect to homepage
          navigate('/');
        }
      } else {
        throw new Error(response.error || 'Failed to authenticate with backend');
      }

    } catch (err) {
      console.error("Google Sign-In error:", err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
      if (actions && actions.showToast) {
        actions.showToast('error', 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation effect for form switching
  useEffect(() => {
    setFormAnimating(true);
    const timer = setTimeout(() => setFormAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [isLogin]);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  // Enhanced form validation
  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!loginForm.password) {
      errors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerForm.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!registerForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
      if (registerForm.phone) {
        if (!/^[6-9][0-9]{9}$/.test(registerForm.phone)) {
          errors.phone = 'Phone must start with 6-9 and be 10 digits';
        }
    }
    return errors;
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => {
      const newForm = { ...prev, [name]: value };

      // Real-time validation inside the state update to ensure we have the latest form state
      const newValidationErrors = { ...validationErrors };

      if (name === 'phone') {
        let phoneError = '';
        if (value && !/^[6-9][0-9]{0,9}$/.test(value)) {
          phoneError = 'Phone must start with 6-9 and be up to 10 digits';
        } else if (value.length === 10 && !/^[6-9][0-9]{9}$/.test(value)) {
          phoneError = 'Phone must start with 6-9 and be 10 digits';
        }
        newValidationErrors.phone = phoneError;
      }

      if (name === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
        if (newForm.confirmPassword && value !== newForm.confirmPassword) {
          newValidationErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newValidationErrors.confirmPassword;
        }
      }

      if (name === 'confirmPassword') {
        if (newForm.password !== value) {
          newValidationErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newValidationErrors.confirmPassword;
        }
      }

      // Clear validation error for other fields when user starts typing
      if (validationErrors[name] && name !== 'phone' && name !== 'confirmPassword' && name !== 'password') {
        delete newValidationErrors[name];
      }
      
      setValidationErrors(newValidationErrors);
      
      return newForm;
    });

    if (error) setError('');
  };

  // Enhanced login handler with better validation
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateLoginForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const response = await api.auth.login({
        email: loginForm.email.trim().toLowerCase(),
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
        
        // Success animation before navigation
        setLoading(false);
        setTimeout(() => navigate('/'), 500);
      } else {
        const errorMsg = response.error || 'Login failed';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Unable to connect to the server. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced register handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateRegisterForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      if (!auth || !auth.register) {
        throw new Error('Authentication context is not available');
      }

      const result = await auth.register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
        phone: registerForm.phone?.trim() || ''
      });

      if (result.success) {
        // Set user in app context if available
        if (actions && actions.setUser) {
          actions.setUser(result.data);
        }
        
        // Success animation before navigation
        setLoading(false);
        setTimeout(() => navigate('/'), 500);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register with animation
  const handleToggleMode = () => {
    setFormAnimating(true);
    setIsLogin(!isLogin);
    setError('');
    setValidationErrors({});
    setPasswordStrength(0);
    
    setTimeout(() => {
      setFormAnimating(false);
    }, 300);
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = ({ strength }) => {
    const getStrengthConfig = () => {
      if (strength <= 25) return { color: 'bg-red-500', text: 'Weak', textColor: 'text-red-600' };
      if (strength <= 50) return { color: 'bg-orange-500', text: 'Fair', textColor: 'text-orange-600' };
      if (strength <= 75) return { color: 'bg-yellow-500', text: 'Good', textColor: 'text-yellow-600' };
      return { color: 'bg-green-500', text: 'Strong', textColor: 'text-green-600' };
    };

    const config = getStrengthConfig();

    return (
      <div className="mt-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Strength</span>
          <span className={`font-medium text-xs ${config.textColor}`}>
            {config.text}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ${config.color}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden login-container">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-brand-purple/20 to-brand-pink/20 enhanced-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-brand-indigo/20 to-brand-blue/20 enhanced-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-brand-indigo to-brand-purple rounded-full flex items-center justify-center mb-6 shadow-lg pulse-glow">
            <Icon name="user" size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2 animated-gradient-text">
            {isLogin ? 'Welcome Back' : 'Join MakeEasy'}
          </h2>
          <p className="text-lg text-gray-600">
            {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
          </p>
          <button
            onClick={handleToggleMode}
            className="mt-4 text-brand-purple hover:text-brand-pink transition-all duration-300 font-semibold inline-flex items-center gap-2 hover:scale-105"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            <Icon name="key-round" size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Main Form Card */}
        <div className={`glass-morphism py-8 px-8 shadow-2xl rounded-3xl border border-white/50 transition-all duration-500 ${formAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'} animate-fade-in-up card-hover-effect`}>
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg animate-fade-in-down error-shake">
              <div className="flex items-center">
                <Icon name="alert-circle" size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div className="space-y-5">
                {/* Email Field */}
                {/* <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Icon name="mail" size={16} className="mr-2 text-brand-indigo" />
                    {/* Email Address */}
                  {/*</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className={`form-field-enhanced appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                    placeholder="Enter your email"
                  />
                 
                </div> */}
                <div className="relative">
  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-indigo">
    <Icon name="mail" size={16} />
  </span>
  <input
    id="email"
    name="email"
    type="email"
    autoComplete="email"
    required
    value={loginForm.email}
    onChange={handleLoginChange}
    className={`form-field-enhanced appearance-none block w-full pl-11 pr-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
    placeholder="Enter your email"
  />
   {validationErrors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <Icon name="alert-circle" size={14} className="mr-1" />
                      {validationErrors.email}
                    </p>
                  )}
</div>

                {/* Password Field */}
                <div>
                  {/* <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Icon name="lock-keyhole" size={16} className="mr-2 text-brand-indigo" />
                    Password
                  </label> */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                      <Icon name="lock-keyhole" size={16} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className={`form-field-enhanced appearance-none block w-full pl-11 pr-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-purple transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <Icon name="alert-circle" size={14} className="mr-1" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Remember Me & Welcome Back Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-medium">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="/forgot-password" className="font-medium text-brand-purple hover:text-brand-pink transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-enhanced w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all duration-300 transform hover:scale-105 btn-glow ${loading ? 'opacity-70 cursor-not-allowed scale-100' : ''}`}
                >
                  {loading ? (
                    <>
                      <Icon name="loader" size={20} className="loading-enhanced mr-3" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Icon name="key-round" size={20} className="mr-3" />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              {/* Two Column Layout for Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {/* Name Field */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                    <Icon name="user" size={16} />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className={`form-field-enhanced appearance-none block w-full pl-10 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 text-sm ${validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                    placeholder="Full Name"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <Icon name="alert-circle" size={12} className="mr-1" />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                    <Icon name="mail" size={16} />
                  </span>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className={`form-field-enhanced appearance-none block w-full pl-10 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 text-sm ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                    placeholder="Email Address"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <Icon name="alert-circle" size={12} className="mr-1" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                    <Icon name="phone" size={16} />
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={10}
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className={`form-field-enhanced appearance-none block w-full pl-10 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 text-sm ${validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                    placeholder="Phone (Optional)"
                  />
                  {validationErrors.phone && validationErrors.phone.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 z-10">
                      <div className="flex items-center bg-red-50 border border-red-200 text-red-700 text-xs rounded px-2 py-1 shadow animate-fade-in-down">
                        <Icon name="alert-circle" size={14} className="mr-1 text-red-500" />
                        {validationErrors.phone}
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                    <Icon name="lock" size={16} />
                  </span>
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className={`form-field-enhanced appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 text-sm ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                    placeholder="Create password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-purple transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
                  </button>
                  {/* Password Strength Indicator */}
                </div>
                
              </div>

              {/* Confirm Password Field - Full Width */}
              <div className="relative mt-3">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-indigo">
                  <Icon name="lock" size={16} />
                </span>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className={`form-field-enhanced appearance-none block w-full pl-10 pr-10 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple transition-all duration-300 text-sm ${validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white/70'}`}
                  placeholder="Confirm password"
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-purple transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={16} />
                </button>
                <div className="flex items-center justify-between mt-1">
                </div>
              </div>
                {registerForm.password && (
                    <div className="mt-2 w-full">
                      <PasswordStrengthIndicator strength={passwordStrength} />
                    </div>
                  )}
                  {validationErrors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <Icon name="alert-circle" size={12} className="mr-1" />
                      {validationErrors.password}
                    </p>
                  )}
                  {validationErrors.confirmPassword ? (
                    <p className="text-xs text-red-600 flex items-center">
                      <Icon name="alert-circle" size={12} className="mr-1" />
                      {validationErrors.confirmPassword}
                    </p>
                  ) : (
                    <div></div>
                  )}

              {/* Compact Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded mt-0.5 flex-shrink-0"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
                  I agree to the{' '}
                  <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors font-semibold">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors font-semibold">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Register Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-enhanced w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink hover:from-brand-purple hover:to-brand-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all duration-300 transform hover:scale-105 btn-glow ${loading ? 'opacity-70 cursor-not-allowed scale-100' : ''}`}
                >
                  {loading ? (
                    <>
                      <Icon name="loader" size={18} className="loading-enhanced mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Icon name="user-plus" size={18} className="mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Social Login Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="social-btn w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white/70 hover:bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <FcGoogle size={22} className="mr-3" />
                <span className="text-gray-700 font-semibold">Google</span>
              </button>
              
              <button
                type="button"
                className="social-btn w-full inline-flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white/70 hover:bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <FaFacebook size={20} className="text-blue-600 mr-3" />
                <span className="text-gray-700 font-semibold">Facebook</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
            <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">Terms</a> and{' '}
            <a href="#" className="text-brand-purple hover:text-brand-pink transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
