import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import './OrdersPage.css';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // ←←← الجديد: Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);

    const fetchOrders = async (page = 1) => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/orders?page=${page}&limit=10`);
            // console.log(response.data);

            const { orders: fetchedOrders, pagination } = response.data;

            const realOrders = Array.isArray(fetchedOrders) ? fetchedOrders : response.data.orders || [];

            if (realOrders.length === 0) {
                setOrders([]);
                setTotalPages(1);
                return;
            }


            const getUserDisplayStatus = (status) => {
                // نحولها كلها لـ lowercase ونزيل المسافات من الأول والآخر
                const s = (status || "").toString().trim().toLowerCase();

                if (s.includes("pend")) return "Processing";
                if (s.includes("process") || s.includes("ship")) return "On The Way";
                if (s.includes("deliver") || s === "done") return "Delivered";
                if (s.includes("cancel") || s.includes("refund")) return "Canceled";

                return "Processing"; // default
            };

            const displayOrders = realOrders.flatMap(order =>
                (order.items || []).map(item => ({
                    id: `${order._id}-${item.product?._id || item._id}`,
                    product: item.product || {
                        title: 'Deleted product',
                        images: [],
                        thumbnail: '/placeholder.jpg'
                    },
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                    orderDate: order.createdAt || new Date(),
                    status: getUserDisplayStatus(order.status),
                    total: (item.price || 0) * (item.quantity || 1)
                }))
            );

            setOrders(displayOrders);

            // Save pagination data in states
            if (pagination) {
                setCurrentPage(pagination.currentPage);
                setTotalPages(pagination.totalPages || 1);
                setHasNext(pagination.hasNext || false);
                setHasPrev(pagination.hasPrev || false);
            }

        } catch (err) {
            console.error("Failed to fetch orders: ", err.response?.data || err.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1); // We always start from the first page.
    }, [user]);

    //  navigate between pages
    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        fetchOrders(page);
    };

    if (loading) {
        return (
            <div className="orders-page">
                <h2 className="page-heading">Orders</h2>
                <div className="empty-orders">
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <h2 className="page-heading">Orders</h2>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <i className="bi bi-cart-x"></i>
                    <p>You have no orders yet</p>
                </div>
            ) : (
                <>
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.id} className="order-item">
                                <div className="order-item-image">
                                    <img
                                        src={order.product.image || order.product.images?.[0] || order.product.thumbnail || '/placeholder.jpg'}
                                        alt={order.product.title}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                </div>
                                <div className="order-item-details">
                                    <h5 className="order-item-title">{order.product.title}</h5>
                                    <p className="order-item-date">
                                        Ordered On: {new Date(order.orderDate).toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="order-item-price">${order.total.toFixed(2)}</p>
                                    <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="order-item-actions">
                                    <button
                                        onClick={() => navigate(`/product/${order.product._id}`)}
                                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-500 transition"
                                    >
                                        View Item
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={!hasPrev}
                                className={`px-6 py-3 rounded-lg font-medium transition ${hasPrev
                                    ? 'bg-black text-white hover:bg-gray-900'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Previous
                            </button>

                            <span className="text-lg font-semibold text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={!hasNext}
                                className={`px-6 py-3 rounded-lg font-medium transition ${hasNext
                                    ? 'bg-black text-white hover:bg-gray-900'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default OrdersPage;