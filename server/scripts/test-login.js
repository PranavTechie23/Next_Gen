const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026'; // From .env

async function testLogin() {
    try {
        // 1. Register TPO Admin
        const adminData = {
            name: "Test Admin",
            email: `admin_${Date.now()}@test.com`,
            password: "password123",
            institution_id: 1,
            adminKey: ADMIN_SECRET
        };

        console.log("Registering Admin...");
        await axios.post(`${API_URL}/register-admin`, adminData);
        console.log("Admin Registered Successfully.");

        // 2. Login
        console.log("Attempting Login...");
        const loginResponse = await axios.post(`${API_URL}/login`, {
            email: adminData.email,
            password: adminData.password
        });

        console.log("Login Successful!");
        console.log("Token:", loginResponse.data.token ? "Received" : "Missing");
        console.log("Role:", loginResponse.data.user.role);

        if (loginResponse.data.user.role === 'TPO_ADMIN') {
            console.log("TEST PASSED: Role is correct.");
        } else {
            console.log("TEST FAILED: Role mismatch.");
        }

        // 3. Invalid Login
        console.log("Attempting Invalid Login...");
        try {
            await axios.post(`${API_URL}/login`, {
                email: adminData.email,
                password: "wrongpassword"
            });
            console.log("TEST FAILED: Invalid login should have failed.");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("TEST PASSED: Invalid login rejected correctly.");
            } else {
                console.log("TEST FAILED: Unexpected error code for invalid login:", error.response ? error.response.status : error.message);
            }
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testLogin();
