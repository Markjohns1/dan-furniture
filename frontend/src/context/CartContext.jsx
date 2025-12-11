/**
 * Dan Classic Furniture - Cart Context
 */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'dan_furniture_cart';

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
    }, []);

    // Save cart to localStorage when items change
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantity = 1, color = null) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (item) => item.id === product.id && item.color === color
            );

            if (existingIndex >= 0) {
                // Update quantity
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            // Add new item
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || null,
                    quantity,
                    color,
                    stock: product.stock,
                },
            ];
        });
    };

    const removeItem = (productId, color = null) => {
        setItems((prev) =>
            prev.filter((item) => !(item.id === productId && item.color === color))
        );
    };

    const updateQuantity = (productId, quantity, color = null) => {
        if (quantity <= 0) {
            removeItem(productId, color);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === productId && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((prev) => !prev);

    // Computed values
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // Format for order creation
    const getOrderItems = () =>
        items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            color: item.color,
        }));

    // Generate WhatsApp message
    const getWhatsAppMessage = (customerInfo) => {
        const itemsList = items
            .map(
                (item) =>
                    `• ${item.name}${item.color ? ` (${item.color})` : ''} x${item.quantity} = KSh ${(
                        item.price * item.quantity
                    ).toLocaleString()}`
            )
            .join('\n');

        return `🛋️ *NEW ORDER - Dan Classic Furniture*
━━━━━━━━━━━━━━━━━━
👤 Customer: ${customerInfo.name}
📱 Phone: ${customerInfo.phone}
📍 Location: ${customerInfo.address}
━━━━━━━━━━━━━━━━━━
📦 *ORDER ITEMS:*
${itemsList}
━━━━━━━━━━━━━━━━━━
💰 *TOTAL: KSh ${subtotal.toLocaleString()}*
━━━━━━━━━━━━━━━━━━
${customerInfo.notes ? `📝 Notes: ${customerInfo.notes}` : ''}`;
    };

    return (
        <CartContext.Provider
            value={{
                items,
                itemCount,
                subtotal,
                isOpen,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                toggleCart,
                getOrderItems,
                getWhatsAppMessage,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartContext;
