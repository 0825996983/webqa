import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import ProductModel from '../../models/ProductModel';

type ShoppingContextProviderProps = {
    children: ReactNode;
};

type CartItem = {
    id: number;
    productName?: string;
    price: number;
    listPrice: number;
    description: string;
    quantity: number; // Sử dụng quantity để quản lý số lượng trong giỏ hàng
    size: string;
    color: string; 
    imageData: string 

};

interface ShoppingContextType {
    cartQty: number;
    totalPrice: number;
    cartItems: CartItem[];
    increaseQty: (id: number) => void;
    decreaseQty: (id: number) => void;
    addCartItem: (item: ProductModel) => void;
    removeCartItem: (id: number) => void;
    clearCart: () => void;
}


const ShoppingContext = createContext<ShoppingContextType>({} as ShoppingContextType);

export const useShoppingContext = () => {
    return useContext(ShoppingContext);
};

export const ShoppingContextProvider = ({ children }: ShoppingContextProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const jsonCartData = localStorage.getItem('shopping_cart');
        return jsonCartData ? JSON.parse(jsonCartData) : [];
    });

    useEffect(() => {
        localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const cartQty = cartItems.reduce((qty, item) => qty + item.quantity, 0);

    const totalPrice = cartItems.reduce((total, item) => total + item.quantity * (item.price || 0), 0);

    const increaseQty = (id: number) => {
        const newItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(newItems);
    };
    

    const decreaseQty = (id: number) => {
        const currentCartItem = cartItems.find(item => item.id === id);
        if (currentCartItem) {
            if (currentCartItem.quantity === 1) {
                removeCartItem(id);
            } else {
                const newItems = cartItems.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                );
                setCartItems(newItems);
            }
        }
    };

    const addCartItem = (product: ProductModel) => {
        const currentCartItem = cartItems.find(item => item.id === product.id);
        const imageData = product.imageData; // Đảm bảo imageData được truyền vào sản phẩm
    
        if (currentCartItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            const newItem: CartItem = {
                id: product.id,
                productName: product.productName,
                price: product.price ?? 0,
                listPrice: product.listPrice ?? 0,
                description: product.description ?? '',
                quantity: 1,
                size: product.size ?? '',
                color: product.color ?? '',
                imageData: imageData || '' // Đảm bảo imageData được lưu
            };
            setCartItems([...cartItems, newItem]);
        }
    };
    
    
    
    
    useEffect(() => {
        // Kiểm tra lại trước khi lưu vào localStorage
        console.log("Cart before saving to localStorage:", cartItems);
        localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
    }, [cartItems]);
    
    useEffect(() => {
        // Khi load lại trang, kiểm tra dữ liệu trong localStorage
        const jsonCartData = localStorage.getItem('shopping_cart');
        if (jsonCartData) {
            const storedItems: CartItem[] = JSON.parse(jsonCartData); // Chỉ định kiểu dữ liệu CartItem[]
            const correctedItems = storedItems.map((item: CartItem) => ({
                ...item,
                quantity: item.quantity > 0 ? item.quantity : 1, // Đảm bảo quantity >= 1
            }));
            setCartItems(correctedItems);
        }
    }, []);
      

    const removeCartItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <ShoppingContext.Provider value={{
            cartItems,
            cartQty,
            totalPrice,
            increaseQty,
            decreaseQty,
            addCartItem,
            removeCartItem,
            clearCart
        }}>
            {children}
        </ShoppingContext.Provider>
    );
};

export default ShoppingContext;


