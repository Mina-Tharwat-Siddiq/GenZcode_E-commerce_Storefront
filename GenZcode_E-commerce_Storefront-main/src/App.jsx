import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Home from './pages/Home'
import Unauthorized from './pages/Unauthorized'
import DashboardPage from './pages/Admin/DashboardPage'
import ProductsPage from './pages/Admin/ProductsPage'
import AdminOrdersPage from './pages/Admin/OrdersPage'
import ProductForm from './pages/Admin/ProductForm'
import ReviewsPage from './pages/Admin/ReviewsPage'
import CustomersPage from './pages/Admin/CustomersPage'
import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import MyAccountPage from './pages/MyAccount/MyAccountPage'
import UserOrdersPage from './pages/MyAccount/OrdersPage'
import WishlistPage from './pages/MyAccount/WishlistPage'
import AddressPage from './pages/MyAccount/AddressPage'
import AccountDetailsPage from './pages/MyAccount/AccountDetailsPage'
import LogoutPage from './pages/MyAccount/LogoutPage'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'
import ReviewsManagement from './pages/Admin/ReviewsManagement'
import AdminsPage from './pages/Admin/AdminsPage'


const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


const RequireAdmin = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-danger" style={{ width: '4rem', height: '4rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{from: location.pathname}}/>;
  }

    if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {

  return (
    <>
      <Routes>

        {/* Public Home */}
          <Route path='/' element={<Home/>} />
          
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/product/:id' element={<ProductDetailsPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          
          {/* My Account Routes */}
          <Route path='/my-account' element={<RequireAuth><MyAccountPage /></RequireAuth>}>
            <Route index element={<Navigate to="/my-account/orders" replace />} />
            <Route path="orders" element={<UserOrdersPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="address" element={<AddressPage />} />
            <Route path="account-details" element={<AccountDetailsPage />} />
          </Route>

          {/* Logout Route - No Auth Required */}
          <Route path='/my-account/logout' element={<LogoutPage />} />

        {/* Protected Routes For Admin Only*/}
        <Route
          path="/AdminDashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="reviews/:id" element={<ReviewsManagement />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="admins" element={<AdminsPage />} />
          {/*<Route path="settings" element={<SettingsPage />} /> */}
        </Route>

        {/* Normal Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
