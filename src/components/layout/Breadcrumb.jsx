import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumb = () => {
  const location = useLocation();

  // Define breadcrumb mappings for different routes
  const breadcrumbMap = {
    '/': [{ label: 'Home', path: '/' }],
    '/products': [{ label: 'Home', path: '/' }, { label: 'Products', path: '/products' }],
    '/product-details': [{ label: 'Home', path: '/' }, { label: 'Products', path: '/products' }, { label: 'Product Details', path: '/product-details' }],
    '/services': [{ label: 'Home', path: '/' }, { label: 'Services', path: '/services' }],
    '/about': [{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }],
    '/contact': [{ label: 'Home', path: '/' }, { label: 'Contact', path: '/contact' }],
    '/cart': [{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }],
    '/checkout': [{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout', path: '/checkout' }],
    '/login': [{ label: 'Home', path: '/' }, { label: 'Login', path: '/login' }],
    '/profile': [{ label: 'Home', path: '/' }, { label: 'Profile', path: '/profile' }],
    '/orders': [{ label: 'Home', path: '/' }, { label: 'Orders', path: '/orders' }],
    '/user-services': [{ label: 'Home', path: '/' }, { label: 'Your Services', path: '/user-services' }],
    
    // Admin routes
    '/admin/dashboard': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Dashboard', path: '/admin/dashboard' }
    ],
    '/admin/categories': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage Categories', path: '/admin/categories' }
    ],
    '/admin/products': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage Products', path: '/admin/products' }
    ],
    '/admin/services': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage Services', path: '/admin/services' }
    ],
    '/admin/banners': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage Banners', path: '/admin/banners' }
    ],
    '/admin/locations': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage Locations', path: '/admin/locations' }
    ],
    '/admin/about': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage About', path: '/admin/about' }
    ],
    '/admin/users': [
      { label: 'Home', path: '/' },
      { label: 'Admin', path: '/admin/dashboard' },
      { label: 'Manage Users', path: '/admin/users' }
    ],
  };

  // Get breadcrumbs for current route
  const getBreadcrumbs = () => {
    const pathname = location.pathname;
    
    // Check for exact match first
    if (breadcrumbMap[pathname]) {
      return breadcrumbMap[pathname];
    }

    // Check for admin routes specifically (they contain /admin/)
    for (const [route, breadcrumbs] of Object.entries(breadcrumbMap)) {
      if (route.includes('/admin') && pathname.startsWith(route)) {
        return breadcrumbs;
      }
    }

    // Check for other partial matches
    for (const [route, breadcrumbs] of Object.entries(breadcrumbMap)) {
      if (pathname.startsWith(route) && route !== '/') {
        return breadcrumbs;
      }
    }

    // Default breadcrumb for unknown routes
    const lastSegment = pathname.split('/').filter(Boolean).pop() || 'Page';
    return [
      { label: 'Home', path: '/' },
      { label: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' '), path: pathname }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumb on home page or login page
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/admin/login') {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200"
      aria-label="Breadcrumb"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center">
              {index === 0 ? (
                <Link
                  to={breadcrumb.path}
                  className="flex items-center gap-1 text-gray-600 hover:text-brand-indigo transition-colors"
                  title="Go to Home"
                >
                  <Home size={16} className="text-gray-500" />
                  <span className="text-sm font-medium hidden sm:inline">{breadcrumb.label}</span>
                </Link>
              ) : index === breadcrumbs.length - 1 ? (
                // Last breadcrumb - not clickable
                <span className="text-sm font-medium text-gray-900">
                  {breadcrumb.label}
                </span>
              ) : (
                // Middle breadcrumbs - clickable
                <Link
                  to={breadcrumb.path}
                  className="text-sm font-medium text-gray-600 hover:text-brand-indigo transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}

              {/* Separator */}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight size={16} className="mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Breadcrumb;
