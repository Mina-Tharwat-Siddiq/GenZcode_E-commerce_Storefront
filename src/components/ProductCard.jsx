import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    const inWishlist = isInWishlist(product.id);

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div 
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="product-image-container">
                <Link to={`/product/${product.id}`} className="product-image-link">
                    <img 
                        src={product.thumbnail || (product.images && product.images.length > 0 ? product.images[0] : null) || '/placeholder.jpg'} 
                        alt={product.title}
                        className="product-image"
                        onError={(e) => {
                            // إذا فشلت الصورة، استخدم placeholder
                            e.target.src = '/placeholder.jpg';
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
            <Link to={`/product/${product.id}`} className="product-info-link">
                <div className="product-info">
                    <h5 className="product-title">{product.title}</h5>
                    <div className="product-info-footer">
                        <span className="product-status-inline">
                            {product.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                        <p className="product-price">${product.price}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductCard;

