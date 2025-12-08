import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import Swal from 'sweetalert2';

function ReviewsManagement() {
    const { id } = useParams(); // productId
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/products/${id}/reviews`);
            setReviews(res.data.reviews || []);
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (reviewId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/products/${id}/reviews/${reviewId}`);

            toast.success("Review Deleted Successfully");
            fetchReviews();

        } catch (e) {
            const message = e.response?.data?.message || "Failed To Delete Review";
            toast.error(message);
        }
    };

    if (loading) return <div className="text-center py-5">...Loading</div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Reviews </h2>
                <button className="btn btn-secondary" onClick={() => navigate('/AdminDashboard/products')}>
                    Back
                </button>
            </div>

            {reviews.length === 0 ? (
                <div className="alert alert-info">There are no reviews for this product yet</div>
            ) : (
                <div className="row">
                    {reviews.map(review => (
                        <div key={review._id} className="col-md-6 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5>{review.reviewerName}</h5>
                                        <span className="text-warning">★ {review.rating}</span>
                                    </div>
                                    <small className="text-muted">{new Date(review.date).toLocaleDateString('en-GB')}</small>
                                    <p className="mt-3">{review.comment}</p>
                                </div>
                                <div className="card-footer bg-white">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(review._id)}
                                    >
                                        Delete Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewsManagement;