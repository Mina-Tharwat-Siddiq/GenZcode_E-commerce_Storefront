import { useEffect } from "react";
import DataTable from "../../components/Table";
import { useOrders } from "../../context/OrdersContext";
import { ToastContainer } from "react-toastify";

function OrdersPage() {
    const {
        orders,
        currentPage,
        totalOrders,
        limit,
        loading,
        fetchOrders,
        updateOrderStatus,
        deleteOrder } = useOrders();

    //     useEffect(() => {
    //     fetchOrders(currentPage);
    // }, [currentPage, fetchOrders]);

    const renderRow = {
        header: () => (
            <>
                <th>ID</th>
                <th>Image</th>
                <th>Product</th>
                <th>User</th>
                <th>Total order</th>
                <th>Total</th>
                <th>Actions</th>
            </>
        ),
        body: (order, index) => (
            <tr key={order._id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>
                    <div className="product-img"
                        style={{ maxWidth: '40px', height: 'auto', borderRadius: '5px' }}>
                        <img src={order.products[0]?.thumbnail} alt={order.products[0]?.title} />
                    </div>
                </td>
                <td className="fw-semibold">{order.products[0]?.title}</td>
                <td>
                    <td>
                        <div className="d-flex align-items-center">
                            {/* User Image */}
                            <img
                                src={order?.profileImage || 'https://via.placeholder.com/40'}
                                alt={order.userName}
                                className="rounded-circle me-3"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                                <div className="fw-semibold">{order.userName}</div>
                                <small className="text-muted">{order.user?.email}</small>
                            </div>
                        </div>
                    </td>
                </td>
                <td>{order.totalProducts}</td>
                <td><strong>${order.total.toFixed(2)}</strong></td>
                <td>
                    <div className="d-flex gap-2 align-items-center">
                        <select
                            className={`form-select form-select-sm rounded-pill fw-bold ${order.status === 'delivered' ? 'text-success' :
                                order.status === 'processing' ? 'text-warning' :
                                    order.status === 'shipped' ? 'text-info' :
                                        'text-secondary'
                                }`}
                            style={{ width: '140px', fontSize: '0.85rem' }}
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                            className="btn btn-danger btn-sm rounded-pill"
                            title="Delete Order"
                            onClick={() => deleteOrder(order._id)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        ),
    };
    return (
        <div>
            <DataTable
                title="Orders"
                data={orders}
                renderRow={renderRow}
                loading={loading}
                totalItems={totalOrders}
                limit={limit}
                currentPage={currentPage}
                onPageChange={fetchOrders}
                showAddButton={false}
                showSearch={true}
            />
        </div>
    )
}


export default OrdersPage;