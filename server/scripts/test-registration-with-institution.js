const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function testRegistrationWithInstitution() {
    try {
        const uniqueId = Date.now();
        const instCode = `INST_${uniqueId}`;
        
        const adminData = {
            name: "Founder Admin",
            email: `founder_${uniqueId}@test.com`,
            password: "password123",
            // New Institution Details
            institution_name: `Tech Institute ${uniqueId}`,
            institution_code: instCode,
            institution_address: "123 Innovation Blvd",
            
            adminKey: ADMIN_SECRET
        };

        // 1. Register Admin + New Institution
        console.log("1. Registering Admin & Creating New Institution...");
        const registerResponse = await client.post(`${API_URL}/register-admin`, adminData);
        console.log("   Registration Success:", registerResponse.data.message);

        // 2. Login to verify (and get user details including institution_id)
        console.log("2. Logging in...");
        const loginResponse = await client.post(`${API_URL}/login`, {
            email: adminData.email,
            password: adminData.password
        });
        console.log("   Login Success. User ID:", loginResponse.data.user.id);
        console.log("   Institution ID:", loginResponse.data.user.institution_id);

        if (loginResponse.data.user.institution_id) {
             console.log("   TEST PASSED: User linked to an institution.");
        } else {
             console.log("   TEST FAILED: Institution ID missing.");
        }

        // 3. Try to register another admin for SAME institution code
        console.log("3. Attempting to register another admin for SAME institution code...");
        try {
            await client.post(`${API_URL}/register-admin`, {
                ...adminData,
                email: `founder_copy_${uniqueId}@test.com`,
                name: "Copy Admin"
            });
            console.log("   TEST FAILED: Should have been rejected as 1 Admin per Inst.");
        } catch (error) {
             if (error.response && error.response.status === 400 && error.response.data.message.includes("Institution already has a TPO Admin")) {
                console.log("   TEST PASSED: Duplicate admin rejected.");
            } else {
                console.log("   TEST FAILED: Unexpected error:", error.response ? error.response.data : error.message);
            }
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testRegistrationWithInstitution();
