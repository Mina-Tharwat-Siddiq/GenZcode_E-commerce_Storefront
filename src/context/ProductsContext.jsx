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
    
    // Method To Get All Products (Clothing Only)
    const fetchProducts = async(page = 1)=>{
        setLoading(true);
        try{
            // Clothing categories from dummyjson API
            const clothingCategories = [
                'mens-shirts',
                'mens-shoes', 
                'mens-watches',
                'womens-dresses',
                'womens-shoes',
                'womens-watches',
                'womens-bags',
                'womens-jewellery',
                'sunglasses'
            ];
            
            // Fetch products from multiple clothing categories
            const allProducts = [];
            const promises = clothingCategories.map(category => 
                api.get(`/products/category/${category}?limit=100`)
                    .then(res => {
                        const products = res.data.products || [];
                        // التأكد من أن كل منتج يحتوي على صورة
                        return products.map(product => ({
                            ...product,
                            // التأكد من وجود thumbnail أو images
                            thumbnail: product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : null),
                            images: product.images || (product.thumbnail ? [product.thumbnail] : [])
                        }));
                    })
                    .catch(err => {
                        console.error(`Error fetching ${category}:`, err);
                        return [];
                    })
            );
            
            const results = await Promise.all(promises);
            results.forEach(products => {
                allProducts.push(...products);
            });
            
            // Remove duplicates based on product ID
            const uniqueProducts = allProducts.filter((product, index, self) =>
                index === self.findIndex(p => p.id === product.id)
            );
            
            // Apply pagination
            const skip = (page - 1) * limit;
            const start = skip;
            const end = start + limit;
            const paginatedProducts = uniqueProducts.slice(start, end);
            
            setProducts(paginatedProducts);
            setTotalProducts(uniqueProducts.length);
            setCurrentPage(page);
        }catch(e){
            toast.error("Products Not Found");
            console.error(e);
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

    // Get Single Product
    const getProduct = async(id)=>{
        try {
            const res = await api.get(`/products/${id}`);
            return res.data;
        } catch (e) {
            toast.error("Product not found");
            throw e;
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
            getProduct,
            }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider;