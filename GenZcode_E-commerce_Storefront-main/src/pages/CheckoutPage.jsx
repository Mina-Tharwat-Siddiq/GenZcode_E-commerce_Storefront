import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CheckoutPage.css';
import api from '../api';
import AuthContext from '../context/AuthContext';
function CheckoutPage() {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null);
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        fullName: '',
    });

    useEffect(() => {
    const saved = localStorage.getItem('user_addresses');

    if (saved) {
        try {
            const addresses = JSON.parse(saved);

            if (Array.isArray(addresses) && addresses.length > 0) {
                const addr = addresses[0]; 

                setFormData({
                    fullName: addr.fullName || '',
                    email: addr.email || user?.email || '',
                    phone: addr.phone || '',
                    streetAddress: addr.streetAddress || addr.address || '',
                    city: addr.city || '',
                    state: addr.state || addr.governorate || '',
                    zipCode: addr.zipCode || addr.postalCode || '',
                    country: addr.country || 'Egypt',
                });
                return;
            }

            if (addresses && typeof addresses === 'object') {
                setFormData({
                    fullName: addresses.fullName || '',
                    email: addresses.email || user?.email || '',
                    phone: addresses.phone || '',
                    streetAddress: addresses.streetAddress || addresses.address || '',
                    city: addresses.city || '',
                    state: addresses.state || addresses.governorate || '',
                    zipCode: addresses.zipCode || addresses.postalCode || '',
                    country: addresses.country || 'Egypt',
                });
            }
        } catch (e) {
            console.log("Address Not Found");
        }
    }
}, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        // Validate form fields

        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        for (const item of cartItems) {
            if (item.quantity > item.product.stock) {
                toast.error(
                    `${item.product.title}: Only ${item.product.stock} available (you requested ${item.quantity})`
                );

                return;
            }
        }


        const validCartItems = cartItems.filter(item =>
            item.product && (item.product._id || item.product.id)
        );

        if (cartItems.length !== validCartItems.length) {
            toast.warn('Some items were removed because they are no longer available');
        }

        if (validCartItems.length === 0) {
            toast.error('No valid items in your cart');
            return;
        }
        const orderData = {
            items: validCartItems.map(item => ({
                productId: item.product._id || item.product.id,
                quantity: item.quantity
            }))
        };

        try {
            setLoading(true);

            toast.loading('Processing your order...', { id: 'orderToast' });

            // Add Order To Database
            await api.post('/orders', orderData);

            toast.success('Order placed successfully!', { id: 'orderToast' });

            // Clear Cart
            clearCart();

            navigate('/my-account/orders');
        } catch (err) {
            console.log("err.response:", err.response);
            const message = err.response?.data?.message || 'Failed to place order';
            toast.error(message, { id: 'orderToast' });
            console.error('Order error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
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
                            <form id="checkoutForm"
                                onSubmit={handleSubmit}
                                className="shipping-form">
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
                                {cartItems.slice(0, 3).map((item, index) => {
                                    const product = item.product;
                                    const productId = product._id || product.id;

                                    return (
                                        <div key={productId} className="product-icon">
                                            <img
                                                src={product.thumbnail || product.images?.[0] || "/placeholder.jpg"}
                                                alt={product.title}
                                            />
                                        </div>
                                    );
                                })}

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
                                type="submit"
                                form="checkoutForm"
                                className="btn btn-primary place-order-btn"
                                disabled={loading || cartItems.length === 0}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
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
