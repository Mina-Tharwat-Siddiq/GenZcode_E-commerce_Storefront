import { useReviews } from '../../context/ReviewsContext'
import DataTable from '../../components/Table';
import { format } from 'date-fns';

function ReviewsPage() {
    const {
        reviews,
        loading,
        currentPage,
        totalReviews,
        limit,
        fetchReviews,
        deleteReview
    } = useReviews();

    const renderRow = {
        header: () => (
            <>
                <th>Product</th>
                <th>User</th>
                <th>Review</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Action</th>
            </>
        ),
        body: (review, index) => (
            <tr key={index}>
                <td>
                    <small className="text-muted">#{review.productId}</small><br />
                    <strong>{review.productTitle}</strong>
                </td>
                <td>
                    <div>{review.reviewerName}</div>
                    <small className="text-muted">{review.reviewerEmail}</small>
                </td>
                <td>
                    <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={i < review.rating ? 'text-warning' : 'text-muted'}
                            >
                                ★
                            </span>
                        ))}
                        <span className="ms-2 badge bg-primary">{review.rating}/5</span>
                    </div>
                </td>
                <td>{review.comment}</td>
                <td>{format(new Date(review.date), 'dd MMM yyyy')}</td>
                <td>
                    <button
                        className="btn btn-danger btn-sm rounded-pill"
                        title="Delete Order"
                        onClick={() => {
                            deleteReview(review.productId, review._id)
                        }}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        ),
    };

    return (
        <DataTable
            title="Reviews"
            data={reviews}
            renderRow={renderRow}
            loading={loading}
            totalItems={totalReviews}
            limit={limit}
            currentPage={currentPage}
            onPageChange={fetchReviews}
            showAddButton={false}
            showSearch={true}
        />
    );
}

export default ReviewsPage;