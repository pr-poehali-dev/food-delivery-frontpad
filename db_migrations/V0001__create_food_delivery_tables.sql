
CREATE TABLE IF NOT EXISTS dishes (
    id SERIAL PRIMARY KEY,
    frontpad_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    frontpad_order_id VARCHAR(255) UNIQUE,
    user_name VARCHAR(255),
    user_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total INTEGER NOT NULL,
    items_count INTEGER NOT NULL,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    dish_id INTEGER,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    order_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INTEGER,
    min_order_amount INTEGER,
    active BOOLEAN DEFAULT true,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_dishes_available ON dishes(available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
