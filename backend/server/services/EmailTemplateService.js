const db = require('../config/db');

class EmailTemplateService {
    constructor() {
        this.cache = new Map();
        this.lastFetch = 0;
        this.TTL = 1000 * 60 * 10; // 10 minutes
    }

    async getTemplate(slug) {
        await this._ensureCache();
        return this.cache.get(slug);
    }

    render(template, data = {}) {
    if (!template) {
        return {
            subject: "",
            html: "",
            text: ""
        };
    }

    let subject = template.subject || "";
    let html = template.body_html || "";
    let text = template.body_text || "";

    for (const [key, value] of Object.entries(data)) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, "g");

        subject = subject.replace(regex, String(value));
        html = html.replace(regex, String(value));
        text = text.replace(regex, String(value));
    }

    return { subject, html, text };
}

    async _ensureCache() {
        const now = Date.now();
        if (now - this.lastFetch > this.TTL || this.cache.size === 0) {
            try {
                const [rows] = await db.query('SELECT * FROM email_templates');
                this.cache.clear();
                rows.forEach(row => {
                    this.cache.set(row.slug, row);
                });
                this.lastFetch = now;
            } catch (error) {
                console.error("EmailTemplateService: Failed to fetch templates from DB", error);
            }
        }
    }

    async initialize() {
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS email_templates (
                    slug VARCHAR(100) PRIMARY KEY,
                    subject VARCHAR(255) NOT NULL,
                    body_html LONGTEXT NOT NULL,
                    body_text LONGTEXT,
                    description VARCHAR(255),
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);

            const defaults = [
                ['password_reset_otp', 'Password Reset OTP Request', '<p>Your OTP for password reset is: <strong style="font-size: 1.2em;">{{otp}}</strong></p><p>It is valid for 15 minutes.</p>', 'Your OTP for password reset is: {{otp}}\nIt is valid for 15 minutes.', 'OTP email for password recovery'],
                ['dept_head_credentials', 'Your Department Head Account Credentials', '<h2>Welcome to NextGen Platform</h2><p>Hello {{name}},</p><p>Your Department Head account has been successfully created.</p><p>Here are your login credentials:</p><ul><li><strong>Email:</strong> {{email}}</li><li><strong>Temporary Password:</strong> {{password}}</li></ul><p>Please log in and change your password as soon as possible.</p><p>Best regards,<br>NextGen Team</p>', 'Welcome to NextGen Platform\n\nHello {{name}},\n\nYour Department Head account has been successfully created.\n\nEmail: {{email}}\nTemporary Password: {{password}}\n\nPlease log in and change your password.', 'Credentials email for new TPO Heads'],
                ['student_credentials', 'Your NextGen Student Account Credentials', '<h2>Welcome to NextGen Platform</h2><p>Hello {{roll_number}},</p><p>Your Student account has been successfully created.</p><p>Here are your login credentials:</p><ul><li><strong>Email:</strong> {{email}}</li><li><strong>Temporary Password:</strong> {{password}}</li></ul><p>Please log in and change your password as soon as possible.</p><p>Best regards,<br>NextGen Team</p>', 'Welcome to NextGen Platform\n\nHello {{roll_number}},\n\nYour Student account has been successfully created.\n\nEmail: {{email}}\nTemporary Password: {{password}}\n\nPlease log in and change your password.', 'Credentials email for new students']
            ];

            for (const [slug, sub, html, text, desc] of defaults) {
                await db.query(
                    'INSERT IGNORE INTO email_templates (slug, subject, body_html, body_text, description) VALUES (?, ?, ?, ?, ?)',
                    [slug, sub, html, text, desc]
                );
            }
            
            await this._ensureCache();
            console.log("EmailTemplateService: Initialized successfully.");
        } catch (error) {
            console.error("EmailTemplateService: Initialization failed", error);
        }
    }
}

module.exports = new EmailTemplateService();
