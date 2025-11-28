import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import './ProductDetailsPage.css';

// Helper function to format date as "X AGO"
function formatTimeAgo(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'JUST NOW';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'MINUTE' : 'MINUTES'} AGO`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'HOUR' : 'HOURS'} AGO`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'DAY' : 'DAYS'} AGO`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} ${diffInWeeks === 1 ? 'WEEK' : 'WEEKS'} AGO`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? 'MONTH' : 'MONTHS'} AGO`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} ${diffInYears === 1 ? 'YEAR' : 'YEARS'} AGO`;
}

function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProduct, products } = useProducts();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviewsToShow, setReviewsToShow] = useState(3);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: '',
        reviewerName: user ? `${user.firstName} ${user.lastName}` : '',
        reviewerEmail: user ? user.email : ''
    });

    // Available colors and sizes (يمكن جلبها من API أو استخدام بيانات افتراضية)
    const availableColors = [
        { name: 'Light Blue', value: '#87CEEB' },
        { name: 'Light Green', value: '#90EE90' },
        { name: 'Orange', value: '#FFA500' },
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' }
    ];

    const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    // Load reviews from localStorage
    const loadLocalReviews = () => {
        try {
            const savedReviews = localStorage.getItem(`product_reviews_${id}`);
            return savedReviews ? JSON.parse(savedReviews) : [];
        } catch (error) {
            console.error('Error loading reviews:', error);
            return [];
        }
    };

    // Save review to localStorage
    const saveReview = (newReview) => {
        try {
            const localReviews = loadLocalReviews();
            const updatedReviews = [...localReviews, newReview];
            localStorage.setItem(`product_reviews_${id}`, JSON.stringify(updatedReviews));
            return updatedReviews;
        } catch (error) {
            console.error('Error saving review:', error);
            return [];
        }
    };

    // Merge API reviews with local reviews
    const getMergedReviews = (apiProduct) => {
        const localReviews = loadLocalReviews();
        const apiReviews = apiProduct.reviews || [];
        
        // Combine and remove duplicates based on date and reviewerName
        const allReviews = [...apiReviews, ...localReviews];
        const uniqueReviews = allReviews.filter((review, index, self) => 
            index === self.findIndex(r => 
                r.reviewerName === review.reviewerName && 
                r.date === review.date &&
                r.comment === review.comment
            )
        );
        
        // Sort by date (newest first)
        return uniqueReviews.sort((a, b) => {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return dateB - dateA;
        });
    };

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const productData = await getProduct(id);
                
                // Merge with local reviews
                const mergedReviews = getMergedReviews(productData);
                const updatedProduct = {
                    ...productData,
                    reviews: mergedReviews,
                    // Recalculate rating
                    rating: mergedReviews.length > 0 
                        ? mergedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / mergedReviews.length 
                        : productData.rating
                };
                
                setProduct(updatedProduct);
                // Set default color if available
                if (availableColors.length > 0) {
                    setSelectedColor(availableColors[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id, getProduct, navigate]);

    // Update review form when user changes
    useEffect(() => {
        if (user) {
            setReviewForm(prev => ({
                ...prev,
                reviewerName: `${user.firstName} ${user.lastName}`,
                reviewerEmail: user.email
            }));
        }
    }, [user]);

    // Fetch related products when products are available
    useEffect(() => {
        if (product && products.length > 0) {
            const related = products
                .filter(p => p.id !== product.id && p.category === product.category)
                .slice(0, 4);
            setRelatedProducts(related);
        }
    }, [product, products]);

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            addToCart(product, quantity);
        }
    };

    const handleWishlistClick = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to write a review');
            navigate('/login');
            return;
        }

        if (!reviewForm.comment.trim()) {
            toast.error('Please write a review comment');
            return;
        }

        const newReview = {
            reviewerName: reviewForm.reviewerName || 'Anonymous',
            reviewerEmail: reviewForm.reviewerEmail || '',
            rating: reviewForm.rating,
            comment: reviewForm.comment.trim(),
            date: new Date().toISOString()
        };

        if (!product) {
            toast.error('Product not found');
            return;
        }

        // Save review locally
        saveReview(newReview);
        
        // Update product state
        const mergedReviews = getMergedReviews(product);
        const newRating = mergedReviews.length > 0 
            ? mergedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / mergedReviews.length 
            : product.rating || 0;
        
        setProduct(prev => ({
            ...prev,
            reviews: mergedReviews,
            rating: newRating
        }));

        // Reset form
        setReviewForm({
            rating: 5,
            comment: '',
            reviewerName: user ? `${user.firstName} ${user.lastName}` : '',
            reviewerEmail: user ? user.email : ''
        });

        // Close modal
        setShowReviewModal(false);
        
        // Show success message
        toast.success('Review submitted successfully!');
        
        // Switch to reviews tab
        setActiveTab('reviews');
    };

    const handleStarClick = (rating) => {
        setReviewForm(prev => ({ ...prev, rating }));
    };

    if (loading) {
        return (
            <div className="product-details-page">
                <Header />
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-details-page">
                <Header />
                <div className="container py-5">
                    <div className="text-center">
                        <h2>Product not found</h2>
                        <Link to="/" className="btn btn-primary mt-3">Go to Home</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const productImages = product.images && product.images.length > 0 
        ? product.images 
        : (product.thumbnail ? [product.thumbnail] : []);

    const inWishlist = isInWishlist(product.id);

    return (
        <div className="product-details-page">
            <Header />
            
            {/* Breadcrumbs */}
            <div className="breadcrumbs-section">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/">Ecommerce</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {product.title}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Product Section */}
            <section className="product-main-section">
                <div className="container">
                    <div className="row">
                        {/* Product Images */}
                        <div className="col-lg-6">
                            <div className="product-images-container">
                                <div className="main-product-image">
                                    <img 
                                        src={productImages[selectedImageIndex] || product.thumbnail || '/placeholder.jpg'} 
                                        alt={product.title}
                                        className="product-main-img"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                </div>
                                {productImages.length > 1 && (
                                    <div className="product-thumbnails">
                                        {productImages.slice(0, 4).map((image, index) => (
                                            <button
                                                key={index}
                                                className={`thumbnail-btn ${selectedImageIndex === index ? 'active' : ''}`}
                                                onClick={() => setSelectedImageIndex(index)}
                                            >
                                                <img 
                                                    src={image} 
                                                    alt={`${product.title} ${index + 1}`}
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="col-lg-6">
                            <div className="product-details-content">
                                <h1 className="product-title">{product.title}</h1>
                                
                                <div className="product-rating-stock">
                                    <div className="product-rating">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <i 
                                                    key={i} 
                                                    className={`bi ${i < Math.floor(product.rating || 0) ? 'bi-star-fill' : 'bi-star'}`}
                                                ></i>
                                            ))}
                                        </div>
                                        <span className="rating-value">{product.rating || 0}</span>
                                        <span className="reviews-count">
                                            ({product.reviews?.length || 0} reviews)
                                        </span>
                                    </div>
                                    <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                                    </div>
                                </div>

                                <div className="product-price">
                                    ${product.price}
                                </div>

                                {/* Available Colors */}
                                <div className="product-options">
                                    <div className="option-group">
                                        <label>AVAILABLE COLORS</label>
                                        <div className="color-options">
                                            {availableColors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={`color-option ${selectedColor?.value === color.value ? 'active' : ''}`}
                                                    style={{ backgroundColor: color.value }}
                                                    onClick={() => setSelectedColor(color)}
                                                    title={color.name}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Select Size */}
                                    <div className="option-group">
                                        <label>SELECT SIZE</label>
                                        <div className="size-options">
                                            {availableSizes.map(size => (
                                                <button
                                                    key={size}
                                                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="option-group">
                                        <label>QUANTITY</label>
                                        <div className="quantity-selector">
                                            <button 
                                                className="quantity-btn"
                                                onClick={decreaseQuantity}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="number" 
                                                value={quantity} 
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    if (val >= 1 && val <= product.stock) {
                                                        setQuantity(val);
                                                    }
                                                }}
                                                min="1"
                                                max={product.stock}
                                                className="quantity-input"
                                            />
                                            <button 
                                                className="quantity-btn"
                                                onClick={increaseQuantity}
                                                disabled={quantity >= product.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="product-actions">
                                    <button 
                                        className="btn-add-to-cart"
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                    >
                                        ADD TO CART
                                    </button>
                                    <button 
                                        className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
                                        onClick={handleWishlistClick}
                                        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                        <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                    </button>
                                </div>

                                <div className="shipping-info">
                                    <i className="bi bi-truck"></i>
                                    <span>FREE SHIPPING ON ORDERS $100+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Description Section */}
            <section className="product-description-section">
                <div className="container">
                    <h2 className="section-title">Detail</h2>
                    <div className="description-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'details' && (
                            <div className="details-content">
                                <p className="product-description">
                                    {product.description || `Discover the ${product.title}, an ultimate wardrobe essential that combines style with comfort. This premium piece features meticulous attention to detail and premium quality materials, making it a versatile addition to any collection.`}
                                </p>
                                <ul className="product-features">
                                    <li>Premium Quality</li>
                                    <li>Ultimate Wardrobe Staple</li>
                                    <li>Available in Various Sizes</li>
                                    <li>Tailored Fit</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="reviews-content">
                                {/* Reviews Header */}
                                <div className="reviews-header-section">
                                    <div className="reviews-overview">
                                        <div className="overall-rating-large">
                                            {product.rating ? product.rating.toFixed(1) : '0.0'}
                                        </div>
                                        <div className="reviews-summary">
                                            <div className="reviews-separator">—</div>
                                            <div className="reviews-count-large">
                                                {product.reviews?.length || 0} {product.reviews?.length === 1 ? 'Review' : 'Reviews'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="reviews-actions">
                                        <button 
                                            className={`reviews-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('reviews')}
                                        >
                                            Reviews
                                        </button>
                                        <button 
                                            className="write-review-btn"
                                            onClick={() => {
                                                if (!user) {
                                                    toast.error('Please login to write a review');
                                                    navigate('/login');
                                                } else {
                                                    setShowReviewModal(true);
                                                }
                                            }}
                                        >
                                            Write a review
                                        </button>
                                    </div>
                                </div>

                                {/* Reviews List */}
                                {product.reviews && product.reviews.length > 0 ? (
                                    <>
                                        <div className="reviews-list">
                                            {product.reviews.slice(0, reviewsToShow).map((review, index) => (
                                                <div key={index} className="review-item">
                                                    <div className="review-item-header">
                                                        <div className="reviewer-info">
                                                            <div className="reviewer-name">{review.reviewerName || 'Anonymous'}</div>
                                                            <div className="review-date">{formatTimeAgo(review.date)}</div>
                                                        </div>
                                                        <div className="review-rating">
                                                            {[...Array(5)].map((_, i) => (
                                                                <i 
                                                                    key={i} 
                                                                    className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                                                                ></i>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="review-comment">{review.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {product.reviews.length > reviewsToShow && (
                                            <div className="load-more-reviews">
                                                <button 
                                                    className="load-more-btn"
                                                    onClick={() => setReviewsToShow(prev => prev + 3)}
                                                >
                                                    Load more reviews
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="related-products-section">
                    <div className="container">
                        <div className="section-header-related">
                            <h2 className="section-title-related">You might also like</h2>
                            <Link to="/search" className="see-all-link">SEE ALL PRODUCTS</Link>
                        </div>
                        <div className="related-products-grid">
                            {relatedProducts.map(relatedProduct => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Newsletter />
            <Footer />

            {/* Review Modal */}
            {showReviewModal && (
                <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
                    <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="review-modal-header">
                            <h2>Write a Review</h2>
                            <button 
                                className="review-modal-close"
                                onClick={() => setShowReviewModal(false)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview} className="review-form">
                            <div className="review-form-group">
                                <label>Your Rating</label>
                                <div className="star-rating-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                                            onClick={() => handleStarClick(star)}
                                            onMouseEnter={() => {
                                                // Optional: hover effect
                                            }}
                                        >
                                            <i className="bi bi-star-fill"></i>
                                        </button>
                                    ))}
                                    <span className="rating-text">
                                        {reviewForm.rating} {reviewForm.rating === 1 ? 'Star' : 'Stars'}
                                    </span>
                                </div>
                            </div>

                            <div className="review-form-group">
                                <label htmlFor="reviewerName">Your Name</label>
                                <input
                                    type="text"
                                    id="reviewerName"
                                    className="review-form-input"
                                    value={reviewForm.reviewerName}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewerName: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="review-form-group">
                                <label htmlFor="reviewerEmail">Your Email</label>
                                <input
                                    type="email"
                                    id="reviewerEmail"
                                    className="review-form-input"
                                    value={reviewForm.reviewerEmail}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewerEmail: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="review-form-group">
                                <label htmlFor="comment">Your Review</label>
                                <textarea
                                    id="comment"
                                    className="review-form-textarea"
                                    rows="5"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                    placeholder="Share your experience with this product..."
                                    required
                                ></textarea>
                            </div>

                            <div className="review-form-actions">
                                <button 
                                    type="button" 
                                    className="review-cancel-btn"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="review-submit-btn"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetailsPage;

