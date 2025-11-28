import DataTable from "../../components/Table";
import { useOrders } from "../../context/OrdersContext";

function OrdersPage() {
    const {
        orders, 
        currentPage, 
        totalOrders, 
        limit, 
        loading,
        fetchOrders,
        deleteOrder} = useOrders();

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
        body: (order) => (
            <tr>
                <td>{order.id}</td>
                <td>
                <div className="product-img"
                        style={{ maxWidth: '40px', height: 'auto', borderRadius: '5px' }}>
                        <img src={order.products[0].thumbnail} alt={order.title} />
                    </div>
                </td>
                <td className="fw-semibold">{order.products[0].title}</td>
                <td>{order.userName}</td>
                <td>{order.totalProducts}</td>
                <td><strong>${order.total}</strong></td>
                <td>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            if (window.confirm('Are You Sure You Want To Delete This Order')) {
                                deleteOrder(order.id);
                            }
                        }}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        ),
    };
    return(
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
    )
}


export default OrdersPage;