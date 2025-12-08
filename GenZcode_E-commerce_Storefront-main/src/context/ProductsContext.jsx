import { createContext, useContext, useEffect, useState } from "react";
import { productsAPI } from "../api";
import { toast } from "react-toastify";
import AuthContext from "./AuthContext";
import Swal from "sweetalert2";

const ProductsContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
    return useContext(ProductsContext);
}

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 20;
    const { user } = useContext(AuthContext);

    // Method To Get All Products (Clothing Only)
    // const fetchProducts = async (page = 1, searchQuery = '') => {
    //     try {
    //         setLoading(true);
    //         const { data } = await productsAPI.getAll({
    //             limit: limit,
    //             page: page
    //         });
    //         setProducts(data.products);
    //     } catch (e) {
    //         toast.error("Failed to load products",
    //             {
    //                 position: "top-center",
    //                 autoClose: 2000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //             }
    //         );
    //         console.error(e);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const fetchProducts = async (page = 1, searchQuery = '') => {
        setLoading(true);
        try {
            let url = `/products?page=${page}&limit=${limit}`;
            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }
            const res = await productsAPI.getAll(url);
            setProducts(res.data.products);
            setTotalProducts(res.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    // Method To Add Product
    const addProduct = async (newProduct) => {
        try {
            const { data } = await productsAPI.create(newProduct);
            const addedProduct = data.product;
            console.log(addedProduct);
            setProducts(pre => [...pre, addedProduct]);
            // Refresh All Products
            // fetchProducts();
            toast.success("The product has been added successfully");
            return { success: true };
        } catch (e) {
            toast.error("Failed To Add Product");
            // Refresh Products Data
            fetchProducts(currentPage);  
            return { success: false, error: e.response?.data?.message || 'Failed To Add Product' };
        }
    }


    // Upadte Specific Product
    const updateProduct = async (id, productData) => {
        try {
            const { data } = await productsAPI.update(id, productData);
            setProducts(pre => pre.map(prod => prod.id === id ? data.product : prod));
            toast.success("Product has been updated successfully");
            // Refresh Products Data
            fetchProducts(currentPage);   
            return { success: true };
        } catch (e) {
            toast.error("Faild to update product");
            return { success: false, error: e.response?.data?.message };
        }
    }
    // Delete Specific Product
    const deleteProduct = async (id) => {
    const result = await Swal.fire({
        title: 'Delete this product?',
        text: "This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        buttonsStyling: false,
        customClass: {
            popup: 'shadow-lg',
            confirmButton: 'btn btn-danger px-4 mx-2',
            cancelButton: 'btn btn-secondary px-4 mx-2',
        },
        width: '480px',
    });

    if (!result.isConfirmed) return { success: false }

    try {
        await productsAPI.delete(id);

        setProducts(prev => prev.filter(prod => prod._id !== id));

        toast.success("Product deleted successfully");

        return { success: true };
    } catch (e) {
        toast.error("Failed to delete product");
        return { success: false, error: 'Failed to delete product' };
    }
};

    // Get Single Product
    const getProduct = async (id) => {
        try {
            const { data } = await productsAPI.getById(id);
            return data;
        } catch (e) {
            toast.error("Product not found");
        }
    }


    return (
        <ProductsContext.Provider value={{
            products,
            loading,
            currentPage,
            totalProducts,
            limit,
            setLoading,
            setProducts,
            setTotalProducts,
            fetchProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            getProduct,
        }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;