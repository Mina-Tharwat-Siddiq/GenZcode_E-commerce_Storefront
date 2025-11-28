import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { toast } from 'react-toastify';
import api from '../../api';

function AddProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addProduct, updateProduct } = useProducts();
    const isEditing = !!id;
    const [product, setProduct] = useState({
        title: '',
        price: '',
        category: '',
        sku: '',
        stock: '',
        description: '',
        thumbnail: '',
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        async function getData(){
            if (isEditing) {
                const res = await api.get(`/products/${id}`);
                const prod = await res.data;
                console.log(prod.title);
    
                setProduct({
                    title: prod.title,
                    price: prod.price,
                    category: prod.category,
                    sku: prod.sku,
                    stock: prod.stock,
                    description: prod.description,
                    thumbnail: prod.thumbnail
                })
            }
        }
        getData();
    }, [id])


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.title || !product.price || !product.category) {
            toast.error('Title, Price and Category Type!');
            return;
        }


        const productData = {
            title: product.title,
            price: parseFloat(product.price),
            category: product.category,
            sku: product.sku || null,
            stock: parseInt(product.stock) || 0,
            description: product.description,
            thumbnail: product.thumbnail,
        };

        try {
            if (isEditing) {
                const res = await api.get(`/products/${id}`);
                const prod = await res.data;
                updateProduct(prod.id, productData);
                navigate('/AdminDashboard/products');
            } else {
                await addProduct(productData);
                navigate('/AdminDashboard/products');
            }
        } catch {
            toast.error('Falid To Added Product');
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white">
                            <h4 className="mb-0">{isEditing?"Edit Product":"Add Product"}</h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    {/* Left */}
                                    <div className="col-lg-6">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            className="form-control mb-3"
                                            value={product.title}
                                            onChange={(e) => setProduct(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                        />

                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price"
                                            className="form-control mb-3"
                                            value={product.price}
                                            onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />

                                        <select
                                            className="form-select mb-3"
                                            value={product.category}
                                            onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                                            required
                                        >
                                            <option value=""> Choose Kind Of Category</option>
                                            <option value={"fragrances"}>Fragrances</option>
                                            <option value={"beauty"}>Beauty</option>
                                            <option value={"clothes"}>Clothes</option>
                                            <option value={"furniture"}>Furniture</option>
                                            <option value={"groceries"}>Groceries</option>
                                        </select>

                                        <input
                                            type="text"
                                            placeholder="SKU"
                                            className="form-control mb-3"
                                            value={product.sku}
                                            onChange={(e) => setProduct(prev => ({ ...prev, sku: e.target.value }))}
                                        />

                                        <textarea
                                            placeholder="Description"
                                            className="form-control mb-3"
                                            rows="3"
                                            value={product.description}
                                            onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>

                                    {/* Right */}
                                    <div className="col-lg-6">
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            className="form-control mb-3"
                                            value={product.stock}
                                            onChange={(e) => setProduct(prev => ({ ...prev, stock: e.target.value }))}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Image Url"
                                            className="form-control mb-3"
                                            value={product.thumbnail}
                                            onChange={(e) => setProduct(prev => ({ ...prev, thumbnail: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-dark px-5">
                                        {isEditing ? "Save" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;