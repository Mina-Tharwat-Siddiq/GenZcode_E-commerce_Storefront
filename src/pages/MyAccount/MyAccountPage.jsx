import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './MyAccountPage.css';

function MyAccountPage() {
    return (
        <div className="my-account-page">
            <Header />
            
            {/* Banner Section */}
            <div className="account-banner">
                <div className="container">
                    <h1 className="account-title">My Account</h1>
                    <div className="breadcrumbs">
                        <span>Ecommerce</span>
                        <span className="separator"> &gt; </span>
                        <span>My Account</span>
                    </div>
                </div>
            </div>

            <div className="container account-content">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3">
                        <div className="account-sidebar">
                            <NavLink 
                                to="/my-account/orders" 
                                className={({ isActive }) => 
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <i className="bi bi-cart"></i>
                                <span>Orders</span>
                            </NavLink>
                            <NavLink 
                                to="/my-account/wishlist" 
                                className={({ isActive }) => 
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <i className="bi bi-heart"></i>
                                <span>Wishlist</span>
                            </NavLink>
                            <NavLink 
                                to="/my-account/address" 
                                className={({ isActive }) => 
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <i className="bi bi-display"></i>
                                <span>Address</span>
                            </NavLink>
                            <NavLink 
                                to="/my-account/password" 
                                className={({ isActive }) => 
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <i className="bi bi-key"></i>
                                <span>Password</span>
                            </NavLink>
                            <NavLink 
                                to="/my-account/account-details" 
                                className={({ isActive }) => 
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <i className="bi bi-person"></i>
                                <span>Account Detail</span>
                            </NavLink>
                            <NavLink 
                                to="/my-account/logout" 
                                className={({ isActive }) => 
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                <span>Logout</span>
                            </NavLink>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        <div className="account-main-content">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default MyAccountPage;

