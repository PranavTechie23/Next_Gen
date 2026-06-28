const Config = require('../services/ConfigService');

const PUBLIC_KEYS = [
    'APP_NAME',
    'INSTITUTION_NAME',
    'APP_LOGO_URL',
    'FOOTER_TEXT',
    'SUPPORT_EMAIL',
];

const getPublicConfig = async (req, res) => {
    try {
        const values = await Promise.all(PUBLIC_KEYS.map((key) => Config.get(key)));

        const config = Object.fromEntries(
            PUBLIC_KEYS.map((key, i) => [key, values[i]])
        );

        return res.json(config);
    } catch (error) {
        console.error('getPublicConfig error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { getPublicConfig };