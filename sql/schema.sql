-- ============================================================
-- Haifly Trap — PostgreSQL Schema
-- Compatible with all PostgreSQL versions (no extensions required)
-- ============================================================

-- Pure SQL UUID v4 generator (works without pgcrypto or superuser privileges)
CREATE OR REPLACE FUNCTION gen_random_uuid() RETURNS uuid AS $$
SELECT (
  substr(md5, 1, 8) || '-' ||
  substr(md5, 9, 4) || '-' ||
  '4' || substr(md5, 14, 3) || '-' ||
  substr('89ab', 1 + floor(random() * 4)::int, 1) || substr(md5, 18, 3) || '-' ||
  substr(md5, 21, 12)
)::uuid
FROM (SELECT md5(random()::text || clock_timestamp()::text) AS md5) t;
$$ LANGUAGE sql;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer',  -- 'customer' | 'admin' | 'handler'
  welcome_email_sent BOOLEAN DEFAULT false,
  welcome_email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  original_price NUMERIC(12,2),
  price_label TEXT,
  original_price_label TEXT,
  image TEXT,
  images JSONB,
  cloudinary_public_id TEXT,
  category TEXT NOT NULL,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  badge TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  is_limited BOOLEAN NOT NULL DEFAULT false,
  manual_out_of_stock BOOLEAN NOT NULL DEFAULT false,
  features JSONB,
  specifications JSONB,
  min_quantity INTEGER DEFAULT 1,
  has_indoor_outdoor_variants BOOLEAN DEFAULT false,
  indoor_price NUMERIC(12,2),
  outdoor_price NUMERIC(12,2),
  free_delivery BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE marketers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  code TEXT UNIQUE NOT NULL,
  commission NUMERIC(5,2) NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE handlers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  zone TEXT,
  assigned_orders INTEGER NOT NULL DEFAULT 0,
  completed_today INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  alt_phone TEXT,
  whatsapp TEXT,
  customer_email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  landmark TEXT,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL,
  coupon_code TEXT,
  tracking_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  rider_name TEXT,
  rider_phone TEXT,
  assigned_handler_id UUID REFERENCES handlers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  tags JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_type TEXT NOT NULL DEFAULT 'customer',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_push_subscriptions_user_type ON push_subscriptions(user_type);
CREATE INDEX idx_push_subscriptions_user_email ON push_subscriptions(user_email);
CREATE INDEX idx_handlers_user_id ON handlers(user_id);

-- ============================================================
-- GUESSED COLUMNS (please confirm):
-- products.min_quantity               — derived from frontend minQuantity field in product data
-- products.has_indoor_outdoor_variants — from frontend Product type; nullable boolean
-- products.indoor_price               — from frontend Product type; nullable numeric
-- products.outdoor_price              — from frontend Product type; nullable numeric
-- products.free_delivery              — from frontend Product type; nullable boolean
-- handlers.user_id                    — links handler to users table (new, not in old Supabase schema)
-- orders.assigned_handler_id          — referenced in handlers controller getHandlerOrders; assumed uuid FK
-- blogs.slug                          — in BlogPost frontend type; unique text
-- ============================================================
