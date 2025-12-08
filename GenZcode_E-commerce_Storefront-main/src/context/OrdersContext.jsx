import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import AuthContext from "./AuthContext";

const OrdersContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export function useOrders() {
    return useContext(OrdersContext);
}
export function OrdersProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const limit = 20;

    // Get All Orders
    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get('/orders', {
                params: { page, limit }
            });

            fetchOrders(currentPage);

            const orders = res.data.orders;
            const total = res.data.pagination.totalItems;

            const formattedOrders = orders.map(order => ({
                _id: order._id,
                userName: order.user?.name || 'Unknown User',
                status: order.status || 'Pending',
                total: order.totalAmount || order.total,
                totalProducts: order.items?.length || 0,
                profileImage: order.user?.profileImage,
                products: order.items?.map(item => ({
                    title: item.product?.title || 'Deleted Product',
                    thumbnail: item.product?.thumbnail || item.product?.images?.[0] || '/placeholder.jpg'
                })) || []
            }));

            setOrders(formattedOrders);
            setTotalOrders(total);
            setCurrentPage(page);

        } catch (e) {
            // toast.error("Failed to load orders");
            setOrders([]);
            setTotalOrders(0);
        } finally {
            setLoading(false);
        }
    };

    // Use Effect To Get All Orders
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            return;
        }
        fetchOrders(1);
    }, [])
    // Update Order
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });

            fetchOrders(currentPage);

            setOrders(prev => prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `Status updated successfully.`,
                timer: 2000,
                showConfirmButton: false,
                background: '#d4edda',
                color: '#155724',
                toast: true,
                position: 'center-top'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update!',
                text: `Status updated failed.`,
                timer: 2000,
                showConfirmButton: false,
                background: '#d4edda',
                color: '#155724',
                toast: true,
                position: 'center-top'
            });
            console.error(error);
        }
    };
    // Delete Order
    const deleteOrder = async (orderId) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this request?",
            html: `
            <div style="font-size: 1.1rem; color: #666; margin: 15px 0;">
                order number <strong style="color: #ff8c42;">#${orderId.slice(-6)}</strong> It will be deleted permanently<br>
                customer <small style="color: #999;"> ${orders.find(o => o.id === orderId)?.name || "Undefined"}</small>
            </div>
        `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, delete.",
            cancelButtonText: "No",
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                popup: 'shadow-lg',
                confirmButton: 'btn btn-danger px-4 mx-2',
                cancelButton: 'btn btn-secondary px-4 mx-2',
            },
            width: '480px',
            background: '#fff',
            backdrop: 'rgba(0,0,0,0.7)',
            allowOutsideClick: false,
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/orders/${orderId}`);

                setOrders(prev => prev.filter(order => order.id !== orderId));

                Swal.fire({
                    icon: 'success',
                    title: "Delete successfully.",
                    text: "Order deleted successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#d4edda',
                    color: '#155724',
                });

            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: "Failed to delete",
                    text: "There was a problem, try again",
                    confirmButtonText: 'Done',
                });
            }
        }
    };

    return (
        <OrdersContext.Provider value={{
            orders,
            loading,
            currentPage,
            totalOrders,
            limit,
            fetchOrders,
            updateOrderStatus,
            deleteOrder,
        }}>
            {children}
        </OrdersContext.Provider>
    )
}


export default OrdersContext;