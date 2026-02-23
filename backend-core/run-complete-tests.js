/**
 * IntelliCargo Complete System Test Suite
 * Tests ALL 47+ API endpoints with all HTTP methods
 * Generates comprehensive test results report
 */

const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080/api';
let authTokenUser1 = '';
let authTokenUser2 = '';
let authTokenUser3 = '';

// Test Results Storage
const testResults = {
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    startTime: new Date().toISOString(),
    endTime: '',
    duration: ''
  },
  tests: []
};

// ===================== UTILITY FUNCTIONS =====================

function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function recordTest(endpoint, method, status, response = null, error = null, skipped = false, requestData = null) {
  testResults.summary.totalTests++;
  
  const test = {
    endpoint,
    method,
    passed: status === 'PASS',
    failed: status === 'FAIL',
    skipped: skipped,
    status,
    statusCode: response?.status || error?.response?.status || null,
    responseTime: response?.responseTime || null,
    error: error ? (error.response?.data?.message || error.message) : null,
    timestamp: new Date().toISOString(),
    requestData: requestData || null,
    responseData: response?.data || null,
    errorDetails: error?.response?.data || null
  };
  
  testResults.tests.push(test);
  
  if (status === 'PASS') {
    testResults.summary.passed++;
    log(`✅ ${method} ${endpoint} - PASSED`, 'success');
  } else if (status === 'FAIL') {
    testResults.summary.failed++;
    log(`❌ ${method} ${endpoint} - FAILED: ${test.error}`, 'error');
  } else if (skipped) {
    testResults.summary.skipped++;
    log(`⏭️  ${method} ${endpoint} - SKIPPED`, 'warning');
  }
}

async function makeRequest(method, url, data = null, token = null) {
  const startTime = Date.now();
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    if (data) {
      config.data = data;
    }
    // Debug output for PUT requests
    if (method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
      console.log(`DEBUG: ${method} ${url}, Headers: ${JSON.stringify(config.headers)}, Data: ${JSON.stringify(data)}`);
    }
    const response = await axios(config);
    response.responseTime = Date.now() - startTime;
    return response;
  } catch (error) {
    error.responseTime = Date.now() - startTime;
    if (method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
      console.log(`DEBUG ERROR: ${method} ${url}, Status: ${error.response?.status}, Error: ${error.message}`);
    }
    throw error;
  }
}

// ===================== TEST SUITES =====================

// 1. AUTH CONTROLLER TESTS (2 endpoints)
async function testAuthController() {
  log('\n📝 TESTING AUTH CONTROLLER', 'info');
  log('================================\n', 'info');
  
  // POST /api/auth/register
  try {
    const requestData = {
      email: 'test.user@example.com',
      password: 'password123',
      fullName: 'Test User',
      companyName: 'Test Company',
      country: 'USA'
    };
    const response = await makeRequest('POST', '/auth/register', requestData);
    recordTest('/auth/register', 'POST', 'PASS', response, null, false, requestData);
  } catch (error) {
    if (error.response?.status === 400) {
      // User already exists is acceptable
      const reqData = {email: 'test.user@example.com'};
      recordTest('/auth/register', 'POST', 'PASS', error.response, null, false, reqData);
    } else {
      const reqData = {email: 'test.user@example.com'};
      recordTest('/auth/register', 'POST', 'FAIL', null, error, false, reqData);
    }
  }
  
  // POST /api/auth/login (User 1)
  try {
    const requestData = {
      email: 'john.doe@globalcorp.com',
      password: 'password123'
    };
    const response = await makeRequest('POST', '/auth/login', requestData);
    authTokenUser1 = response.data.token;
    recordTest('/auth/login', 'POST', 'PASS', response, null, false, requestData);
  } catch (error) {
    recordTest('/auth/login', 'POST', 'FAIL', null, error, false, {email: 'john.doe@globalcorp.com'});
    return; // Cannot continue without auth
  }
  
  // Login User 2
  try {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'maria.garcia@coffeeexport.com',
      password: 'password123'
    });
    authTokenUser2 = response.data.token;
  } catch (error) {
    log('⚠️  Could not login user2', 'warning');
  }
  
  // Login User 3
  try {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'li.wang@asianlogistics.com',
      password: 'password123'
    });
    authTokenUser3 = response.data.token;
  } catch (error) {
    log('⚠️  Could not login user3', 'warning');
  }
}

// 2. USER CONTROLLER TESTS (3 endpoints)
async function testUserController() {
  log('\n👤 TESTING USER CONTROLLER', 'info');
  log('================================\n', 'info');
  
  // GET /api/users/me
  try {
    const response = await makeRequest('GET', '/users/me', null, authTokenUser1);
    recordTest('/users/me', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/users/me', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/users/me/roles
  try {
    const response = await makeRequest('GET', '/users/me/roles', null, authTokenUser1);
    recordTest('/users/me/roles', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/users/me/roles', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/users/admin/all
  try {
    const response = await makeRequest('GET', '/users/admin/all', null, authTokenUser1);
    recordTest('/users/admin/all', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/users/admin/all', 'GET', 'FAIL', null, error, false);
  }
}

// 3. COMPANY CONTROLLER TESTS (4 endpoints)
async function testCompanyController() {
  log('\n🏢 TESTING COMPANY CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let companyId = null;
  
  // GET /api/companies/my-company
  try {
    const response = await makeRequest('GET', '/companies/my-company', null, authTokenUser1);
    companyId = response.data.id || response.data.companyId;
    recordTest('/companies/my-company', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/companies/my-company', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/companies/all
  try {
    const response = await makeRequest('GET', '/companies/all', null, authTokenUser1);
    recordTest('/companies/all', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/companies/all', 'GET', 'FAIL', null, error, false);
  }
  
  // PUT /api/companies/my-company
  try {
    const requestData = {
      name: 'Global Trade Corp - Updated',
      country: 'USA',
      registrationNumber: 'US-GTC-2024-001'
    };
    const response = await makeRequest('PUT', '/companies/my-company', requestData, authTokenUser1);
    recordTest('/companies/my-company', 'PUT', 'PASS', response, null, false, requestData);
  } catch (error) {
    recordTest('/companies/my-company', 'PUT', 'FAIL', null, error, false, {
      name: 'Global Trade Corp - Updated',
      country: 'USA',
      registrationNumber: 'US-GTC-2024-001'
    });
  }
  
  // PUT /api/companies/{id}
  if (companyId) {
    try {
      const requestData = {
        name: 'Global Trade Corp - Admin Updated',
        country: 'USA',
        registrationNumber: 'US-GTC-2024-001'
      };
      const response = await makeRequest('PUT', `/companies/${companyId}`, requestData, authTokenUser1);
      recordTest('/companies/{id}', 'PUT', 'PASS', response, null, false, requestData);
    } catch (error) {
      recordTest('/companies/{id}', 'PUT', 'FAIL', null, error, false, {
        name: 'Global Trade Corp - Admin Updated',
        country: 'USA'
      });
    }
  } else {
    recordTest('/companies/{id}', 'PUT', 'SKIP', null, null, true, null);
  }
}

// 4. PRODUCT CONTROLLER TESTS (7 endpoints)
async function testProductController() {
  log('\n📦 TESTING PRODUCT CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let productId = null;
  
  // First, try to get existing products
  try {
    const response = await makeRequest('GET', '/products/my-company', null, authTokenUser1);
    if (response.data.length > 0) {
      productId = response.data[0].productId || response.data[0].id;
    }
  } catch (error) {
    // Ignore - will try to create
  }
  
  // POST /api/products (create)
  try {
    const response = await makeRequest('POST', '/products', {
      name: 'Test Product Auto-Created',
      category: 'Electronics',
      hsCode: '8517.12',
      description: 'Automated test product',
      unitType: 'UNIT',
      originCountry: 'USA'
    }, authTokenUser1);
    if (!productId) {
      productId = response.data.productId || response.data.id;
    }
    recordTest('/products', 'POST', 'PASS', response);
  } catch (error) {
    recordTest('/products', 'POST', 'FAIL', null, error, false);
  }
  
  // GET /api/products/{id}
  if (productId) {
    try {
      const response = await makeRequest('GET', `/products/${productId}`, null, authTokenUser1);
      recordTest('/products/{id}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/products/{id}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/products/{id}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/products/my-company
  try {
    const response = await makeRequest('GET', '/products/my-company', null, authTokenUser1);
    if (!productId && response.data.length > 0) {
      productId = response.data[0].productId || response.data[0].id;
    }
    recordTest('/products/my-company', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/products/my-company', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/products/active
  try {
    const response = await makeRequest('GET', '/products/active', null, authTokenUser1);
    recordTest('/products/active', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/products/active', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/products/category/{category}
  try {
    const response = await makeRequest('GET', '/products/category/Agriculture', null, authTokenUser1);
    recordTest('/products/category/{category}', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/products/category/{category}', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/products/search?keyword=coffee
  try {
    const response = await makeRequest('GET', '/products/search?keyword=coffee', null, authTokenUser1);
    recordTest('/products/search', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/products/search', 'GET', 'FAIL', null, error, false);
  }
  
  // PUT /api/products/{id}
  if (productId) {
    try {
      const response = await makeRequest('PUT', `/products/${productId}`, {
        name: 'Test Product Updated',
        description: 'Updated description'
      }, authTokenUser1);
      recordTest('/products/{id}', 'PUT', 'PASS', response);
    } catch (error) {
      recordTest('/products/{id}', 'PUT', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/products/{id}', 'PUT', 'SKIP', null, null, true, null);
  }
  
  // DELETE /api/products/{id}
  if (productId) {
    try {
      const response = await makeRequest('DELETE', `/products/${productId}`, null, authTokenUser1);
      recordTest('/products/{id}', 'DELETE', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/products/{id}', 'DELETE', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/products/{id}', 'DELETE', 'SKIP', null, null, true, null);
  }
}

// 5. PRODUCT LISTING CONTROLLER TESTS (9 endpoints)
async function testProductListingController() {
  log('\n📋 TESTING PRODUCT LISTING CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let listingId = null;
  let productId = null;
  
  // First, get existing listings to extract IDs
  try {
    const response = await makeRequest('GET', '/product-listings/my-company', null, authTokenUser2);
    if (response.data.length > 0) {
      listingId = response.data[0].listingId || response.data[0].id;
      productId = response.data[0].product?.productId || response.data[0].product?.id || response.data[0].productId;
    }
  } catch (error) {
    // Ignore - will try to get product separately
  }
  
  // If no product yet, get from products endpoint
  if (!productId) {
    try {
      const response = await makeRequest('GET', '/products/my-company', null, authTokenUser2);
      if (response.data.length > 0) {
        productId = response.data[0].productId || response.data[0].id;
      }
    } catch (error) {
      log('⚠️  Could not fetch products for listing creation', 'warning');
    }
  }
  
  // POST /api/product-listings (create)
  if (productId) {
    try {
      const response = await makeRequest('POST', '/product-listings', {
        productId: productId,
        availableQuantity: 500.0,
        minOrderQuantity: 10.0,
        maxOrderQuantity: 200.0,
        pricePerUnit: 15.50,
        currency: 'USD',
        incoterm: 'FOB',
        portOfLoading: 'Test Port',
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }, authTokenUser2);
      if (!listingId) {
        listingId = response.data.listingId || response.data.id;
      }
      recordTest('/product-listings', 'POST', 'PASS', response);
    } catch (error) {
      recordTest('/product-listings', 'POST', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/product-listings', 'POST', 'SKIP', null, null, true, null);
  }
  
  // GET /api/product-listings/{id}
  if (listingId) {
    try {
      const response = await makeRequest('GET', `/product-listings/${listingId}`, null, authTokenUser1);
      recordTest('/product-listings/{id}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/product-listings/{id}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/product-listings/{id}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/product-listings/my-company
  try {
    const response = await makeRequest('GET', '/product-listings/my-company', null, authTokenUser2);
    if (!listingId && response.data.length > 0) {
      listingId = response.data[0].listingId || response.data[0].id;
    }
    recordTest('/product-listings/my-company', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/product-listings/my-company', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/product-listings/marketplace
  try {
    const response = await makeRequest('GET', '/product-listings/marketplace', null, authTokenUser1);
    recordTest('/product-listings/marketplace', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/product-listings/marketplace', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/product-listings/product/{productId}
  if (productId) {
    try {
      const response = await makeRequest('GET', `/product-listings/product/${productId}`, null, authTokenUser1);
      recordTest('/product-listings/product/{productId}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/product-listings/product/{productId}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/product-listings/product/{productId}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/product-listings/search?keyword=coffee
  try {
    const response = await makeRequest('GET', '/product-listings/search?keyword=coffee', null, authTokenUser1);
    recordTest('/product-listings/search', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/product-listings/search', 'GET', 'FAIL', null, error, false);
  }
  
  // PUT /api/product-listings/{id}
  if (listingId) {
    try {
      const response = await makeRequest('PUT', `/product-listings/${listingId}`, {
        availableQuantity: 450.0,
        pricePerUnit: 16.00
      }, authTokenUser2);
      recordTest('/product-listings/{id}', 'PUT', 'PASS', response);
    } catch (error) {
      recordTest('/product-listings/{id}', 'PUT', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/product-listings/{id}', 'PUT', 'SKIP', null, null, true, null);
  }
  
  // PATCH /api/product-listings/{id}/close
  if (listingId) {
    try {
      const response = await makeRequest('PATCH', `/product-listings/${listingId}/close`, null, authTokenUser2);
      recordTest('/product-listings/{id}/close', 'PATCH', 'PASS', response);
    } catch (error) {
      recordTest('/product-listings/{id}/close', 'PATCH', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/product-listings/{id}/close', 'PATCH', 'SKIP', null, null, true, null);
  }
  
  // DELETE /api/product-listings/{id}
  if (listingId) {
    try {
      const response = await makeRequest('DELETE', `/product-listings/${listingId}`, null, authTokenUser2);
      recordTest('/product-listings/{id}', 'DELETE', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/product-listings/{id}', 'DELETE', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/product-listings/{id}', 'DELETE', 'SKIP', null, null, true, null);
  }
}

// 6. TRADE REQUEST CONTROLLER TESTS (7 endpoints)
async function testTradeRequestController() {
  log('\n🤝 TESTING TRADE REQUEST CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let requestId = null;
  
  // First try to get existing trade requests
  try {
    const response = await makeRequest('GET', '/trade-requests/my-company', null, authTokenUser1);
    if (response.data.length > 0) {
      requestId = response.data[0].requestId || response.data[0].id;
    }
  } catch (error) {
    // Ignore - will try to create
  }
  
  // POST /api/trade-requests (create)
  try {
    const response = await makeRequest('POST', '/trade-requests', {
      tradeType: 'BUY_PRODUCT',
      title: 'Test Trade Request Auto-Created',
      description: 'Automated test trade request',
      quantity: 100.0,
      unitType: 'KG',
      budgetMin: 5.00,
      budgetMax: 10.00,
      currency: 'USD',
      originCountry: 'Colombia',
      destinationCountry: 'USA',
      preferredIncoterm: 'FOB',
      visibility: 'GLOBAL',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    }, authTokenUser1);
    if (!requestId) {
      requestId = response.data.requestId || response.data.id;
    }
    recordTest('/trade-requests', 'POST', 'PASS', response);
  } catch (error) {
    recordTest('/trade-requests', 'POST', 'FAIL', null, error, false);
  }
  
  // GET /api/trade-requests/{id}
  if (requestId) {
    try {
      const response = await makeRequest('GET', `/trade-requests/${requestId}`, null, authTokenUser1);
      recordTest('/trade-requests/{id}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/trade-requests/{id}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-requests/{id}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/trade-requests/my-company
  try {
    const response = await makeRequest('GET', '/trade-requests/my-company', null, authTokenUser1);
    if (!requestId && response.data.length > 0) {
      requestId = response.data[0].requestId;
    }
    recordTest('/trade-requests/my-company', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-requests/my-company', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/trade-requests/marketplace
  try {
    const response = await makeRequest('GET', '/trade-requests/marketplace', null, authTokenUser1);
    recordTest('/trade-requests/marketplace', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-requests/marketplace', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/trade-requests/type/{type}
  try {
    const response = await makeRequest('GET', '/trade-requests/type/BUY_PRODUCT', null, authTokenUser1);
    recordTest('/trade-requests/type/{type}', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-requests/type/{type}', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/trade-requests/search?keyword=coffee
  try {
    const response = await makeRequest('GET', '/trade-requests/search?keyword=coffee', null, authTokenUser1);
    recordTest('/trade-requests/search', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-requests/search', 'GET', 'FAIL', null, error, false);
  }
  
  // PUT /api/trade-requests/{id}
  if (requestId) {
    try {
      const response = await makeRequest('PUT', `/trade-requests/${requestId}`, {
        title: 'Test Trade Request Updated',
        budgetMax: 12.00
      }, authTokenUser1);
      recordTest('/trade-requests/{id}', 'PUT', 'PASS', response);
    } catch (error) {
      recordTest('/trade-requests/{id}', 'PUT', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-requests/{id}', 'PUT', 'SKIP', null, null, true, null);
  }
  
  // PATCH /api/trade-requests/{id}/cancel
  if (requestId) {
    try {
      const response = await makeRequest('PATCH', `/trade-requests/${requestId}/cancel`, null, authTokenUser1);
      recordTest('/trade-requests/{id}/cancel', 'PATCH', 'PASS', response);
    } catch (error) {
      recordTest('/trade-requests/{id}/cancel', 'PATCH', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-requests/{id}/cancel', 'PATCH', 'SKIP', null, null, true, null);
  }
}

// 7. TRADE OFFER CONTROLLER TESTS (5 endpoints)
async function testTradeOfferController() {
  log('\n💼 TESTING TRADE OFFER CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let offerId = null;
  let requestId = null;
  
  // First try to get existing offers 
  try {
    const response = await makeRequest('GET', '/trade-offers/my-company', null, authTokenUser2);
    if (response.data.length > 0) {
      offerId = response.data[0].offerId || response.data[0].id;
      requestId = response.data[0].tradeRequest?.requestId || response.data[0].tradeRequest?.id || response.data[0].tradeRequestId;
    }
  } catch (error) {
    // Ignore
  }
  
  // Get an open trade request if not found
  if (!requestId) {
    try {
      const response = await makeRequest('GET', '/trade-requests/marketplace', null, authTokenUser2);
      if (response.data.length > 0) {
        // Find an OPEN request
        const openRequest = response.data.find(r => r.tradeStatus === 'OPEN');
        if (openRequest) {
          requestId = openRequest.requestId || openRequest.id;
        } else if (response.data.length > 0) {
          requestId = response.data[0].requestId || response.data[0].id;
        }
      }
    } catch (error) {
      log('⚠️  Could not fetch trade requests for offer creation', 'warning');
    }
  }
  
  // POST /api/trade-offers (create)
  if (requestId) {
    try {
      const response = await makeRequest('POST', '/trade-offers', {
        tradeRequestId: requestId,
        offeredPrice: 8.50,
        offeredQuantity: 100.0,
        currency: 'USD',
        estimatedDeliveryDays: 30,
        additionalTerms: 'Test offer - automated'
      }, authTokenUser2);
      if (!offerId) {
        offerId = response.data.offerId || response.data.id;
      }
      recordTest('/trade-offers', 'POST', 'PASS', response);
    } catch (error) {
      recordTest('/trade-offers', 'POST', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-offers', 'POST', 'SKIP', null, null, true, null);
  }
  
  // GET /api/trade-offers/{id}
  if (offerId) {
    try {
      const response = await makeRequest('GET', `/trade-offers/${offerId}`, null, authTokenUser1);
      recordTest('/trade-offers/{id}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/trade-offers/{id}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-offers/{id}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/trade-offers/trade-request/{requestId}
  if (requestId) {
    try {
      const response = await makeRequest('GET', `/trade-offers/trade-request/${requestId}`, null, authTokenUser1);
      recordTest('/trade-offers/trade-request/{requestId}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/trade-offers/trade-request/{requestId}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-offers/trade-request/{requestId}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/trade-offers/my-company
  try {
    const response = await makeRequest('GET', '/trade-offers/my-company', null, authTokenUser2);
    if (!offerId && response.data.length > 0) {
      offerId = response.data[0].offerId;
    }
    recordTest('/trade-offers/my-company', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-offers/my-company', 'GET', 'FAIL', null, error, false);
  }
  
  // PATCH /api/trade-offers/{id}/status
  let patchOfferId = offerId;
  if (patchOfferId) {
    try {
      const requestData = { status: 'ACCEPTED' };
      const response = await makeRequest('PATCH', `/trade-offers/${patchOfferId}/status?status=ACCEPTED`, null, authTokenUser1);
      recordTest('/trade-offers/{id}/status', 'PATCH', 'PASS', response, null, false, requestData);
    } catch (error) {
      recordTest('/trade-offers/{id}/status', 'PATCH', 'FAIL', null, error, false, { status: 'ACCEPTED' });
    }
  } else {
    recordTest('/trade-offers/{id}/status', 'PATCH', 'SKIP', null, null, true, null);
  }
  
  // DELETE /api/trade-offers/{id} - Use a PENDING offer for deletion
  let deleteOfferId = null;
  try {
    const response = await makeRequest('GET', '/trade-offers/my-company', null, authTokenUser2);
    // Look for a PENDING offer to delete (not ACCEPTED)
    const pendingOffer = response.data.find(o => o.offerStatus === 'PENDING');
    if (pendingOffer) {
      deleteOfferId = pendingOffer.offerId || pendingOffer.id;
    }
  } catch (error) {
    // Ignore
  }
  
  if (deleteOfferId) {
    try {
      const response = await makeRequest('DELETE', `/trade-offers/${deleteOfferId}`, null, authTokenUser2);
      recordTest('/trade-offers/{id}', 'DELETE', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/trade-offers/{id}', 'DELETE', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-offers/{id}', 'DELETE', 'SKIP', null, null, true, null);
  }
}

// 8. TRADE ORDER CONTROLLER TESTS (6 endpoints)
async function testTradeOrderController() {
  log('\n📜 TESTING TRADE ORDER CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let orderId = null;
  let acceptedOfferId = null;
  
  // First try to get existing orders
  try {
    const response = await makeRequest('GET', '/trade-orders/my-company', null, authTokenUser1);
    if (response.data.length > 0) {
      orderId = response.data[0].orderId || response.data[0].id;
    }
  } catch (error) {
    // Ignore
  }
  
  // Get an accepted offer from seeded data
  try {
    const response = await makeRequest('GET', '/trade-offers/my-company', null, authTokenUser2);
    // Look for PENDING or ACCEPTED offer
    const suitable = response.data.find(o => o.offerStatus === 'ACCEPTED' || o.offerStatus === 'PENDING');
    if (suitable) {
      acceptedOfferId = suitable.offerId || suitable.id;
    } else if (response.data.length > 0) {
      // Use any offer
      acceptedOfferId = response.data[0].offerId || response.data[0].id;
    }
  } catch (error) {
    log('⚠️  Could not fetch offer for order creation', 'warning');
  }
  
  // POST /api/trade-orders/from-offer/{offerId}
  if (acceptedOfferId) {
    try {
      const response = await makeRequest('POST', `/trade-orders/from-offer/${acceptedOfferId}`, {
        contractTerms: 'Standard contract terms',
        paymentTerms: '50% advance, 50% on delivery'
      }, authTokenUser1);
      if (!orderId) {
        orderId = response.data.orderId || response.data.id;
      }
      recordTest('/trade-orders/from-offer/{offerId}', 'POST', 'PASS', response);
    } catch (error) {
      recordTest('/trade-orders/from-offer/{offerId}', 'POST', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-orders/from-offer/{offerId}', 'POST', 'SKIP', null, null, true, null);
  }
  
  // GET /api/trade-orders/{id}
  if (orderId) {
    try {
      const response = await makeRequest('GET', `/trade-orders/${orderId}`, null, authTokenUser1);
      recordTest('/trade-orders/{id}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/trade-orders/{id}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/trade-orders/{id}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/trade-orders/my-company
  try {
    const response = await makeRequest('GET', '/trade-orders/my-company', null, authTokenUser1);
    if (!orderId && response.data.length > 0) {
      orderId = response.data[0].orderId;
    }
    recordTest('/trade-orders/my-company', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-orders/my-company', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/trade-orders/purchases
  try {
    const response = await makeRequest('GET', '/trade-orders/purchases', null, authTokenUser1);
    recordTest('/trade-orders/purchases', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-orders/purchases', 'GET', 'FAIL', null, error, false);
  }
  
  // GET /api/trade-orders/sales
  try {
    const response = await makeRequest('GET', '/trade-orders/sales', null, authTokenUser2);
    recordTest('/trade-orders/sales', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/trade-orders/sales', 'GET', 'FAIL', null, error, false);
  }
  
  // PATCH /api/trade-orders/{id}/status
  if (orderId) {
    try {
      const requestData = { status: 'IN_PROGRESS' };
      const response = await makeRequest('PATCH', `/trade-orders/${orderId}/status?status=IN_PROGRESS`, null, authTokenUser1);
      recordTest('/trade-orders/{id}/status', 'PATCH', 'PASS', response, null, false, requestData);
    } catch (error) {
      recordTest('/trade-orders/{id}/status', 'PATCH', 'FAIL', null, error, false, { status: 'IN_PROGRESS' });
    }
  } else {
    recordTest('/trade-orders/{id}/status', 'PATCH', 'SKIP', null, null, true, null);
  }
}

// 9. SHIPMENT CONTROLLER TESTS (5 endpoints)
async function testShipmentController() {
  log('\n🚢 TESTING SHIPMENT CONTROLLER', 'info');
  log('================================\n', 'info');
  
  let shipmentId = null;
  let orderId = null;
  
  // First check if shipments already exist
  try {
    const response = await makeRequest('GET', '/shipments/status/IN_TRANSIT', null, authTokenUser1);
    if (response.data.length > 0) {
      shipmentId = response.data[0].shipmentId || response.data[0].id;
      orderId = response.data[0].order?.orderId || response.data[0].order?.id || response.data[0].orderId;
    }
  } catch (error) {
    // Ignore
  }
  
  // Get a trade order if not found
  if (!orderId) {
    try {
      const response = await makeRequest('GET', '/trade-orders/my-company', null, authTokenUser1);
      if (response.data.length > 0) {
        orderId = response.data[0].orderId || response.data[0].id;
      }
    } catch (error) {
      log('⚠️  Could not fetch trade order for shipment creation', 'warning');
    }
  }
  
  // POST /api/shipments/order/{orderId}
  if (orderId) {
    try {
      const requestData = {
        estimatedShipDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      const response = await makeRequest('POST', `/shipments/order/${orderId}`, requestData, authTokenUser3);
      // Always update shipmentId from the latest POST response
      shipmentId = response.data.id || response.data.shipmentId;
      console.log(`DEBUG: POST Shipment Response - ID: ${shipmentId}, Full Data Keys: ${Object.keys(response.data || {})}`);
      recordTest('/shipments/order/{orderId}', 'POST', 'PASS', response, null, false, requestData);
    } catch (error) {
      recordTest('/shipments/order/{orderId}', 'POST', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/shipments/order/{orderId}', 'POST', 'SKIP', null, null, true, null);
  }
  
  // GET /api/shipments/{id}
  if (shipmentId) {
    try {
      const response = await makeRequest('GET', `/shipments/${shipmentId}`, null, authTokenUser1);
      recordTest('/shipments/{id}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/shipments/{id}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    console.log('DEBUG: shipmentId is null/undefined - SKIPPING GET /shipments/{id}');
    recordTest('/shipments/{id}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/shipments/order/{orderId}
  if (orderId) {
    try {
      const response = await makeRequest('GET', `/shipments/order/${orderId}`, null, authTokenUser1);
      recordTest('/shipments/order/{orderId}', 'GET', 'PASS', response, null, false);
    } catch (error) {
      recordTest('/shipments/order/{orderId}', 'GET', 'FAIL', null, error, false);
    }
  } else {
    recordTest('/shipments/order/{orderId}', 'GET', 'SKIP', null, null, true, null);
  }
  
  // GET /api/shipments/status/{status}
  try {
    const response = await makeRequest('GET', '/shipments/status/PENDING', null, authTokenUser1);
    recordTest('/shipments/status/{status}', 'GET', 'PASS', response, null, false);
  } catch (error) {
    recordTest('/shipments/status/{status}', 'GET', 'FAIL', null, error, false);
  }
  
  // PATCH /api/shipments/{id}/status
  if (shipmentId) {
    try {
      const requestData = { status: 'IN_TRANSIT' };
      const response = await makeRequest('PATCH', `/shipments/${shipmentId}/status?status=IN_TRANSIT`, null, authTokenUser3);
      recordTest('/shipments/{id}/status', 'PATCH', 'PASS', response, null, false, requestData);
    } catch (error) {
      recordTest('/shipments/{id}/status', 'PATCH', 'FAIL', null, error, false, { status: 'IN_TRANSIT' });
    }
  } else {
    console.log('DEBUG: shipmentId is null/undefined - SKIPPING PATCH /shipments/{id}/status');
    recordTest('/shipments/{id}/status', 'PATCH', 'SKIP', null, null, true, null);
  }
}

// ===================== MAIN TEST RUNNER =====================

async function runAllTests() {
  const startTime = Date.now();
  
  console.log('\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  🚀 IntelliCargo Complete System Test Suite 🚀');
  console.log('════════════════════════════════════════════════════════');
  console.log(`Started: ${new Date().toLocaleString()}`);
  console.log('════════════════════════════════════════════════════════\n');
  
  try {
    await testAuthController();           // 2 endpoints
    await testUserController();           // 3 endpoints
    await testCompanyController();        // 4 endpoints
    await testProductController();        // 7 endpoints
    await testProductListingController(); // 9 endpoints
    await testTradeRequestController();   // 7 endpoints
    await testTradeOfferController();     // 5 endpoints
    await testTradeOrderController();     // 6 endpoints
    await testShipmentController();       // 5 endpoints
    
  } catch (error) {
    log(`\n🔥 Critical error during test execution: ${error.message}`, 'error');
  }
  
  // Calculate summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  testResults.summary.endTime = new Date().toISOString();
  testResults.summary.duration = `${duration}s`;
  testResults.summary.successRate = (
    (testResults.summary.passed / testResults.summary.totalTests) * 100
  ).toFixed(2) + '%';
  
  // Save results to file
  fs.writeFileSync(
    'test-results.json',
    JSON.stringify(testResults, null, 2)
  );
  
  // Print summary
  console.log('\n');
  console.log('════════════════════════════════════════════════════════');
  console.log('  📊 TEST RESULTS SUMMARY  📊');
  console.log('════════════════════════════════════════════════════════');
  console.log(`Total Tests:     ${testResults.summary.totalTests}`);
  console.log(`✅ Passed:        ${testResults.summary.passed}`);
  console.log(`❌ Failed:        ${testResults.summary.failed}`);
  console.log(`⏭️  Skipped:       ${testResults.summary.skipped}`);
  console.log(`📈 Success Rate:  ${testResults.summary.successRate}`);
  console.log(`⏱️  Duration:      ${duration}s`);
  console.log('════════════════════════════════════════════════════════');
  console.log(`\n✅ Results saved to: test-results.json`);
  console.log('\n');
  
  process.exit(testResults.summary.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
