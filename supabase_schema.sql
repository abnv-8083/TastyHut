-- Create tables for Restaurant Waiter Assistant
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Items Table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tables Table
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER UNIQUE NOT NULL,
    status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'active')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'served', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (safely)
INSERT INTO items (name, code, price, category) 
VALUES 
('Margherita Pizza', 'PZ01', 12.99, 'Pizza'),
('Pepperoni Pizza', 'PZ02', 14.99, 'Pizza')
ON CONFLICT (code) DO NOTHING;

INSERT INTO tables (number) 
VALUES (1), (2), (3), (4), (5)
ON CONFLICT (number) DO NOTHING;

-- Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create Policies (Idempotent approach: drop before create)
DROP POLICY IF EXISTS "Allow public read" ON items;
DROP POLICY IF EXISTS "Allow public read" ON tables;
DROP POLICY IF EXISTS "Allow public read" ON orders;
DROP POLICY IF EXISTS "Allow public read" ON order_items;
DROP POLICY IF EXISTS "Allow public insert" ON items;
DROP POLICY IF EXISTS "Allow public insert" ON tables;
DROP POLICY IF EXISTS "Allow public insert" ON orders;
DROP POLICY IF EXISTS "Allow public insert" ON order_items;
DROP POLICY IF EXISTS "Allow public update" ON tables;
DROP POLICY IF EXISTS "Allow public update" ON orders;
DROP POLICY IF EXISTS "Allow public delete" ON items;
DROP POLICY IF EXISTS "Allow public delete" ON tables;
DROP POLICY IF EXISTS "Allow public delete" ON orders;
DROP POLICY IF EXISTS "Allow public delete" ON order_items;

CREATE POLICY "Allow public read" ON items FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON tables FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON order_items FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON tables FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON orders FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON items FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON tables FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON orders FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON order_items FOR DELETE USING (true);
