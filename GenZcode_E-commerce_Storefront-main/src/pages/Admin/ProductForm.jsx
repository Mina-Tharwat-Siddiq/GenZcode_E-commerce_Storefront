import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { toast } from 'react-toastify';
import api, { productsAPI } from '../../api';

function AddProduct() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addProduct, updateProduct } = useProducts();
    const isEditing = !!id;
    const [product, setProduct] = useState({
        title: '',
        price: '',
        stock: '',
        thumbnail: '',
        description: '',
        category: 'Electronics',
        images: [],
        featured: false
    });
    const categories = [
        'Electronics', 'Groceries', 'Furniture', 'Clothing', 'Books', 'Home & Kitchen',
        'Sports', 'Beauty', 'Toys', 'Food', 'Fragrances', 'Other'
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        async function getData() {
            if (isEditing) {
                const { data } = await productsAPI.getById(id);
                console.log(data.product.title);

                setProduct({
                    title: data.product.title,
                    price: data.product.price,
                    category: data.product.category,
                    stock: data.product.stock,
                    description: data.product.description,
                    thumbnail: data.product.thumbnail,
                    images: data.product.images || [],
                    featured: data.product.featured,
                })
            }
        }
        getData();
    }, [id])

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (index, value) => {
        const newImages = [...product.images];
        newImages[index] = value;
        setProduct({ ...product, images: newImages });
    };

    const addImageField = () => {
        setProduct({ ...product, images: [...product.images, ''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!product.title || !product.price || !product.category) {
            toast.error('Title, Price and Category Type!');
            return;
        }


        const productData = {
            title: product.title,
            price: Number(product.price),
            category: product.category,
            stock: Number(product.stock) || 0,
            description: product.description,
            thumbnail: product.thumbnail,
            // Error Here in Filter ==================================>
            images: product.images?.filter(img => img.trim() !== ''),
            featured: product.featured,
        };

        try {
            if (isEditing) {
                const res = await productsAPI.getById(id);
                const prod = await res.data;
                updateProduct(id, productData);
                navigate('/AdminDashboard/products');
            } else {
                addProduct(productData);
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
                            <h4 className="mb-0">{isEditing ? "Edit Product" : "Add Product"}</h4>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    {/* Left */}
                                    <div className="col-lg-6">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            name='title'
                                            className="form-control mb-3"
                                            value={product.title}
                                            onChange={handleChange}
                                            required
                                        />

                                        <input
                                            type="number"
                                            step="0.01"
                                            name='price'
                                            placeholder="Price"
                                            className="form-control mb-3"
                                            value={product.price}
                                            onChange={handleChange}
                                            required
                                        />

                                        <select
                                            className="form-select mb-3"
                                            value={product.category}
                                            name='category'
                                            onChange={handleChange}
                                            required
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            className="form-control mb-3"
                                            name="stock"
                                            placeholder='Stock'
                                            value={product.stock}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />

                                        <textarea
                                            placeholder="Description"
                                            className="form-control mb-3"
                                            name='description'
                                            rows="3"
                                            value={product.description}
                                            onChange={handleChange}
                                        />
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="featured"
                                            name="featured"
                                            checked={product.featured || false}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="featured" style={{ fontWeight: '500' }}>
                                            Mark as Featured (Will appear in Featured section on Homepage)
                                        </label>
                                    </div>

                                    {/* Right */}
                                    <div className="col-lg-6">
                                        <input
                                            type="text"
                                            className="form-control mb-3"
                                            name="thumbnail"
                                            value={product.thumbnail}
                                            onChange={handleChange}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {/* // Error Here in map ==================================> */}
                                        {product.images?.map((img, i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                className="form-control mb-3"
                                                name='images'
                                                value={img}
                                                onChange={(e) => handleImageChange(i, e.target.value)}
                                                placeholder="images Url"
                                            />
                                        ))}
                                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addImageField}>
                                            Add Image +
                                        </button>
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