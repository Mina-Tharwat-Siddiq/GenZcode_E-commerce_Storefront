// src/context/ReviewsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AuthContext from './AuthContext';

const ReviewsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useReviews() {
    return useContext(ReviewsContext);
}

export function ReviewsProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const limit = 30;
    const [currentPage, setCurrentPage] = useState(1);

    const fetchReviews = async (page = 1) => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;

            const res = await api.get(`/products`, {
                params: {
                    page,
                    limit
                }
            });
            const products = res.data.products;

            // Get All Reviews and Store in array
            const allReviews = [];
            products.forEach(product => {
                if (product.reviews && Array.isArray(product.reviews)) {
                    product.reviews.forEach(review => {
                        allReviews.push({
                            ...review,
                            productId: product._id,
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
        if (!user || user.role !== 'admin') {
            return;
        }
        fetchReviews(1);
    }, []);


    const deleteReview = async (productId, reviewId) => {
        const result = await Swal.fire({
            title: 'Delete this review?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-danger mx-2 px-4',
                cancelButton: 'btn btn-secondary mx-2 px-4'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/products/${productId}/reviews/${reviewId}`);

                // Instant remove from table
                setReviews(prev => prev.filter(r => r._id !== reviewId));

                Swal.fire({
                    icon: 'success',
                    title: 'Delete!',
                    text: `Review updated successfully.`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#d4edda',
                    color: '#155724',
                    toast: true,
                    position: 'center-up'
                });
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: "Delete.",
                    text: "Failed deleted review.",
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#d4edda',
                    color: '#155724',
                });
            }
        }
    };

    return (
        <ReviewsContext.Provider value={{
            reviews,
            loading,
            currentPage,
            totalReviews,
            limit,
            fetchReviews,
            deleteReview
        }}>
            {children}
        </ReviewsContext.Provider>
    );
}