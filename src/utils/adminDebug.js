/**
 * Admin Navigation Troubleshooting Guide
 * 
 * This document helps debug issues with admin navigation not working
 */

// Check 1: Verify Admin Authentication
console.log('=== ADMIN AUTHENTICATION CHECK ===');
console.log('User:', JSON.stringify(localStorage.getItem('user'), null, 2));
console.log('Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');

// Check 2: Verify Admin Role
function checkAdminRole() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User Role:', user.role);
  console.log('Is Admin:', user.role === 'admin');
}

// Check 3: Verify Routes Exist
function checkRoutes() {
  const routes = [
    '/admin/dashboard',
    '/admin/products',
    '/admin/categories',
    '/admin/services',
    '/admin/about',
    '/admin/banners',
    '/admin/locations',
    '/admin/users'
  ];
  console.log('Expected Admin Routes:', routes);
}

// Check 4: API Endpoint Test
async function testAdminLoginAPI() {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    const data = await response.json();
    console.log('Admin Login API Response:', data);
  } catch (err) {
    console.error('API Error:', err);
  }
}

// Export for use in console
window.adminDebug = {
  checkAdminRole,
  checkRoutes,
  testAdminLoginAPI
};

console.log('Admin Debug Tools Available - Use window.adminDebug');
