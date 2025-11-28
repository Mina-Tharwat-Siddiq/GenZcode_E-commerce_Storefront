import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const {
        cartItems,
        isCartOpen,
        closeCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        clearCart,
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <>
            <div className="cart-overlay" onClick={closeCart}></div>
            <div className="cart-sidebar">
                <div className="cart-header">
                    <h5>Shopping Cart</h5>
                    <button className="close-cart-btn" onClick={closeCart}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <i className="bi bi-cart-x"></i>
                            <p>Your cart is empty</p>
                            <Link to="/search" onClick={closeCart} className="btn btn-primary">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            <img
                                                src={item.thumbnail || item.images?.[0] || '/placeholder.jpg'}
                                                alt={item.title}
                                            />
                                        </div>
                                        <div className="cart-item-details">
                                            <h6 className="cart-item-title">{item.title}</h6>
                                            <p className="cart-item-price">${item.price}</p>
                                            <div className="cart-item-actions">
                                                <div className="quantity-controls">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        className="quantity-btn"
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
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
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <p className="cart-item-total">
                                                Total: ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-footer">
                                <div className="cart-summary">
                                    <div className="summary-row">
                                        <span>Subtotal:</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Shipping:</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total:</span>
                                        <span>${getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="cart-actions">
                                    <Link
                                        to="/checkout"
                                        onClick={closeCart}
                                        className="btn btn-primary checkout-btn"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                    <button onClick={clearCart} className="btn btn-outline-danger clear-btn">
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Cart;

