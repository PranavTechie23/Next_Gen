import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { toast } from 'sonner';
import { Activity, Clock } from 'lucide-react';

export const AuditLogsTab = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const data = await SuperAdminApi.getAuditLogs();
            setLogs(data);
        } catch (error) {
            toast.error("Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    if (loading) return <div className="text-center py-12 text-muted-foreground">Loading audit logs...</div>;

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-semibold">System Audit Logs</h2>
                </div>
                <span className="text-sm text-muted-foreground">Showing last 100 entries</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-6 py-3 font-medium">Timestamp</th>
                            <th className="px-6 py-3 font-medium">Action</th>
                            <th className="px-6 py-3 font-medium">Actor</th>
                            <th className="px-6 py-3 font-medium">Target</th>
                            <th className="px-6 py-3 font-medium">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-semibold text-primary">{log.action_type}</td>
                                <td className="px-6 py-4">{log.actor_email || 'System'}</td>
                                <td className="px-6 py-4 font-mono text-xs">{log.target_table} (ID: {log.target_id || '-'})</td>
                                <td className="px-6 py-4 text-muted-foreground">{log.description}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No audit logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
