// src/context/ReviewsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const ReviewsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useReviews() {
    return useContext(ReviewsContext);
}

export function ReviewsProvider({ children }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const limit = 30;
    const [currentPage, setCurrentPage] = useState(1);

    const fetchReviews = async (page = 1) => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;

            
            const res = await api.get(`/products?limit=${limit}&skip=${skip}`);
            const products = res.data.products;

            // Get All Reviews and Store in array
            const allReviews = [];
            products.forEach(product => {
                if (product.reviews && Array.isArray(product.reviews)) {
                    product.reviews.forEach(review => {
                        allReviews.push({
                            ...review,
                            productId: product.id,
                            productTitle: product.title
                        });
                    });
                }
            });

            // N Of Reviews
            const total = allReviews.length;

            // Local Pagination 
            const start = skip;
            const end = start + limit;
            const paginatedReviews = allReviews.slice(start, end);

            setReviews(paginatedReviews);
            setTotalReviews(total);
            setCurrentPage(page);
        } catch (error) {
            toast.error("Falid To Get Reviwes");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchReviews(1);
    }, []);

    // const deleteReview = (productId, reviewIndex) => {
    //   //Not Supported To Delete In Dummy Json
    //     setReviews(prev => prev.filter(r => !(r.productId === productId && prev.indexOf(r) === reviewIndex)));
    //     toast.success("تم حذف التقييم");
    // };

    return (
        <ReviewsContext.Provider value={{
            reviews,
            loading,
            currentPage,
            totalReviews,
            limit,
            fetchReviews,
        }}>
            {children}
        </ReviewsContext.Provider>
    );
}