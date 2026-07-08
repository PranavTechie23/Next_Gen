import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { toast } from 'sonner';
import { Megaphone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AnnouncementsTab = () => {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', is_important: false, expires_at: '' });

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await SuperAdminApi.listAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await SuperAdminApi.createAnnouncement(form);
            toast.success("Global announcement broadcasted!");
            setForm({ title: '', message: '', is_important: false, expires_at: '' });
            fetchAnnouncements();
        } catch (error) {
            toast.error("Failed to create announcement");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-500" /> Broadcast Global Announcement
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block text-muted-foreground">Title</label>
                            <input 
                                required
                                type="text" 
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                placeholder="Announcement title"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block text-muted-foreground">Expires At (Optional)</label>
                            <input 
                                type="datetime-local" 
                                value={form.expires_at}
                                onChange={e => setForm({ ...form, expires_at: e.target.value })}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block text-muted-foreground">Message</label>
                        <textarea 
                            required
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background min-h-[100px]"
                            placeholder="Type the global announcement message here..."
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={form.is_important}
                                onChange={e => setForm({ ...form, is_important: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            Mark as Important (Highlights in red)
                        </label>
                        <div className="flex-1"></div>
                        <Button type="submit" disabled={submitting}>
                            <Send className="w-4 h-4 mr-2" />
                            {submitting ? 'Broadcasting...' : 'Broadcast'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Recent Global Announcements</h2>
                </div>
                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : announcements.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No global announcements found.</div>
                    ) : (
                        announcements.map((ann) => (
                            <div key={ann.id} className={`p-6 transition-colors hover:bg-muted/10 ${ann.is_important ? 'border-l-4 border-l-red-500' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        {ann.title}
                                        {ann.is_important && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Important</span>}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(ann.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-muted-foreground whitespace-pre-wrap">{ann.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
