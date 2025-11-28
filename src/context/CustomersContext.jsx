import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const CustomersContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCustomers() {
    return useContext(CustomersContext);
}

export function CustomersProvider({ children }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const limit = 20;
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            const res = await api.get(`/users?limit=${limit}&skip=${skip}`);

            setCustomers(res.data.users);
            setTotalCustomers(res.data.total);
            setCurrentPage(page);
        } catch (e) {
            toast.error("Falid To Get Customers ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(1);
    }, []);

    return (
        <CustomersContext.Provider value={{
            customers,
            loading,
            currentPage,
            totalCustomers,
            limit,
            fetchCustomers
        }}>
            {children}
        </CustomersContext.Provider>
    );
}