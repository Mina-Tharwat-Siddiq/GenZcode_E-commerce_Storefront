import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
    const { getTotalItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const totalItems = getTotalItems();
    
    // تحديد الصفحة الحالية
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleProfileClick = () => {
        if (user) {
            navigate('/my-account/orders');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            {/* Top Banner */}
            <div className="top-banner">
                <p className="banner-text">Get 25% OFF on your first order. Order Now</p>
            </div>

            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <div className="logo-circle">
                            <img 
                                src="/logo-white.png" 
                                alt="Logo" 
                                className="logo-image"
                            />
                        </div>
                        <span className="logo-text">Ecommerce</span>
                    </Link>
                    
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`} 
                                    to="/"
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link 
                                    className={`nav-link dropdown-toggle ${isActive('/search') ? 'active' : ''}`}
                                    to="#" 
                                    role="button" 
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Categories
                                </Link>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/search?category=perfume">Perfume</Link></li>
                                    <li><Link className="dropdown-item" to="/search?category=trousers">Trousers</Link></li>
                                    <li><Link className="dropdown-item" to="/search?category=shoe">Shoe</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${isActive('/about') ? 'active' : ''}`} 
                                    to="/about"
                                >
                                    About
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${isActive('/contact') ? 'active' : ''}`} 
                                    to="/contact"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                        
                        <div className="navbar-actions">
                            <div className="search-box">
                                <i className="bi bi-search"></i>
                                <input 
                                    type="text" 
                                    placeholder="Search products" 
                                    className="search-input"
                                />
                            </div>
                            <button className="icon-btn cart-btn" onClick={handleCartClick}>
                                <i className="bi bi-cart"></i>
                                {totalItems > 0 && (
                                    <span className="cart-badge">{totalItems}</span>
                                )}
                            </button>
                            {user ? (
                                <button className="icon-btn user-btn user-btn-with-name" onClick={handleProfileClick}>
                                    <i className="bi bi-person-circle"></i>
                                    <span className="user-name">
                                        {user.firstName || user.username}
                                    </span>
                                </button>
                            ) : (
                                <button className="icon-btn user-btn" onClick={handleProfileClick}>
                                    <i className="bi bi-person-circle"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;

