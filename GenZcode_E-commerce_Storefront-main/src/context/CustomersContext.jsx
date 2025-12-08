import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import AuthContext, { useAuth } from './AuthContext';
import Swal from 'sweetalert2';

const CustomersContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCustomers() {
    return useContext(CustomersContext);
}

export function CustomersProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;
    const [editModal, setEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);



    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            // const skip = (page - 1) * limit;
            const res = await api.get(`/users`,
                {
                    params: { page, limit }
                }
            );
            const allUsers = res.data.users || res.data;
            const clients = allUsers.filter(u => u.role === 'client');
            setCustomers(clients);
            setTotalCustomers(res.data.total);
            setCurrentPage(page);
        } catch (e) {
            toast.error("Falid To Get Customersssssss ");
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async (page = 1) => {
        setLoading(true);
        try {
            // const skip = (page - 1) * limit;
            const res = await api.get(`/users`,
                {
                    params: { page, limit }
                }
            );
            const allUsers = res.data.users || res.data;
            const admins = allUsers.filter(u => u.role === 'admin');
            setAdmins(admins);
            setTotalCustomers(res.data.total);
            setCurrentPage(page);
        } catch (e) {
            toast.error("Falid To Get Customersssssss ");
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            return;
        }
        fetchCustomers(1);
    }, []);


    const openEditModal = (user) => {
        setEditingUser(user);
        setEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const confirmResult = await Swal.fire({
            title: 'Update this user?',
            text: "The changes will be applied immediately.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-success mx-2 px-4',
                cancelButton: 'btn btn-secondary mx-2 px-4',
            }
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const res = await api.put(`/users/${editingUser._id}`, editingUser);

            // Users
            setCustomers(prev => prev.map(u =>
                u._id === editingUser._id ? { ...u, ...res.data.user } : u
            ));

            // Admins
            setAdmins(prev => prev.map(a =>
                a._id === editingUser._id ? { ...a, ...res.data.user } : a
            ));

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `${editingUser.role === 'admin' ? 'Admin' : 'Customer'} updated successfully.`,
                timer: 2000,
                showConfirmButton: false,
                background: '#d4edda',
                color: '#155724',
                toast: true,
                position: 'center-top'
            });

            setEditModal(false);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: error.response?.data?.message || 'Something went wrong',
                confirmButtonText: 'OK',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-danger px-4'
                }
            });
        }
    };

    // Delete User with SweetAlert
    const handleDeleteUser = async (userId) => {

        const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');

        if (!currentUser?.id) {
            toast.error("Authentication error");
            return;
        }

        if (userId === currentUser._id) {
            toast.error("You cannot delete your own account!", {
                icon: 'Forbidden',
                position: 'top-center',
                autoClose: 4000,
                style: { background: '#dc3545', color: 'white' }
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Delete this user?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-danger mx-2 px-4',
                cancelButton: 'btn btn-secondary mx-2 px-4',
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${userId}`);

                setCustomers(prev => prev.filter(u => u._id !== userId));

                setAdmins(prev => prev.filter(admin => admin._id !== userId));
                
                Swal.fire({
                    icon: 'success',
                    title: "Delete successfully.",
                    text: "User deleted successfully.",
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
        <CustomersContext.Provider value={{
            customers,
            admins,
            loading,
            currentPage,
            totalCustomers,
            limit,
            editModal,
            editingUser,
            setEditModal,
            setEditingUser,
            fetchCustomers,
            fetchAdmins,
            setAdmins,
            openEditModal,
            handleUpdateUser,
            handleDeleteUser
        }}>
            {children}
        </CustomersContext.Provider>
    );
}