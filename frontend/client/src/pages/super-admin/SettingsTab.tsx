import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { toast } from 'sonner';
import { Settings, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SettingsTab = () => {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await SuperAdminApi.getSettings();
            setSettings(data);
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const toggleMaintenanceMode = async () => {
        const isCurrentlyActive = settings.MAINTENANCE_MODE === 'true';
        const newStatus = isCurrentlyActive ? 'false' : 'true';

        if (!isCurrentlyActive) {
            if (!window.confirm("WARNING: Enabling Maintenance Mode will immediately block all Students and TPOs from using the platform. Are you sure?")) return;
        }

        try {
            setUpdating(true);
            await SuperAdminApi.updateSetting('MAINTENANCE_MODE', newStatus);
            toast.success(`Maintenance Mode ${newStatus === 'true' ? 'enabled' : 'disabled'}`);
            fetchSettings();
        } catch (error) {
            toast.error("Failed to update maintenance mode");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-muted-foreground">Loading settings...</div>;

    const isMaintenanceMode = settings.MAINTENANCE_MODE === 'true';

    return (
        <div className="space-y-8">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-500" /> Platform Settings
                </h2>

                <div className="space-y-6">
                    <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-background">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-red-500" /> Maintenance Mode
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                                When enabled, all APIs will return a 503 Service Unavailable error for non-admin users. 
                                Use this when performing critical database migrations or updates.
                            </p>
                            {isMaintenanceMode && (
                                <div className="mt-3 inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-semibold">
                                    <AlertTriangle className="w-4 h-4" /> Platform is currently offline for users
                                </div>
                            )}
                        </div>
                        <Button 
                            variant={isMaintenanceMode ? "default" : "destructive"}
                            onClick={toggleMaintenanceMode}
                            disabled={updating}
                        >
                            {isMaintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
