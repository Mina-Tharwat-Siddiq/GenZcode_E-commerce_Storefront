import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
    return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const skipSaveRef = useRef(false);

    const getStorageKey = (usr) => {
        return usr && usr.id ? `wishlist_user_${usr.id}` : 'user_wishlist';
    };

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const loadWishlist = () => {
            try {
                if (user && user.id) {
                    const anon = localStorage.getItem('user_wishlist');
                    const userKey = getStorageKey(user);
                    const userSaved = localStorage.getItem(userKey);
                    let userList = userSaved ? JSON.parse(userSaved) : [];

                    if (anon) {
                        const anonList = JSON.parse(anon);
                        // merge unique by id
                        const map = {};
                        userList.forEach(i => { map[i.id] = { ...i }; });
                        anonList.forEach(i => { if (!map[i.id]) map[i.id] = { ...i }; });
                        userList = Object.values(map);

                        localStorage.setItem(userKey, JSON.stringify(userList));
                        localStorage.removeItem('user_wishlist');
                    }

                    setWishlistItems(userList);
                } else {
                    const saved = localStorage.getItem('user_wishlist');
                    setWishlistItems(saved ? JSON.parse(saved) : []);
                }
            } catch (e) {
                console.error('Error loading wishlist:', e);
            }
        };

        loadWishlist();
    }, [user]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        try {
            if (skipSaveRef.current) {
                skipSaveRef.current = false;
                return;
            }
            const key = getStorageKey(user);
            localStorage.setItem(key, JSON.stringify(wishlistItems));
        } catch (e) {
            console.error('Error saving wishlist:', e);
        }
    }, [wishlistItems, user]);

    const ensureAuthenticated = () => {
        if (!user) {
            toast.info("Please login to continue", {
                position: "top-center",
                autoClose: 1500,
            });
            navigate("/login");
            return false;
        }
        return true;
    };

    // Add item to wishlist
    const addToWishlist = (product) => {
        if (!ensureAuthenticated()) return;
        setWishlistItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                toast.info(`${product.title} is already in your wishlist`);
                return prevItems;
            } else {
                toast.success(`${product.title} added to wishlist!`);
                return [...prevItems, product];
            }
        });
    };

    // Remove item from wishlist
    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => {
            const item = prevItems.find(i => i.id === productId);
            if (item) {
                toast.success(`${item.title} removed from wishlist`);
            }
            return prevItems.filter(item => item.id !== productId);
        });
    };

    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    // Get total items count
    const getTotalItems = () => {
        return wishlistItems.length;
    };

    // Clear wishlist
    const clearWishlist = () => {
        setWishlistItems([]);
        toast.success('Wishlist cleared');
    };

    // Clear wishlist in UI only (do not persist empty list)
    const clearWishlistNoSave = () => {
        skipSaveRef.current = true;
        setWishlistItems([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                getTotalItems,
                clearWishlist,
                clearWishlistNoSave,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export default WishlistProvider;

