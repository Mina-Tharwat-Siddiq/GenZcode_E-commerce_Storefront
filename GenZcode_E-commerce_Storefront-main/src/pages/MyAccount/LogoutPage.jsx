import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import './LogoutPage.css';

function LogoutPage() {
    const navigate = useNavigate();
    const { clearCart, clearCartNoSave } = useCart();
    const { clearWishlist, clearWishlistNoSave } = useWishlist();
    const { logout } = useAuth();

    useEffect(() => {
        const performLogout = () => {
            // Clear authentication and user-specific data except per-user cart/wishlist
            localStorage.removeItem('user_auth');
            localStorage.removeItem('user_orders');

            // Clear any session storage as well
            sessionStorage.clear();

            // Clear UI state but do not overwrite per-user stored data
            if (clearCartNoSave) clearCartNoSave();
            if (clearWishlistNoSave) clearWishlistNoSave();

            // Use AuthContext logout to update provider state and navigate
            if (logout) logout();
            else navigate('/login', { replace: true });
        };

        // Small delay to allow the logout UI to render
        const timer = setTimeout(performLogout, 250);

        return () => clearTimeout(timer);
    }, [navigate, clearCartNoSave, clearWishlistNoSave, logout]);

    return (
        <div className="logout-page">
            <div className="logout-content">
                <i className="bi bi-box-arrow-right"></i>
                <h2>Logging out...</h2>
                <p>You will be redirected to the login page</p>
            </div>
        </div>
    );
}

export default LogoutPage;

