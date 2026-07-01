import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const { state, toggleCart, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          state.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleCart}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button variant="primary" onClick={toggleCart}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={toggleCart}
                      className="w-20 h-20 bg-white rounded overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={toggleCart}
                        className="font-medium text-sm text-gray-900 hover:text-amber-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span className="ml-2">Color: {item.selectedColor}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-sm">
                          AED {(item.product.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.selectedSize, item.selectedColor)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors self-start"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">AED {total.toFixed(0)}</span>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Delivery charges calculated at checkout
              </div>
              <Link
                to="/checkout"
                onClick={toggleCart}
                className="block"
              >
                <Button variant="gold" className="w-full" size="lg">
                  Checkout
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  window.open('https://wa.me/971501234567', '_blank')
                }
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Order via WhatsApp
              </Button>
              <button
                onClick={toggleCart}
                className="block w-full text-center text-sm text-gray-600 hover:text-black transition-colors py-2"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
