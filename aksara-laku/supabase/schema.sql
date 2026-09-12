-- ==============================================================================
-- AKSARA.LAKU - SUPABASE DATABASE SCHEMA (Langkah 3)
-- Tabel: products, orders, order_items
-- ==============================================================================

-- 1. TABEL PRODUCTS (Katalog Aset Digital & Template F&B)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  niche TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 4.9,
  review_count INTEGER DEFAULT 100,
  sales_count TEXT DEFAULT '100+ Terjual',
  format_badge TEXT DEFAULT 'Canva Editable',
  category_badge TEXT DEFAULT 'Digital Asset',
  thumbnail TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  package_contents JSONB DEFAULT '[]'::jsonb,
  download_link TEXT,
  canva_link TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index untuk performa pencarian katalog
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_niche ON public.products(niche);

-- Aktifkan Row Level Security (RLS) pada tabel products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS Products:
-- Publik (anon & authenticated) dapat melihat seluruh katalog produk
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Admin / Anon dapat mengunggah atau mengupdate produk (untuk seeding & upload admin)
DROP POLICY IF EXISTS "Allow product insert and upsert" ON public.products;
CREATE POLICY "Allow product insert and upsert" 
  ON public.products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);


-- 2. TABEL ORDERS (Transaksi Pesanan)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'QRIS',
  status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index untuk filter order user
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);

-- Aktifkan Row Level Security (RLS) pada tabel orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS Orders:
-- Publik / User dapat membuat order baru saat checkout
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
CREATE POLICY "Allow order creation" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

-- User dapat membaca riwayat pesanannya sendiri (atau anon membaca via ID)
DROP POLICY IF EXISTS "Allow read orders" ON public.orders;
CREATE POLICY "Allow read orders" 
  ON public.orders 
  FOR SELECT 
  USING (true);


-- 3. TABEL ORDER_ITEMS (Relasi Item Produk dalam Pesanan)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(order_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  product_title TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index untuk query relasional My Library
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Aktifkan Row Level Security (RLS) pada tabel order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS Order Items:
DROP POLICY IF EXISTS "Allow order items creation" ON public.order_items;
CREATE POLICY "Allow order items creation" 
  ON public.order_items 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read order items" ON public.order_items;
CREATE POLICY "Allow read order items" 
  ON public.order_items 
  FOR SELECT 
  USING (true);
