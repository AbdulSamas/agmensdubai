export type Category = 'skincare' | 'cosmetics' | 'ladies' | 'gents' | 'shoes';

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  price: number;
  original_price?: number;
  category: Category;
  subcategory?: string;
  images: string[];
  benefits?: string[];
  benefits_ar?: string[];
  ingredients?: string;
  ingredients_ar?: string;
  sizes?: string[];
  colors?: string[];
  stock: number;
  sku: string;
  featured: boolean;
  bestseller: boolean;
  trending: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  referral_code: string;
  role: 'admin' | 'sales' | 'manager';
  is_active: boolean;
  commission_rate: number;
  total_sales: number;
  total_orders: number;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  emirate?: string;
  postal_code?: string;
  notes?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  variant?: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  staff_id?: string;
  staff_referral_code?: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_charge: number;
  discount: number;
  total: number;
  coupon_code?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_emirate?: string;
  customer_notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  product_id: string;
  customer_id?: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WishlistItem {
  product_id: string;
  product: Product;
  created_at: string;
}

export const CATEGORY_LABELS: Record<Category, { en: string; ar: string }> = {
  skincare: { en: 'Skin Care', ar: 'العناية بالبشرة' },
  cosmetics: { en: 'Cosmetics', ar: 'مستحضرات التجميل' },
  ladies: { en: 'Ladies Collection', ar: 'مجموعة السيدات' },
  gents: { en: 'Gents Collection', ar: 'مجموعة الرجال' },
  shoes: { en: 'Shoes', ar: 'الأحذية' },
};

export const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];
