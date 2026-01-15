import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './user/AuthPage';
// import Signup from './user/Signup'; // Unified in AuthPage
// import Signin from './user/Signin'; // Unified in AuthPage
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import Dashboard from './user/UserDashboard';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import Wishlist from './core/wishlist'; // ADD THIS IMPORT
import Orders from './admin/Orders';
import Profile from './user/Profile';
import ManageProducts from './admin/ManageProducts';
import UpdateProduct from './admin/UpdateProduct';
import CategoryList from './admin/CategoryList';
import UsersList from './admin/UsersList';
import NotFound from './core/NotFound';
import AboutUs from "./core/AboutUs";
import EsewaSuccess from './core/EsewaSuccess';
import { Navigate } from 'react-router-dom';
import CheckoutPage from './core/CheckoutPage';
import PrivacyPolicy from './core/PrivacyPolicy';
import TermsOfUse from './core/TermsOfUse';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/signin' element={<AuthPage />} />
        <Route path='/signup' element={<AuthPage />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<Wishlist />} /> {/* ADD THIS ROUTE */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/esewa/success" element={<EsewaSuccess />} />
        <Route path="/esewa/failure" element={<Navigate to="/cart" />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<TermsOfUse />} />


        {/* Private Routes */}
        <Route
          path='/user/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/:userId'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path='/checkout'
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path='/admin/dashboard'
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path='/create/category'
          element={
            <AdminRoute>
              <AddCategory />
            </AdminRoute>
          }
        />
        <Route
          path='/create/product'
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/orders'
          element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/products'
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/product/update/:productId'
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/categories'
          element={
            <AdminRoute>
              <CategoryList />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <AdminRoute>
              <UsersList />
            </AdminRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;