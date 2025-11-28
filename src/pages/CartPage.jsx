import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CartPage.css';

function CartPage() {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        clearCart,
    } = useCart();
    const navigate = useNavigate();

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.033; // 3.3% tax
    const total = subtotal + tax;

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            return;
        }
        navigate('/checkout');
    };

    return (
        <div className="cart-page">
            <Header />
            
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <div className="container">
                    <span>Ecommerce</span>
                    <span className="separator"> &gt; </span>
                    <span>Cart</span>
                </div>
            </div>

            {/* Page Title */}
            <div className="page-title-section">
                <div className="container">
                    <h1 className="page-title">Cart</h1>
                </div>
            </div>

            <div className="container cart-content">
                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <i className="bi bi-cart-x"></i>
                        <h2>Your cart is empty</h2>
                        <p>Add some items to your cart before checkout</p>
                        <Link to="/search" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="row">
                        {/* Cart Items Section */}
                        <div className="col-lg-8">
                            <div className="cart-items-section">
                                <h3 className="section-title">Your cart</h3>
                                <div className="cart-items-list">
                                    {cartItems.map((item, index) => (
                                        <div key={item.id}>
                                            <div className="cart-item">
                                                <div className="cart-item-image">
                                                    <img
                                                        src={item.thumbnail || item.images?.[0] || '/placeholder.jpg'}
                                                        alt={item.title}
                                                    />
                                                </div>
                                                <div className="cart-item-details">
                                                    <h5 className="cart-item-title">{item.title}</h5>
                                                    <div className="cart-item-attributes">
                                                        <span className="attribute">
                                                            Color: <span className="color-dot" style={{ backgroundColor: '#28a745' }}></span>
                                                        </span>
                                                        <span className="attribute">
                                                            Size: M
                                                        </span>
                                                    </div>
                                                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="cart-item-controls">
                                                    <div className="quantity-controls">
                                                        <button
                                                            onClick={() => decreaseQuantity(item.id)}
                                                            className="quantity-btn"
                                                        >
                                                            <i className="bi bi-dash"></i>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            readOnly
                                                            className="quantity-input"
                                                        />
                                                        <button
                                                            onClick={() => increaseQuantity(item.id)}
                                                            className="quantity-btn"
                                                        >
                                                            <i className="bi bi-plus"></i>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="remove-btn"
                                                    >
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            {index < cartItems.length - 1 && <div className="item-divider"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="col-lg-4">
                            <div className="order-summary">
                                <h3 className="section-title">Order Summary</h3>
                                <div className="summary-details">
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
                                    <div className="summary-row total">
                                        <span>Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="summary-actions">
                                    <button
                                        onClick={handleCheckout}
                                        className="btn btn-primary checkout-btn"
                                    >
                                        Checkout
                                    </button>
                                    <Link
                                        to="/search"
                                        className="btn btn-outline-secondary continue-shopping-btn"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default CartPage;

