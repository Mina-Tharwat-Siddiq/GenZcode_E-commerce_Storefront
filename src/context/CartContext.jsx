import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const skipSaveRef = useRef(false);

    const getStorageKey = (usr) => {
        return usr && usr.id ? `cart_user_${usr.id}` : 'cart_items';
    };

    // Load cart when component mounts or when user changes
    useEffect(() => {
        const loadCart = () => {
            try {
                if (user && user.id) {
                    // If user just logged in, try to migrate anonymous cart into user cart
                    const anon = localStorage.getItem('cart_items');
                    const userKey = getStorageKey(user);
                    const userSaved = localStorage.getItem(userKey);

                    let userCart = userSaved ? JSON.parse(userSaved) : [];

                    if (anon) {
                        const anonCart = JSON.parse(anon);
                        // Merge anonCart into userCart (sum quantities by id)
                        const map = {};
                        userCart.forEach(i => { map[i.id] = { ...i }; });
                        anonCart.forEach(i => {
                            if (map[i.id]) map[i.id].quantity += i.quantity;
                            else map[i.id] = { ...i };
                        });
                        userCart = Object.values(map);

                        // Save merged to user key and remove anonymous cart
                        localStorage.setItem(userKey, JSON.stringify(userCart));
                        localStorage.removeItem('cart_items');
                    }

                    setCartItems(userCart);
                } else {
                    const saved = localStorage.getItem('cart_items');
                    setCartItems(saved ? JSON.parse(saved) : []);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        loadCart();
    }, [user]);

    // Save cart to localStorage whenever it changes (per-user key)
    useEffect(() => {
        try {
            if (skipSaveRef.current) {
                // skip this save intentionally (e.g., clear UI without persisting)
                skipSaveRef.current = false;
                return;
            }
            const key = getStorageKey(user);
            localStorage.setItem(key, JSON.stringify(cartItems));
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }, [cartItems, user]);

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

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        if (!ensureAuthenticated()) return;
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // Update quantity if item already exists
                const updatedItems = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                toast.success(`Updated quantity for ${product.title}`);
                return updatedItems;
            } else {
                // Add new item
                toast.success(`${product.title} added to cart!`);
                return [...prevItems, { ...product, quantity }];
            }
        });
        setIsCartOpen(true);
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const item = prevItems.find(i => i.id === productId);
            if (item) {
                toast.success(`${item.title} removed from cart`);
            }
            return prevItems.filter(item => item.id !== productId);
        });
    };

    // Update item quantity
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    // Increase quantity
    const increaseQuantity = (productId) => {
        updateQuantity(productId, getItemQuantity(productId) + 1);
    };

    // Decrease quantity
    const decreaseQuantity = (productId) => {
        const currentQuantity = getItemQuantity(productId);
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        } else {
            removeFromCart(productId);
        }
    };

    // Get item quantity
    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        return item ? item.quantity : 0;
    };

    // Get total items count
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared');
    };

    // Clear cart in UI but do not persist an empty cart to storage
    const clearCartNoSave = () => {
        skipSaveRef.current = true;
        setCartItems([]);
    };

    // Toggle cart
    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    // Close cart
    const closeCart = () => {
        setIsCartOpen(false);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                increaseQuantity,
                decreaseQuantity,
                getItemQuantity,
                getTotalItems,
                getTotalPrice,
                clearCart,
                clearCartNoSave,
                toggleCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;

