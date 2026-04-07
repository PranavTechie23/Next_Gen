const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function testAdminRestriction() {
    try {
        const uniqueId = Date.now();
        const baseAdmin = {
            name: "Duplicate Admin",
            password: "password123",
            institution_id: 1,
            adminKey: ADMIN_SECRET
        };

        // 1. Try to Register First Admin (Might fail if already exists, which is fine)
        console.log("1. Registering First Admin (might already exist)...");
        try {
            await axios.post(`${API_URL}/register-admin`, {
                ...baseAdmin,
                email: `admin_A_${uniqueId}@test.com`
            });
            console.log("   First Admin Registered.");
        } catch (error) {
            console.log("   First Admin Registration result:", error.response ? error.response.data.message : error.message);
        }

        // 2. Try to Register Second Admin for SAME Institution
        console.log("2. Attempting to Register Second Admin for SAME Institution...");
        try {
            await axios.post(`${API_URL}/register-admin`, {
                ...baseAdmin,
                email: `admin_B_${uniqueId}@test.com`
            });
            console.log("   TEST FAILED: Second Admin should have been rejected.");
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message.includes("already exists for this institution")) {
                console.log("   TEST PASSED: Second Admin rejected correctly.");
            } else {
                console.log("   TEST FAILED: Unexpected error:", error.response ? error.response.data : error.message);
            }
        }

    } catch (error) {
        console.error("Test Error:", error);
    }
}

testAdminRestriction();
