import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle, Trash2, ArrowRight, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';

// Notification popup for recent purchases
export function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<{
    product: string;
    location: string;
    time: string;
  } | null>(null);

  const notifications = [
    { product: 'Radiance Glow Serum', location: 'Dubai, UAE', time: '2 min ago' },
    { product: 'Premium Kandura', location: 'Abu Dhabi, UAE', time: '5 min ago' },
    { product: 'Oud Perfume Collection', location: 'Sharjah, UAE', time: '8 min ago' },
    { product: 'Gold Face Mask', location: 'Dubai, UAE', time: '12 min ago' },
  ];

  useEffect(() => {
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotification);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 10 seconds, then random intervals
    const timeout = setTimeout(() => {
      showNotification();

      setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to show
          showNotification();
        }
      }, 20000 + Math.random() * 30000);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible || !notification) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-xs notification-popup">
      <div className="glass rounded-2xl p-4 shadow-2xl border border-white/10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{notification.product}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <span>Recently purchased in {notification.location}</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-1">{notification.time}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating WhatsApp Button
export function FloatingWhatsApp() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="fab fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <button
        onClick={() => window.open('https://wa.me/971501234567', '_blank')}
        className="relative group"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />

        {/* Main button */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
          <MessageCircle className="w-6 h-6 text-white" fill="white" />
        </div>

        {/* Expanded tooltip */}
        <div className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <div className="glass rounded-xl p-3 whitespace-nowrap shadow-xl">
            <p className="text-sm font-medium text-white">Need help?</p>
            <p className="text-xs text-gray-400">Chat with our team</p>
          </div>
        </div>
      </button>
    </div>
  );
}

// Luxury Cart Drawer
export function CartDrawer() {
  const { state, toggleCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const [showPromo, setShowPromo] = useState(true);

  const deliveryCharge = total >= 200 ? 0 : 25;
  const freeDeliveryRemaining = total >= 200 ? 0 : 200 - total;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          state.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-black z-50 transform transition-transform duration-500 ease-out ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="px-2.5 py-0.5 text-sm font-medium bg-amber-400/10 text-amber-400 rounded-full">
                    {itemCount} items
                  </span>
                )}
              </div>
              <button
                onClick={toggleCart}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free delivery progress */}
            {showPromo && total > 0 && total < 200 && (
              <div className="mt-4 p-3 glass rounded-xl animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Add <strong className="text-amber-400">AED {freeDeliveryRemaining.toFixed(0)}</strong> for free delivery</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
                    style={{ width: `${(total / 200) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-400 mb-6">Discover our premium collection and add some items.</p>
                <button
                  onClick={toggleCart}
                  className="px-6 py-3 glass border border-white/10 text-white rounded-full hover:border-amber-400/50 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              state.items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="group relative flex gap-4 p-3 glass rounded-xl transition-all hover:bg-white/5"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={toggleCart}
                    className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={toggleCart}
                      className="font-medium text-white hover:text-amber-400 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>

                    <div className="text-xs text-gray-500 mt-1">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className="ml-2">Color: {item.selectedColor}</span>}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-semibold text-white">AED {(item.product.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                    className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="p-6 border-t border-white/5 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">AED {total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className={`${deliveryCharge === 0 ? 'text-green-400' : 'text-white'}`}>
                    {deliveryCharge === 0 ? 'Free' : `AED ${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                    AED {(total + deliveryCharge).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link to="/checkout" onClick={toggleCart} className="block">
                  <button className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex items-center justify-center gap-2">
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>

                <button
                  onClick={() => window.open('https://wa.me/971501234567', '_blank')}
                  className="w-full py-4 glass border border-white/10 text-white font-medium rounded-xl hover:border-green-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order via WhatsApp
                </button>

                <button
                  onClick={toggleCart}
                  className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
