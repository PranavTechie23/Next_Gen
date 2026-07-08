import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { toast } from 'sonner';
import { Users, LogIn, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const UsersTab = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [selectedInstitution, setSelectedInstitution] = useState('ALL');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const instData = await SuperAdminApi.listInstitutions();
                setInstitutions(instData);
            } catch (err) {
                console.error("Failed to fetch institutions");
            }
        };
        fetchInitialData();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await SuperAdminApi.listUsers({
                page,
                limit,
                search: searchQuery,
                role: selectedRole,
                institution_id: selectedInstitution
            });
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit, selectedRole, selectedInstitution]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleImpersonate = async (userId: number) => {
        if (!window.confirm("You are about to log in as this user. Your current SuperAdmin session will be overridden. Proceed?")) return;

        try {
            await SuperAdminApi.impersonateUser(userId);
            toast.success("Impersonation successful. Reloading...");
            setTimeout(() => {
                window.location.href = '/'; 
            }, 1000);
        } catch (error) {
            toast.error("Failed to impersonate user");
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-xl font-semibold">Platform Users <span className="text-sm font-normal text-muted-foreground ml-2">({total} total)</span></h2>
                </div>
                
                <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 min-w-[200px] lg:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="text" 
                            placeholder="Search email or institution..." 
                            className="pl-9 bg-muted/40 h-9 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={selectedRole}
                        onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="TPO_ADMIN">TPO Admin</option>
                        <option value="TPO_HEAD">TPO Head</option>
                        <option value="STUDENT">Student</option>
                    </select>

                    <select 
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-40 truncate"
                        value={selectedInstitution}
                        onChange={(e) => { setSelectedInstitution(e.target.value); setPage(1); }}
                    >
                        <option value="ALL">All Institutions</option>
                        {institutions.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                        ))}
                    </select>
                    
                    <Button type="submit" size="sm" className="h-9">Search</Button>
                </form>
            </div>
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-muted/50 text-muted-foreground text-sm">
                        <tr>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Role</th>
                            <th className="px-6 py-3 font-medium">Institution</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {loading && users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading users...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No users found matching your criteria.</td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                                            u.role === 'TPO_ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' :
                                            u.role === 'STUDENT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{u.institution_name || 'System / Global'}</td>
                                    <td className="px-6 py-4">
                                        {u.is_active ? (
                                            <span className="text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Active</span>
                                        ) : (
                                            <span className="text-red-600 dark:text-red-500 font-medium flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 bg-background/50 backdrop-blur-sm"
                                            onClick={() => handleImpersonate(u.id)}
                                            disabled={u.role === 'SUPER_ADMIN'}
                                        >
                                            <LogIn className="w-4 h-4 mr-1.5" /> Login As
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {!loading && totalPages > 0 && (
                <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{users.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of <span className="font-medium text-foreground">{total}</span> users
                    </div>
                    <div className="flex items-center gap-2">
                        <select 
                            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm mr-4 shadow-sm"
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                            <option value={50}>50 / page</option>
                            <option value={100}>100 / page</option>
                        </select>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium px-2">
                            Page {page} of {totalPages}
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
