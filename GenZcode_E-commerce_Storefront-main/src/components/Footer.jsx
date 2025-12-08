import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row footer-content">
                    {/* Brand/About Column */}
                    <div className="col-md-3 col-sm-6 mb-4">
                        <div className="footer-brand">
                            <div className="logo-circle">
                                <img 
                                    src="/images/logo-black.svg" 
                                    alt="Logo" 
                                    className="logo-image"
                                />
                            </div>
                            <span className="logo-text">Ecommerce</span>
                        </div>
                        <p className="footer-description">
                            DevCut is a YouTube channel for practical project-based learning.
                        </p>
                        <div className="social-icons">
                            <Link to="https://github.com" className="social-icon" aria-label="GitHub">
                                <i className="bi bi-github"></i>
                            </Link>
                            <Link to="https://www.instagram.com" className="social-icon" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </Link>
                            <Link to="https://www.youtube.com" className="social-icon" aria-label="YouTube">
                                <i className="bi bi-youtube"></i>
                            </Link>
                        </div>
                    </div>


                    {/* Company Column */}
                    <div className="col-md-2 col-sm-6 mb-4">
                        <h6 className="footer-heading">COMPANY</h6>
                        <ul className="footer-links">
                            <li><Link to="/about">About us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Shop Column */}
                    <div className="col-md-2 col-sm-6 mb-4">
                        <h6 className="footer-heading">SHOP</h6>
                        <ul className="footer-links">
                            <li><Link to="/my-account">My Account</Link></li>
                            <li><Link to="/checkout">Checkout</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                        </ul>
                    </div>

                    {/* Accepted Payments Column */}
                    <div className="col-md-3 col-sm-6 mb-4">
                        <h6 className="footer-heading">ACCEPTED PAYMENTS</h6>
                        <div className="payment-methods">
                            <div className="payment-logo">COD</div>
                            <div className="payment-logo">VISA</div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-copyright">
                    <hr className="footer-divider" />
                    <p className="copyright-text">© 2025 DevCut. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

