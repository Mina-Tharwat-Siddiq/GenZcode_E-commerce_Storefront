import DataTable from '../../components/Table';
import { useCustomers } from '../../context/CustomersContext';

function CustomersPage() {
    const {
        customers,
        loading,
        currentPage,
        totalCustomers,
        limit,
        editModal,
        editingUser,
        setEditModal,
        setEditingUser,
        fetchCustomers,
        openEditModal,
        handleUpdateUser,
        handleDeleteUser
    } = useCustomers();

    let inputDate;
    let date;
    let day;
    let month;
    let year;

    let formattedDate;


    const renderRow = {
        header: () => (
            <>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date Of Bearth</th>
                <th>Ations</th>
            </>
        ),
        body: (customer, index) => (
            inputDate = customer.dateOfBirth,
            date = new Date(inputDate),
            day = date.getUTCDate(),
            month = date.getUTCMonth() + 1,
            year = date.getUTCFullYear(),
            formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            <tr key={customer._id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>
                    <div className="fw-semibold">{customer.name}</div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone || 0}</td>
                <td><p>{formattedDate}</p></td>
                <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                        {/* Edit Button */}
                        <button
                            onClick={() => openEditModal(customer)}
                            className="btn btn-warning btn-sm rounded-pill px-3"
                            title="Edit User"
                        >
                            Edit
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => handleDeleteUser(customer._id)}
                            className="btn btn-danger btn-sm rounded-pill px-3"
                            title="Delete User"
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
                title="Customers"
                data={customers}
                renderRow={renderRow}
                loading={loading}
                totalItems={totalCustomers}
                limit={limit}
                currentPage={currentPage}
                onPageChange={fetchCustomers}
                showAddButton={false}
                showSearch={true}
            />

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

export default CustomersPage;