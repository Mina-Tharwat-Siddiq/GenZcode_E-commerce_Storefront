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
    const isInitialMount = useRef(true);
    const skipSaveRef = useRef(false);

    const getStorageKey = (usr) => {
        return usr && usr.id ? `cart_user_${usr.id}` : 'cart_items';
    };

    // Load cart when component mounts or when user changes
    useEffect(() => {
        const loadCart = () => {
            try {
                const key = getStorageKey(user);

                let saved;
                if (user && user.id) {
                    saved = localStorage.getItem(key);
                } else {
                    saved = localStorage.getItem('cart_items');
                }

                if (!saved) {
                    setCartItems([]);
                    return;
                }

                let parsed = JSON.parse(saved);


                const cleanedAndNormalized = parsed
                    .map(item => {
                        if (!item.product) return null;

                        const id = item.product._id || item.product.id;
                        if (!id) {
                            return null;
                        }

                        const normalizedProduct = {
                            ...item.product,
                            id: id,
                            _id: undefined
                        };

                        return {
                            product: normalizedProduct,
                            quantity: item.quantity || 1
                        };
                    })
                    .filter(Boolean);

                const map = new Map();
                cleanedAndNormalized.forEach(item => {
                    if (map.has(item.product.id)) {
                        map.get(item.product.id).quantity += item.quantity;
                    } else {
                        map.set(item.product.id, item);
                    }
                });

                const finalCart = Array.from(map.values());
                setCartItems(finalCart);

                localStorage.setItem(key, JSON.stringify(finalCart));

            } catch (error) {
                toast.error("Failed to load the cart, it has been cleared", error);
                setCartItems([]);
                localStorage.removeItem(getStorageKey(user));
                localStorage.removeItem('cart_items');
            }
        };

        loadCart();
    }, [user]);
    // Save cart to localStorage whenever it changes (per-user key)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (skipSaveRef.current) {
            skipSaveRef.current = false;
            return;
        }



        try {
            const key = getStorageKey(user);

            if (cartItems.length === 0) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(cartItems));
            }
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

        const productId = product._id || product.id;
        if (!productId) return;

        if (quantity > product.stock) {
            toast.error(`Sorry, only ${product.stock} item(s) available in stock`, {
                icon: "Out of stock",
                theme: "colored",
                autoClose: 4000
            });
            return;
        }

        const normalizedProduct = {
            ...product,
            id: productId,
            _id: undefined
        };

        setCartItems(prev => {
            const exists = prev.find(item => item.product.id === productId);

            if (exists) {
                const newQuantity = exists.quantity + quantity;

                if (newQuantity > product.stock) {
                    toast.error(`Cannot add more. Only ${product.stock} available`, {
                        icon: "Warning",
                        theme: "colored"
                    });
                    return prev;
                }

                toast.success("Quantity updated successfully");
                return prev.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            }

            
            toast.success(`${normalizedProduct.title} added to cart!`);
            return [...prev, { product: normalizedProduct, quantity }];
        });

        setIsCartOpen(true);
    };
    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
        toast.info("Product has been removed from cart.");
    };

    // Update item quantity

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev => prev.map(item =>
            (item.product.id || item.product._id) === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    // Increase quantity
    const increaseQuantity = (productId) => {
        setCartItems(prev => prev.map(item =>
            (item.product.id || item.product._id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    // Decrease quantity
    const decreaseQuantity = (productId) => {
        setCartItems(prev => prev.map(item => {
            if ((item.product.id || item.product._id) === productId) {
                return item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : null;
            }
            return item;
        }).filter(Boolean));
    };

    // Get item quantity
    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => (item.product.id || item.product._id) === productId);
        return item?.quantity || 0;
    };

    // Get total items count
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    // Get total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
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

