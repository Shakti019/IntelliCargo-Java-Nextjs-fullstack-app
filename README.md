# IntelliCargo — Global Trade & Logistics Platform

## 📋 Project Overview
**IntelliCargo** is a B2B trade and logistics management platform that connects buyers and sellers globally, facilitating international trade transactions and **real-time shipment tracking**.

The platform enables companies to:
- Create trade requests (buy/sell)
- Receive and manage offers
- Convert accepted offers into orders
- Create shipments and track multi-stage routes with GPS

---

## 🏗️ System Architecture

### Tech Stack

#### Backend (Core API)
- **Framework:** Spring Boot 3.2.3 (Java 17)
- **Database:** PostgreSQL (Supabase hosted)
- **Authentication:** JWT + OAuth2 (Google)
- **ORM:** Spring Data JPA
- **Security:** Spring Security + BCrypt

#### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **API Client:** Axios

#### Additional Services
- **AI Backend:** Python (planned, not implemented)
- **Real-time Chat:** MongoDB schemas defined (not fully integrated)

---

## 🎯 Core Business Functionality

### 1) Company & User Management
- Multi-company support with role-based access control (**RBAC**)
- Users can belong to multiple companies with different roles
- Primary company selection for active context
- Permissions: `CREATE_PRODUCT`, `MANAGE_TRADES`, `CREATE_SHIPMENT`, etc.

### 2) Product Catalog
- Companies create and manage product inventory
- Categories, HS codes, specifications
- Minimum order quantities and pricing
- Product status: **active / inactive**

### 3) Product Listings (Marketplace)
- Sellers publish products to a marketplace
- Price per unit, available quantity, validity period
- Incoterms support: **FOB, CIF, DDP, EXW**
- Port of loading info
- Listing status: `OPEN`, `CLOSED`, `EXPIRED`

### 4) Trade Request System
#### Types
- `BUY_PRODUCT`: Buyer seeks products/services
- `SELL_PRODUCT`: Seller offers products to marketplace

#### Features
- Budget range (min/max)
- Quantity + unit specification
- Origin/destination countries
- Preferred Incoterms
- Expiration dates
- Visibility: `GLOBAL` (public) or `PRIVATE`
- Status tracking: `OPEN`, `CONFIRMED`, `CANCELLED`

### 5) Trade Offer Management
- Companies make offers on trade requests
- Offered price, quantity, delivery timeframe
- Additional terms and conditions
- Offer status: `PENDING`, `ACCEPTED`, `REJECTED`

**Business rule:** Cannot offer on own trade requests.

### 6) Trade Order Workflow
#### Order Creation
- Buyer accepts an offer → creates a **Trade Order**
- Links: **Trade Request → Accepted Offer → Trade Order**
- Buyer/seller companies assigned based on trade type

#### Order Statuses
- `CONTRACTED` — initial order created
- `PENDING` — awaiting payment
- `PROCESSING` — payment completed, preparing shipment
- `CONFIRMED` — order confirmed, ready to ship
- `IN_PROGRESS` — shipment in transit
- `COMPLETED` — delivered
- `CANCELLED` — cancelled

#### Permissions
- Only companies involved (buyer/seller) can update order status
- Authorization checks verify company ownership

### 7) Shipment Tracking
#### Shipment Lifecycle
Created when the seller initiates shipping for an order:
- Tracking number, carrier information
- Origin/destination addresses
- Estimated vs actual delivery dates

#### Shipment Statuses
- `PENDING` — shipment created, not dispatched
- `IN_TRANSIT` — en route
- `DELIVERED` — delivered successfully
- `CANCELLED` — cancelled

#### Route Stages (Multi-modal Transport)
Each shipment supports multiple route stages with:
- **Stage Types:**
  - `ORIGIN_WAREHOUSE`
  - `PORT_OF_LOADING`
  - `CUSTOMS_EXPORT`
  - `SEA_TRANSPORT` / `AIR_TRANSPORT` / `ROAD_TRANSPORT`
  - `PORT_OF_DISCHARGE`
  - `CUSTOMS_IMPORT`
  - `DESTINATION_WAREHOUSE`
- **Stage Status:** `PENDING`, `IN_PROGRESS`, `COMPLETED`
- GPS coordinates (lat/long) for each location
- Estimated vs actual arrival/departure times
- Notes per stage

---

## ✅ Key Features Implemented

### Authentication & Authorization
- Email/password registration with BCrypt hashing
- JWT token-based authentication
- OAuth2 Google Sign-In integration
- Role-based permissions system
- Company-scoped data access

### API Endpoints (40+)

#### Auth
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — Login (JWT)

#### Companies
- `GET /api/companies/my-company` — Get user's company
- `GET /api/companies/all` — List all companies
- `PUT /api/companies/my-company` — Update company

#### Products
- `POST /api/products` — Create product
- `GET /api/products/my-company` — Company products
- `GET /api/products/active` — Active products
- `PUT /api/products/{id}` — Update product
- `DELETE /api/products/{id}` — Delete product

#### Trade Requests
- `POST /api/trade-requests` — Create request
- `GET /api/trade-requests/my-company` — My requests
- `GET /api/trade-requests/marketplace` — Browse marketplace
- `PUT /api/trade-requests/{id}` — Update request
- `PATCH /api/trade-requests/{id}/cancel` — Cancel request

#### Trade Offers
- `POST /api/trade-offers` — Make offer
- `GET /api/trade-offers/my-company` — Offers made by my company
- `GET /api/trade-offers/received` — Offers received on my requests
- `GET /api/trade-offers/accepted` — Accepted offers
- `PATCH /api/trade-offers/{id}/status` — Accept/reject offer
- `DELETE /api/trade-offers/{id}` — Delete pending offer

#### Trade Orders
- `POST /api/trade-orders/from-offer/{offerId}` — Create order from accepted offer
- `GET /api/trade-orders/my-company` — All orders
- `GET /api/trade-orders/purchases` — Orders where company is buyer
- `GET /api/trade-orders/sales` — Orders where company is seller
- `PATCH /api/trade-orders/{id}/status` — Update order status

#### Shipments
- `POST /api/shipments/order/{orderId}` — Create shipment
- `GET /api/shipments/my-company` — Company shipments
- `GET /api/shipments/order/{orderId}` — Get shipment by order
- `GET /api/shipments/status/{status}` — Filter by status
- `PATCH /api/shipments/{id}/status` — Update shipment status

---

## 📊 Database Schema (Main Tables)

### Core Entities
- `companies` — Company profiles
- `users` — User accounts
- `user_company_roles` — User-company relationships
- `roles` — Role definitions (ADMIN, IMPORTER, EXPORTER, etc.)
- `permissions` — Granular permissions

### Marketplace
- `products` — Product catalog
- `product_listings` — Active marketplace listings
- `trade_requests` — Buy/sell requests
- `trade_offers` — Offers on requests
- `trade_orders` — Confirmed orders

### Logistics
- `shipments` — Shipment tracking
- `shipment_route_stages` — Multi-stage route tracking

### Geo Intelligence (Defined but not fully utilized)
- `transport_nodes` — Ports, warehouses, etc.
- `transport_edges` — Routes between nodes
- `geo_intelligence_nodes` — Market intelligence data

---

## 🔄 Complete Trade Workflow
**Request → Offer → Order → Shipment**

---

## 🧪 Testing Infrastructure

### Automated API Testing
- Script: `run-complete-tests.js`
- Tests all 40+ endpoints systematically
- Uses two test users with different companies
- Generates `test-results.json` with:
  - Pass/Fail status for each endpoint
  - Response times
  - Error details
  - Success rate calculation

### Seed Data
- File: `data-seed.sql`
- Pre-populates database with:
  - 3 companies (Global Electronics, LPU, Tech Imports)
  - 3 users (one per company)
  - 3 products (laptops, displays, switches)
  - 7 trade requests (BUY and SELL)
  - 3 offers (PENDING, ACCEPTED)
  - 3 orders (PENDING, PROCESSING, CONFIRMED)
  - 2 shipments (IN_TRANSIT with 8 stages, DELIVERED with 4 stages)

### Test Data Seeder
- Java configuration class: `ComprehensiveTestDataSeeder.java`
- Profile: `test-full`
- Programmatically creates full workflow data

---

## 🎨 Frontend Pages

### Dashboard
- `/dashboard` — Overview with stats

### Products
- `/dashboard/products` — Product management

### Product Listings
- `/dashboard/product-listings` — Marketplace listings

### Trade Requests
- `/dashboard/trade-requests`
  - Tabs: **My Requests** | **Marketplace**
  - Create BUY/SELL requests
  - View received offers

### Trade Offers
- `/dashboard/trade-offers`
  - Offers made by company
  - Make offers on marketplace requests

### Trade Orders
- `/dashboard/trade-orders`
  - Tabs: **All** | **Purchases** | **Sales**
  - Create order from accepted offer
  - Update order status

### Shipments
- `/dashboard/shipments`
  - Create shipment for order
  - Track route stages
  - Filter by status

---

## 🔐 Security Features

### Authentication
- BCrypt password hashing (strength: **10 rounds**)
- JWT tokens with expiration
- OAuth2 Google integration
- Stateless session management

### Authorization
- Company-scoped data access
- Users can only access data for their primary company
- Ownership verification for updates/deletes
- Permission checks on sensitive operations

### Business Logic Validations
- Cannot offer on own trade requests
- Only request creator can accept offers
- Only involved companies can update orders/shipments
- Accepted offers cannot be deleted

---

## 📈 What's Working
✅ Fully functional MVP:
- User registration & authentication
- Company management
- Product CRUD operations
- Product listing marketplace
- Trade request creation (BUY/SELL)
- Trade offer submission
- Offer acceptance → Order creation
- Order status management
- Shipment creation and tracking
- Multi-stage route tracking with GPS coordinates
- Company-scoped authorization
- Complete API testing suite

---

## ⚠️ What's Not Implemented / Incomplete
❌ Missing features:
- Payment integration (no payment processing)
- Real-time chat (MongoDB schemas defined, not integrated)
- AI backend (planned, not built)
- Route optimization (service defined, not functional)
- Geo intelligence (tables exist, not utilized)
- Email notifications (no email service)
- File uploads (no document/image storage)
- Advanced search (basic search only)
- Analytics dashboard (no reporting/charts)
- Mobile app (web only)
- Multi-language support (English only)
- Trade drafts (MongoDB schema defined, not used)
- Warehouse management (tables exist, not utilized)

---

## 🗂️ Project Structure
> Add your folder layout here (e.g., `backend/`, `frontend/`, `docs/`) if you want it documented.

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL (or Supabase)
- Maven

### Backend Setup
> Add backend installation and run steps here.

### Frontend Setup
> Add frontend installation and run steps here.

### Test Credentials (Seed Data)
- **Buyer:** `buyer@globalelectronics.com` / `password123`
- **Seller:** `seller@lpu.edu` / `password123`
- **Importer:** `procurement@techimports.com` / `password123`

---

## 📝 Key Design Patterns
- Repository Pattern — data access abstraction
- DTO Pattern — prevent entity exposure
- Service Layer — business logic separation
- JWT Stateless Auth — scalable authentication
- Role-Based Access Control — flexible permissions
- Multi-tenancy — company-scoped data isolation

---

## 📊 Project Status
**Current State:** Functional MVP ✅

Core trade workflow (**Request → Offer → Order → Shipment**) is fully operational with:
- Working authentication
- Complete CRUD operations
- Multi-company support
- Comprehensive API testing
- Real-time shipment tracking

### Next Steps for Production
- Payment gateway integration
- Email notification service
- Real-time chat implementation
- File upload/storage (S3)
- Advanced analytics dashboard
- Performance optimization
- Production deployment (Docker/K8s)

---

## 👨‍💻 Development Team Context
This appears to be a student/learning project or proof-of-concept for an international trade platform, likely developed for:
- University coursework (LPU referenced in seed data)
- Portfolio demonstration
- Hackathon/competition
- Startup MVP validation

---

## 📄 License
Not specified (consider adding **MIT** or **Apache-2.0** if open-source).

---

## ℹ️ Environment
- **Last Updated:** 2026-02
