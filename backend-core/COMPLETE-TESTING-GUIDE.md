# 🚀 IntelliCargo Complete System Testing Guide

## 📋 Overview

This testing suite provides **comprehensive end-to-end testing** for the entire IntelliCargo backend system, covering **all 47+ API endpoints** across **9 controllers**.

### ✨ Features

- ✅ **Complete Coverage**: Tests ALL endpoints (GET, POST, PUT, PATCH, DELETE)
- ✅ **Automated Workflow**: Tests complete business flows (products → listings → trades → orders → shipments)
- ✅ **JWT Authentication**: Automatic token management for all authenticated requests
- ✅ **Comprehensive Data Seeding**: Rich test data with complete entity relationships
- ✅ **Detailed Reporting**: JSON results file with pass/fail status for each endpoint
- ✅ **Color-Coded Console**: Real-time test progress with visual feedback

---

## 📊 Test Coverage

### Total: **47+ Endpoints** across **9 Controllers**

| Controller | Endpoints | Methods |
|------------|-----------|---------|
| **AuthController** | 2 | POST |
| **UserController** | 3 | GET |
| **CompanyController** | 4 | GET, PUT |
| **ProductController** | 7 | GET, POST, PUT, DELETE |
| **ProductListingController** | 9 | GET, POST, PUT, PATCH, DELETE |
| **TradeRequestController** | 7 | GET, POST, PUT, PATCH |
| **TradeOfferController** | 5 | GET, POST, PATCH, DELETE |
| **TradeOrderController** | 6 | GET, POST, PATCH |
| **ShipmentController** | 5 | GET, POST, PATCH |

---

## 🛠️ Setup & Installation

### 1. Prerequisites

- **Java 17+** (Spring Boot backend)
- **PostgreSQL** (Database)
- **Node.js 16+** (Test runner)
- **npm** (Package manager)

### 2. Install Dependencies

```powershell
# Install Node.js dependencies
npm install
```

### 3. Configure Database

Ensure your [application.yml](src/main/resources/application.yml) has correct database settings:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://your-host:5432/intellicargo
    username: your-username
    password: your-password
```

---

## 🚀 Running Tests

### Method 1: Complete System Test (Recommended)

This runs **ALL 47+ endpoints** with comprehensive workflow testing:

```powershell
# Step 1: Start backend with comprehensive test data
.\start-backend.ps1 test-full

# Step 2: Run complete test suite
npm run test:complete
```

### Method 2: Quick Test (Basic endpoints only)

```powershell
# Step 1: Start backend with basic test data
.\start-backend.ps1 test

# Step 2: Run quick tests
npm test
```

---

## 📁 Test Data Seeding

### Profile: `test` (Basic)
**File**: [TestDataSeederConfig.java](src/main/java/com/intellicargo/core/Config/TestDataSeederConfig.java)

Creates basic test data:
- 3 Companies
- 3 Users
- 3 Products
- 3 Product Listings
- 3 Trade Requests

### Profile: `test-full` (Comprehensive) ⭐

**File**: [ComprehensiveTestDataSeeder.java](src/main/java/com/intellicargo/core/Config/ComprehensiveTestDataSeeder.java)

Creates complete workflow data:
- 3 Companies (IMPORTER, EXPORTER, FREIGHT_FORWARDER)
- 5 Permissions
- 2 Roles (COMPANY_ADMIN, TRADE_MANAGER)
- 3 Users with company associations
- 5 Products (Coffee, Tea, Electronics, Cocoa, Machinery)
- 4 Product Listings (OPEN status)
- 3 Trade Requests (BUY/SELL/TRANSPORT)
- 3 Trade Offers (PENDING, ACCEPTED, REJECTED)
- 1 Trade Order (CONTRACTED)
- 2 Shipments (IN_TRANSIT, PENDING)

### Test User Credentials

| Email | Password | Company | Role |
|-------|----------|---------|------|
| john.doe@globalcorp.com | password123 | Global Trade Corp (USA) | COMPANY_ADMIN |
| maria.garcia@coffeeexport.com | password123 | Coffee Exporters Ltd (Colombia) | COMPANY_ADMIN |
| li.wang@asianlogistics.com | password123 | Asian Logistics Inc (China) | COMPANY_ADMIN |

---

## 📊 Understanding Test Results

### Console Output

Tests display real-time progress with color coding:
- 🟢 **Green**: Test passed
- 🔴 **Red**: Test failed
- 🟡 **Yellow**: Test skipped (dependency missing)
- 🔵 **Cyan**: Informational message

### Example Output:
```
🚀 ====================================
🚀 IntelliCargo Complete System Test Suite
🚀 ====================================

📝 TESTING AUTH CONTROLLER
================================
✅ POST /auth/register - PASSED
✅ POST /auth/login - PASSED

👤 TESTING USER CONTROLLER
================================
✅ GET /users/me - PASSED
✅ GET /users/me/roles - PASSED
❌ GET /users/admin/all - FAILED: Forbidden

...

📊 TEST RESULTS SUMMARY
════════════════════════════════════════════════════════
Total Tests:     48
✅ Passed:        45
❌ Failed:        2
⏭️  Skipped:       1
📈 Success Rate:  93.75%
⏱️  Duration:      12.5s
════════════════════════════════════════════════════════
```

### JSON Results File

**Location**: `test-results.json`

**Structure**:
```json
{
  "summary": {
    "totalTests": 48,
    "passed": 45,
    "failed": 2,
    "skipped": 1,
    "successRate": "93.75%",
    "duration": "12.5s",
    "startTime": "2024-01-15T10:30:00.000Z",
    "endTime": "2024-01-15T10:30:12.500Z"
  },
  "tests": [
    {
      "endpoint": "/auth/login",
      "method": "POST",
      "passed": true,
      "failed": false,
      "skipped": false,
      "status": "PASS",
      "statusCode": 200,
      "responseTime": 450,
      "error": null,
      "timestamp": "2024-01-15T10:30:01.234Z"
    },
    ...
  ]
}
```

---

## 🧪 Testing Workflows

The test suite validates complete business workflows:

### 1. **Product Management Flow**
```
CREATE Product → GET Products → UPDATE Product → DELETE Product
```

### 2. **Listing & Marketplace Flow**
```
CREATE Listing → View Marketplace → UPDATE Listing → CLOSE Listing
```

### 3. **Trade Request Flow**
```
CREATE Trade Request → Search Marketplace → UPDATE Request → CANCEL Request
```

### 4. **Complete Trade Flow** ⭐
```
Trade Request (OPEN)
  ↓
Trade Offer (PENDING)
  ↓
Accept Offer (ACCEPTED)
  ↓
Create Order (CONTRACTED)
  ↓
Create Shipment (PENDING)
  ↓
Update Shipment Status (IN_TRANSIT)
  ↓
Complete Delivery (DELIVERED)
```

---

## 🔍 Troubleshooting

### Issue: "Connection refused" error

**Solution**: Ensure backend is running on port 8080
```powershell
.\start-backend.ps1 test-full
```

### Issue: "401 Unauthorized" errors

**Solution**: Check that test users exist in database
- Verify seeder ran successfully
- Check console logs for "✅ Test data seeding completed"

### Issue: Many "SKIP" results

**Solution**: This is normal for first run
- Skipped tests depend on entities created in previous tests
- Subsequent test runs should have fewer skips

### Issue: Database errors during seeding

**Solution**: Clear database before re-seeding
```sql
-- Run in PostgreSQL
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

---

## 📝 Manual Testing (Alternative)

Use the HTTP file for manual testing in VS Code or IntelliJ:

**File**: [API-TESTS.http](API-TESTS.http)

Install REST Client extension for VS Code:
```
ext install humao.rest-client
```

---

## 🎯 Test Development

### Adding New Tests

Edit [run-complete-tests.js](run-complete-tests.js):

```javascript
async function testMyNewController() {
  log('\n🎨 TESTING MY NEW CONTROLLER', 'info');
  log('================================\n', 'info');
  
  // GET endpoint
  try {
    const response = await makeRequest('GET', '/my-endpoint', null, authTokenUser1);
    recordTest('/my-endpoint', 'GET', 'PASS', response);
  } catch (error) {
    recordTest('/my-endpoint', 'GET', 'FAIL', null, error);
  }
}

// Add to runAllTests()
async function runAllTests() {
  ...
  await testMyNewController();
  ...
}
```

### Enhancing Test Data

Edit [ComprehensiveTestDataSeeder.java](src/main/java/com/intellicargo/core/Config/ComprehensiveTestDataSeeder.java):

```java
// Add more entities in the seedComprehensiveData() method
ProductModel product6 = new ProductModel();
product6.setName("New Product");
product6.setCategory("New Category");
// ... set other fields
product6 = productRepository.save(product6);
```

---

## 📚 Documentation

- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Testing Guide**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **README Testing**: [README-TESTING.md](README-TESTING.md)

---

## 🎓 Best Practices

### ✅ DO:
- Always start backend before running tests
- Use `test-full` profile for comprehensive testing
- Review `test-results.json` after each run
- Check console for real-time test status
- Clear database when test data becomes inconsistent

### ❌ DON'T:
- Don't run tests on production database
- Don't modify test users manually in database
- Don't run multiple test instances simultaneously
- Don't ignore failed tests (they indicate API issues)

---

## 📈 Success Metrics

**Target**: 95%+ success rate

- **Excellent**: 95-100% (45+ passed out of 48)
- **Good**: 85-94% (40-44 passed)
- **Needs Work**: <85% (39 or fewer passed)

---

## 🚀 Quick Start Commands

```powershell
# Complete system test (recommended)
.\start-backend.ps1 test-full
npm run test:complete

# Quick basic test
.\start-backend.ps1 test
npm test

# View results
cat test-results.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Check specific failed tests
cat test-results.json | ConvertFrom-Json | % { $_.tests | Where-Object { $_.failed -eq $true } }
```

---

## 💡 Pro Tips

1. **Check Response Times**: Review `responseTime` in test results to identify slow endpoints
2. **Test Sequentially**: Don't parallelize tests - they have dependencies
3. **Fresh Database**: Re-seed database between major test runs
4. **Monitor Logs**: Watch backend console for database errors
5. **JWT Expiry**: Tokens last 24 hours - restart backend if tests start failing with 401

---

## 🤝 Contributing

When adding new features:
1. Add test data to `ComprehensiveTestDataSeeder.java`
2. Create test cases in `run-complete-tests.js`
3. Update this README with new endpoints
4. Ensure 95%+ test pass rate maintained

---

## 📧 Support

For issues or questions:
- Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing instructions
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoint specifications
- Check backend console logs for error details

---

**Happy Testing! 🎉**

Last Updated: January 2024
Version: 2.0.0
