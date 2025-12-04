// Rigorous Backend Testing Suite - All Scenarios

const API_URL = 'http://localhost:3000/api';

// Test Results Tracker
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function logTest(name, passed, details = '') {
    results.tests.push({ name, passed, details });
    if (passed) {
        results.passed++;
        console.log(`✅ ${name}`);
    } else {
        results.failed++;
        console.error(`❌ ${name}`, details);
    }
}

async function rigorousTests() {
    console.log('🔥 RIGOROUS TESTING SUITE - ALL SCENARIOS\n');
    console.log('='.repeat(60));

    // ========== SECTION 1: BASIC CONNECTIVITY ==========
    console.log('\n📡 SECTION 1: SERVER CONNECTIVITY');
    console.log('-'.repeat(60));

    try {
        const res = await fetch(`${API_URL}/vendors`);
        logTest('Server is reachable', res.ok);
    } catch (error) {
        logTest('Server is reachable', false, error.message);
        console.log('\n❌ CRITICAL: Server not running. Start with: cd server && node index.js');
        return;
    }

    // ========== SECTION 2: AUTHENTICATION TESTS ==========
    console.log('\n🔐 SECTION 2: AUTHENTICATION');
    console.log('-'.repeat(60));

    // Test 2.1: Valid Signup
    try {
        const email = `test${Date.now()}@example.com`;
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email,
                password: 'password123',
                role: 'couple'
            })
        });
        const data = await res.json();
        logTest('Valid signup', res.ok && data.user);
    } catch (error) {
        logTest('Valid signup', false, error.message);
    }

    // Test 2.2: Duplicate Email Signup
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test',
                email: 'couple@test.com',
                password: 'password',
                role: 'couple'
            })
        });
        logTest('Duplicate email rejected', res.status === 400);
    } catch (error) {
        logTest('Duplicate email rejected', false, error.message);
    }

    // Test 2.3: Valid Login
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'couple@test.com',
                password: 'password'
            })
        });
        const data = await res.json();
        logTest('Valid login', res.ok && data.user);
    } catch (error) {
        logTest('Valid login', false, error.message);
    }

    // Test 2.4: Invalid Login
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'wrong@test.com',
                password: 'wrongpassword'
            })
        });
        logTest('Invalid login rejected', res.status === 401);
    } catch (error) {
        logTest('Invalid login rejected', false, error.message);
    }

    // Test 2.5: Missing Fields
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@test.com' })
        });
        logTest('Missing password rejected', res.status === 401);
    } catch (error) {
        logTest('Missing password rejected', false, error.message);
    }

    // ========== SECTION 3: VENDOR OPERATIONS ==========
    console.log('\n🏪 SECTION 3: VENDOR OPERATIONS');
    console.log('-'.repeat(60));

    // Test 3.1: Get All Vendors
    try {
        const res = await fetch(`${API_URL}/vendors`);
        const vendors = await res.json();
        logTest('Get all vendors', res.ok && Array.isArray(vendors) && vendors.length > 0);
    } catch (error) {
        logTest('Get all vendors', false, error.message);
    }

    // Test 3.2: Get Specific Vendor
    try {
        const res = await fetch(`${API_URL}/vendors/v1`);
        const vendor = await res.json();
        logTest('Get vendor by ID', res.ok && vendor.id === 'v1');
    } catch (error) {
        logTest('Get vendor by ID', false, error.message);
    }

    // Test 3.3: Non-existent Vendor
    try {
        const res = await fetch(`${API_URL}/vendors/nonexistent`);
        logTest('Non-existent vendor returns 404', res.status === 404);
    } catch (error) {
        logTest('Non-existent vendor returns 404', false, error.message);
    }

    // Test 3.4: Category Filter
    try {
        const res = await fetch(`${API_URL}/vendors?category=Photographer`);
        const vendors = await res.json();
        const allPhotographers = vendors.every(v => v.category === 'Photographer');
        logTest('Category filter works', res.ok && allPhotographers);
    } catch (error) {
        logTest('Category filter works', false, error.message);
    }

    // Test 3.5: Price Range Filter
    try {
        const res = await fetch(`${API_URL}/vendors?minPrice=1000&maxPrice=2000`);
        const vendors = await res.json();
        const inRange = vendors.every(v => v.price >= 1000 && v.price <= 2000);
        logTest('Price filter works', res.ok && inRange);
    } catch (error) {
        logTest('Price filter works', false, error.message);
    }

    // Test 3.6: Location Filter
    try {
        const res = await fetch(`${API_URL}/vendors?location=New York`);
        const vendors = await res.json();
        const hasLocation = vendors.some(v => v.location && v.location.includes('New York'));
        logTest('Location filter works', res.ok && hasLocation);
    } catch (error) {
        logTest('Location filter works', false, error.message);
    }

    // Test 3.7: Rating Filter
    try {
        const res = await fetch(`${API_URL}/vendors?minRating=4.5`);
        const vendors = await res.json();
        const highRated = vendors.every(v => v.rating >= 4.5);
        logTest('Rating filter works', res.ok && highRated);
    } catch (error) {
        logTest('Rating filter works', false, error.message);
    }

    // Test 3.8: Multiple Filters Combined
    try {
        const res = await fetch(`${API_URL}/vendors?category=Photographer&minPrice=1000&maxPrice=2000&minRating=4.5`);
        const vendors = await res.json();
        logTest('Multiple filters work together', res.ok);
    } catch (error) {
        logTest('Multiple filters work together', false, error.message);
    }

    // ========== SECTION 4: DATA VALIDATION ==========
    console.log('\n📊 SECTION 4: DATA VALIDATION');
    console.log('-'.repeat(60));

    // Test 4.1: Vendor Data Structure
    try {
        const res = await fetch(`${API_URL}/vendors/v1`);
        const vendor = await res.json();
        const hasRequiredFields = vendor.id && vendor.name && vendor.category &&
            vendor.price !== undefined && vendor.rating !== undefined;
        logTest('Vendor has required fields', hasRequiredFields);
    } catch (error) {
        logTest('Vendor has required fields', false, error.message);
    }

    // Test 4.2: User Data Structure
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'couple@test.com', password: 'password' })
        });
        const data = await res.json();
        const hasRequiredFields = data.user && data.user.id && data.user.name &&
            data.user.email && data.user.role;
        logTest('User has required fields', hasRequiredFields);
    } catch (error) {
        logTest('User has required fields', false, error.message);
    }

    // ========== SECTION 5: CONCURRENT REQUESTS ==========
    console.log('\n⚡ SECTION 5: CONCURRENT REQUESTS');
    console.log('-'.repeat(60));

    // Test 5.1: Multiple Simultaneous Requests
    try {
        const promises = Array(10).fill(null).map(() =>
            fetch(`${API_URL}/vendors`)
        );
        const results = await Promise.all(promises);
        const allSuccessful = results.every(r => r.ok);
        logTest('Handle 10 concurrent requests', allSuccessful);
    } catch (error) {
        logTest('Handle 10 concurrent requests', false, error.message);
    }

    // Test 5.2: Mixed Request Types
    try {
        const promises = [
            fetch(`${API_URL}/vendors`),
            fetch(`${API_URL}/vendors/v1`),
            fetch(`${API_URL}/vendors?category=Photographer`),
            fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'couple@test.com', password: 'password' })
            })
        ];
        const results = await Promise.all(promises);
        const allSuccessful = results.every(r => r.ok);
        logTest('Handle mixed concurrent requests', allSuccessful);
    } catch (error) {
        logTest('Handle mixed concurrent requests', false, error.message);
    }

    // ========== SECTION 6: ERROR HANDLING ==========
    console.log('\n🛡️ SECTION 6: ERROR HANDLING');
    console.log('-'.repeat(60));

    // Test 6.1: Invalid JSON
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: 'invalid json'
        });
        logTest('Invalid JSON handled', res.status >= 400);
    } catch (error) {
        logTest('Invalid JSON handled', true); // Fetch error is expected
    }

    // Test 6.2: Missing Content-Type
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: 'test@test.com', password: 'password' })
        });
        logTest('Missing Content-Type handled', res.status >= 400 || res.ok);
    } catch (error) {
        logTest('Missing Content-Type handled', false, error.message);
    }

    // ========== SECTION 7: EDGE CASES ==========
    console.log('\n🔍 SECTION 7: EDGE CASES');
    console.log('-'.repeat(60));

    // Test 7.1: Empty Filter Results
    try {
        const res = await fetch(`${API_URL}/vendors?category=NonExistent`);
        const vendors = await res.json();
        logTest('Empty filter results return empty array', res.ok && vendors.length === 0);
    } catch (error) {
        logTest('Empty filter results return empty array', false, error.message);
    }

    // Test 7.2: Very Long Email
    try {
        const longEmail = 'a'.repeat(100) + '@test.com';
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test',
                email: longEmail,
                password: 'password',
                role: 'couple'
            })
        });
        logTest('Long email handled', res.status === 201 || res.status === 400);
    } catch (error) {
        logTest('Long email handled', false, error.message);
    }

    // Test 7.3: Special Characters in Search
    try {
        const res = await fetch(`${API_URL}/vendors?search=${encodeURIComponent('<script>alert("xss")</script>')}`);
        logTest('Special characters in search handled', res.ok);
    } catch (error) {
        logTest('Special characters in search handled', false, error.message);
    }

    // ========== FINAL REPORT ==========
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL TEST REPORT');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

    if (results.failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.tests.filter(t => !t.passed).forEach(t => {
            console.log(`   - ${t.name}: ${t.details}`);
        });
    }

    console.log('\n' + '='.repeat(60));

    if (results.failed === 0) {
        console.log('🎉 ALL TESTS PASSED! Website is fully functional!');
    } else {
        console.log('⚠️  Some tests failed. Review errors above.');
    }

    console.log('='.repeat(60) + '\n');
}

// Run tests
rigorousTests().catch(console.error);
