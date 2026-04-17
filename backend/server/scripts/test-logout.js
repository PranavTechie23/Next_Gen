const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026'; // From .env

async function testAuthFlow() {
    try {
        // 1. Register TPO Admin (Dynamic email to avoid conflicts)
        const uniqueId = Date.now();
        const adminData = {
            name: "Test Admin",
            email: `admin_${uniqueId}@test.com`,
            password: "password123",
            institution_id: 1,
            adminKey: ADMIN_SECRET
        };

        console.log("1. Registering Admin...");
        await axios.post(`${API_URL}/register-admin`, adminData);
        console.log("   Admin Registered Successfully.");

        // 2. Login
        console.log("2. Attempting Login...");
        const loginResponse = await axios.post(`${API_URL}/login`, {
            email: adminData.email,
            password: adminData.password
        });
        const token = loginResponse.data.token;
        console.log("   Login Successful! Token received.");

        // 3. Access Protected Route (Simulated via Logout which is protected)
        // Note: Ideally we'd have a separate protected route, but Logout requires auth so it works as a test.
        console.log("3. Attempting Logout (Protected Route)...");
        const logoutResponse = await axios.post(`${API_URL}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   Logout Successful:", logoutResponse.data.message);

        // 4. Access Protected Route Again (Should Fail)
        console.log("4. Attempting Logout AGAIN with invalidated token...");
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("   TEST FAILED: Should have been rejected.");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("   TEST PASSED: Rejected with 401 Unauthorized.");
            } else {
                console.log("   TEST FAILED: Unexpected error:", error.message);
            }
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testAuthFlow();
