import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";


const OrdersContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export function useOrders() {
    return useContext(OrdersContext);
}
export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const limit = 20;

    // Get All Orders
    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            const res = await api.get(`/carts?limit=${limit}&skip=${skip}`);
            
            const carts = res.data.carts;
            const total = res.data.total;
            

            const userIds = [...new Set(carts.map(cart=>cart.id))];
            const usersRes = await Promise.all(
                userIds.map(id => api.get(`/users/${id}`).catch(()=>null))
            );

            const usersMap = {};
            usersRes.forEach((res,ind)=>{
                if(res?.data){
                    usersMap[userIds[ind]] = `${res.data.firstName} ${res.data.lastName}`;
                }else{
                    usersMap[userIds[ind]] = `User ${userIds[ind]}`;
                }
            });

            const enrichedOrders = carts.map(order => ({
                ...order,
                userName: usersMap[order.userId] || 'Not Found'
            }));

            setOrders(enrichedOrders);
            setTotalOrders(total);
            setCurrentPage(page);
        } catch (e) {
            toast.success("Orders Not Found");
            setOrders([]);
            setTotalOrders(0);
        }finally{
            setLoading(false);
        }
    };
    // Use Effect To Get All Orders
    useEffect(()=>{
        fetchOrders(1);
    },[])
    // Delete Order
    const deleteOrder = async (id) => {
        try {
            await api.delete(`/carts/${id}`);
            setOrders(pre => pre.filter(order => order.id !== id));
            toast.success("Order Has Been Deleted Successfully.");
        } catch (e) {
            toast.error("Falid To Delete Order");
        }
    }

    return (
        <OrdersContext.Provider value={{
            orders,
            loading,
            currentPage,
            totalOrders,
            limit,
            fetchOrders,
            deleteOrder,
        }}>
            {children}
        </OrdersContext.Provider>
    )
}


export default OrdersContext;