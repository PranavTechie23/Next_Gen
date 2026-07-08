import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Key, Copy, CheckCircle, Trash2, ShieldAlert } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { AssessmentKitsManager } from './AssessmentKitsManager';
import { PlatformMetrics } from './PlatformMetrics';
import { InstitutionsTab } from './InstitutionsTab';
import { UsersTab } from './UsersTab';
import { AnnouncementsTab } from './AnnouncementsTab';
import { SettingsTab } from './SettingsTab';
import { AuditLogsTab } from './AuditLogsTab';

export const SuperAdminDashboard = () => {
    const { logout } = useUser();
    const [keys, setKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'institutions' | 'users' | 'announcements' | 'keys' | 'assessments' | 'audit' | 'settings'>('overview');

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const data = await SuperAdminApi.listKeys();
            setKeys(data);
        } catch (error) {
            toast.error("Failed to load registration keys");
        }
    };

    const handleGenerateKey = async () => {
        try {
            setLoading(true);
            const res = await SuperAdminApi.generateKey(notes);
            setNotes('');
            fetchKeys();
            window.prompt(
                "Key generated successfully!\n\nCopy this key now. For security reasons, it will not be shown again:",
                res.key
            );
        } catch (error) {
            toast.error("Failed to generate key");
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeKey = async (id: number) => {
        try {
            await SuperAdminApi.revokeKey(id);
            toast.success("Key revoked successfully");
            fetchKeys();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to revoke key");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const TabButton = ({ id, label }: { id: any, label: string }) => (
        <button 
            className={`pb-2 font-medium transition-colors whitespace-nowrap ${activeTab === id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab(id)}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <ShieldAlert className="w-8 h-8 text-primary" />
                            Super Admin Portal
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage platform-wide settings and data</p>
                    </div>
                    <Button variant="outline" onClick={logout}>Sign Out</Button>
                </div>

                <div className="flex border-b border-border gap-6 overflow-x-auto pb-1">
                    <TabButton id="overview" label="Overview" />
                    <TabButton id="institutions" label="Institutions" />
                    <TabButton id="users" label="Users" />
                    <TabButton id="announcements" label="Announcements" />
                    <TabButton id="keys" label="Registration Keys" />
                    <TabButton id="assessments" label="Assessment Kits" />
                    <TabButton id="audit" label="Audit Logs" />
                    <TabButton id="settings" label="Settings" />
                </div>

                {activeTab === 'overview' && <PlatformMetrics />}
                {activeTab === 'institutions' && <InstitutionsTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'announcements' && <AnnouncementsTab />}
                {activeTab === 'assessments' && <AssessmentKitsManager />}
                {activeTab === 'audit' && <AuditLogsTab />}
                {activeTab === 'settings' && <SettingsTab />}
                
                {activeTab === 'keys' && (
                    <div className="space-y-8">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5 text-blue-500" /> Generate New Registration Key
                            </h2>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-sm font-medium mb-1 block text-muted-foreground">Internal Notes (e.g. Institution Name)</label>
                                    <input 
                                        type="text" 
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g. For MIT Pune"
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                    />
                                </div>
                                <Button onClick={handleGenerateKey} disabled={loading} className="px-8">
                                    {loading ? "Generating..." : "Generate Key"}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-semibold">Active & Used Keys</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/50 text-muted-foreground text-sm">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Key Value</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Institution</th>
                                            <th className="px-6 py-3 font-medium">Notes</th>
                                            <th className="px-6 py-3 font-medium">Created At</th>
                                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border text-sm">
                                        {keys.map((k) => (
                                            <tr key={k.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4 font-mono text-primary font-medium flex items-center gap-2">
                                                    {k.key_value ? `${k.key_value.substring(0, 8)}...` : '-'}
                                                    <button onClick={() => copyToClipboard(k.key_value)} className="text-muted-foreground hover:text-foreground" title="Copy Hashed Key">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {k.is_used ? (
                                                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold w-max">
                                                            <CheckCircle className="w-3 h-3" /> Used
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-semibold w-max">
                                                            <Key className="w-3 h-3" /> Unused
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{k.institution_name || '-'}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{k.notes || '-'}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{new Date(k.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    {!k.is_used && (
                                                        <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto" onClick={() => handleRevokeKey(k.id)}>
                                                            <Trash2 className="w-4 h-4 mr-1" /> Revoke
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {keys.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                                    No registration keys found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
