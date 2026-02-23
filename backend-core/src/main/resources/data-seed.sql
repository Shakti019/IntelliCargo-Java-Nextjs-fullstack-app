-- ================================================
-- IntelliCargo Seed Data - Complete Workflow Demo
-- ================================================
-- This seed data demonstrates the complete trade flow:
-- Trade Request → Offer → Order → Payment → Shipment
-- ================================================

-- Clear existing data (in reverse order of dependencies)
DELETE FROM shipment_route_stages;
DELETE FROM shipments;
DELETE FROM trade_orders;
DELETE FROM trade_offers;
DELETE FROM trade_requests;
DELETE FROM product_listings;
DELETE FROM products;
DELETE FROM user_company_roles;
DELETE FROM users;
DELETE FROM companies;
DELETE FROM roles;

-- ================================================
-- 1. COMPANIES
-- ================================================

-- Buyer Company
INSERT INTO companies (id, name, email, country, industry, created_at, updated_at) VALUES
(1, 'Global Electronics Ltd', 'contact@globalelectronics.com', 'USA', 'Electronics', NOW(), NOW());

-- Seller Company  
INSERT INTO companies (id, name, email, country, industry, created_at, updated_at) VALUES
(2, 'Lovely Professional University', 'procurement@lpu.edu', 'India', 'Education', NOW(), NOW());

-- Another Buyer Company
INSERT INTO companies (id, name, email, country, industry, created_at, updated_at) VALUES
(3, 'Tech Imports Inc', 'info@techimports.com', 'Canada', 'Technology', NOW(), NOW());

-- ================================================
-- 2. USERS
-- ================================================

-- Buyer Company User
-- Password: password123 (bcrypt hash with rounds=10)
INSERT INTO users (user_id, email, password_hash, full_name, is_active, created_at, updated_at) VALUES
(1, 'buyer@globalelectronics.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Buyer', true, NOW(), NOW());

-- Seller Company User
-- Password: password123 (bcrypt hash with rounds=10)
INSERT INTO users (user_id, email, password_hash, full_name, is_active, created_at, updated_at) VALUES
(2, 'seller@lpu.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Seller', true, NOW(), NOW());

-- Another Buyer User
-- Password: password123 (bcrypt hash with rounds=10)
INSERT INTO users (user_id, email, password_hash, full_name, is_active, created_at, updated_at) VALUES
(3, 'procurement@techimports.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike Importer', true, NOW(), NOW());

-- ================================================
-- 3. USER COMPANY ROLES
-- ================================================

INSERT INTO user_company_roles (id, user_id, company_id, role, is_primary, created_at) VALUES
(1, 1, 1, 'ADMIN', true, NOW()),
(2, 2, 2, 'ADMIN', true, NOW()),
(3, 3, 3, 'ADMIN', true, NOW());

-- ================================================
-- 4. PRODUCTS
-- ================================================

INSERT INTO products (id, name, category, description, unit_type, min_order_quantity, is_active, company_id, created_by, created_at, updated_at) VALUES
(gen_random_uuid(), 'Industrial Laptops', 'ELECTRONICS', 'High-performance laptops for industrial use', 'PCS', 10, true, 2, 2, NOW(), NOW()),
(gen_random_uuid(), 'LED Display Panels', 'ELECTRONICS', '55-inch commercial display panels', 'PCS', 5, true, 2, 2, NOW(), NOW()),
(gen_random_uuid(), 'Network Switches', 'ELECTRONICS', 'Enterprise-grade 48-port switches', 'PCS', 1, true, 2, 2, NOW(), NOW());

-- ================================================
-- 4B. PRODUCT LISTINGS
-- ================================================

INSERT INTO product_listings (id, product_id, company_id, available_quantity, min_order_quantity, max_order_quantity, price_per_unit, currency, incoterm, port_of_loading, valid_until, listing_status, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM products WHERE name = 'Industrial Laptops' LIMIT 1), 2, 500, 10, 100, 950.00, 'USD', 'FOB', 'Shanghai Port', NOW() + INTERVAL '90 days', 'OPEN', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM products WHERE name = 'LED Display Panels' LIMIT 1), 2, 200, 5, 50, 620.00, 'USD', 'CIF', 'Shanghai Port', NOW() + INTERVAL '60 days', 'OPEN', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM products WHERE name = 'Network Switches' LIMIT 1), 2, 150, 1, 30, 920.00, 'USD', 'EXW', 'Shenzhen Warehouse', NOW() + INTERVAL '120 days', 'OPEN', NOW(), NOW());

-- ================================================
-- 5. TRADE REQUESTS
-- ================================================

-- Request 1: PENDING (buyer needs laptops)
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 1, 1, 'BUY_PRODUCT', 'Need 100 Industrial Laptops', 'Looking for ruggedized laptops for field operations', 100, 'PCS', 80000, 100000, 'USD', 'USA', 'USA', 'DDP', 'OPEN', 'GLOBAL', NOW() + INTERVAL '30 days', NOW(), NOW());

-- Request 2: Has offer and order (LED panels - COMPLETED flow)
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
('a4cde486-1234-5678-9abc-def012345678', 1, 1, (SELECT id FROM products WHERE name = 'LED Display Panels' LIMIT 1), 'BUY_PRODUCT', 'Bulk Order: LED Display Panels', 'Need 50 commercial-grade LED panels for office expansion', 50, 'PCS', 25000, 35000, 'USD', 'India', 'USA', 'CIF', 'CONFIRMED', 'GLOBAL', NOW() + INTERVAL '60 days', NOW() - INTERVAL '5 days', NOW());

-- Request 3: Has offer, waiting for order (Network switches)
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
('b5def597-2345-6789-abcd-ef0123456789', 3, 3, (SELECT id FROM products WHERE name = 'Network Switches' LIMIT 1), 'BUY_PRODUCT', 'Network Infrastructure Upgrade', 'Purchasing enterprise switches for data center', 20, 'PCS', 15000, 20000, 'USD', 'India', 'Canada', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '45 days', NOW() - INTERVAL '3 days', NOW());

-- Request 4: From Company 2 (Seller looking to buy keyboards)
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, 'BUY_PRODUCT', 'Buy Keyboards', 'Need mechanical keyboards for university computer labs', 120, 'PCS', 3000, 5000, 'USD', 'India', 'India', 'DDP', 'OPEN', 'GLOBAL', NOW() + INTERVAL '40 days', NOW(), NOW());

-- ================================================
-- SELL REQUESTS (MARKETPLACE ITEMS)
-- ================================================

-- SELL Request 1: Company 2 selling Industrial Laptops
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, (SELECT id FROM products WHERE name = 'Industrial Laptops' LIMIT 1), 'SELL_PRODUCT', 'Sell Industrial Laptops - Bulk Stock', 'High-performance ruggedized laptops available for immediate delivery', 200, 'PCS', 850.00, 950.00, 'USD', 'India', 'Worldwide', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '60 days', NOW(), NOW());

-- SELL Request 2: Company 2 selling LED Display Panels
INSERT INTO trade_requests (id, company_id, created_by, product_id, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 2, 2, (SELECT id FROM products WHERE name = 'LED Display Panels' LIMIT 1), 'SELL_PRODUCT', 'Premium LED Display Panels for Sale', '55-inch commercial-grade displays, perfect for retail and offices', 150, 'PCS', 580.00, 650.00, 'USD', 'India', 'Worldwide', 'CIF', 'OPEN', 'GLOBAL', NOW() + INTERVAL '90 days', NOW(), NOW());

-- SELL Request 3: Company 3 selling tech accessories
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 3, 3, 'SELL_PRODUCT', 'Wireless Headphones - Premium Quality', 'Noise-cancelling wireless headphones with 30hr battery life', 500, 'PCS', 45.00, 65.00, 'USD', 'Canada', 'North America', 'DDP', 'OPEN', 'GLOBAL', NOW() + INTERVAL '45 days', NOW(), NOW());

-- SELL Request 4: Company 1 selling office equipment
INSERT INTO trade_requests (id, company_id, created_by, trade_type, title, description, quantity, unit_type, budget_min, budget_max, currency, origin_country, destination_country, preferred_incoterm, trade_status, visibility, expires_at, created_at, updated_at) VALUES
(gen_random_uuid(), 1, 1, 'SELL_PRODUCT', 'Office Chairs - Ergonomic Design', 'Professional ergonomic office chairs with lumbar support', 300, 'PCS', 120.00, 180.00, 'USD', 'USA', 'Worldwide', 'FOB', 'OPEN', 'GLOBAL', NOW() + INTERVAL '30 days', NOW(), NOW());

-- ================================================
-- 6. TRADE OFFERS
-- ================================================

-- Offer 1: PENDING (on request 1 - waiting for buyer acceptance)
INSERT INTO trade_offers (id, trade_request_id, offered_by_company, offered_by_user, offered_price, offered_quantity, currency, estimated_delivery_days, additional_terms, offer_status, created_at, updated_at) VALUES
('c6ef0678-3456-789a-bcde-f01234567890', (SELECT id FROM trade_requests WHERE title LIKE 'Need 100 Industrial%' LIMIT 1), 2, 2, 92000, 100, 'USD', 15, 'Includes 3-year warranty and on-site support', 'PENDING', NOW() - INTERVAL '1 day', NOW());

-- Offer 2: ACCEPTED (on request 2 - LED panels, has order)
INSERT INTO trade_offers (id, trade_request_id, offered_by_company, offered_by_user, offered_price, offered_quantity, currency, estimated_delivery_days, additional_terms, offer_status, created_at, updated_at) VALUES
('2bd231f4-4567-89ab-cdef-012345678901', 'a4cde486-1234-5678-9abc-def012345678', 2, 2, 30000, 50, 'USD', 20, '2-year warranty, bulk discount applied', 'ACCEPTED', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days');

-- Offer 3: ACCEPTED (on request 3 - switches, ready for order creation)
INSERT INTO trade_offers (id, trade_request_id, offered_by_company, offered_by_user, offered_price, offered_quantity, currency, estimated_delivery_days, additional_terms, offer_status, created_at, updated_at) VALUES
('d7f01789-5678-9abc-def0-123456789012', 'b5def597-2345-6789-abcd-ef0123456789', 2, 2, 18000, 20, 'USD', 10, 'Express shipping available', 'ACCEPTED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

-- ================================================
-- 7. TRADE ORDERS
-- ================================================

-- Order 1: PENDING - Waiting for buyer payment
INSERT INTO trade_orders (id, trade_request_id, accepted_offer_id, buyer_company_id, seller_company_id, final_price, final_quantity, currency, incoterm, trade_status, created_at, updated_at) VALUES
(gen_random_uuid(), 'a4cde486-1234-5678-9abc-def012345678', '2bd231f4-4567-89ab-cdef-012345678901', 1, 2, 30000, 50, 'USD', 'CIF', 'PENDING', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Order 2: PROCESSING - Payment completed, waiting for seller to create shipment
INSERT INTO trade_orders (id, trade_request_id, accepted_offer_id, buyer_company_id, seller_company_id, final_price, final_quantity, currency, incoterm, trade_status, created_at, updated_at) VALUES
('e8f12890-6789-abcd-ef01-234567890123', 'a4cde486-1234-5678-9abc-def012345678', '2bd231f4-4567-89ab-cdef-012345678901', 1, 2, 30000, 50, 'USD', 'CIF', 'PROCESSING', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Order 3: CONFIRMED - Shipment created, in transit
INSERT INTO trade_orders (id, trade_request_id, accepted_offer_id, buyer_company_id, seller_company_id, final_price, final_quantity, currency, incoterm, trade_status, created_at, updated_at) VALUES
('f9012901-789a-bcde-f012-345678901234', 'b5def597-2345-6789-abcd-ef0123456789', 'd7f01789-5678-9abc-def0-123456789012', 3, 2, 18000, 20, 'USD', 'FOB', 'CONFIRMED', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days');

-- ================================================
-- 8. SHIPMENTS
-- ================================================

-- Shipment 1: IN_TRANSIT (for order 3)
INSERT INTO shipments (id, trade_order_id, tracking_number, carrier, shipment_status, origin_address, destination_address, estimated_delivery, actual_delivery, notes, created_at, updated_at) VALUES
('a0123012-89ab-cdef-0123-456789012345', 'f9012901-789a-bcde-f012-345678901234', 'SHP-DHL-20260220-001', 'DHL Express', 'IN_TRANSIT', 'LPU Campus, Jalandhar, Punjab, India', 'Tech Imports Inc, Toronto, ON, Canada', NOW() + INTERVAL '5 days', NULL, 'Express international shipping', NOW() - INTERVAL '3 days', NOW());

-- Shipment 2: DELIVERED (completed order - for demo)
INSERT INTO shipments (id, trade_order_id, tracking_number, carrier, shipment_status, origin_address, destination_address, estimated_delivery, actual_delivery, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'e8f12890-6789-abcd-ef01-234567890123', 'SHP-FDX-20260215-042', 'FedEx', 'DELIVERED', 'LPU Campus, Jalandhar, Punjab, India', 'Global Electronics Ltd, New York, NY, USA', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'Delivered successfully, signed by receiver', NOW() - INTERVAL '10 days', NOW() - INTERVAL '1 day');

-- ================================================
-- 9. SHIPMENT ROUTE STAGES
-- ================================================

-- Route stages for Shipment 1 (IN_TRANSIT)
INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'ORIGIN_WAREHOUSE', 'COMPLETED', 'LPU Warehouse, Jalandhar, India', 31.2522, 75.7026, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', 'Goods picked from warehouse', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'PORT_OF_LOADING', 'COMPLETED', 'Nhava Sheva Port, Mumbai, India', 18.9481, 72.9508, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'Container loaded on vessel', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'CUSTOMS_EXPORT', 'COMPLETED', 'Mumbai Customs, India', 18.9400, 72.8350, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 'Export clearance completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'SEA_TRANSPORT', 'IN_PROGRESS', 'Pacific Ocean - En Route', 35.0000, -140.0000, NOW() + INTERVAL '3 days', NULL, NULL, NULL, 'Vessel: MSC ANASTASIA, ETA Port of Vancouver', NOW() - INTERVAL '1 day', NOW());

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'PORT_OF_DISCHARGE', 'PENDING', 'Port of Vancouver, Canada', 49.2827, -123.1207, NOW() + INTERVAL '3 days', NULL, NOW() + INTERVAL '3 days', NULL, 'Awaiting vessel arrival', NOW() - INTERVAL '3 days', NOW());

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'CUSTOMS_IMPORT', 'PENDING', 'Vancouver Customs, Canada', 49.1913, -123.1827, NOW() + INTERVAL '4 days', NULL, NOW() + INTERVAL '4 days', NULL, 'Import clearance pending', NOW() - INTERVAL '3 days', NOW());

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'ROAD_TRANSPORT', 'PENDING', 'Highway to Toronto', 43.6532, -79.3832, NOW() + INTERVAL '5 days', NULL, NULL, NULL, 'Truck transport to final destination', NOW() - INTERVAL '3 days', NOW());

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'a0123012-89ab-cdef-0123-456789012345', 'DESTINATION_WAREHOUSE', 'PENDING', 'Tech Imports Warehouse, Toronto, Canada', 43.6532, -79.3832, NOW() + INTERVAL '5 days', NULL, NULL, NULL, 'Final delivery pending', NOW() - INTERVAL '3 days', NOW());

-- Route stages for Shipment 2 (DELIVERED - complete)
INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM shipments WHERE tracking_number = 'SHP-FDX-20260215-042'), 'ORIGIN_WAREHOUSE', 'COMPLETED', 'LPU Warehouse, Jalandhar, India', 31.2522, 75.7026, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', 'Package collected', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM shipments WHERE tracking_number = 'SHP-FDX-20260215-042'), 'AIR_TRANSPORT', 'COMPLETED', 'Delhi to New York Flight', 40.6413, -73.7781, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days', 'Flight FX9823 - Express Air', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days');

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM shipments WHERE tracking_number = 'SHP-FDX-20260215-042'), 'CUSTOMS_IMPORT', 'COMPLETED', 'JFK Customs, New York', 40.6413, -73.7781, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', 'Customs cleared', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

INSERT INTO shipment_route_stages (id, shipment_id, stage_type, stage_status, location, location_coordinates_lat, location_coordinates_long, estimated_arrival, actual_arrival, estimated_departure, actual_departure, notes, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM shipments WHERE tracking_number = 'SHP-FDX-20260215-042'), 'DESTINATION_WAREHOUSE', 'COMPLETED', 'Global Electronics, New York, NY', 40.7128, -74.0060, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL, NULL, 'Delivered and signed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- ================================================
-- SEED DATA SUMMARY
-- ================================================
-- Companies: 3 (1 buyer, 1 seller, 1 additional buyer)
-- Users: 3 (one per company)
-- Products: 3 (all from seller company)
-- Trade Requests: 3 (various statuses)
-- Trade Offers: 3 (PENDING, ACCEPTED x2)
-- Trade Orders: 3 (PENDING, PROCESSING, CONFIRMED)
-- Shipments: 2 (IN_TRANSIT, DELIVERED)
-- Route Stages: 12 total across 2 shipments
-- ================================================
-- COMPLETE WORKFLOW DEMONSTRATION:
-- 1. View Trade Requests → See 3 requests
-- 2. View Trade Offers → See offers on those requests
-- 3. Accept offer → Create Trade Order
-- 4. Buyer pays → Order status PROCESSING
-- 5. Seller creates shipment → Redirected to shipments
-- 6. Track shipment progress → View route stages
-- 7. Delivery complete → Order COMPLETED
-- ================================================
