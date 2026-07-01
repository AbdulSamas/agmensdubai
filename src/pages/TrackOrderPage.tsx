import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import type { Order, OrderItem } from '../types';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  processing: 'bg-purple-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get('order') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<(Order & { items?: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('order_number', orderNumber.trim().toUpperCase())
        .single();

      if (error || !data) {
        setError('Order not found. Please check your order number.');
        return;
      }

      setOrder(data);
    } catch {
      setError('Failed to search order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const index = statusSteps.findIndex((s) => s.key === status);
    return index === -1 ? 0 : index;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Enter your order number to check the status of your order
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter order number (e.g., AG20240101-123456)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <Button variant="gold" onClick={handleSearch} isLoading={loading}>
              Track
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && searched && !order && !loading && (
          <div className="max-w-md mx-auto bg-gray-100 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No order found with this number</p>
          </div>
        )}

        {/* Order Status */}
        {order && (
          <div className="space-y-8">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">Order Status</h2>
                <span className={`${statusColors[order.status] || 'bg-gray-500'} text-white text-sm px-3 py-1 rounded-full capitalize`}>
                  {order.status}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded transition-all duration-500"
                    style={{
                      width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= getStatusIndex(order.status);
                    const Icon = step.icon;

                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                            isActive
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-2 text-center hidden md:block ${
                          isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.status === 'cancelled' && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg text-red-600 text-center">
                  <XCircle className="w-5 h-5 inline mr-2" />
                  This order has been cancelled
                </div>
              )}

              {order.tracking_number && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-mono font-medium">{order.tracking_number}</p>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p>{order.delivery_address}</p>
                      <p>{order.delivery_city}, {order.delivery_emirate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Order Info</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Order Number:</span> <span className="font-medium">{order.order_number}</span></p>
                    <p><span className="text-gray-500">Payment:</span> <span className="font-medium capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span></p>
                    <p><span className="text-gray-500">Date:</span> <span className="font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span></p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          {item.variant && <p className="text-gray-500">{item.variant}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">AED {item.total.toFixed(0)}</p>
                          <p className="text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span>AED {order.subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery</span>
                      <span>{order.delivery_charge === 0 ? 'Free' : `AED ${order.delivery_charge.toFixed(0)}`}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-AED {order.discount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2">
                      <span>Total</span>
                      <span>AED {order.total.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
              <p className="text-white/80 mb-4">
                Contact us on WhatsApp for any questions about your order
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(
                    `https://wa.me/971501234567?text=${encodeURIComponent(
                      `Hi, I have a question about my order ${order.order_number}`
                    )}`,
                    '_blank'
                  )
                }
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
