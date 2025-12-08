import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';
import './WishlistPage.css';

function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    return (
        <div className="wishlist-page">
            <h2 className="page-heading">Wishlist</h2>
            
            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <i className="bi bi-heart"></i>
                    <p>Your wishlist is empty</p>
                    <p className="sub-text">Add items to your wishlist to save them for later</p>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="wishlist-item">
                            <button 
                                className="remove-wishlist-btn"
                                onClick={() => removeFromWishlist(item._id)}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                            <ProductCard product={item} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;

