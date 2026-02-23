/**
 * Automated API Testing Script
 * Runs all API tests and saves responses to test-responses.json
 * 
 * Usage: node run-api-tests.js
 * Requirements: npm install axios
 */

const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const OUTPUT_FILE = 'test-responses.json';

// Test results storage
const testResults = {
  metadata: {
    project: "IntelliCargo Backend API",
    version: "1.0.0",
    testDate: new Date().toISOString().split('T')[0],
    baseUrl: BASE_URL,
    testRunTime: new Date().toISOString()
  },
  testUsers: {
    user1: {
      email: "john.doe@globalcorp.com",
      password: "password123",
      company: "Global Trade Corp",
      token: ""
    }
  },
  authentication: {},
  companies: {},
  products: {},
  productListings: {},
  tradeRequests: {},
  tradeOffers: {},
  tradeOrders: {},
  shipments: {},
  completeWorkflow: {},
  errorScenarios: {},
  performanceMetrics: {
    averageResponseTimes: {},
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0
  },
  notes: []
};

let authToken = '';

// Helper function to make API calls and record results
async function apiCall(method, endpoint, data = null, headers = {}) {
  const startTime = Date.now();
  testResults.performanceMetrics.totalRequests++;
  
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    const responseTime = Date.now() - startTime;
    
    testResults.performanceMetrics.successfulRequests++;
    
    return {
      status: response.status,
      response: response.data,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    testResults.performanceMetrics.failedRequests++;
    
    return {
      status: error.response?.status || 'ERROR',
      response: error.response?.data || { error: error.message },
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: true
    };
  }
}

// Test Suite
async function runTests() {
  console.log('🚀 Starting IntelliCargo API Tests...\n');
  
  // ===== AUTHENTICATION TESTS =====
  console.log('📋 Testing Authentication...');
  
  // 1. Register a new user
  const registerData = {
    email: "test.user@example.com",
    password: "password123",
    fullName: "Test User",
    phoneNumber: "+1234567890",
    companyName: "Test Company",
    companyCountry: "USA",
    companyType: "EXPORTER"
  };
  
  const registerResult = await apiCall('POST', '/api/auth/register', registerData);
  testResults.authentication.register = {
    endpoint: "POST /api/auth/register",
    request: registerData,
    ...registerResult
  };
  console.log(`  ✓ Register: ${registerResult.status}`);
  
  // 2. Login with test user credentials (from seeder)
  const loginData = {
    email: "john.doe@globalcorp.com",
    password: "password123"
  };
  
  const loginResult = await apiCall('POST', '/api/auth/login', loginData);
  testResults.authentication.login = {
    endpoint: "POST /api/auth/login",
    request: loginData,
    ...loginResult
  };
  
  if (loginResult.response && loginResult.response.token) {
    authToken = loginResult.response.token;
    testResults.testUsers.user1.token = authToken;
    console.log(`  ✓ Login: ${loginResult.status} - Token acquired`);
  } else {
    console.log(`  ✗ Login failed: ${loginResult.status}`);
    console.log('  ⚠️  Continuing with limited tests...');
  }
  
  // ===== COMPANY TESTS =====
  console.log('\n📋 Testing Company APIs...');
  
  // 3. Get my company
  const myCompanyResult = await apiCall('GET', '/api/companies/my-company', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.companies.getMyCompany = {
    endpoint: "GET /api/companies/my-company",
    ...myCompanyResult
  };
  console.log(`  ✓ Get My Company: ${myCompanyResult.status}`);
  
  // 4. Get all companies (requires admin permission)
  const allCompaniesResult = await apiCall('GET', '/api/companies/all', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.companies.getAllCompanies = {
    endpoint: "GET /api/companies/all",
    ...allCompaniesResult
  };
  console.log(`  ✓ Get All Companies: ${allCompaniesResult.status}`);
  
  // ===== PRODUCT TESTS =====
  console.log('\n📋 Testing Product APIs...');
  
  // 5. Get my company products
  const myProductsResult = await apiCall('GET', '/api/products/my-company', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.products.getMyCompanyProducts = {
    endpoint: "GET /api/products/my-company",
    ...myProductsResult
  };
  console.log(`  ✓ Get My Company Products: ${myProductsResult.status}`);
  
  // 6. Create a new product
  const productData = {
    name: "Premium Coffee Beans",
    category: "Agriculture",
    hsCode: "0901.21",
    description: "High-quality Arabica coffee beans",
    unitType: "KG",
    originCountry: "Colombia",
    isActive: true
  };
  
  const createProductResult = await apiCall('POST', '/api/products', productData, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.products.create = {
    endpoint: "POST /api/products",
    request: productData,
    ...createProductResult
  };
  
  let productId = null;
  if (createProductResult.response && createProductResult.response.id) {
    productId = createProductResult.response.id;
    testResults.products.productId = productId;
    console.log(`  ✓ Create Product: ${createProductResult.status} - ID: ${productId}`);
  } else {
    console.log(`  ✓ Create Product: ${createProductResult.status}`);
  }
  
  // 7. Get product by ID
  if (productId) {
    const getProductResult = await apiCall('GET', `/api/products/${productId}`, null, {
      'Authorization': `Bearer ${authToken}`
    });
    testResults.products.getById = {
      endpoint: `GET /api/products/{id}`,
      ...getProductResult
    };
    console.log(`  ✓ Get Product by ID: ${getProductResult.status}`);
  }
  
  // 8. Get all active products
  const activeProductsResult = await apiCall('GET', '/api/products/active', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.products.getAllActive = {
    endpoint: "GET /api/products/active",
    ...activeProductsResult
  };
  console.log(`  ✓ Get All Active Products: ${activeProductsResult.status}`);
  
  // 9. Search products
  const searchResult = await apiCall('GET', '/api/products/search?category=Agriculture', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.products.search = {
    endpoint: "GET /api/products/search",
    queryParams: { category: "Agriculture" },
    ...searchResult
  };
  console.log(`  ✓ Search Products: ${searchResult.status}`);
  
  // ===== PRODUCT LISTING TESTS =====
  console.log('\n📋 Testing Product Listing APIs...');
  
  // 10. Get marketplace listings
  const marketplaceResult = await apiCall('GET', '/api/product-listings/marketplace', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.productListings.getMarketplace = {
    endpoint: "GET /api/product-listings/marketplace",
    ...marketplaceResult
  };
  console.log(`  ✓ Get Marketplace: ${marketplaceResult.status}`);
  
  // 11. Create product listing (only if we have a product ID)
  if (productId) {
    const listingData = {
      productId: productId,
      availableQuantity: 5000,
      minOrderQuantity: 100,
      maxOrderQuantity: 2000,
      pricePerUnit: 8.50,
      currency: "USD",
      incoterm: "FOB",
      portOfLoading: "Port of Cartagena",
      validUntil: "2026-12-31",
      listingStatus: "OPEN"
    };
    
    const createListingResult = await apiCall('POST', '/api/product-listings', listingData, {
      'Authorization': `Bearer ${authToken}`
    });
    testResults.productListings.create = {
      endpoint: "POST /api/product-listings",
      request: listingData,
      ...createListingResult
    };
    console.log(`  ✓ Create Product Listing: ${createListingResult.status}`);
  }
  
  // ===== TRADE REQUEST TESTS =====
  console.log('\n📋 Testing Trade Request APIs...');
  
  // 12. Get marketplace trade requests
  const tradeMarketResult = await apiCall('GET', '/api/trade-requests/marketplace', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.tradeRequests.getMarketplace = {
    endpoint: "GET /api/trade-requests/marketplace",
    ...tradeMarketResult
  };
  console.log(`  ✓ Get Trade Marketplace: ${tradeMarketResult.status}`);
  
  // 13. Create trade request
  const tradeRequestData = {
    tradeType: "BUY_PRODUCT",
    title: "Looking to buy 1000 KG Premium Coffee",
    description: "Need high-quality Arabica coffee beans",
    quantity: 1000,
    unitType: "KG",
    budgetMin: 7.00,
    budgetMax: 9.00,
    currency: "USD",
    originCountry: "Colombia",
    destinationCountry: "USA",
    preferredIncoterm: "CIF",
    visibility: "GLOBAL",
    expiresAt: "2026-03-31T23:59:59"
  };
  
  const createTradeRequestResult = await apiCall('POST', '/api/trade-requests', tradeRequestData, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.tradeRequests.create = {
    endpoint: "POST /api/trade-requests",
    request: tradeRequestData,
    ...createTradeRequestResult
  };
  console.log(`  ✓ Create Trade Request: ${createTradeRequestResult.status}`);
  
  // ===== ERROR SCENARIO TESTS =====
  console.log('\n📋 Testing Error Scenarios...');
  
  // 14. Unauthorized access (no token)
  const unauthorizedResult = await apiCall('GET', '/api/products/my-company');
  testResults.errorScenarios.unauthorized = {
    endpoint: "GET /api/products/my-company",
    withoutToken: true,
    expectedStatus: 401,
    ...unauthorizedResult
  };
  console.log(`  ✓ Unauthorized Test: ${unauthorizedResult.status}`);
  
  // 15. Not found error
  const notFoundResult = await apiCall('GET', '/api/products/00000000-0000-0000-0000-000000000000', null, {
    'Authorization': `Bearer ${authToken}`
  });
  testResults.errorScenarios.notFound = {
    endpoint: "GET /api/products/00000000-0000-0000-0000-000000000000",
    expectedStatus: 404,
    ...notFoundResult
  };
  console.log(`  ✓ Not Found Test: ${notFoundResult.status}`);
  
  // ===== CALCULATE METRICS =====
  calculateMetrics();
  
  // ===== SAVE RESULTS =====
  console.log('\n💾 Saving test results...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(testResults, null, 2));
  console.log(`✅ Test results saved to ${OUTPUT_FILE}\n`);
  
  // ===== DISPLAY SUMMARY =====
  displaySummary();
}

function calculateMetrics() {
  const { totalRequests, successfulRequests, failedRequests } = testResults.performanceMetrics;
  testResults.performanceMetrics.successRate = totalRequests > 0 
    ? `${((successfulRequests / totalRequests) * 100).toFixed(2)}%` 
    : '0%';
}

function displaySummary() {
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════');
  console.log(`Total Requests:      ${testResults.performanceMetrics.totalRequests}`);
  console.log(`Successful:          ${testResults.performanceMetrics.successfulRequests} ✓`);
  console.log(`Failed:              ${testResults.performanceMetrics.failedRequests} ✗`);
  console.log(`Success Rate:        ${testResults.performanceMetrics.successRate}`);
  console.log('═══════════════════════════════════════\n');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});
