IntelliCargo - Global Trade & Logistics Platform
📋 Project Overview
IntelliCargo is a comprehensive B2B trade and logistics management platform that connects buyers and sellers globally, facilitating international trade transactions and shipment tracking. The platform enables companies to create trade requests, receive offers, manage orders, and track shipments in real-time.

🏗️ System Architecture
Tech Stack
Backend (Core API)
Framework: Spring Boot 3.2.3 (Java 17)
Database: PostgreSQL (Supabase hosted)
Authentication: JWT + OAuth2 (Google)
ORM: Spring Data JPA
Security: Spring Security with BCrypt
Frontend
Framework: Next.js 14 (React 18)
Language: TypeScript
Styling: Tailwind CSS
State Management: React Hooks
API Client: Axios
Additional Services
AI Backend: Python (planned, not implemented)
Real-time Chat: MongoDB schemas defined (not fully integrated)
🎯 Core Business Functionality
1. Company & User Management
Multi-company support with role-based access control (RBAC)
Users can belong to multiple companies with different roles
Primary company selection for active context
Permissions: CREATE_PRODUCT, MANAGE_TRADES, CREATE_SHIPMENT, etc.
2. Product Catalog
Companies create and manage their product inventory
Product categories, HS codes, specifications
Minimum order quantities, pricing
Active/inactive product status
3. Product Listings (Marketplace)
Sellers publish products to marketplace
Price per unit, available quantity, validity period
Incoterms support (FOB, CIF, DDP, EXW)
Port of loading information
Listing status: OPEN, CLOSED, EXPIRED
4. Trade Request System
Two Types of Requests:

BUY_PRODUCT: Buyer seeks products/services
SELL_PRODUCT: Seller offers products to marketplace
Request Features:

Budget range (min/max)
Quantity and unit specification
Origin/destination countries
Preferred Incoterms
Expiration dates
Visibility: GLOBAL (public) or PRIVATE
Status tracking: OPEN, CONFIRMED, CANCELLED
5. Trade Offer Management
Companies make offers on trade requests
Offered price, quantity, delivery timeframe
Additional terms and conditions
Offer status: PENDING, ACCEPTED, REJECTED
Business Rule: Cannot offer on own trade requests
6. Trade Order Workflow
Order Creation:

Buyer accepts an offer → creates Trade Order
Links: Trade Request → Accepted Offer → Trade Order
Buyer/Seller companies automatically assigned based on trade type
Order Statuses:

CONTRACTED: Initial order created
PENDING: Awaiting payment
PROCESSING: Payment completed, preparing shipment
CONFIRMED: Order confirmed, ready to ship
IN_PROGRESS: Shipment in transit
COMPLETED: Order delivered
CANCELLED: Order cancelled
Permissions:

Only companies involved (buyer/seller) can update order status
Authorization checks verify company ownership
7. Shipment Tracking
Shipment Lifecycle:

Created when seller initiates shipping for an order
Tracking number, carrier information
Origin/destination addresses
Estimated vs actual delivery dates
Shipment Statuses:

PENDING: Shipment created, not dispatched
IN_TRANSIT: En route to destination
DELIVERED: Successfully delivered
CANCELLED: Shipment cancelled
Route Stages (Multi-modal Transport):
Each shipment has multiple route stages with:

Stage Types:

ORIGIN_WAREHOUSE
PORT_OF_LOADING
CUSTOMS_EXPORT
SEA_TRANSPORT / AIR_TRANSPORT / ROAD_TRANSPORT
PORT_OF_DISCHARGE
CUSTOMS_IMPORT
DESTINATION_WAREHOUSE
Stage Status: PENDING, IN_PROGRESS, COMPLETED

GPS coordinates (latitude/longitude) for each location

Estimated vs actual arrival/departure times

Notes for each stage

🔑 Key Features Implemented
Authentication & Authorization
Email/password registration with BCrypt hashing
JWT token-based authentication
OAuth2 Google Sign-In integration
Role-based permissions system
Company-scoped data access
API Endpoints (40+ endpoints)
Auth
POST /api/auth/register - User registration
POST /api/auth/login - Login with JWT token
Companies
GET /api/companies/my-company - Get user's company
GET /api/companies/all - List all companies
PUT /api/companies/my-company - Update company
Products
POST /api/products - Create product
GET /api/products/my-company - Company products
GET /api/products/active - Active products
PUT /api/products/{id} - Update product
DELETE /api/products/{id} - Delete product
Trade Requests
POST /api/trade-requests - Create request
GET /api/trade-requests/my-company - My requests
GET /api/trade-requests/marketplace - Browse marketplace
PUT /api/trade-requests/{id} - Update request
PATCH /api/trade-requests/{id}/cancel - Cancel request
Trade Offers
POST /api/trade-offers - Make offer
GET /api/trade-offers/my-company - Offers made by my company
GET /api/trade-offers/received - Offers received on my requests
GET /api/trade-offers/accepted - Accepted offers
PATCH /api/trade-offers/{id}/status - Accept/reject offer
DELETE /api/trade-offers/{id} - Delete pending offer
Trade Orders
POST /api/trade-orders/from-offer/{offerId} - Create order from accepted offer
GET /api/trade-orders/my-company - All orders
GET /api/trade-orders/purchases - Orders where company is buyer
GET /api/trade-orders/sales - Orders where company is seller
PATCH /api/trade-orders/{id}/status - Update order status
Shipments
POST /api/shipments/order/{orderId} - Create shipment
GET /api/shipments/my-company - Company shipments
GET /api/shipments/order/{orderId} - Get shipment by order
GET /api/shipments/status/{status} - Filter by status
PATCH /api/shipments/{id}/status - Update shipment status
📊 Database Schema (Main Tables)
Core Entities
companies - Company profiles
users - User accounts with auth
user_company_roles - User-company relationships
roles - Role definitions (ADMIN, IMPORTER, EXPORTER, etc.)
permissions - Granular permissions
Marketplace
products - Product catalog
product_listings - Active marketplace listings
trade_requests - Buy/sell requests
trade_offers - Offers on requests
trade_orders - Confirmed orders
Logistics
shipments - Shipment tracking
shipment_route_stages - Multi-stage route tracking
Geo Intelligence (Defined but not fully utilized)
transport_nodes - Ports, warehouses, etc.
transport_edges - Routes between nodes
geo_intelligence_nodes - Market intelligence data
🔄 Complete Trade Workflow
🧪 Testing Infrastructure
Automated API Testing
Script: run-complete-tests.js
Tests all 40+ endpoints systematically
Two test users with different companies
Generates test-results.json with:
Pass/Fail status for each endpoint
Response times
Error details
Success rate calculation
Seed Data
File: data-seed.sql
Pre-populates database with:
3 companies (Global Electronics, LPU, Tech Imports)
3 users (one per company)
3 products (laptops, displays, switches)
7 trade requests (BUY and SELL)
3 offers (PENDING, ACCEPTED)
3 orders (PENDING, PROCESSING, CONFIRMED)
2 shipments (IN_TRANSIT with 8 stages, DELIVERED with 4 stages)
Test Data Seeder
Java configuration class: ComprehensiveTestDataSeeder.java
Profile: test-full
Programmatically creates full workflow data
🎨 Frontend Pages
Dashboard Pages
Dashboard (/dashboard) - Overview with stats
Products (/dashboard/products) - Product management
Product Listings (/dashboard/product-listings) - Marketplace listings
Trade Requests (/dashboard/trade-requests)
Tabs: "My Requests" | "Marketplace"
Create BUY/SELL requests
View received offers
Trade Offers (/dashboard/trade-offers)
Offers made by company
Make offers on marketplace requests
Trade Orders (/dashboard/trade-orders)
Tabs: "All" | "Purchases" | "Sales"
Create order from accepted offer
Update order status
Shipments (/dashboard/shipments)
Create shipment for order
Track route stages
Filter by status
🔐 Security Features
Authentication
BCrypt password hashing (strength: 10 rounds)
JWT tokens with expiration
OAuth2 Google integration
Stateless session management
Authorization
Company-scoped data access
User can only access data for their primary company
Ownership verification for updates/deletes
Permission checks on sensitive operations
Business Logic Validations
Cannot offer on own trade requests
Only request creator can accept offers
Only involved companies can update orders/shipments
Accepted offers cannot be deleted
📈 What's Working
✅ Fully Functional:

User registration & authentication
Company management
Product CRUD operations
Product listing marketplace
Trade request creation (BUY/SELL)
Trade offer submission
Offer acceptance → Order creation
Order status management
Shipment creation and tracking
Multi-stage route tracking with GPS coordinates
Company-scoped authorization
Complete API testing suite
⚠️ What's Not Implemented / Incomplete
❌ Missing Features:

Payment Integration - No actual payment processing
Real-time Chat - MongoDB schemas defined but not integrated
AI Backend - Python service planned but not built
Route Optimization - Service defined but not functional
Geo Intelligence - Database tables exist but not utilized
Email Notifications - No email service
File Uploads - No document/image storage
Advanced Search - Basic search only
Analytics Dashboard - No reporting/charts
Mobile App - Web only
Multi-language - English only
Trade Drafts - MongoDB schema defined but not used
Warehouse Management - Tables exist but not utilized
🗂️ Project Structure
🚀 Getting Started
Prerequisites
Java 17+
Node.js 18+
PostgreSQL (or use Supabase)
Maven
Backend Setup
Frontend Setup
Test Credentials (from seed data)
Buyer: buyer@globalelectronics.com / password123
Seller: seller@lpu.edu / password123
Importer: procurement@techimports.com / password123
📝 Key Design Patterns
Repository Pattern - Data access abstraction
DTO Pattern - Prevent entity exposure
Service Layer - Business logic separation
JWT Stateless Auth - Scalable authentication
Role-Based Access Control - Flexible permissions
Multi-tenancy - Company-scoped data isolation
🎓 Learning Outcomes
This project demonstrates:

Full-stack development (Spring Boot + Next.js)
RESTful API design
JWT authentication & OAuth2
JPA/Hibernate ORM
Multi-stage workflow management
Real-world B2B trade processes
Shipment tracking with geolocation
Automated API testing
Database design for complex domains
📊 Project Status
Current State: Functional MVP ✅

The core trade workflow (Request → Offer → Order → Shipment) is fully operational with:

Working authentication
Complete CRUD operations
Multi-company support
Comprehensive API testing
Real-time shipment tracking
Next Steps for Production:

Payment gateway integration
Email notification service
Real-time chat implementation
File upload/storage (S3)
Advanced analytics dashboard
Performance optimization
Production deployment (Docker/K8s)
👨‍💻 Development Team Context
This appears to be a student/learning project or proof-of-concept for an international trade platform, likely developed for:

University coursework (LPU mentioned in seed data)
Portfolio demonstration
Hackathon/competition
Startup MVP validation
The codebase shows good software engineering practices with structured architecture, comprehensive testing, and realistic business logic implementation.

📄 License
Not specified (add MIT/Apache if open-source)

Last Updated: February 2026
API Base URL: http://localhost:8080
Frontend URL: http://localhost:3000
