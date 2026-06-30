import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { buildApiUrl } from '@/lib/api';

interface BrandingConfig {
    APP_NAME: string;
    INSTITUTION_NAME: string;
    APP_LOGO_URL: string;
    FOOTER_TEXT: string;
    SUPPORT_EMAIL: string;
}

const defaultBranding: BrandingConfig = {
    APP_NAME: 'NextGen',
    INSTITUTION_NAME: 'Professional Institute of Technology',
    APP_LOGO_URL: '/NG/NextGen_light.png',
    FOOTER_TEXT: '© 2026 NextGen. All rights reserved.',
    SUPPORT_EMAIL: 'support@nextgen.com'
};

interface BrandingContextType {
    config: BrandingConfig;
    loading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<BrandingConfig>(defaultBranding);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const response = await axios.get(buildApiUrl('/config/public'));
                if (response.data) {
                    setConfig(prev => ({
                        ...prev,
                        ...response.data
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch branding config:", error);
                // Keep defaults on error
            } finally {
                setLoading(false);
            }
        };

        fetchBranding();
    }, []);

    return (
        <BrandingContext.Provider value={{ config, loading }}>
            {children}
        </BrandingContext.Provider>
    );
};

export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
