import DataTable from '../../components/Table';
import { useCustomers } from '../../context/CustomersContext';

function CustomersPage() {
    const {
        customers,
        loading,
        currentPage,
        totalCustomers,
        limit,
        fetchCustomers
    } = useCustomers();

    const renderRow = {
        header: () => (
            <>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
            </>
        ),
        body: (customer) => (
            <tr>
                <td>{customer.id}</td>
                <td>
                    <div className="fw-semibold">{customer.firstName} {customer.lastName}</div>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address?.city || ' Undefined'}</td>
            </tr>
        ),
    };

    return (
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
    );
}

export default CustomersPage;