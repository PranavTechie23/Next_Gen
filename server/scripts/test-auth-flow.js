const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:5000/api/auth';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function runFullAuthSuite() {
    console.log("=========================================");
    console.log("   STARTING FULL AUTHENTICATION TEST");
    console.log("=========================================\n");

    const uniqueId = Date.now();
    const email = `auth_master_${uniqueId}@test.com`;
    const password = "password123";
    const newPassword = "securePassword789";

    try {
        // --- STEP 1: REGISTRATION ---
        console.log("1. TEST: Register TPO Admin + Institution");
        const regResponse = await client.post(`${API_URL}/register-admin`, {
            name: "Master Admin",
            email: email,
            password: password,
            phone: "9123456780",
            employee_code: `MA_${uniqueId}`,
            institution_name: `Master Inst ${uniqueId}`,
            institution_code: `MI_${uniqueId}`,
            institution_address: "123 Master Road",
            adminKey: ADMIN_SECRET
        });
        console.log("   ✅ Success:", regResponse.data.message);


        // --- STEP 2: LOGIN ---
        console.log("\n2. TEST: Login (Initial Password)");
        const loginResponse = await client.post(`${API_URL}/login`, {
            email: email,
            password: password
        });
        console.log("   ✅ Success. User ID:", loginResponse.data.user.id);
        
        // Check cookie
        const cookies = await jar.getCookies(API_URL);
        if (cookies.some(c => c.key === 'token')) {
            console.log("   ✅ Cookie 'token' is present.");
        } else {
             throw new Error("Cookie 'token' missing after login.");
        }


        // --- STEP 3: CHANGE PASSWORD ---
        console.log("\n3. TEST: Change Password");
        // Cookie is automatically used by 'client'
        const changeResponse = await client.post(`${API_URL}/change-password`, {
            currentPassword: password,
            newPassword: newPassword
        });
        console.log("   ✅ Success:", changeResponse.data.message);


        // --- STEP 4: LOGOUT ---
        console.log("\n4. TEST: Logout");
        const logoutResponse = await client.post(`${API_URL}/logout`);
        console.log("   ✅ Success:", logoutResponse.data.message);
        
        // Verify cookie cleared
        const cookiesAfterLogout = await jar.getCookies(API_URL);
        // tough-cookie might either remove it or show expired.
        // If it's empty or token is missing/empty, it's good.
        const tokenCookie = cookiesAfterLogout.find(c => c.key === 'token');
        if (!tokenCookie || tokenCookie.value === '') {
             console.log("   ✅ Cookie cleared.");
        } else {
             console.log("   ⚠️ Cookie still present (might be expired).");
        }


        // --- STEP 5: LOGIN FAILED (OLD PASSWORD) ---
        console.log("\n5. TEST: Login with OLD Password (Should Fail)");
        try {
            await client.post(`${API_URL}/login`, {
                email: email,
                password: password
            });
            throw new Error("Login with old password should not succeed.");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("   ✅ Success: Login rejected as expected.");
            } else {
                throw error;
            }
        }


        // --- STEP 6: LOGIN SUCCESS (NEW PASSWORD) ---
        console.log("\n6. TEST: Login with NEW Password");
        await client.post(`${API_URL}/login`, {
            email: email,
            password: newPassword
        });
        console.log("   ✅ Success: Authenticated with new password.");


        // --- STEP 7: REQUEST PASSWORD RESET ---
        console.log("\n7. TEST: Request Password Reset");
        const resetResponse = await client.post(`${API_URL}/reset-password`, {
            email: email
        });
        console.log("   ✅ Success:", resetResponse.data.message);


        console.log("\n=========================================");
        console.log("   ALL AUTHENTICATION TESTS PASSED 🚀");
        console.log("=========================================");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        if (error.response) {
            console.error("   Server Response:", error.response.data);
        }
    }
}

runFullAuthSuite();
