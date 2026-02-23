# IntelliCargo API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication
All endpoints (except register/login) require JWT Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication APIs

### 1.1 Register New User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "country": "USA"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

### 1.2 Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

---

## 2. Company APIs

### 2.1 Get My Company
**Endpoint:** `GET /api/companies/my-company`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Global Trade Corp",
  "registrationNumber": "REG-2024-12345",
  "country": "USA",
  "status": "ACTIVE"
}
```

### 2.2 Create Company
**Endpoint:** `POST /api/companies`

**Request Body:**
```json
{
  "name": "Global Trade Corp",
  "registrationNumber": "REG-2024-12345",
  "country": "USA"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Global Trade Corp",
  "registrationNumber": "REG-2024-12345",
  "country": "USA",
  "status": "PENDING"
}
```

---

## 3. Product APIs

### 3.1 Create Product
**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "name": "Premium Coffee Beans",
  "category": "Agriculture",
  "hsCode": "0901.21",
  "description": "High-quality Arabica coffee beans",
  "unitType": "KG",
  "originCountry": "Colombia",
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "companyId": 1,
  "companyName": "Global Trade Corp",
  "createdByUserId": 123,
  "createdByUserName": "John Doe",
  "name": "Premium Coffee Beans",
  "category": "Agriculture",
  "hsCode": "0901.21",
  "description": "High-quality Arabica coffee beans",
  "unitType": "KG",
  "originCountry": "Colombia",
  "isActive": true,
  "createdAt": "2026-02-21T10:30:00",
  "updatedAt": "2026-02-21T10:30:00"
}
```

### 3.2 Get My Company Products
**Endpoint:** `GET /api/products/my-company`

**Response:** `200 OK`
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "companyId": 1,
    "companyName": "Global Trade Corp",
    "name": "Premium Coffee Beans",
    "category": "Agriculture",
    "hsCode": "0901.21",
    "description": "High-quality Arabica coffee beans",
    "unitType": "KG",
    "originCountry": "Colombia",
    "isActive": true,
    "createdAt": "2026-02-21T10:30:00",
    "updatedAt": "2026-02-21T10:30:00"
  }
]
```

### 3.3 Search Products
**Endpoint:** `GET /api/products/search?category=Agriculture&originCountry=Colombia&isActive=true`

**Response:** Array of products matching filters

---

## 4. Product Listing APIs

### 4.1 Create Product Listing
**Endpoint:** `POST /api/product-listings`

**Request Body:**
```json
{
  "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "availableQuantity": 5000,
  "minOrderQuantity": 100,
  "maxOrderQuantity": 2000,
  "pricePerUnit": 8.50,
  "currency": "USD",
  "incoterm": "FOB",
  "portOfLoading": "Port of Cartagena",
  "validUntil": "2026-12-31",
  "listingStatus": "OPEN"
}
```

**Response:** `201 Created`
```json
{
  "id": "7b85f64-5717-4562-b3fc-2c963f66bfa7",
  "productId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "productName": "Premium Coffee Beans",
  "companyId": 1,
  "companyName": "Global Trade Corp",
  "availableQuantity": 5000,
  "minOrderQuantity": 100,
  "maxOrderQuantity": 2000,
  "pricePerUnit": 8.50,
  "currency": "USD",
  "incoterm": "FOB",
  "portOfLoading": "Port of Cartagena",
  "validUntil": "2026-12-31",
  "listingStatus": "OPEN",
  "createdAt": "2026-02-21T11:00:00",
  "updatedAt": "2026-02-21T11:00:00"
}
```

### 4.2 Get Marketplace Listings
**Endpoint:** `GET /api/product-listings/marketplace`

**Response:** Array of valid open listings

---

## 5. Trade Request APIs

### 5.1 Create Trade Request
**Endpoint:** `POST /api/trade-requests`

**Request Body:**
```json
{
  "tradeType": "BUY_PRODUCT",
  "title": "Looking to buy 1000 KG Premium Coffee",
  "description": "Need high-quality Arabica coffee beans",
  "quantity": 1000,
  "unitType": "KG",
  "budgetMin": 7.00,
  "budgetMax": 9.00,
  "currency": "USD",
  "originCountry": "Colombia",
  "destinationCountry": "USA",
  "preferredIncoterm": "CIF",
  "visibility": "GLOBAL",
  "expiresAt": "2026-03-31T23:59:59"
}
```

**Trade Types:**
- `BUY_PRODUCT`
- `SELL_PRODUCT`
- `TRANSPORT_SERVICE`
- `WAREHOUSE_SERVICE`
- `CUSTOM_SERVICE`

**Response:** `201 Created`
```json
{
  "id": "9c85f64-5717-4562-b3fc-2c963f66cfa8",
  "createdByUserId": 123,
  "createdByUserName": "John Doe",
  "companyId": 1,
  "companyName": "Global Trade Corp",
  "tradeType": "BUY_PRODUCT",
  "title": "Looking to buy 1000 KG Premium Coffee",
  "description": "Need high-quality Arabica coffee beans",
  "quantity": 1000,
  "unitType": "KG",
  "budgetMin": 7.00,
  "budgetMax": 9.00,
  "currency": "USD",
  "originCountry": "Colombia",
  "destinationCountry": "USA",
  "preferredIncoterm": "CIF",
  "tradeStatus": "OPEN",
  "visibility": "GLOBAL",
  "expiresAt": "2026-03-31T23:59:59",
  "createdAt": "2026-02-21T12:00:00",
  "updatedAt": "2026-02-21T12:00:00"
}
```

### 5.2 Get Marketplace Trade Requests
**Endpoint:** `GET /api/trade-requests/marketplace`

**Response:** Array of global, open, non-expired trade requests

---

## 6. Trade Offer APIs

### 6.1 Create Trade Offer
**Endpoint:** `POST /api/trade-offers`

**Request Body:**
```json
{
  "tradeRequestId": "9c85f64-5717-4562-b3fc-2c963f66cfa8",
  "offeredPrice": 8.25,
  "offeredQuantity": 1000,
  "currency": "USD",
  "estimatedDeliveryDays": 30,
  "additionalTerms": "Payment: 50% advance, 50% on delivery"
}
```

**Response:** `201 Created`
```json
{
  "id": "1d85f64-5717-4562-b3fc-2c963f66dfa9",
  "tradeRequestId": "9c85f64-5717-4562-b3fc-2c963f66cfa8",
  "tradeRequestTitle": "Looking to buy 1000 KG Premium Coffee",
  "offeredByCompanyId": 2,
  "offeredByCompanyName": "Coffee Exporters Ltd",
  "offeredByUserId": 456,
  "offeredByUserName": "Jane Smith",
  "offeredPrice": 8.25,
  "offeredQuantity": 1000,
  "currency": "USD",
  "estimatedDeliveryDays": 30,
  "additionalTerms": "Payment: 50% advance, 50% on delivery",
  "offerStatus": "PENDING",
  "createdAt": "2026-02-21T13:00:00",
  "updatedAt": "2026-02-21T13:00:00"
}
```

### 6.2 Accept Offer
**Endpoint:** `PATCH /api/trade-offers/{id}/status?status=ACCEPTED`

**Response:** Updated offer with status ACCEPTED

---

## 7. Trade Order APIs

### 7.1 Create Order from Accepted Offer
**Endpoint:** `POST /api/trade-orders/from-offer/{offerId}`

**Response:** `201 Created`
```json
{
  "id": "2e85f64-5717-4562-b3fc-2c963f66efa0",
  "tradeRequestId": "9c85f64-5717-4562-b3fc-2c963f66cfa8",
  "acceptedOfferId": "1d85f64-5717-4562-b3fc-2c963f66dfa9",
  "buyerCompanyId": 1,
  "buyerCompanyName": "Global Trade Corp",
  "sellerCompanyId": 2,
  "sellerCompanyName": "Coffee Exporters Ltd",
  "finalPrice": 8.25,
  "finalQuantity": 1000,
  "currency": "USD",
  "incoterm": "CIF",
  "tradeStatus": "CONTRACTED",
  "createdAt": "2026-02-21T14:00:00",
  "updatedAt": "2026-02-21T14:00:00"
}
```

### 7.2 Get My Company Orders
**Endpoint:** `GET /api/trade-orders/my-company`

**Response:** Array of all orders (as buyer or seller)

### 7.3 Update Order Status
**Endpoint:** `PATCH /api/trade-orders/{id}/status?status=IN_PROGRESS`

**Order Statuses:**
- `CONTRACTED`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

---

## 8. Shipment APIs

### 8.1 Create Shipment for Order
**Endpoint:** `POST /api/shipments/order/{orderId}`

**Response:** `201 Created`
```json
{
  "id": "3f85f64-5717-4562-b3fc-2c963f66ffa1",
  "orderId": "2e85f64-5717-4562-b3fc-2c963f66efa0",
  "status": "PENDING",
  "createdAt": "2026-02-21T15:00:00",
  "updatedAt": "2026-02-21T15:00:00"
}
```

### 8.2 Update Shipment Status
**Endpoint:** `PATCH /api/shipments/{id}/status?status=IN_TRANSIT`

**Shipment Statuses:**
- `PENDING`
- `PROCESSING`
- `IN_TRANSIT`
- `DELIVERED`
- `CANCELLED`
- `RETURNED`

**Response:** Updated shipment

---

## Complete Trade Workflow Example

### Step 1: Company A creates trade request
```
POST /api/trade-requests (BUY_PRODUCT request)
```

### Step 2: Company B makes an offer
```
POST /api/trade-offers (Offer on Company A's request)
```

### Step 3: Company A accepts the offer
```
PATCH /api/trade-offers/{offerId}/status?status=ACCEPTED
```

### Step 4: Order is created automatically
```
POST /api/trade-orders/from-offer/{offerId}
```

### Step 5: Shipment is created
```
POST /api/shipments/order/{orderId}
```

### Step 6: Track shipment status
```
PATCH /api/shipments/{id}/status?status=PROCESSING
PATCH /api/shipments/{id}/status?status=IN_TRANSIT
PATCH /api/shipments/{id}/status?status=DELIVERED
```

### Step 7: Complete order
```
PATCH /api/trade-orders/{id}/status?status=COMPLETED
```

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2026-02-21T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request body"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2026-02-21T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2026-02-21T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

### 404 Not Found
```json
{
  "timestamp": "2026-02-21T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

---

## Notes

1. Replace `{id}` with actual UUIDs in endpoints
2. All timestamps are in ISO 8601 format
3. All monetary values use BigDecimal (2 decimal precision)
4. All quantity values use BigDecimal (4 decimal precision)
5. Company data isolation is enforced - users only see their own company data
6. Admin endpoints require special permissions
