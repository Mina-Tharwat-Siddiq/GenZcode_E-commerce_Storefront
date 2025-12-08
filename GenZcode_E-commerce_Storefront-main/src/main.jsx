import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProductsProvider from './context/ProductsContext.jsx';
import { OrdersProvider } from './context/OrdersContext.jsx';
import { ReviewsProvider } from './context/ReviewsContext.jsx';
import { CustomersProvider } from './context/CustomersContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

import "bootstrap/dist/css/bootstrap.min.css";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap";

import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <ReviewsProvider>
                <CustomersProvider>
                  <App />
                </CustomersProvider>
              </ReviewsProvider>
            </OrdersProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>


  <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
  </BrowserRouter>
)
