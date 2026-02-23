# API Testing Quick Start Guide

## 🚀 Getting Started

### 1. Start the Application with Test Data

Add this to your `application.yml`:
```yaml
spring:
  profiles:
    active: test
```

Or run with:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

Or in PowerShell:
```powershell
.\start-backend.ps1
```

### 2. Test User Credentials

The seeder creates 3 test users:

| Email | Password | Company | Country |
|-------|----------|---------|---------|
| john.doe@globalcorp.com | password123 | Global Trade Corp | USA |
| maria.garcia@coffeeexport.com | password123 | Coffee Exporters Ltd | Colombia |
| li.wang@asianlogistics.com | password123 | Asian Logistics Inc | China |

### 3. Install REST Client Extension (VS Code)

1. Open VS Code
2. Install "REST Client" extension by Huachao Mao
3. Open `API-TESTS.http` file
4. Click "Send Request" above each endpoint

### 4. Testing Workflow

#### Step 1: Login and Get Token
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@globalcorp.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john.doe@globalcorp.com",
  "fullName": "John Doe"
}
```

#### Step 2: Copy the token
Replace `YOUR_JWT_TOKEN_HERE` in `API-TESTS.http` with the actual token.

#### Step 3: Test All Endpoints
Open `API-TESTS.http` and click "Send Request" for each API call.

---

## 📊 Pre-Seeded Test Data

### Companies (3)
1. **Global Trade Corp** (USA) - Status: ACTIVE
2. **Coffee Exporters Ltd** (Colombia) - Status: ACTIVE
3. **Asian Logistics Inc** (China) - Status: ACTIVE

### Products (3)
1. **Premium Arabica Coffee Beans** - Colombia, 5000 KG available
2. **Premium Green Tea** - China, 3000 KG available
3. **Electronic Components** - China, 10000 UNIT available

### Product Listings (3)
1. Coffee: $8.50/KG, FOB Cartagena
2. Tea: $12.00/KG, FOB Shanghai
3. Electronics: $2.50/UNIT, EXW Shenzhen

### Trade Requests (3)
1. **BUY_PRODUCT**: Looking to buy 1000 KG Premium Coffee (Global Trade Corp)
2. **TRANSPORT_SERVICE**: Sea freight Shanghai to LA (Global Trade Corp)
3. **SELL_PRODUCT**: Premium Coffee Beans for Sale (Coffee Exporters Ltd)

---

## 🧪 Complete Trade Workflow Test

### Scenario: Coffee Purchase Deal

**Participants:**
- **Buyer**: John Doe @ Global Trade Corp
- **Seller**: Maria Garcia @ Coffee Exporters Ltd

### Step-by-Step:

#### 1. Login as Buyer (John)
```http
POST /api/auth/login
{ "email": "john.doe@globalcorp.com", "password": "password123" }
```
Save token as `@buyerToken`

#### 2. View Marketplace Trade Requests
```http
GET /api/trade-requests/marketplace
Authorization: Bearer {{buyerToken}}
```

#### 3. Login as Seller (Maria)
```http
POST /api/auth/login
{ "email": "maria.garcia@coffeeexport.com", "password": "password123" }
```
Save token as `@sellerToken`

#### 4. Seller Makes an Offer
```http
POST /api/trade-offers
Authorization: Bearer {{sellerToken}}
Content-Type: application/json

{
  "tradeRequestId": "<trade-request-id-from-step-2>",
  "offeredPrice": 8.25,
  "offeredQuantity": 1000,
  "currency": "USD",
  "estimatedDeliveryDays": 30,
  "additionalTerms": "Payment: 50% advance, 50% on delivery"
}
```

#### 5. Buyer Views Offers
```http
GET /api/trade-offers/trade-request/<trade-request-id>
Authorization: Bearer {{buyerToken}}
```

#### 6. Buyer Accepts Offer
```http
PATCH /api/trade-offers/<offer-id>/status?status=ACCEPTED
Authorization: Bearer {{buyerToken}}
```

#### 7. Buyer Creates Order
```http
POST /api/trade-orders/from-offer/<offer-id>
Authorization: Bearer {{buyerToken}}
```

#### 8. Create Shipment
```http
POST /api/shipments/order/<order-id>
Authorization: Bearer {{sellerToken}}
```

#### 9. Update Shipment Status
```http
# Processing
PATCH /api/shipments/<shipment-id>/status?status=PROCESSING
Authorization: Bearer {{sellerToken}}

# In Transit
PATCH /api/shipments/<shipment-id>/status?status=IN_TRANSIT
Authorization: Bearer {{sellerToken}}

# Delivered
PATCH /api/shipments/<shipment-id>/status?status=DELIVERED
Authorization: Bearer {{buyerToken}}
```

#### 10. Complete Order
```http
PATCH /api/trade-orders/<order-id>/status?status=COMPLETED
Authorization: Bearer {{buyerToken}}
```

---

## 📝 Response Collection Template

Create a file `test-responses.json` to save all your test responses:

```json
{
  "login": {
    "user1": {
      "request": {
        "email": "john.doe@globalcorp.com",
        "password": "password123"
      },
      "response": {
        "token": "...",
        "email": "john.doe@globalcorp.com",
        "fullName": "John Doe"
      },
      "timestamp": "2026-02-21T10:00:00"
    }
  },
  "products": {
    "create": {
      "request": {},
      "response": {},
      "timestamp": ""
    },
    "list": {
      "response": [],
      "timestamp": ""
    }
  },
  "trade_workflow": {
    "step1_create_request": {},
    "step2_make_offer": {},
    "step3_accept_offer": {},
    "step4_create_order": {},
    "step5_create_shipment": {},
    "step6_update_shipment": {},
    "step7_complete_order": {}
  }
}
```

---

## 🔍 Common Test Scenarios

### 1. Product Management Flow
```
Login → Create Product → Create Listing → View Marketplace → Update Listing
```

### 2. Trade Request Flow
```
Login → Create Request → Get Marketplace Requests → Update Request
```

### 3. Complete Order Flow
```
Create Request → Make Offer → Accept Offer → Create Order → Create Shipment → Track → Complete
```

### 4. Search & Filter Flow
```
Search Products → Filter by Category → Filter by Country → Filter by Price
```

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Make sure you've copied the JWT token and replaced `{{token}}` variable

### Issue: 403 Forbidden
**Solution:** User doesn't have permission for this action

### Issue: 404 Not Found
**Solution:** Resource ID doesn't exist, check if you're using correct UUIDs

### Issue: 400 Bad Request
**Solution:** Check request body format, ensure all required fields are present

---

## 📊 API Metrics to Track

Create a spreadsheet or document to track:

| Endpoint | Method | Request Time | Response Code | Response Size | Notes |
|----------|--------|--------------|---------------|---------------|-------|
| /api/auth/login | POST | 150ms | 200 | 450 bytes | Success |
| /api/products | POST | 200ms | 201 | 680 bytes | Success |
| ... | ... | ... | ... | ... | ... |

---

## 💡 Tips

1. **Use Variables**: In REST Client, use `@variable = value` at the top
2. **Chain Requests**: Save IDs from responses to use in next requests
3. **Organize Tests**: Group related tests together
4. **Document Responses**: Save sample responses for frontend development
5. **Test Error Cases**: Try invalid data to test error handling
6. **Performance Testing**: Note response times for optimization
7. **Security Testing**: Try accessing resources without authentication

---

## 🎯 Next Steps

1. ✅ Test all CRUD operations for each entity
2. ✅ Test complete trade workflow (Request → Offer → Order → Shipment)
3. ✅ Test search and filter endpoints
4. ✅ Test error scenarios (invalid data, unauthorized access)
5. ✅ Document all request/response formats
6. ✅ Create Postman collection (optional)
7. ✅ Share API documentation with frontend team

---

**Happy Testing! 🚀**
