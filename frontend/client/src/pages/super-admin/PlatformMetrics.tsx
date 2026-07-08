import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { toast } from 'sonner';
import { Building2, Users, GraduationCap, Briefcase, Network, Code2 } from 'lucide-react';

export const PlatformMetrics = () => {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await SuperAdminApi.getMetrics();
                setMetrics(data);
            } catch (error) {
                toast.error("Failed to load platform metrics");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return <div className="text-center py-12 text-muted-foreground">Loading metrics...</div>;
    }

    if (!metrics) {
        return <div className="text-center py-12 text-red-500">Failed to load metrics</div>;
    }

    const statCards = [
        { title: "Total Institutions", value: metrics.totalInstitutions, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Registered Students", value: metrics.totalStudents, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Total TPO Staff", value: metrics.totalTPOs, icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Total Placements", value: metrics.totalPlacements, icon: Briefcase, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "Recruitment Drives", value: metrics.totalDrives, icon: Network, color: "text-rose-500", bg: "bg-rose-500/10" },
        { title: "Assessment Kits", value: metrics.totalKits, icon: Code2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                    <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};
