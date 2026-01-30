import React, {
    useState,
    useEffect,
    useContext,
    createContext,
    useReducer,
    useCallback,
    FormEvent,
    useMemo,
    useRef,
} from "react";
import {
    Star,
    ThumbsUp,
    AlertCircle,
    CheckCircle2,
    X,
    Search,
    BarChart3,
    MessageSquare,
    User,
    Mail,
    Zap,
    Clock,
    TrendingUp,
    Send,
    Bell,
    Shield,
    ChevronUp,
    ChevronDown,
    LayoutDashboard,
    PlusCircle,
    ListFilter,
    MoreHorizontal,
    ArrowRight,
    Sparkles,
    Inbox,
    Filter
} from "lucide-react";

// -----------------------------
// Global Styles & Animations
// -----------------------------
const styleTag = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.animate-enter {
  animation: enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
`;

// -----------------------------
// Types
// -----------------------------

export type FeedbackType = "bug" | "feature" | "improvement" | "compliment" | "general";
export type FeedbackPriority = "low" | "medium" | "high" | "critical";
export type FeedbackStatus = "new" | "in-progress" | "resolved" | "closed";

export interface Feedback {
    id: string;
    name: string;
    email: string;
    type: FeedbackType;
    priority: FeedbackPriority;
    status: FeedbackStatus;
    title: string;
    message: string;
    rating: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
    assignedTo?: string;
    comments: Comment[];
    upvotes: number;
    isAnonymous: boolean;
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: Date;
    isAdmin: boolean;
}

export interface UserStats {
    totalFeedback: number;
    feedbackResolved: number;
    avgResponseTime: number; // hours
    userScore: number;
}

// -----------------------------
// Context & State Logic
// -----------------------------

interface FeedbackContextType {
    feedbacks: Feedback[];
    userStats: UserStats;
    addFeedback: (fb: Omit<Feedback, "id" | "createdAt" | "updatedAt" | "comments" | "upvotes">) => void;
    updateFeedback: (id: string, updates: Partial<Feedback>) => void;
    addComment: (feedbackId: string, comment: Omit<Comment, "id" | "createdAt">) => void;
    upvoteFeedback: (id: string) => void;
    toasts: Toast[];
    addToast: (message: string, type: "success" | "error") => void;
    removeToast: (id: string) => void;
}

interface Toast {
    id: string;
    message: string;
    type: "success" | "error";
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) throw new Error("useFeedback must be used within FeedbackProvider");
    return context;
};

// --- Initial Data Generators ---
const generateMockData = (): Feedback[] => [
    {
        id: "1",
        name: "Alex Design",
        email: "alex@design.co",
        type: "feature",
        priority: "high",
        status: "in-progress",
        title: "Dark Mode Support",
        message: "The current light theme is beautiful, but a dark mode would really help during late-night work sessions.",
        rating: 9,
        tags: ["ui", "ux", "accessibility"],
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(),
        assignedTo: "Design Team",
        comments: [
            { id: "c1", userId: "admin", userName: "Product Team", content: "On our roadmap for Q3!", createdAt: new Date(), isAdmin: true }
        ],
        upvotes: 45,
        isAnonymous: false,
    },
    {
        id: "2",
        name: "Sarah Dev",
        email: "sarah@dev.io",
        type: "bug",
        priority: "critical",
        status: "new",
        title: "API Timeout on Export",
        message: "Exporting large datasets (>50MB) causes a 504 Gateway Timeout intermittently.",
        rating: 3,
        tags: ["backend", "performance", "urgent"],
        createdAt: new Date(Date.now() - 3600000 * 4),
        updatedAt: new Date(),
        comments: [],
        upvotes: 12,
        isAnonymous: false,
    },
    {
        id: "3",
        name: "Anonymous",
        email: "anon@mail.com",
        type: "compliment",
        priority: "low",
        status: "resolved",
        title: "Love the new Dashboard!",
        message: "The analytics widgets are incredibly snappy now. Great job on the optimization.",
        rating: 10,
        tags: ["kudos", "performance"],
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(),
        resolvedAt: new Date(),
        comments: [],
        upvotes: 89,
        isAnonymous: true,
    }
];

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Load initial data
    useEffect(() => {
        setTimeout(() => {
            setFeedbacks(generateMockData());
        }, 500);
    }, []);

    const addToast = (message: string, type: "success" | "error") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const addFeedback = (data: any) => {
        const newFb: Feedback = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: [],
            upvotes: 0,
        };
        setFeedbacks((prev) => [newFb, ...prev]);
        addToast("Feedback submitted successfully!", "success");
    };

    const updateFeedback = (id: string, updates: Partial<Feedback>) => {
        setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f)));
    };

    const addComment = (feedbackId: string, comment: any) => {
        const newComment = { ...comment, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
        setFeedbacks((prev) =>
            prev.map((f) => (f.id === feedbackId ? { ...f, comments: [...f.comments, newComment] } : f))
        );
    };

    const upvoteFeedback = (id: string) => {
        setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, upvotes: f.upvotes + 1 } : f)));
    };

    const userStats = useMemo(() => {
        const resolved = feedbacks.filter((f) => f.status === "resolved" || f.status === "closed");
        return {
            totalFeedback: feedbacks.length,
            feedbackResolved: resolved.length,
            avgResponseTime: 24.5, // Mocked for visuals
            userScore: 92,
        };
    }, [feedbacks]);

    return (
        <FeedbackContext.Provider
            value={{ feedbacks, userStats, addFeedback, updateFeedback, addComment, upvoteFeedback, toasts, addToast, removeToast }}
        >
            {children}
        </FeedbackContext.Provider>
    );
};

// -----------------------------
// UI Components
// -----------------------------

const ToastContainer = () => {
    const { toasts, removeToast } = useFeedback();
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all animate-enter bg-white border border-slate-100 ${toast.type === "success" ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
                        }`}
                >
                    {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 ml-2">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};

const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({
    children,
    className = "",
    noPadding = false,
}) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow duration-300 ${noPadding ? "" : "p-6"} ${className}`}>
        {children}
    </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant: string }> = ({ children, variant }) => {
    const styles: Record<string, string> = {
        bug: "bg-rose-50 text-rose-600 ring-rose-500/10",
        feature: "bg-indigo-50 text-indigo-600 ring-indigo-500/10",
        improvement: "bg-emerald-50 text-emerald-600 ring-emerald-500/10",
        compliment: "bg-amber-50 text-amber-600 ring-amber-500/10",
        general: "bg-slate-50 text-slate-600 ring-slate-500/10",
        new: "bg-blue-50 text-blue-700 ring-blue-700/10",
        "in-progress": "bg-violet-50 text-violet-700 ring-violet-700/10",
        resolved: "bg-teal-50 text-teal-700 ring-teal-700/10",
        critical: "bg-red-50 text-red-700 border-red-200",
        high: "bg-orange-50 text-orange-700 border-orange-200",
        medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
        low: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${styles[variant] || styles.general} flex items-center gap-1.5`}>
            {children}
        </span>
    );
};

// -----------------------------
// Dashboard Components
// -----------------------------

const StatCard: React.FC<{ title: string; value: string | number; icon: any; trend?: string; color: string }> = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
}) => (
    <Card className="relative overflow-hidden group">
        <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-[0.08] transition-transform group-hover:scale-110 ${color}`} />
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
            </div>
        </div>
        {trend && (
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium relative z-10">
                <TrendingUp className="w-4 h-4" />
                <span>{trend}</span>
                <span className="text-slate-400 font-normal ml-1">vs last month</span>
            </div>
        )}
    </Card>
);

const Dashboard = () => {
    const { feedbacks, userStats } = useFeedback();

    // Simple aggregation for charts
    const typeCounts = feedbacks.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6 animate-enter">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Feedback" value={userStats.totalFeedback} icon={Inbox} trend="+12%" color="bg-indigo-600" />
                <StatCard title="Resolved Issues" value={userStats.feedbackResolved} icon={CheckCircle2} trend="+5%" color="bg-emerald-600" />
                <StatCard title="Avg Response" value={`${userStats.avgResponseTime}h`} icon={Clock} trend="-2.4h" color="bg-amber-500" />
                <StatCard title="Satisfaction" value={`${userStats.userScore}%`} icon={Star} trend="+4%" color="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart Area */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900">Feedback Volume</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">Weekly</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-full text-slate-500 hover:bg-slate-100">Monthly</button>
                        </div>
                    </div>
                    {/* Decorative Graph Placeholder */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-50 rounded-t-lg relative group transition-all duration-500 hover:bg-indigo-100" style={{ height: `${h}%` }}>
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all duration-700 ease-out"
                                    style={{ height: `${h * 0.6}%`, opacity: 0.8 }}
                                />
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h} items
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </Card>

                {/* Categories */}
                <Card>
                    <h3 className="font-semibold text-slate-900 mb-6">By Category</h3>
                    <div className="space-y-6">
                        {Object.entries(typeCounts).map(([type, count], idx) => (
                            <div key={type} className="group">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="capitalize font-medium text-slate-700 flex items-center gap-2">
                                        {type === 'bug' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                                        {type === 'feature' && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                                        {type === 'improvement' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                        {type === 'compliment' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                                        {type === 'general' && <div className="w-2 h-2 rounded-full bg-slate-500" />}
                                        {type}
                                    </span>
                                    <span className="text-slate-500">{count} ({Math.round((count / userStats.totalFeedback) * 100)}%)</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${type === 'bug' ? 'bg-rose-500' :
                                            type === 'feature' ? 'bg-indigo-500' :
                                                type === 'improvement' ? 'bg-emerald-500' :
                                                    type === 'compliment' ? 'bg-amber-500' : 'bg-slate-500'
                                            }`}
                                        style={{ width: `${(count / userStats.totalFeedback) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Most active category</span>
                            <span className="font-semibold text-indigo-600 capitalize">Feature Request</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// -----------------------------
// Form Component
// -----------------------------

interface FeedbackFormState {
    name: string;
    email: string;
    type: FeedbackType;
    priority: FeedbackPriority;
    title: string;
    message: string;
    rating: number;
    tags: string[];
    isAnonymous: boolean;
}

const FeedbackWizard = () => {
    const { addFeedback } = useFeedback();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FeedbackFormState>({
        name: "", email: "", type: "feature", priority: "medium",
        title: "", message: "", rating: 0, tags: [], isAnonymous: false
    });

    const handleTypeSelect = (type: FeedbackType) => {
        setFormData(prev => ({ ...prev, type }));
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addFeedback({ ...formData, status: "new" });
        setStep(4); // Success step
        // Reset after delay or manual
        setTimeout(() => {
            setFormData({
                name: "", email: "", type: "feature", priority: "medium",
                title: "", message: "", rating: 0, tags: [], isAnonymous: false
            });
            setStep(1);
        }, 2000);
    };

    return (
        <div className="max-w-3xl mx-auto animate-enter">
            {/* Step Indicator */}
            <div className="mb-8 flex justify-between items-center px-4 md:px-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${s === step ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" :
                            s < step ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                            }`}>
                            {s < step ? <CheckCircle2 size={18} /> : s}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${s === step ? "text-indigo-600" : "text-slate-400"}`}>
                            {s === 1 ? "Category" : s === 2 ? "Details" : "Review"}
                        </span>
                    </div>
                ))}
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 -z-0 mx-auto w-2/3" />
                <div
                    className="absolute top-5 left-0 right-0 h-0.5 bg-indigo-600 -z-0 mx-auto w-2/3 transition-all duration-500"
                    style={{ width: step === 1 ? '0%' : step === 2 ? '33%' : step === 3 ? '66%' : '100%' }}
                />
            </div>

            <Card className="min-h-[400px] flex flex-col justify-center">
                {step === 1 && (
                    <div className="animate-enter">
                        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">What's on your mind?</h2>
                        <p className="text-slate-500 text-center mb-8">Choose a category to help us route your feedback.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { id: 'bug' as FeedbackType, icon: AlertCircle, label: 'Report a Bug', color: 'text-rose-600', bg: 'bg-rose-50', border: 'hover:border-rose-200' },
                                { id: 'feature' as FeedbackType, icon: Zap, label: 'Feature Request', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'hover:border-indigo-200' },
                                { id: 'improvement' as FeedbackType, icon: Sparkles, label: 'Improvement', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
                                { id: 'compliment' as FeedbackType, icon: ThumbsUp, label: 'Compliment', color: 'text-amber-600', bg: 'bg-amber-50', border: 'hover:border-amber-200' },
                                { id: 'general' as FeedbackType, icon: MessageSquare, label: 'General', color: 'text-slate-600', bg: 'bg-slate-50', border: 'hover:border-slate-200' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTypeSelect(item.id)}
                                    className={`p-6 rounded-xl border border-transparent bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group ring-1 ring-slate-100 ${item.border}`}
                                >
                                    <div className={`p-4 rounded-full ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                        <item.icon size={28} />
                                    </div>
                                    <span className="font-semibold text-slate-700">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-enter max-w-lg mx-auto w-full">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Tell us more</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                                    placeholder="Brief summary..."
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white resize-none"
                                    placeholder="Add details, steps to reproduce, or specific suggestions..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Emotion</label>
                                    <div className="flex gap-1 bg-slate-50 p-1.5 rounded-lg">
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setFormData({ ...formData, rating: r * 2 })}
                                                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${formData.rating >= r * 2 ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {r * 2}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-6">
                                <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-700 font-medium">Back</button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.title || !formData.message}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-enter max-w-lg mx-auto w-full">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Final Details</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        disabled={formData.isAnonymous}
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        disabled={formData.isAnonymous}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                                <div
                                    className={`w-11 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.isAnonymous ? 'bg-indigo-600' : ''}`}
                                    onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${formData.isAnonymous ? 'translate-x-5' : ''}`} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 text-sm">Submit Anonymously</p>
                                    <p className="text-xs text-slate-500">We won't display your name publicly</p>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-between">
                                <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-700 font-medium">Back</button>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-200 flex items-center gap-2"
                                >
                                    <Send size={18} />
                                    Submit Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center animate-enter py-12">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your feedback has been successfully submitted. We appreciate your contribution to making our platform better.</p>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: "", email: "", type: "feature", priority: "medium",
                                    title: "", message: "", rating: 0, tags: [], isAnonymous: false
                                });
                                setStep(1);
                            }}
                            className="text-indigo-600 font-medium hover:text-indigo-800"
                        >
                            Submit another
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

// -----------------------------
// Feed Logic & Items
// -----------------------------

const FeedbackItem: React.FC<{ feedback: Feedback }> = ({ feedback }) => {
    const [expanded, setExpanded] = useState(false);
    const { upvoteFeedback, addComment } = useFeedback();
    const [comment, setComment] = useState("");

    const submitComment = () => {
        if (!comment.trim()) return;
        addComment(feedback.id, { userId: 'me', userName: 'Me', content: comment, isAdmin: false });
        setComment("");
    };

    return (
        <div className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100">
            <div className="flex gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                        onClick={() => upvoteFeedback(feedback.id)}
                        className="w-10 h-10 rounded-lg bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 flex flex-col items-center justify-center transition-colors group-hover:scale-105"
                    >
                        <ChevronUp size={20} />
                    </button>
                    <span className="font-bold text-slate-700">{feedback.upvotes}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-slate-900 text-lg">{feedback.title}</h3>
                                <Badge variant={feedback.type}>
                                    {feedback.type === 'bug' ? <AlertCircle size={12} /> : <Zap size={12} />}
                                    {feedback.type}
                                </Badge>
                                <Badge variant={feedback.priority}>{feedback.priority}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-medium text-slate-700">{feedback.isAnonymous ? "Anonymous" : feedback.name}</span>
                                <span>•</span>
                                <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                                {feedback.assignedTo && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                            <Shield size={10} /> {feedback.assignedTo}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <Badge variant={feedback.status}>{feedback.status}</Badge>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-4">{feedback.message}</p>

                    <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            <MessageSquare size={16} />
                            {feedback.comments.length} Comments
                        </button>
                        <div className="flex-1" />
                        <div className="flex gap-1">
                            {feedback.tags.map(tag => (
                                <span key={tag} className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100 animate-enter">
                            <div className="space-y-4 mb-4">
                                {feedback.comments.length === 0 && <p className="text-sm text-slate-400 italic">No comments yet.</p>}
                                {feedback.comments.map(c => (
                                    <div key={c.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {c.userName.charAt(0)}
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-r-xl rounded-bl-xl p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-sm font-bold ${c.isAdmin ? 'text-indigo-600' : 'text-slate-700'}`}>
                                                    {c.userName} {c.isAdmin && <span className="text-[10px] bg-indigo-100 px-1 rounded ml-1">TEAM</span>}
                                                </span>
                                                <span className="text-xs text-slate-400">Just now</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{c.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <input
                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Write a comment..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && submitComment()}
                                />
                                <button onClick={submitComment} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FeedbackFeed = () => {
    const { feedbacks } = useFeedback();
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = feedbacks.filter(f => {
        if (filter !== "all" && f.status !== filter && f.type !== filter) return false;
        if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="max-w-4xl mx-auto animate-enter">
            {/* Toolbar */}
            <div className="sticky top-0 z-20 bg-[#f8fafc]/95 backdrop-blur py-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="Search feedback..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                        {['all', 'bug', 'feature', 'improvement'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block" />
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4 pb-12">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Inbox size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No feedback found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search query.</p>
                    </div>
                ) : (
                    filtered.map(fb => <FeedbackItem key={fb.id} feedback={fb} />)
                )}
            </div>
        </div>
    );
};

// -----------------------------
// Layout & Main App
// -----------------------------

const SidebarItem: React.FC<{ icon: any; label: string; active?: boolean; onClick: () => void; badge?: number }> = ({
    icon: Icon, label, active, onClick, badge
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />}
        <Icon size={20} className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
        <span className="font-medium">{label}</span>
        {badge && (
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>
                {badge}
            </span>
        )}
    </button>
);

export default function EnhancedFeedbackApp() {
    const [view, setView] = useState<'dashboard' | 'feed' | 'submit'>('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <FeedbackProvider>
            <style>{styleTag}</style>
            <div className="min-h-screen flex bg-[#f8fafc] text-slate-900">
                {/* Sidebar */}
                <aside className={`fixed lg:sticky top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-30 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-300">
                            F
                        </div>
                        {isSidebarOpen && <span className="font-bold text-xl tracking-tight">FeedBack<span className="text-indigo-600">.io</span></span>}
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-1">
                        <SidebarItem icon={LayoutDashboard} label="Overview" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                        <SidebarItem icon={ListFilter} label="All Feedback" active={view === 'feed'} onClick={() => setView('feed')} badge={3} />
                        <SidebarItem icon={PlusCircle} label="Submit New" active={view === 'submit'} onClick={() => setView('submit')} />

                        <div className="pt-8 pb-2 px-4">
                            {isSidebarOpen && <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>}
                        </div>
                        <SidebarItem icon={Bell} label="Notifications" onClick={() => { }} badge={12} />
                        <SidebarItem icon={User} label="Team Members" onClick={() => { }} />
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <button className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100" alt="Avatar" />
                            {isSidebarOpen && (
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-semibold text-slate-900 truncate">Felix Johnson</p>
                                    <p className="text-xs text-slate-500 truncate">Product Manager</p>
                                </div>
                            )}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Header */}
                    <header className="h-16 border-b border-slate-200/50 bg-white/80 backdrop-blur sticky top-0 z-20 px-8 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-slate-800">
                            {view === 'dashboard' && 'Dashboard Overview'}
                            {view === 'feed' && 'User Feedback'}
                            {view === 'submit' && 'New Submission'}
                        </h1>
                        <div className="flex items-center gap-4">
                            <button className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                                <Bell size={20} />
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                Export Report
                            </button>
                        </div>
                    </header>

                    <div className="p-8 max-w-7xl mx-auto">
                        {view === 'dashboard' && <Dashboard />}
                        {view === 'feed' && <FeedbackFeed />}
                        {view === 'submit' && <FeedbackWizard />}
                    </div>
                </main>

                <ToastContainer />
            </div>
        </FeedbackProvider>
    );
}