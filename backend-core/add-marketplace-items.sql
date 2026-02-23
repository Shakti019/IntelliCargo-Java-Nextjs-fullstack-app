-- ================================================
-- ADD MARKETPLACE ITEMS (Without Deleting Data)
-- ================================================
-- This adds SELL requests from different companies
-- to populate the marketplace WITHOUT deleting existing data
-- ================================================

-- SELL Request 1: Company 2 selling Industrial Laptops
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, (SELECT id FROM products WHERE name = 'Industrial Laptops' LIMIT 1), 'SELL_PRODUCT', 'Sell Industrial Laptops - Bulk Stock', 'High-performance ruggedized laptops available for immediate delivery', 200, 'PCS', 850.00, 950.00, 'USD', 'India', 'Worldwide', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '60 days', NOW(), NOW());

-- SELL Request 2: Company 2 selling LED Display Panels
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, (SELECT id FROM products WHERE name = 'LED Display Panels' LIMIT 1), 'SELL_PRODUCT', 'Premium LED Display Panels for Sale', '55-inch commercial-grade displays, perfect for retail and offices', 150, 'PCS', 580.00, 650.00, 'USD', 'India', 'Worldwide', 'CIF', 'OPEN', 'GLOBAL', NOW() + INTERVAL '90 days', NOW(), NOW());

-- SELL Request 3: Company 3 selling tech accessories (if exists)
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) 
SELECT gen_random_uuid(), 3, 3, 'SELL_PRODUCT', 'Wireless Headphones - Premium Quality', 'Noise-cancelling wireless headphones with 30hr battery life', 500, 'PCS', 45.00, 65.00, 'USD', 'Canada', 'North America', 'DDP', 'OPEN', 'GLOBAL', NOW() + INTERVAL '45 days', NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM companies WHERE id = 3);

-- SELL Request 4: Company 1 selling office equipment (if you want to sell items too)
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) 
SELECT gen_random_uuid(), 1, 1, 'SELL_PRODUCT', 'Office Chairs - Ergonomic Design', 'Professional ergonomic office chairs with lumbar support', 300, 'PCS', 120.00, 180.00, 'USD', 'USA', 'Worldwide', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '30 days', NOW(), NOW()
WHERE EXISTS (SELECT 1 FROM companies WHERE id = 1);

-- SELL Request 5: Electronics from Company 2
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, 'SELL_PRODUCT', 'Mechanical Keyboards - Gaming Grade', 'RGB mechanical keyboards with Cherry MX switches', 250, 'PCS', 60.00, 90.00, 'USD', 'India', 'Worldwide', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '50 days', NOW(), NOW());

-- SELL Request 6: Network equipment from Company 2
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, (SELECT id FROM products WHERE name = 'Network Switches' LIMIT 1), 'SELL_PRODUCT', 'Enterprise Network Switches', '48-port managed gigabit switches with PoE support', 80, 'PCS', 880.00, 950.00, 'USD', 'India', 'Worldwide', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '70 days', NOW(), NOW());

-- Success message
SELECT 'SUCCESS: Added 6 SELL requests to marketplace!' as message;
