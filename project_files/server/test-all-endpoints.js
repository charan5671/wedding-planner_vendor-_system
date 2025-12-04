// Comprehensive Backend Test Script

const API_URL = 'http://localhost:3000/api';

async function testAllEndpoints() {
    console.log('🧪 Starting Comprehensive Backend Tests...\n');

    // Test 1: Signup (Register)
    console.log('1️⃣ Testing SIGNUP...');
    try {
        const signupRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                role: 'couple'
            })
        });

        if (signupRes.ok) {
            const data = await signupRes.json();
            console.log('✅ Signup PASSED:', data.user.email);
        } else {
            const error = await signupRes.text();
            console.error('❌ Signup FAILED:', signupRes.status, error);
        }
    } catch (error) {
        console.error('❌ Signup ERROR:', error.message);
    }

    // Test 2: Login
    console.log('\n2️⃣ Testing LOGIN...');
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'couple@test.com',
                password: 'password'
            })
        });

        if (loginRes.ok) {
            const data = await loginRes.json();
            console.log('✅ Login PASSED:', data.user.name);
        } else {
            console.error('❌ Login FAILED:', loginRes.status);
        }
    } catch (error) {
        console.error('❌ Login ERROR:', error.message);
    }

    // Test 3: Get All Vendors
    console.log('\n3️⃣ Testing GET ALL VENDORS...');
    try {
        const vendorsRes = await fetch(`${API_URL}/vendors`);

        if (vendorsRes.ok) {
            const vendors = await vendorsRes.json();
            console.log(`✅ Vendors PASSED: Found ${vendors.length} vendors`);
            if (vendors.length > 0) {
                console.log('   Sample vendor:', vendors[0].name);
            }
        } else {
            console.error('❌ Vendors FAILED:', vendorsRes.status);
        }
    } catch (error) {
        console.error('❌ Vendors ERROR:', error.message);
    }

    // Test 4: Get Vendor by ID
    console.log('\n4️⃣ Testing GET VENDOR BY ID...');
    try {
        const vendorRes = await fetch(`${API_URL}/vendors/v1`);

        if (vendorRes.ok) {
            const vendor = await vendorRes.json();
            console.log('✅ Vendor Details PASSED:', vendor.name);
        } else {
            console.error('❌ Vendor Details FAILED:', vendorRes.status);
        }
    } catch (error) {
        console.error('❌ Vendor Details ERROR:', error.message);
    }

    // Test 5: Vendor Filters
    console.log('\n5️⃣ Testing VENDOR FILTERS...');
    try {
        const filterRes = await fetch(`${API_URL}/vendors?category=Photographer&minPrice=1000&maxPrice=2000`);

        if (filterRes.ok) {
            const filtered = await filterRes.json();
            console.log(`✅ Filters PASSED: Found ${filtered.length} photographers in price range`);
        } else {
            console.error('❌ Filters FAILED:', filterRes.status);
        }
    } catch (error) {
        console.error('❌ Filters ERROR:', error.message);
    }

    console.log('\n✨ All tests completed!\n');
}

testAllEndpoints();
