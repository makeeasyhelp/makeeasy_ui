import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ImprovedProductDetailsPage from './pages/ImprovedProductDetailsPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginRegisterPage from './pages/auth/LoginRegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatedProfilePage from './pages/UpdatedProfilePage';
import EnhancedProfilePage from './pages/EnhancedProfilePage';
import OrdersPage from './pages/OrdersPage';
import UserServicesPage from './pages/UserServicesPage';
import CartPage from './pages/CartPage';
import ImprovedCheckoutPage from './pages/ImprovedCheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsCRUDPage from './pages/admin/AdminProductsCRUDPage';
import AdminCategoriesCRUDPage from './pages/admin/AdminCategoriesCRUDPage';
import AdminServicesCRUDPage from './pages/admin/AdminServicesCRUDPage';
import AdminAboutCRUDPage from './pages/admin/AdminAboutCRUDPage';
import AdminManageUsersPage from './pages/admin/AdminManageUsersPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:productId" element={<ImprovedProductDetailsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginRegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="checkout/:bookingId" element={<ImprovedCheckoutPage />} />
          <Route path="checkout" element={<ImprovedCheckoutPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <EnhancedProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="orders" 
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="user-services" 
            element={
              <ProtectedRoute>
                <UserServicesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route 
            path="admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminManageUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/products" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProductsCRUDPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/categories" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminCategoriesCRUDPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/services" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminServicesCRUDPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/about" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAboutCRUDPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
