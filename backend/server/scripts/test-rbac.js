const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const API_URL = 'http://localhost:5000/api';
const ADMIN_SECRET = 'MySecureCollegeKey2026';

async function testRBAC() {
    console.log("=========================================");
    console.log("   STARTING RBAC VERIFICATION TEST");
    console.log("=========================================\n");

    const uniqueId = Date.now();
    const email = `rbac_admin_${uniqueId}@test.com`;
    const password = "password123";

    try {
        // --- STEP 1: REGISTRATION (TPO_ADMIN) ---
        console.log("1. Registering TPO Admin...");
        await client.post(`${API_URL}/auth/register-admin`, {
            name: "RBAC Admin",
            email: email,
            password: password,
            phone: "9123456780",
            employee_code: `RBAC_${uniqueId}`,
            institution_name: `RBAC Inst ${uniqueId}`,
            institution_code: `RBAC_${uniqueId}`,
            institution_address: "RBAC Road",
            adminKey: ADMIN_SECRET
        });
        console.log("   ✅ Registration Success.");

        // --- STEP 2: LOGIN ---
        console.log("\n2. Logging in...");
        await client.post(`${API_URL}/auth/login`, {
            email: email,
            password: password
        });
        console.log("   ✅ Login Success (Cookie Set).");

        // --- STEP 3: ACCESS TPO ROUTE (Protected + Authorized) ---
        console.log("\n3. Testing GET /api/tpo/test (Expect Success)...");
        try {
            const tpoResponse = await client.get(`${API_URL}/tpo/test`);
            console.log("   ✅ Success:", tpoResponse.data);
        } catch (error) {
            console.error("   ❌ Failed to access TPO route:", error.message);
            if(error.response) console.error("   Response:", error.response.data);
        }

        // --- STEP 4: ACCESS ADMIN ROUTE (Protected + Authorized) ---
        console.log("\n4. Testing POST /api/admin/dept-heads (Expect Success)...");
        // Needs proper body
        try {
            const adminResponse = await client.post(`${API_URL}/admin/dept-heads`, {
                name: "Dept Head 1",
                email: `dept_head_${uniqueId}@test.com`,
                department_id: 1 // Assuming ID 1 exists (might fail if not seeded, but auth check happens first)
            });
            console.log("   ✅ Success or Business Logic Error (Auth Passed):", adminResponse.data);
        } catch (error) {
            // It might fail due to FK constraint (department_id) but if it returns 400/500 it means Auth passed.
            // If 401/403, Auth failed.
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                 console.error("   ❌ Auth Failed for Admin route:", error.response.status);
            } else {
                 console.log("   ✅ Auth Passed (Even if business logic failed):", error.response ? error.response.status : error.message);
                 if(error.response) console.log("   Response:", error.response.data);
            }
        }

        // --- STEP 5: LOGOUT ---
        console.log("\n5. Logging out...");
        await client.post(`${API_URL}/auth/logout`);
        console.log("   ✅ Logout Success.");

        // --- STEP 6: ACCESS TPO ROUTE (Logged Out) ---
        console.log("\n6. Testing GET /api/tpo/test (Expect 401 Failure)...");
        try {
            await client.get(`${API_URL}/tpo/test`);
            console.error("   ❌ Failed: Should have returned 401.");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("   ✅ Success: Access denied as expected (401).");
            } else {
                console.error("   ❌ Unexpected error code:", error.response ? error.response.status : error.message);
            }
        }

    } catch (error) {
        console.error("\n❌ TEST SUITE FAILED:", error.message);
        if (error.response) {
            console.error("   Server Response:", error.response.data);
        }
    }
}

testRBAC();
