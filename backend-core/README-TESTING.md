# API Testing Guide

## Automated Testing Script

This project includes an automated testing script that runs all API tests and saves responses to a JSON file.

### Setup

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Install dependencies**
   ```powershell
   npm install
   ```

### Running Tests

#### Option 1: Using the Automated Script (Recommended)

```powershell
# Run all tests and save responses automatically
npm test
```

This will:
- Execute all API endpoints
- Automatically save responses to `test-responses.json`
- Display a summary of test results
- Show success/failure rates

#### Option 2: Using VS Code REST Client

1. Open `API-TESTS.http` in VS Code
2. Install "REST Client" extension if not already installed
3. Click "Send Request" above each API call
4. Manually copy responses to `test-responses-template.json`

### Test Output

After running `npm test`, check:
- **`test-responses.json`** - Contains all API responses with timestamps
- **Console output** - Shows real-time test progress and summary

### Example Output

```
🚀 Starting IntelliCargo API Tests...

📋 Testing Authentication...
  ✓ Register: 201
  ✓ Login: 200 - Token acquired

📋 Testing Company APIs...
  ✓ Get My Company: 200
  ✓ Get All Companies: 200

📋 Testing Product APIs...
  ✓ Get My Company Products: 200
  ✓ Create Product: 201 - ID: abc-123-def
  ✓ Get Product by ID: 200
  ✓ Get All Active Products: 200
  ✓ Search Products: 200

📋 Testing Product Listing APIs...
  ✓ Get Marketplace: 200
  ✓ Create Product Listing: 201

📋 Testing Trade Request APIs...
  ✓ Get Trade Marketplace: 200
  ✓ Create Trade Request: 201

📋 Testing Error Scenarios...
  ✓ Unauthorized Test: 401
  ✓ Not Found Test: 404

💾 Saving test results...
✅ Test results saved to test-responses.json

📊 Test Summary
═══════════════════════════════════════
Total Requests:      14
Successful:          14 ✓
Failed:              0 ✗
Success Rate:        100.00%
═══════════════════════════════════════
```

### Test Response Structure

The `test-responses.json` file contains:
- **metadata** - Test run information
- **testUsers** - User credentials and tokens
- **authentication** - Login/Register results
- **companies** - Company API results
- **products** - Product CRUD results
- **productListings** - Listing API results
- **tradeRequests** - Trade API results
- **errorScenarios** - Error handling tests
- **performanceMetrics** - Response times and success rates

### Testing with Different Users

To test with the seeded users, modify the login data in `run-api-tests.js`:

```javascript
const loginData = {
  email: "maria.garcia@coffeeexport.com",  // or li.wang@asianlogistics.com
  password: "password123"
};
```

### Prerequisites

- Application must be running on `http://localhost:8080`
- Start with: `./start-backend.ps1` or `mvn spring-boot:run`
- For test data, use: `mvn spring-boot:run -Dspring-boot.run.profiles=test`

### Troubleshooting

**Issue**: `npm: command not found`
- **Solution**: Install Node.js from https://nodejs.org/

**Issue**: Connection refused
- **Solution**: Ensure the backend is running on port 8080

**Issue**: Authentication failed
- **Solution**: Verify test users exist in database or register a new user

**Issue**: 403 Forbidden errors
- **Solution**: Check user has required permissions
