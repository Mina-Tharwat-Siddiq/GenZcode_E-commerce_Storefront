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

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <ProductsProvider>
        <OrdersProvider>
          <ReviewsProvider>
            <CustomersProvider>
              <App />
            </CustomersProvider>
          </ReviewsProvider>
        </OrdersProvider>
      </ProductsProvider>
    </AuthProvider>
  </ThemeProvider>
  </BrowserRouter>
)
