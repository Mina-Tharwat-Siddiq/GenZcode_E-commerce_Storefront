import { toast } from "react-toastify";
import api from "../../api";
import DataTable from "../../components/Table";
import { useCustomers } from "../../context/CustomersContext";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AdminsPage() {
    const {
        admins,
        loading,
        limit,
        editModal,
        editingUser,
        setEditModal,
        setEditingUser,
        currentPage,
        fetchAdmins,
        setAdmins,
        deleteCustomer,
        totalCustomers,
        openEditModal,
        handleUpdateUser,
        handleDeleteUser
    } = useCustomers();
    const { user: currentUser } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: '',
        phone: null,
        dateOfBirth: null
    });

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newAdmin,
                role: 'admin'
            };

            const res = await api.post('/auth/register-admin', payload);


            setAdmins(prev => [res.data.user, ...prev]);

            toast.success("Admin added successfully!");
            setShowAddModal(false);
            setNewAdmin({ name: '', email: '', password: '', phone: null, dateOfBirth: null });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create admin");
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const renderRow = {
        header: () => (
            <>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date Of Birth</th>
                <th>Actions</th>
            </>
        ),
        body: (admin, index) => (
            <tr key={admin._id}>
                <td>#{(currentPage - 1) * limit + index + 1}</td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.phone || '-'}</td>
                <td>{admin.dateOfBirth ? new Date(admin.dateOfBirth).toLocaleDateString() : '-'}</td>
                <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                        {/* Edit Button */}
                        <button
                            onClick={() => openEditModal(admin)}
                            className="btn btn-warning btn-sm rounded-pill px-3"
                            title="Edit User"
                        >
                            Edit
                        </button>

                        {/* Delete Button */}
                        {admin._id !== currentUser?.id && (
                            <button
                                onClick={() => handleDeleteUser(admin._id)}
                                className="btn btn-danger btn-sm rounded-pill px-3"
                                title="Delete User"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                            
                        )}
                    </div>
                </td>
            </tr>
        )
    };

    return (
        <div>
            <DataTable
                title="Admins"
                data={admins}
                renderRow={renderRow}
                loading={loading}
                showSearch={true}
                totalItems={totalCustomers}
                limit={limit}
                currentPage={currentPage}
                onPageChange={fetchAdmins}
                showAddButton={true}
                addButtonText="Add New Admin"
                onAddClick={() => setShowAddModal(true)}
            />

            {showAddModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-lg">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-shield-lock me-2"></i>
                                    Add New Admin
                                </h5>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-close btn-close-white"
                                ></button>
                            </div>
                            <form onSubmit={handleAddAdmin}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                required
                                                value={newAdmin.name}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                required
                                                value={newAdmin.email}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                required
                                                minLength="6"
                                                value={newAdmin.password}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Phone (optional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newAdmin.phone}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Date of Birth (optional)</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={newAdmin.dateOfBirth}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success px-4">
                                        <i className="bi bi-check2"></i> Create Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {editModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User</h5>
                                <button onClick={() => setEditModal(false)} className="btn-close"></button>
                            </div>
                            <form onSubmit={handleUpdateUser}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Name"
                                        value={editingUser?.name || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        className="form-control mb-3"
                                        placeholder="Email"
                                        value={editingUser?.email || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Phone"
                                        value={editingUser?.phone || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                    />
                                    <select
                                        className="form-select mb-3"
                                        value={editingUser?.role || 'client'}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    >
                                        <option value="client">Client</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminsPage;