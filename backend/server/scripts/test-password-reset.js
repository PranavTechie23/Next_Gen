const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function testPasswordResetReal() {
    try {
        const uniqueId = Date.now();
        const email = `test_reset_${uniqueId}@gmail.com`; // Using a dummy gmail to look real, but it won't be received unless user put their own email in .env and changed this script.
        // Actually, for the USER to verify it works, they should check the email they put in .env or the target.
        // But for AUTOMATED verification of the SERVER RESPONSE, any email works as long as the server ATTEMPTS to send.
        
        console.log(`1. Registering new admin with email: ${email}`);
        
        const adminData = {
            name: "Reset Test Admin",
            email: email,
            password: "password123",
            phone: "9998887776",
            employee_code: `EMP_${uniqueId}`,
            institution_name: `Reset Inst ${uniqueId}`,
            institution_code: `RI_${uniqueId}`,
            institution_address: "Reset Road",
            adminKey: ADMIN_SECRET
        };

        await client.post(`${API_URL}/register-admin`, adminData);
        console.log("   Registration Successful.");

        console.log(`2. Requesting Password Reset for: ${email}`);
        const response = await client.post(`${API_URL}/reset-password`, {
            email: email
        });

        console.log("   Response Message:", response.data.message);
        
        if (response.data.message === "Password reset link sent to your email.") {
            console.log("   TEST PASSED: Server reported success (Real Email Path).");
            console.log("   NOTE: Check the inbox of " + email + " (if valid) or the SMTP sender Outbox.");
        } else if (response.data.message.includes("Check server logs")) {
            console.log("   TEST RESULT: Server used MOCK Email (SMTP vars missing or not loaded).");
        } else {
            console.log("   TEST FAILED: Unexpected response.");
        }

    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testPasswordResetReal();
