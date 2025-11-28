import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CheckoutPage.css';

function CheckoutPage() {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        fullName: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Validate form
        if (!formData.streetAddress || !formData.city || !formData.state || 
            !formData.zipCode || !formData.country || !formData.email || !formData.fullName) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Simulate payment processing
        toast.success('Processing payment...');
        
        // Save order to localStorage
        const order = {
            id: Date.now(),
            items: cartItems,
            total: total,
            subtotal: subtotal,
            tax: tax,
            shippingAddress: formData,
            orderDate: new Date().toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }),
            status: 'Processing'
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        existingOrders.unshift(order);
        localStorage.setItem('user_orders', JSON.stringify(existingOrders));
        
        setTimeout(() => {
            toast.success('Payment successful! Order placed.');
            clearCart();
            navigate('/my-account/orders');
        }, 2000);
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <Header />
                <div className="empty-checkout">
                    <i className="bi bi-cart-x"></i>
                    <h2>Your cart is empty</h2>
                    <p>Add some items to your cart before checkout</p>
                    <button onClick={() => navigate('/search')} className="btn btn-primary">
                        Continue Shopping
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.04; // 4% tax
    const total = subtotal + tax;

    return (
        <div className="checkout-page">
            <Header />
            
            {/* Banner Section */}
            <div className="checkout-banner">
                <div className="container">
                    <h1 className="checkout-title">Checkout</h1>
                    <div className="breadcrumbs">
                        <span>Ecommerce</span>
                        <span className="separator"> &gt; </span>
                        <span>Checkout</span>
                    </div>
                </div>
            </div>

            <div className="container checkout-content">
                <div className="row">
                    {/* Left Column - Shipping Address */}
                    <div className="col-lg-7">
                        <div className="shipping-section">
                            <h3 className="section-title">Shipping Address</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Full name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Your Order */}
                    <div className="col-lg-5">
                        <div className="order-section">
                            <h3 className="section-title">Your Order</h3>
                            
                            {/* Product Icons */}
                            <div className="product-icons">
                                {cartItems.slice(0, 3).map((item, index) => (
                                    <div key={item.id} className="product-icon">
                                        <img
                                            src={item.thumbnail || item.images?.[0] || '/placeholder.jpg'}
                                            alt={item.title}
                                        />
                                    </div>
                                ))}
                                {cartItems.length > 3 && (
                                    <div className="product-icon more">
                                        +{cartItems.length - 3}
                                    </div>
                                )}
                            </div>

                            <Link to="/cart" className="edit-cart-btn">
                                Edit Cart
                            </Link>

                            {/* Order Summary */}
                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div className="summary-row">
                                    <span>Tax:</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span>$ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="btn btn-primary place-order-btn"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default CheckoutPage;
