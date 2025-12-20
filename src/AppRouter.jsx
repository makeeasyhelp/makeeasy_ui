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
import AdminProfessionalServicesCRUDPage from './pages/admin/AdminProfessionalServicesCRUDPage';
import AdminAboutCRUDPage from './pages/admin/AdminAboutCRUDPage';
import AdminManageUsersPage from './pages/admin/AdminManageUsersPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminLocationsPage from './pages/admin/AdminLocationsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Rental System Components
import RentalProductDetailsPage from './pages/RentalProductDetailsPage';
import KYCUploadPage from './pages/KYCUploadPage';
import UserRentalDashboard from './pages/UserRentalDashboard';
import ServiceRequestForm from './pages/ServiceRequestForm';
import AdminRentalManagement from './pages/admin/AdminRentalManagement';
import AdminKYCReview from './pages/admin/AdminKYCReview';
import AdminServiceRequestManagement from './pages/admin/AdminServiceRequestManagement';
import EnhancedRentalProductDetailsPage from './pages/EnhancedRentalProductDetailsPage';
import RentalCartPage from './pages/RentalCartPage';
import RentalCheckoutPage from './pages/RentalCheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

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
          {/* Old checkout routes - replaced by RentalCheckoutPage */}
          {/* <Route path="checkout/:bookingId" element={<ImprovedCheckoutPage />} /> */}
          {/* <Route path="checkout" element={<ImprovedCheckoutPage />} /> */}
          
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
          
          {/* Rental System Routes */}
          <Route path="rental/product/:id" element={<EnhancedRentalProductDetailsPage />} />
          <Route path="rental-cart" element={<RentalCartPage />} />
          <Route 
            path="checkout" 
            element={
              <ProtectedRoute>
                <RentalCheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="payment" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="order-success" 
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="kyc-upload" 
            element={
              <ProtectedRoute>
                <KYCUploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="user/kyc-upload" 
            element={
              <ProtectedRoute>
                <KYCUploadPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="user/rentals" 
            element={
              <ProtectedRoute>
                <UserRentalDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="service-request/create" 
            element={
              <ProtectedRoute>
                <ServiceRequestForm />
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
            path="admin/professional-services" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProfessionalServicesCRUDPage />
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
          <Route 
            path="admin/banners" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBannersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/locations" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLocationsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Rental Management Routes */}
          <Route 
            path="admin/rentals" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminRentalManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/kyc" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminKYCReview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/service-requests" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminServiceRequestManagement />
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
