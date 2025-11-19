import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Home from './pages/Home'
import Unauthorized from './pages/Unauthorized'
import DashboardPage from './pages/Admin/DashboardPage'
import ProductsPage from './pages/Admin/ProductsPage'
import OrdersPage from './pages/Admin/OrdersPage'
import AddProduct from './pages/Admin/ProductForm'
import ReviewsPage from './pages/Admin/ReviewsPage'
import CustomersPage from './pages/Admin/CustomersPage'
import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NavBar from './components/NavBar'

// function DashboardRoute({ children, allowedRoles }) {
//   const { user } = useAuth();
//   // Check If User Role Is Not Admin Go Unauthorized.jsx Page
//   if (!user ||!allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }
  

//   return children;
// }
  
// function HomeRoute({ children }) {
// const { user } = useAuth();

//   if (!user) return <Navigate to="/login" replace/>;
//   return children;
// }


const RequireAuth = ({ children }) => {
  const auth = localStorage.getItem("user_auth");
  const user = auth ? JSON.parse(auth) : null;
  console.log(user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if(user.role === "admin") return <Navigate to={"/AdminDashboard"}/>;
  return children;
};

const RequireAdmin = ({ children }) => {
  const auth = localStorage.getItem("user_auth");
  const user = auth ? JSON.parse(auth) : null;
  
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  } 
  return children;
};

function App() {

  return (
    <>
      <Routes>

        {/* Protected Routes For Users*/}
          <Route path='/' element={<RequireAuth ><Home/>
          </RequireAuth>} />
          
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />

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
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          {/*<Route path="settings" element={<SettingsPage />} /> */}
        </Route>

        {/* Normal Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
