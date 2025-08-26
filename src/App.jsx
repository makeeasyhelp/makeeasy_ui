import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  // Temporary function to handle navigation from any old components
  // that haven't been updated to use the new router
  const handleNavigate = (page, params = {}) => {
    switch(page) {
      case 'Home': navigate('/'); break;
      case 'Products': navigate('/products'); break;
      case 'Services': navigate('/services'); break;
      case 'About': navigate('/about'); break;
      case 'Contact': navigate('/contact'); break;
      case 'Login': navigate('/login'); break;
      case 'Profile': navigate('/profile'); break;
      case 'ProductDetails': navigate(`/products/${params.productId}`); break;
      case 'AdminDashboard': navigate('/admin/dashboard'); break;
      case 'AdminProducts': navigate('/admin/products'); break;
      case 'AdminCategories': navigate('/admin/categories'); break;
      case 'AdminServices': navigate('/admin/services'); break;
      default: navigate('/');
    }
  };

  // Render nothing since we're using React Router's Outlet component
  return null;
}

export default App;
