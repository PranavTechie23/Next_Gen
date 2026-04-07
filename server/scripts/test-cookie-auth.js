const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function testCookieAuth() {
    try {
        // 1. Register TPO Admin
        const uniqueId = Date.now();
        const adminData = {
            name: "Cookie Admin",
            email: `cookie_admin_${uniqueId}@test.com`,
            password: "password123",
            institution_id: 1,
            adminKey: ADMIN_SECRET
        };

        console.log("1. Registering Admin...");
        await client.post(`${API_URL}/register-admin`, adminData);
        console.log("   Admin Registered Successfully.");

        // 2. Login (Should set cookie)
        console.log("2. Attempting Login...");
        const loginResponse = await client.post(`${API_URL}/login`, {
            email: adminData.email,
            password: adminData.password
        });
        
        console.log("   Login Successful!");
        // Check if cookie is in the jar
        const cookies = await jar.getCookies(API_URL);
        const tokenCookie = cookies.find(c => c.key === 'token');
        
        if (tokenCookie) {
            console.log("   TEST PASSED: 'token' cookie found.");
        } else {
            console.log("   TEST FAILED: 'token' cookie NOT found.");
        }

        // 3. Access Protected Route (Logout) using Cookie
        console.log("3. Attempting Logout (Protected via Cookie)...");
        // We do NOT send Authorization header. Client jar handles cookies automatically.
        try {
            await client.post(`${API_URL}/logout`);
            console.log("   Logout Successful!");
            console.log("   TEST PASSED: Accessed protected route using cookie.");
        } catch (error) {
            console.log("   TEST FAILED: Could not access protected route.", error.message);
        }

        // 4. Verify Cookie Cleared
        const cookiesAfterLogout = await jar.getCookies(API_URL);
        const tokenCookieAfter = cookiesAfterLogout.find(c => c.key === 'token');
        // Note: res.columns() sets exp to past, tough-cookie might remove it or show it as expired.
        // Usually tough-cookie removes expired cookies.
        
        if (!tokenCookieAfter || tokenCookieAfter.value === '') {
             console.log("   TEST PASSED: Cookie cleared/expired after logout.");
        } else {
             console.log("   TEST WARNING: Cookie still present (might be expired but not removed from jar).", tokenCookieAfter);
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testCookieAuth();
