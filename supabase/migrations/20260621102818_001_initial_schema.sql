-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL CHECK (category IN ('skincare', 'cosmetics', 'ladies', 'gents', 'shoes')),
  subcategory TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[],
  benefits_ar TEXT[],
  ingredients TEXT,
  ingredients_ar TEXT,
  sizes TEXT[],
  colors TEXT[],
  stock INTEGER DEFAULT 100,
  sku TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  bestseller BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff table for sales staff
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'sales' CHECK (role IN ('admin', 'sales', 'manager')),
  is_active BOOLEAN DEFAULT true,
  commission_rate DECIMAL(4,2) DEFAULT 5.00,
  total_sales DECIMAL(12,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  address TEXT,
  city TEXT,
  emirate TEXT DEFAULT 'Dubai',
  postal_code TEXT,
  notes TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT 'AG' || to_char(NOW(), 'YYYYMMDD') || '-' || lpad(random()::text, 6, '0'),
  customer_id UUID REFERENCES customers(id),
  staff_id UUID REFERENCES staff(id),
  staff_referral_code TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cod' CHECK (payment_method IN ('cod', 'online')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  subtotal DECIMAL(12,2) NOT NULL,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  coupon_code TEXT,
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_emirate TEXT DEFAULT 'Dubai',
  customer_notes TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  variant TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Products policies (public read for catalog)
CREATE POLICY "products_public_read" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "products_authenticated_read" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "products_admin_write" ON products FOR ALL TO authenticated WITH CHECK (true);

-- Reviews policies
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "reviews_authenticated_read" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO authenticated WITH CHECK (true);

-- Coupons policies
CREATE POLICY "coupons_public_check" ON coupons FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "coupons_authenticated_read" ON coupons FOR SELECT TO authenticated USING (true);

-- Staff policies
CREATE POLICY "staff_authenticated_access" ON staff FOR SELECT TO authenticated USING (true);

-- Customers policies
CREATE POLICY "customers_select_own" ON customers FOR SELECT TO authenticated USING (auth.uid()::text = id::text OR EXISTS (SELECT 1 FROM staff WHERE staff.id = auth.uid()::uuid));
CREATE POLICY "customers_insert" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "customers_update_own" ON customers FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);

-- Orders policies
CREATE POLICY "orders_customer_access" ON orders FOR SELECT TO authenticated USING (
  customer_id = auth.uid()::uuid OR 
  EXISTS (SELECT 1 FROM staff WHERE staff.id = auth.uid()::uuid) OR
  staff_id = auth.uid()::uuid
);
CREATE POLICY "orders_insert" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "orders_update_access" ON orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM staff WHERE staff.id = auth.uid()::uuid));

-- Order items policies
CREATE POLICY "orderitems_customer_access" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid()::uuid OR EXISTS (SELECT 1 FROM staff WHERE staff.id = auth.uid()::uuid)))
);
CREATE POLICY "orderitems_insert" ON order_items FOR INSERT TO authenticated WITH CHECK (true);

-- Wishlists policies
CREATE POLICY "wishlist_select_own" ON wishlists FOR SELECT TO authenticated USING (customer_id = auth.uid()::uuid);
CREATE POLICY "wishlist_insert_own" ON wishlists FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid()::uuid);
CREATE POLICY "wishlist_delete_own" ON wishlists FOR DELETE TO authenticated USING (customer_id = auth.uid()::uuid);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_bestseller ON products(bestseller) WHERE bestseller = true;
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_staff ON orders(staff_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_reviews_product ON reviews(product_id);