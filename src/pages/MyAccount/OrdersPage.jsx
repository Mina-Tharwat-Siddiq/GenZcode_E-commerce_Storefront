import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './OrdersPage.css';

function OrdersPage() {
    const { cartItems } = useCart();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Load orders from localStorage
        const savedOrders = localStorage.getItem('user_orders');
        if (savedOrders) {
            const parsedOrders = JSON.parse(savedOrders);
            // Transform orders to display format
            const displayOrders = parsedOrders.flatMap(order => 
                order.items.map(item => ({
                    id: `${order.id}-${item.id}`,
                    product: item,
                    orderDate: order.orderDate,
                    status: order.status,
                    total: item.price * item.quantity
                }))
            );
            setOrders(displayOrders);
        }
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    return (
        <div className="orders-page">
            <h2 className="page-heading">Orders</h2>
            
            {orders.length === 0 ? (
                <div className="empty-orders">
                    <i className="bi bi-cart-x"></i>
                    <p>You have no orders yet</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-item">
                            <div className="order-item-image">
                                <img
                                    src={order.product.thumbnail || order.product.images?.[0] || '/placeholder.jpg'}
                                    alt={order.product.title}
                                />
                            </div>
                            <div className="order-item-details">
                                <h5 className="order-item-title">{order.product.title}</h5>
                                <p className="order-item-date">Ordered On: {order.orderDate || formatDate(order.orderDate)}</p>
                                <p className="order-item-price">${order.total.toFixed(2)}</p>
                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-item-actions">
                                <button className="view-item-btn">View item</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdersPage;

