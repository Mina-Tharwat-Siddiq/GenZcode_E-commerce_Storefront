import DataTable from "../../components/Table.jsx";
import { useProducts } from "../../context/ProductsContext.jsx";
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
function ProductsPage() {
    const {
        products,
        loading,
        currentPage,
        totalProducts,
        limit,
        deleteProduct,
        fetchProducts,
    } = useProducts();

    const navigate = useNavigate();

    const renderRow = {
        header: () => (
            <>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Categories</th>
                <th>Action</th>
            </>
        ),
        body: (product, index) => (
            <tr key={product.id}>
                <td>{(currentPage - 1) * limit + index + 1}</td>
                <td>
                    <div className="product-img"
                        style={{ maxWidth: '40px', height: 'auto', borderRadius: '5px' }}>
                        <img src={product.thumbnail} alt={product.title} />
                    </div>
                </td>
                <td>{product.title}</td>
                <td>{product.sku || 'N/A'}</td>
                <td>${product.price}</td>
                <td>
                    <span className={`fw-semibold ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </span>
                </td>
                <td>{product.category || "Uncategorized"}</td>
                <td>
                    <div className="dropdown">
                        <button className="btn p-0 border-0 bg-transparent text-dark"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="true">...</button>
                        
                        <ul className="dropdown-menu shadow">
                            <li>
                                <Link
                                    className="dropdown-item text-info fw-medium"
                                    to={`/AdminDashboard/products/edit/${product.id}`}
                                >
                                    <i className="bi bi-pencil me-2"></i> Edit
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item text-danger fw-medium"
                                    onClick={() => deleteProduct(product.id,product)}
                                >
                                    <i className="bi bi-trash me-2"></i> Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        )
    }

    if (loading) return <div>Loading...</div>
    return (
        <>
            <DataTable
                title="Products"
                data={products}
                renderRow={renderRow}
                showAddButton={true}
                addButtonText="Add Product"
                onAddClick={() => navigate('/AdminDashboard/products/add')}
                // Pagination attributes
                totalItems={totalProducts}
                limit={limit}
                currentPage={currentPage}
                onPageChange={fetchProducts}
            />
        </>
    )
}

export default ProductsPage;