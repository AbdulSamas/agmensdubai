import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number; size?: string; color?: string }
  | { type: 'REMOVE_ITEM'; productId: string; size?: string; color?: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number; size?: string; color?: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.product.id &&
          item.selectedSize === action.size &&
          item.selectedColor === action.color
      );
      if (existingIndex > -1) {
        const items = [...state.items];
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: items[existingIndex].quantity + action.quantity,
        };
        return { ...state, items, isOpen: true };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity,
            selectedSize: action.size,
            selectedColor: action.color,
          },
        ],
        isOpen: true,
      };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(
        (item) =>
          !(
            item.product.id === action.productId &&
            item.selectedSize === action.size &&
            item.selectedColor === action.color
          )
      );
      return { ...state, items };
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items.map((item) =>
        item.product.id === action.productId &&
        item.selectedSize === action.size &&
        item.selectedColor === action.color
          ? { ...item, quantity: action.quantity }
          : item
      );
      return { ...state, items };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'LOAD_CART':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('ag_cart');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        dispatch({ type: 'LOAD_CART', items });
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ag_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity: number, size?: string, color?: string) => {
    dispatch({ type: 'ADD_ITEM', product, quantity, size, color });
  };

  const removeItem = (productId: string, size?: string, color?: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId, size, color });
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity, size, color });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        total,
        itemCount,
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
