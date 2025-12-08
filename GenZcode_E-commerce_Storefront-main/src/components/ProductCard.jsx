import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
    };




    const inWishlist = isInWishlist(product._id);

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div
            className="product-card mb-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-image-container bg-orange-100 d-flex align-items-center justify-content-center"
                style={{ height: '280px' }}>
                <Link to={`/product/${product._id}`} className="product-image-link d-block ص-100 h-100">
                    <img
                        src={product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : null) || '/placeholder.jpg'}
                        alt={product.title}
                        className="product-image w-100 h-100 object-fit-contain p-4"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/600x400.png';
                        }}
                        loading="lazy"
                    />
                </Link>
                <button
                    className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                    onClick={handleWishlistClick}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <i className={inWishlist ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
                </button>
                <div className="product-status">
                    {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                </div>
                {isHovered && product.stock > 0 && (
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                    >
                        <i className="bi bi-cart-plus"></i>
                        Add to Cart
                    </button>
                )}
            </div>
            <Link to={`/product/${product._id}`} className="product-info-link">
                <div className="product-info">
                    <h5 className="product-title">{product.title}</h5>

                    <div className="product-info-footer">
                        <span className="product-status-inline">
                            {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>

                        <p className="product-price">
                            ${product.price}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;

