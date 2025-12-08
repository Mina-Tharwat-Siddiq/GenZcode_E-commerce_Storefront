import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import './Header.css';
import api, { usersAPI } from '../api';
import { useEffect, useState } from 'react';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const { getTotalItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const totalItems = getTotalItems();
    const [userImage, setUserImage] = useState(null);
    const getUserImage = async () => {
        const res = await usersAPI.getCurrent();
        const userImage = res.data.user.profileImage;
        setUserImage(userImage);
    }
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/products/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to load categories", err);
            } finally {
                setLoadingCats(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }
        getUserImage();
    }, [user])

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

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <>
            {/* Top Banner */}
            <div className="top-banner">
                <p className="banner-text">Get 25% OFF on your first order. Order Now</p>
            </div>

            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg stiky-top navbar-light bg-white shadow-sm" style={{ position: "sticky" }}>
                <div className="container position-relative">

                    {/* Logo */}
                    <Link className="navbar-brand" to="/">
                        <div className="logo-circle">
                            <img src="/images/logo-white.svg" alt="Logo" className="logo-image" />
                        </div>
                        <span className="logo-text fw-bold">Ecommerce</span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mobileMenu"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Desktop Menu */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
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
                                <ul className="dropdown-menu shadow-lg border-0">
                                    {categories.map((cat) => (
                                        <li key={cat}>
                                            <Link
                                                className="dropdown-item"
                                                to={`/search?category=${encodeURIComponent(cat)}`}
                                            >
                                                {cat}
                                            </Link>
                                        </li>
                                    ))}
                                    <li><Link className="dropdown-item text-danger fw-bold" to="/search">View All Categories →</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact">Contact</Link>
                            </li>
                        </ul>

                        {/* For Desktop */}
                        <div className="navbar-actions d-none d-lg-flex align-items-center gap-5">
                            <div className="search-box">
                                <i className="bi bi-search" onClick={handleSearch} style={{ cursor: 'pointer' }}></i>
                                <input
                                    type="text"
                                    placeholder="Search products"
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        console.log(`Search Query Value: ${searchQuery}`);

                                        setSearchQuery(e.target.value)
                                    }}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <button className="icon-btn cart-btn position-relative" onClick={handleCartClick}>
                                <i className="bi bi-cart fs-4"></i>
                                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                            </button>
                            {user ? (
                                <button className="icon-btn user-btn user-btn-with-name d-flex wrap align-items-center gap-2" onClick={handleProfileClick}>
                                    <img
                                        src={userImage}
                                        alt="Profile"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '2px solid #fff',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}
                                    />
                                    <span className="user-name">
                                        <span className="first-name">{user.name.split(' ')[0]}</span>
                                        {user.name.split(' ').length > 1 && (
                                            <span className="rest-name">{user.name.split(' ').slice(1).join(' ')}</span>
                                        )}
                                    </span>
                                </button>
                            ) : (
                                <button className="icon-btn user-btn" onClick={handleProfileClick}>
                                    <i className="bi bi-person-circle fs-4"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* For Mobile Only */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="mobileMenu">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold">Ecommerce</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body pt-4">

                    {/* Search in Mobile */}
                    <div className="search-box mb-4">
                        <i className="bi bi-search" onClick={handleSearch} style={{ cursor: 'pointer' }}></i>
                        <input type="text"
                            placeholder="Search products..."
                            className="search-input w-100"
                            value={searchQuery}
                            onChange={(e) => {
                                console.log(`Search Query Value: ${searchQuery}`);

                                setSearchQuery(e.target.value)
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    {/* Mobile Nav Links */}
                    <ul className="list-unstyled">
                        <li className="mb-3"><Link className="text-dark fs-5 text-decoration-none" to="/">Home</Link></li>
                        <li className="mb-3"><Link className="text-dark fs-5 text-decoration-none" to="/search">Categories</Link></li>
                        <li className="mb-3"><Link className="text-dark fs-5 text-decoration-none" to="/about">About</Link></li>
                        <li className="mb-3"><Link className="text-dark fs-5 text-decoration-none" to="/contact">Contact</Link></li>
                    </ul>

                    <hr className="my-4" />

                    {/* Cart & Account in Mobile */}
                    <div className="d-flex flex-column gap-3">
                        <button className="btn btn-outline-dark py-3 d-flex align-items-center justify-content-between" onClick={handleCartClick}>
                            <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-cart"></i>
                                <span>My Cart</span>
                            </div>
                            {totalItems > 0 && <span className="badge bg-dark">{totalItems}</span>}
                        </button>

                        {user ? (
                            <button className="btn btn-dark py-3" onClick={handleProfileClick}>
                                <img
                                    src={userImage}
                                    alt="Profile"
                                    style={{
                                        width: '40px',
                                        marginRight: "10px",
                                        height: '40px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #fff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                    }}
                                />
                                {user.name}'s Account
                            </button>
                        ) : (
                            <button className="btn btn-outline-dark py-3" onClick={handleProfileClick}>
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Login / Register
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;

