const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Schema Validation
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['RECRUITER'], "Only recruiters can register publicly"), // Restrict public registration to Recruiters
  company_name: z.string().min(2, "Company name is required"),
  hr_name: z.string().min(2, "HR Name is required"),
  hr_phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  industry_type: z.string().optional(),
  website: z.string().url().optional()
});

exports.register = async (req, res) => {
  try {
    // 1. Validate Input
    const validatedData = registerSchema.parse(req.body);

    const { email, password, role, company_name, hr_name, hr_phone, industry_type, website } = validatedData;

    // 2. Check if user exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Start Transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert into Users Table
      const [userResult] = await connection.query(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role]
      );
      const userId = userResult.insertId;

      // Insert into Recruiters Table
      await connection.query(
        'INSERT INTO recruiters (user_id, company_name, hr_name, hr_phone, industry_type, website) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, company_name, hr_name, hr_phone, industry_type || null, website || null]
      );

      await connection.commit();
      connection.release();

      res.status(201).json({ message: "Recruiter registered successfully! Please login." });

    } catch (err) {
      await connection.rollback();
      connection.release();
      console.error("Transaction Error:", err);
      res.status(500).json({ error: "Registration failed due to server error" });
    }

  } catch (err) {
    if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
