const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function testPasswordChange() {
    try {
        const uniqueId = Date.now();
        const email = `change_pass_${uniqueId}@test.com`;
        const initialPassword = "password123";
        const newPassword = "newpassword456";
        
        // 1. Register
        console.log(`1. Registering user: ${email}`);
        await client.post(`${API_URL}/register-admin`, {
            name: "Change Pass Admin",
            email: email,
            password: initialPassword,
            institution_name: `CP Inst ${uniqueId}`,
            institution_code: `CPI_${uniqueId}`,
            institution_address: "CP Road",
            adminKey: ADMIN_SECRET
        });

        // 2. Login (Initial)
        console.log("2. Logging in with Initial Password...");
        await client.post(`${API_URL}/login`, {
            email: email,
            password: initialPassword
        });
        console.log("   Login Success.");

        // 3. Change Password
        console.log("3. Changing Password...");
        const changeResponse = await client.post(`${API_URL}/change-password`, {
            currentPassword: initialPassword,
            newPassword: newPassword
        });
        console.log("   Change Password Response:", changeResponse.data.message);

        // 4. Logout
        console.log("4. Logging out...");
        await client.post(`${API_URL}/logout`);

        // 5. Login with OLD Password (Should Fail)
        console.log("5. Attempting Login with OLD Password...");
        try {
            await client.post(`${API_URL}/login`, {
                email: email,
                password: initialPassword
            });
            console.log("   TEST FAILED: Login with old password should have failed.");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("   TEST PASSED: Login with old password rejected.");
            } else {
                 console.log("   TEST FAILED: Unexpected error with old password:", error.message);
            }
        }

        // 6. Login with NEW Password (Should Succeed)
        console.log("6. Attempting Login with NEW Password...");
        try {
            await client.post(`${API_URL}/login`, {
                email: email,
                password: newPassword
            });
            console.log("   TEST PASSED: Login with new password successful.");
        } catch (error) {
            console.log("   TEST FAILED: Login with new password failed:", error.message);
        }


    } catch (error) {
        console.error("Test Failed:", error.response ? error.response.data : error.message);
    }
}

testPasswordChange();
