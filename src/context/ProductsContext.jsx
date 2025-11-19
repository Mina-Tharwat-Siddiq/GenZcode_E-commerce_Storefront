import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

const ProductsContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts(){
    return useContext(ProductsContext);
}
export function ProductsProvider({children}) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 20;
    
    // Method To Get All Products
    const fetchProducts = async(page = 1)=>{
        setLoading(true);
        try{
            const skip = (page - 1) * limit;
            const res = await api.get(`/products?limited=${limit}&skip=${skip}`);
            setProducts(res.data.products);
            setTotalProducts(res.data.total);
            setCurrentPage(page);
        }catch(e){
            toast.error("Products Not Found");
        }finally{
            setLoading(false);
        }
    }
    // Method To Add Product
    const addProduct = async(newProduct)=>{
        try {
            const res = await api.post('/products/add',newProduct);
            setProducts(pre => [...pre, res.data]);
            toast.success("The product has been added successfully");
        } catch (e) {
            toast.error("Faild To Product");
            throw e;
        }
    }
    // Upadte Specific Product
    const updateProduct = async(id,productData)=>{
        try {
            const res = await api.put(`/products/${id}`,productData);
            setProducts(pre => pre.map(prod => prod.id == id? res.data: prod));
            toast.success("Product has been updated successfully");
        } catch (e) {
            toast.error("Faild to update product");
            throw e;
        }
    }
    // Delete Specific Product
    const deleteProduct = async(id)=>{
        try {
            await api.delete(`/products/${id}`);
            setProducts(pre => pre.filter(prod => prod.id != id));
            toast.success("Product has been deleted successfully");
        } catch (e) {
            toast.error("Faild to delete product");
        }
    }

    useEffect(()=>{
        fetchProducts();
    },[]);

    return(
        <ProductsContext.Provider value={{
            products,
            loading,
            currentPage,
            totalProducts,
            limit,
            fetchProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;