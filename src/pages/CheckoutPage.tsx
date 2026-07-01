import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ChevronRight, CreditCard, Truck, MapPin, User, Phone, MessageCircle, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { useAuth } from '../store/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import type { Coupon } from '../types';
import { EMIRATES } from '../types';

export function CheckoutPage() {
  const { state, total, clearCart } = useCart();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    name: authState.customer?.name || '',
    phone: authState.customer?.phone || '',
    email: authState.customer?.email || '',
    whatsapp: authState.customer?.whatsapp || authState.customer?.phone || '',
    address: authState.customer?.address || '',
    city: authState.customer?.city || '',
    emirate: authState.customer?.emirate || 'Dubai',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'online',
    couponCode: '',
  });

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryCharge = total >= 200 ? 0 : 25;
  let discountAmount = 0;

  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discountAmount = (total * coupon.discount_value) / 100;
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }
  }

  const grandTotal = total + deliveryCharge - discountAmount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyCoupon = async () => {
    if (!formData.couponCode.trim()) return;

    setCouponError('');
    setCoupon(null);

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', formData.couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setCouponError('Invalid coupon code');
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setCouponError('This coupon has expired');
        return;
      }

      if (data.usage_limit && data.used_count >= data.usage_limit) {
        setCouponError('This coupon has reached its usage limit');
        return;
      }

      if (data.min_order_value && total < data.min_order_value) {
        setCouponError(`Minimum order of AED ${data.min_order_value} required`);
        return;
      }

      setCoupon(data);
    } catch {
      setCouponError('Failed to apply coupon');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      let customerId = authState.customer?.id;

      if (!customerId) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', formData.phone)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              name: formData.name,
              phone: formData.phone,
              email: formData.email || null,
              whatsapp: formData.whatsapp || formData.phone,
              address: formData.address,
              city: formData.city,
              emirate: formData.emirate,
            })
            .select()
            .single();

          if (customerError) throw customerError;
          customerId = newCustomer.id;
        }
      }

      const orderData: Record<string, unknown> = {
        customer_id: customerId,
        subtotal: total,
        delivery_charge: deliveryCharge,
        discount: discountAmount,
        total: grandTotal,
        payment_method: formData.paymentMethod,
        delivery_address: formData.address,
        delivery_city: formData.city,
        delivery_emirate: formData.emirate,
        customer_notes: formData.notes || null,
        staff_referral_code: referralCode || null,
      };

      if (coupon) {
        orderData.coupon_code = coupon.code;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = state.items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        variant: [item.selectedSize, item.selectedColor].filter(Boolean).join(' / ') || null,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      if (coupon) {
        await supabase
          .from('coupons')
          .update({ used_count: coupon.used_count + 1 })
          .eq('id', coupon.id);
      }

      setOrderNumber(order.order_number);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your order. We will contact you shortly to confirm the details.
          </p>

          <div className="bg-white rounded-lg p-6 mb-8 inline-block">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/track?order=${orderNumber}`}>
              <Button variant="gold" size="lg">
                Track Order
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link to="/shop">
            <Button variant="gold" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <button
                onClick={() => s < step && setStep(s)}
                className={`flex items-center gap-2 ${s > step ? 'opacity-50' : ''}`}
                disabled={s > step}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s < step
                      ? 'bg-green-500 text-white'
                      : s === step
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </span>
                <span className="hidden sm:block text-sm font-medium">
                  {s === 1 ? 'Details' : s === 2 ? 'Payment' : 'Confirm'}
                </span>
              </button>
              {s < 3 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact & Delivery Details
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={errors.phone}
                    placeholder="+971 50 XXX XXXX"
                    icon={<Phone className="w-4 h-4" />}
                  />

                  <Input
                    label="Email (Optional)"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    placeholder="your@email.com"
                  />

                  <Input
                    label="WhatsApp Number"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="For order updates"
                    icon={<MessageCircle className="w-4 h-4" />}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Delivery Address *"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      error={errors.address}
                      placeholder="Building, Street, Area"
                      icon={<MapPin className="w-4 h-4" />}
                    />
                  </div>

                  <Input
                    label="City / Area *"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    error={errors.city}
                    placeholder="Dubai Marina, JBR, etc."
                  />

                  <Select
                    label="Emirate"
                    value={formData.emirate}
                    onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                    options={EMIRATES.map((e) => ({ value: e, label: e }))}
                  />

                  <div className="md:col-span-2">
                    <Textarea
                      label="Order Notes (Optional)"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Special instructions for delivery..."
                      rows={3}
                    />
                  </div>
                </div>

                {referralCode && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                    Referred by staff member: {referralCode}
                  </div>
                )}

                <div className="mt-6">
                  <Button variant="gold" size="lg" onClick={() => setStep(2)}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <button
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === 'cod'
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}>
                      {formData.paymentMethod === 'cod' && (
                        <div className="w-3 h-3 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                    <Truck className="w-6 h-6 text-gray-400 ml-auto" />
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                    disabled
                    className="w-full p-4 border-2 rounded-lg flex items-center gap-4 transition-colors border-gray-200 opacity-60 cursor-not-allowed"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        Online Payment
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">Coming Soon</span>
                      </p>
                      <p className="text-sm text-gray-500">Credit/Debit Card, Apple Pay</p>
                    </div>
                    <CreditCard className="w-6 h-6 text-gray-400 ml-auto" />
                  </button>
                </div>

                {/* Coupon Section */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Apply Coupon
                  </h3>

                  <div className="flex gap-2">
                    <Input
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                      placeholder="Enter coupon code"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>

                  {couponError && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {couponError}
                    </p>
                  )}

                  {coupon && (
                    <div className="mt-2 p-3 bg-green-50 rounded text-sm text-green-700 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Coupon applied! You save AED {discountAmount.toFixed(0)}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="gold" size="lg" onClick={() => setStep(3)}>
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                {/* Customer Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Details</h3>
                  <p className="text-gray-600">{formData.name}</p>
                  <p className="text-gray-600">{formData.phone}</p>
                  <p className="text-gray-600">{formData.address}, {formData.city}</p>
                  <p className="text-gray-600">{formData.emirate}</p>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Items ({state.items.length})</h3>
                  <div className="space-y-3">
                    {state.items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {[item.selectedSize, item.selectedColor].filter(Boolean).join(' / ')}
                          </p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">AED {(item.product.price * item.quantity).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleSubmit}
                    isLoading={loading}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium ml-2">
                      AED {(item.product.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">AED {total.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `AED ${deliveryCharge}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-AED {discountAmount.toFixed(0)}</span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">AED {grandTotal.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-xs text-gray-500 space-y-2">
                <p className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Free delivery on orders over AED 200
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  100% Authentic Products
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
