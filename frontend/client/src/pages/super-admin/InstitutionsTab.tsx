import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { toast } from 'sonner';
import { Building2, Power, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InstitutionsTab = () => {
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInstitutions = async () => {
        try {
            setLoading(true);
            const data = await SuperAdminApi.listInstitutions();
            setInstitutions(data);
        } catch (error) {
            toast.error("Failed to load institutions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        if (!window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'suspend'} this institution?`)) return;

        try {
            await SuperAdminApi.toggleInstitutionStatus(id, newStatus);
            toast.success(`Institution ${newStatus ? 'activated' : 'suspended'} successfully`);
            fetchInstitutions();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="text-center py-12 text-muted-foreground">Loading institutions...</div>;

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Managed Institutions</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 text-muted-foreground text-sm">
                        <tr>
                            <th className="px-6 py-3 font-medium">Name</th>
                            <th className="px-6 py-3 font-medium">Code</th>
                            <th className="px-6 py-3 font-medium">Contact</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {institutions.map((inst) => (
                            <tr key={inst.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 font-medium">{inst.name}</td>
                                <td className="px-6 py-4">{inst.code}</td>
                                <td className="px-6 py-4">{inst.contact_email}</td>
                                <td className="px-6 py-4">
                                    {inst.is_active ? (
                                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
                                    ) : (
                                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold">Suspended</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button 
                                        variant={inst.is_active ? "destructive" : "default"} 
                                        size="sm" 
                                        className="h-8"
                                        onClick={() => handleToggleStatus(inst.id, inst.is_active ?? true)}
                                    >
                                        {inst.is_active ? <><PowerOff className="w-4 h-4 mr-1" /> Suspend</> : <><Power className="w-4 h-4 mr-1" /> Activate</>}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {institutions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No institutions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
