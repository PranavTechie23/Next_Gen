import React, { useState, useEffect } from 'react';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from "@/components/ThemeToggle";
import {
    ArrowLeft,
    RefreshCcw,
    Clock,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Receipt,
    HelpCircle,
    FileText,
    ChevronDown,
    ChevronUp,
    Mail,
    MessageSquare,
    Phone,
    Calendar,
    CreditCard,
    Users,
    Zap,
    TrendingUp,
    Award,
    DollarSign,
    Download,
    Share2,
    Bell,
    Info,
    Star,
    BookOpen,
    Target,
    Shield,
    Lock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Sparkles,
    ArrowRight,
    Moon,
    Sun,
    Search,
    Filter,
    BarChart3,
    Briefcase,
    GraduationCap,
    LightbulbIcon,
    MessageCircle
} from 'lucide-react';

export default function RefundPolicy(props: any) {
    const isDashboard = props?.isDashboard || false;
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        avgRefundTime: 0,
        satisfaction: 0,
        processed: 0
    });

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedStats({
                avgRefundTime: 7,
                satisfaction: 98,
                processed: 5000
            });
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        window.history.back();
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const refundSteps = [
        {
            icon: FileText,
            title: "Submit Request",
            desc: "Raise a refund request through your student dashboard or email support within the eligible timeframe.",
            color: "from-blue-500 to-cyan-500",
            estimatedTime: "Instant"
        },
        {
            icon: Clock,
            title: "Review Period",
            desc: "Our specialized team reviews your request and verifies eligibility within 3-5 business days.",
            color: "from-purple-500 to-pink-500",
            estimatedTime: "3-5 days"
        },
        {
            icon: ShieldCheck,
            title: "Verification",
            desc: "Automated and manual verification of eligibility based on our comprehensive policy criteria.",
            color: "from-amber-500 to-orange-500",
            estimatedTime: "1-2 days"
        },
        {
            icon: RefreshCcw,
            title: "Processing",
            desc: "Approved refunds are securely processed back to your original payment method automatically.",
            color: "from-green-500 to-emerald-500",
            estimatedTime: "7-10 days"
        }
    ];

    const faqs = [
        {
            category: 'General',
            question: "What is the standard refund window for course purchases?",
            answer: "Our standard refund window is 7 days from the date of purchase. However, you must not have accessed more than 25% of the course content. For placement-linked bootcamps, special terms may apply. We want to ensure you have enough time to evaluate if the course meets your expectations while protecting our content creators."
        },
        {
            category: 'General',
            question: "How long does it take to receive my refund?",
            answer: "Once approved, refunds typically take 7-10 business days to appear in your account. The exact timing depends on your bank or payment provider. Digital wallet payments (like PayPal, GPay) are often processed within 48 hours. Credit card refunds may take longer due to banking cycles. You'll receive email notifications at each stage of the process."
        },
        {
            category: 'Eligibility',
            question: "Can I get a refund if I've completed more than 25% of the course?",
            answer: "Unfortunately, if you've accessed more than 25% of the course content, you're no longer eligible for a standard refund. However, if you're experiencing technical issues or content quality concerns, please contact our support team. We evaluate exceptional cases individually and may offer credits or alternative solutions."
        },
        {
            category: 'Eligibility',
            question: "Are subscription-based plans eligible for refunds?",
            answer: "Subscription-based plans (Monthly/Annual) can be cancelled at any time from your account settings. However, we do not provide refunds for partial months already used. Your access will continue until the end of your current billing period. Annual subscriptions cancelled within the first 30 days may be eligible for a prorated refund."
        },
        {
            category: 'Process',
            question: "How do I submit a refund request?",
            answer: "You can submit a refund request in three ways: 1) Through your student dashboard under 'Billing & Payments', 2) By emailing billing@campuscareer.com with your order details, or 3) By contacting our support team via live chat. Please include your order number, reason for refund, and any relevant details to expedite the process."
        },
        {
            category: 'Process',
            question: "What information do I need to provide for a refund request?",
            answer: "Please provide: your order number or transaction ID, registered email address, course name, date of purchase, and a brief reason for the refund request. If applicable, include screenshots of any technical issues or concerns. This helps us process your request faster and improve our services."
        },
        {
            category: 'Special Cases',
            question: "What happens if I don't get placed after completing a placement-linked bootcamp?",
            answer: "For our placement-linked bootcamps, if you complete the entire program, meet all requirements (attendance, assignments, assessments), and actively participate in placement activities but don't receive a job offer within the guaranteed period, you may be eligible for a partial credit (up to 50% of program fees) towards future certifications or a program extension at no cost."
        },
        {
            category: 'Special Cases',
            question: "Can I get a refund for application or registration fees?",
            answer: "Application and registration fees are non-refundable as they cover administrative costs for processing your enrollment, background verification, and system setup. These fees are clearly marked during checkout. However, if your application is rejected by our admissions team, these fees will be fully refunded automatically."
        },
        {
            category: 'Payment Methods',
            question: "Will I receive my refund through the same payment method I used?",
            answer: "Yes, all refunds are processed back to the original payment method used for the purchase. This is a security measure to prevent fraud. If the original payment method is no longer valid (expired card, closed account), please contact our billing team to arrange an alternative refund method with proper verification."
        },
        {
            category: 'Payment Methods',
            question: "What if I paid using multiple payment methods or installments?",
            answer: "If you used multiple payment methods (e.g., partial credit card, partial wallet), the refund will be split proportionally to each method. For installment plans, if you're eligible for a refund, we'll refund all payments made to date and cancel future installments. Any interest or processing fees charged by third-party lenders may not be refundable."
        },
        {
            category: 'Technical',
            question: "I'm experiencing technical issues with the platform. Can I get a refund?",
            answer: "We strive for a seamless experience. If you're facing technical difficulties, please contact our technical support team first. Most issues can be resolved quickly. If the issues persist and significantly impact your learning, you may be eligible for a refund or course extension, evaluated on a case-by-case basis."
        },
        {
            category: 'Technical',
            question: "What if the course content doesn't match the description?",
            answer: "We take course quality and accuracy seriously. If you find that the course content significantly differs from the description or syllabus, please report this within 7 days of purchase. We'll investigate and, if confirmed, provide a full refund regardless of content accessed, plus a 10% credit for future courses as an apology."
        },
        {
            category: 'Policy',
            question: "Can I transfer my course to another student instead of getting a refund?",
            answer: "Course transfers are allowed within 14 days of purchase for a nominal processing fee of $25. The new student must create an account and accept the transfer. This is a great option if someone else in your network could benefit from the course. Contact our support team to initiate the transfer process."
        },
        {
            category: 'Policy',
            question: "Do you offer any cooling-off period for international students?",
            answer: "Yes, international students have a 14-day cooling-off period as per international consumer protection standards, compared to 7 days for domestic students. This accounts for time zone differences and international payment processing times. The 25% content access limit still applies."
        },
        {
            category: 'Corporate',
            question: "How do refunds work for corporate or bulk purchases?",
            answer: "Corporate and bulk purchases (5+ licenses) follow customized refund terms outlined in your organization's agreement. Typically, unused licenses can be refunded within 30 days of purchase. Partially used licenses may be eligible for prorated refunds. Contact your dedicated account manager for specific details."
        }
    ];

    const stats = [
        {
            icon: Clock,
            label: "Avg. Refund Time",
            value: `${animatedStats.avgRefundTime}`,
            suffix: " days",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            icon: Star,
            label: "Satisfaction Rate",
            value: `${animatedStats.satisfaction}`,
            suffix: "%",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            icon: Users,
            label: "Refunds Processed",
            value: `${animatedStats.processed}`,
            suffix: "+",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            icon: Award,
            label: "Response Time",
            value: "< 24",
            suffix: " hrs",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        }
    ];

    const categories = [
        { id: 'all', label: 'All Questions', icon: BookOpen },
        { id: 'General', label: 'General', icon: Info },
        { id: 'Eligibility', label: 'Eligibility', icon: CheckCircle },
        { id: 'Process', label: 'Process', icon: RefreshCcw },
        { id: 'Special Cases', label: 'Special Cases', icon: Star },
        { id: 'Payment Methods', label: 'Payment', icon: CreditCard },
        { id: 'Technical', label: 'Technical', icon: Zap },
        { id: 'Policy', label: 'Policy', icon: Shield },
        { id: 'Corporate', label: 'Corporate', icon: Briefcase }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const refundScenarios = [
        {
            title: "Full Refund Eligible",
            icon: CheckCircle2,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            scenarios: [
                "Request within 7 days and less than 25% content accessed",
                "Technical issues preventing course access (verified)",
                "Course content doesn't match description (verified)",
                "Application rejected by admissions team"
            ]
        },
        {
            title: "Partial Refund/Credit",
            icon: AlertCircle,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            scenarios: [
                "Placement-linked program with no placement (50% credit)",
                "Request between 7-14 days with minimal access",
                "Annual subscription cancelled within 30 days (prorated)",
                "Extraordinary circumstances (case-by-case evaluation)"
            ]
        },
        {
            title: "Non-Refundable",
            icon: XCircle,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            scenarios: [
                "More than 25% course content accessed",
                "Request after 7-day window (14 days for international)",
                "Application/registration fees (unless rejected)",
                "Completed assessments or earned certifications",
                "Physical materials already shipped"
            ]
        }
    ];

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            description: "billing@campuscareer.com",
            actionText: "Send Email",
            availability: "Response within 24 hours",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Instant messaging support",
            actionText: "Start Chat",
            availability: "Mon-Fri, 9 AM - 6 PM IST",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "+91-XXX-XXX-XXXX",
            actionText: "Call Now",
            availability: "Mon-Fri, 10 AM - 5 PM IST",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: FileText,
            title: "Submit Ticket",
            description: "Detailed support request",
            actionText: "Create Ticket",
            availability: "24/7 submission",
            color: "from-amber-500 to-orange-500"
        }
    ];

    const policyHighlights = [
        {
            icon: Shield,
            title: "Money-Back Guarantee",
            description: "7-day satisfaction guarantee for all courses with clear eligibility criteria"
        },
        {
            icon: Lock,
            title: "Secure Processing",
            description: "Bank-grade encryption for all refund transactions and personal data"
        },
        {
            icon: Zap,
            title: "Fast Track Option",
            description: "Priority processing available for urgent cases (24-48 hour review)"
        },
        {
            icon: TrendingUp,
            title: "Transparent Timeline",
            description: "Real-time tracking of your refund request status via dashboard"
        }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Data Science Student",
            image: "PS",
            content: "The refund process was incredibly smooth. I requested a refund within the first week, and the team processed it without any hassle. Received my money back in just 8 days!",
            rating: 5
        },
        {
            name: "Rahul Verma",
            role: "Web Development Bootcamp",
            image: "RV",
            content: "I had concerns about the course content, but the support team was very understanding. They not only processed my refund quickly but also suggested alternative courses that better matched my goals.",
            rating: 5
        },
        {
            name: "Anita Desai",
            role: "Corporate Training Manager",
            image: "AD",
            content: "Managing refunds for our team of 20+ employees was seamless. The dedicated account manager handled everything professionally. Great experience with the platform!",
            rating: 5
        }
    ];

    return (
        <div className={`${!isDashboard ? "min-h-screen" : "bg-transparent"} transition-colors duration-300 ${isDark ? (isDashboard ? 'bg-transparent' : 'bg-black') : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} text-foreground`}>
            {/* Enhanced Header - Only show if NOT in dashboard */}
            {!isDashboard && (
                <header className={`sticky top-0 z-50 backdrop-blur-xl border-b shadow-lg transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBack}
                                    className={`${isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-all`}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                                <div className={`h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                                <div className="flex items-center gap-0">
                                    <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0" />
                                    <div>
                                        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Refund Policy</span>
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clear & Transparent</p>
                                    </div>
                                </div>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
            )}

            <main className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-12" : "py-0"}`}>
                <div className={`${!isDashboard ? "max-w-7xl mx-auto" : ""}`}>
                    {/* Hero Section - Hide if dashboard */}
                    {!isDashboard && (
                        <div className="text-center mb-16 relative">
                            <div className="absolute inset-0 -z-10 overflow-hidden">
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
                            </div>
                            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-4 py-1.5">
                                <Sparkles className="w-3 h-3 mr-1" />
                                100% Transparent Process
                            </Badge>
                            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Cancellation &
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Refund Policy</span>
                            </h1>
                            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                Your satisfaction is our priority. We've designed a fair, transparent, and hassle-free refund process to ensure your peace of mind.
                            </p>
                        </div>
                    )}

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, idx) => (
                            <Card key={idx} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
                                <CardContent className="p-6">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                                        {stat.value}<span className="text-xl">{stat.suffix}</span>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-3 mb-12 justify-center">
                        {['overview', 'process', 'faq', 'contact'].map((tab) => (
                            <Button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                variant={activeTab === tab ? 'default' : 'outline'}
                                className={`capitalize ${activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                            >
                                {tab === 'overview' && <Info className="w-4 h-4 mr-2" />}
                                {tab === 'process' && <RefreshCcw className="w-4 h-4 mr-2" />}
                                {tab === 'faq' && <HelpCircle className="w-4 h-4 mr-2" />}
                                {tab === 'contact' && <MessageSquare className="w-4 h-4 mr-2" />}
                                {tab}
                            </Button>
                        ))}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-12">
                            {/* Policy Highlights */}
                            <div>
                                <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <Target className="w-8 h-8 inline-block mr-3 text-blue-600" />
                                    Why Choose Our Refund Policy?
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {policyHighlights.map((item, idx) => (
                                        <Card key={idx} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1`}>
                                            <CardContent className="p-6">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                                                    <item.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg overflow-hidden`}>
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2" />
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <ShieldCheck className="w-6 h-6 text-green-500" />
                                                <span className={isDark ? 'text-white' : 'text-slate-900'}>Placement Guarantee</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm leading-relaxed">
                                                    Complete the entire program with 90%+ attendance
                                                </p>
                                            </div>
                                            <div className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm leading-relaxed">
                                                    Submit all assignments and pass assessments
                                                </p>
                                            </div>
                                            <div className={`flex items-start gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm leading-relaxed">
                                                    Actively participate in placement activities
                                                </p>
                                            </div>
                                            <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20' : 'bg-green-50'} border ${isDark ? 'border-green-800' : 'border-green-200'}`}>
                                                <p className={`text-xs ${isDark ? 'text-green-300' : 'text-green-700'} font-medium`}>
                                                    If not placed within guaranteed period: 50% credit or program extension
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg overflow-hidden`}>
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2" />
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertCircle className="w-6 h-6 text-amber-500" />
                                                <span className={isDark ? 'text-white' : 'text-slate-900'}>Non-Refundable Items</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                <li className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <XCircle className="w-4 h-4 text-amber-500" />
                                                    Application/registration fees ($50-$100)
                                                </li>
                                                <li className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <XCircle className="w-4 h-4 text-amber-500" />
                                                    Completed assessments & certifications
                                                </li>
                                                <li className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <XCircle className="w-4 h-4 text-amber-500" />
                                                    Physical materials already shipped
                                                </li>
                                                <li className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <XCircle className="w-4 h-4 text-amber-500" />
                                                    Third-party service fees (payment gateway)
                                                </li>
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg overflow-hidden`}>
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2" />
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Receipt className="w-6 h-6 text-purple-500" />
                                                <span className={isDark ? 'text-white' : 'text-slate-900'}>Processing Timelines</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">Digital Wallets</span>
                                                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">48 hours</Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">Debit/Credit Cards</span>
                                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">5-7 days</Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">Bank Transfers</span>
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">7-10 days</Badge>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm">International</span>
                                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">10-14 days</Badge>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-lg border ${isDark ? 'border-purple-800' : 'border-purple-200'}`}>
                                                <Bell className="w-4 h-4 text-purple-500" />
                                                <p className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                                                    Email notifications at each stage
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Testimonials */}
                            <div>
                                <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <Star className="w-8 h-8 inline-block mr-3 text-blue-600" />
                                    What Our Students Say
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {testimonials.map((testimonial, idx) => (
                                        <Card key={idx} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                        {testimonial.image}
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</h4>
                                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{testimonial.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 mb-3">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    ))}
                                                </div>
                                                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{testimonial.content}"</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Refund Scenarios */}
                            <div>
                                <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <BarChart3 className="w-8 h-8 inline-block mr-3 text-blue-600" />
                                    Refund Eligibility at a Glance
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {refundScenarios.map((scenario, idx) => (
                                        <Card key={idx} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg overflow-hidden`}>
                                            <div className={`h-2 bg-gradient-to-r ${scenario.color === 'text-green-500' ? 'from-green-500 to-emerald-500' : scenario.color === 'text-amber-500' ? 'from-amber-500 to-orange-500' : 'from-red-500 to-pink-500'}`}></div>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-xl ${scenario.bgColor} flex items-center justify-center`}>
                                                        <scenario.icon className={`w-6 h-6 ${scenario.color}`} />
                                                    </div>
                                                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{scenario.title}</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ul className="space-y-3">
                                                    {scenario.scenarios.map((item, i) => (
                                                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                            <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${scenario.color}`} />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Key Policies */}
                            <div>
                                <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <BookOpen className="w-8 h-8 inline-block mr-3 text-blue-600" />
                                    Detailed Policy Terms
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg overflow-hidden`}>
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2" />
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Clock className="w-6 h-6 text-blue-500" />
                                                <span className={isDark ? 'text-white' : 'text-slate-900'}>Standard Refund Window</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-blue-50'} border ${isDark ? 'border-slate-700' : 'border-blue-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Domestic Students</span>
                                                    <Badge className="bg-blue-600 text-white">7 Days</Badge>
                                                </div>
                                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    Full refund if less than 25% content accessed
                                                </p>
                                            </div>
                                            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-indigo-50'} border ${isDark ? 'border-slate-700' : 'border-indigo-200'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>International Students</span>
                                                    <Badge className="bg-indigo-600 text-white">14 Days</Badge>
                                                </div>
                                                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    Extended cooling-off period with same access limits
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Process Tab */}
                    {activeTab === 'process' && (
                        <div className="space-y-12">
                            <div>
                                <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Step-by-Step Refund Process
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {refundSteps.map((step, idx) => (
                                        <div key={idx} className="relative group">
                                            <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-2xl transition-all h-full group-hover:-translate-y-2`}>
                                                <div className={`h-2 bg-gradient-to-r ${step.color}`}></div>
                                                <CardContent className="p-6 text-center">
                                                    <div className="relative mb-6">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto shadow-lg`}>
                                                            <step.icon className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        {idx + 1}
                                                    </div>
                                                    <h3 className={`font-bold text-lg mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                                                    <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{step.desc}</p>
                                                    <Badge variant="outline" className={`${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-600'}`}>
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {step.estimatedTime}
                                                    </Badge>
                                                </CardContent>
                                            </Card>
                                            {idx < 3 && (
                                                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent -translate-y-1/2 z-0">
                                                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Refund Request Form Tips */}
                            <Card className={`${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-white to-blue-50 border-slate-200'} shadow-xl`}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                            <LightbulbIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className={isDark ? 'text-white' : 'text-slate-900'}>Tips for Faster Processing</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Required Information</h4>
                                            <ul className="space-y-3">
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    Order number or transaction ID
                                                </li>
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    Registered email address
                                                </li>
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    Course name and purchase date
                                                </li>
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                                    Brief reason for refund
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Best Practices</h4>
                                            <ul className="space-y-3">
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                                                    Submit request as early as possible
                                                </li>
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                                                    Provide screenshots if reporting issues
                                                </li>
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                                                    Be clear and concise in your explanation
                                                </li>
                                                <li className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Sparkles className="w-4 h-4 text-amber-500 mt-0.5" />
                                                    Check spam folder for responses
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tracking Your Refund */}
                            <div>
                                <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <TrendingUp className="w-8 h-8 inline-block mr-3 text-blue-600" />
                                    Track Your Refund Status
                                </h2>
                                <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg`}>
                                    <CardContent className="p-8">
                                        <div className="space-y-6">
                                            {[
                                                { status: 'Submitted', desc: 'Your request has been received', color: 'blue' },
                                                { status: 'Under Review', desc: 'Our team is reviewing your request', color: 'purple' },
                                                { status: 'Approved', desc: 'Your refund has been approved', color: 'green' },
                                                { status: 'Processing', desc: 'Refund is being processed to your account', color: 'amber' },
                                                { status: 'Completed', desc: 'Refund successfully credited', color: 'emerald' }
                                            ].map((stage, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full bg-${stage.color}-500/10 flex items-center justify-center border-2 border-${stage.color}-500`}>
                                                        <CheckCircle2 className={`w-5 h-5 text-${stage.color}-500`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stage.status}</h4>
                                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{stage.desc}</p>
                                                    </div>
                                                    <Badge className={`bg-${stage.color}-500 text-white`}>Step {idx + 1}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-blue-50'} border ${isDark ? 'border-slate-700' : 'border-blue-200'}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <Info className="w-5 h-5 text-blue-500" />
                                                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Real-Time Updates</h4>
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                Track your refund status in real-time from your student dashboard. You'll also receive email and SMS notifications at each stage of the process.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                        <div className="space-y-8">
                            <div className="text-center mb-12">
                                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Frequently Asked Questions
                                </h2>
                                <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Find answers to common questions about our refund policy
                                </p>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                                    <input
                                        type="text"
                                        placeholder="Search FAQs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    className={`${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                                        size="sm"
                                        className={`${selectedCategory === category.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                                    >
                                        <category.icon className="w-4 h-4 mr-2" />
                                        {category.label}
                                    </Button>
                                ))}
                            </div>

                            {/* FAQ List */}
                            <div className="space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq, idx) => (
                                        <Card
                                            key={idx}
                                            className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg overflow-hidden transition-all ${expandedFaq === idx ? 'ring-2 ring-blue-500' : ''}`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(idx)}
                                                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-opacity-80 transition-all"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge className={`${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} text-xs`}>
                                                            {faq.category}
                                                        </Badge>
                                                    </div>
                                                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                        {faq.question}
                                                    </h3>
                                                </div>
                                                <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center flex-shrink-0`}>
                                                    {expandedFaq === idx ? (
                                                        <ChevronUp className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                                                    ) : (
                                                        <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
                                                    )}
                                                </div>
                                            </button>
                                            {expandedFaq === idx && (
                                                <div className={`px-6 pb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <div className={`pl-4 border-l-4 border-blue-500 ${isDark ? 'bg-slate-800/50' : 'bg-blue-50'} p-4 rounded-r-lg`}>
                                                        <p className="leading-relaxed">{faq.answer}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <HelpCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No results found</h3>
                                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Try adjusting your search or filter criteria
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Still Have Questions */}
                            <Card className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} shadow-xl mt-12`}>
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                        <MessageCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Still have questions?
                                    </h3>
                                    <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Our support team is ready to help you with any concerns
                                    </p>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                                        onClick={() => setActiveTab('contact')}
                                    >
                                        Contact Support
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <div className="space-y-12">
                            <div className="text-center mb-12">
                                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Get in Touch
                                </h2>
                                <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Choose your preferred way to reach our billing support team
                                </p>
                            </div>

                            {/* Contact Methods */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {contactMethods.map((method, idx) => (
                                    <Card key={idx} className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1`}>
                                        <div className={`h-2 bg-gradient-to-r ${method.color}`}></div>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                    <method.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{method.title}</h3>
                                                    <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{method.description}</p>
                                                    <div className={`flex items-center gap-2 text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        <Clock className="w-3 h-3" />
                                                        {method.availability}
                                                    </div>
                                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all">
                                                        {method.actionText}
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Office Hours */}
                            <Card className={`${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'} shadow-xl`}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                        <span className={isDark ? 'text-white' : 'text-slate-900'}>Support Hours</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-blue-50'} border ${isDark ? 'border-slate-700' : 'border-blue-200'}`}>
                                            <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Regular Support</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Monday - Friday</span>
                                                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>9 AM - 6 PM IST</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Saturday</span>
                                                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>10 AM - 4 PM IST</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sunday</span>
                                                    <span className={`font-bold text-red-500`}>Closed</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-purple-50'} border ${isDark ? 'border-slate-700' : 'border-purple-200'}`}>
                                            <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Priority Support</h4>
                                            <div className="space-y-3">
                                                <div className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Zap className="w-4 h-4 text-purple-500 mt-0.5" />
                                                    <span>24/7 for urgent billing issues</span>
                                                </div>
                                                <div className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Zap className="w-4 h-4 text-purple-500 mt-0.5" />
                                                    <span>Dedicated account managers for corporate clients</span>
                                                </div>
                                                <div className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <Zap className="w-4 h-4 text-purple-500 mt-0.5" />
                                                    <span>Faster response times guaranteed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Form */}
                            <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl`}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                        <span className={isDark ? 'text-white' : 'text-slate-900'}>Send Us a Message</span>
                                    </CardTitle>
                                    <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                        Fill out the form below and we'll get back to you within 24 hours
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                                                <input
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Order Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="ORD-123456"
                                                    className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Request Type</label>
                                                <select className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                                    <option>Refund Request</option>
                                                    <option>Billing Inquiry</option>
                                                    <option>Payment Issue</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Message</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Please describe your issue in detail..."
                                                className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                                            ></textarea>
                                        </div>
                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg">
                                            <Mail className="w-5 h-5 mr-2" />
                                            Submit Request
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Resources */}
                            <div>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Additional Resources
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all group cursor-pointer`}>
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                                <Download className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Download Policy PDF</h3>
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Get a copy of our complete refund policy</p>
                                        </CardContent>
                                    </Card>
                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all group cursor-pointer`}>
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                                <BookOpen className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Help Center</h3>
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Browse our knowledge base</p>
                                        </CardContent>
                                    </Card>
                                    <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-lg hover:shadow-xl transition-all group cursor-pointer`}>
                                        <CardContent className="p-6 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                                <Share2 className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Share Feedback</h3>
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Help us improve our policies</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Help Center CTA */}
                    {activeTab !== 'contact' && (
                        <div className={`mt-16 text-center p-12 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 blur-3xl"></div>
                            <div className="relative">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
                                    <HelpCircle className="w-10 h-10 text-white" />
                                </div>
                                <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Have questions about a specific charge?
                                </h2>
                                <p className={`text-lg mb-8 max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Our dedicated billing support team is here to help you resolve any issues with your payments. We typically respond within 24 hours.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                                        onClick={() => setActiveTab('contact')}
                                    >
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        Contact Billing Support
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className={`${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'} shadow-lg`}
                                        onClick={() => window.location.href = '/help_center'}
                                    >
                                        <BookOpen className="w-5 h-5 mr-2" />
                                        View Help Center
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Enhanced Footer */}
            <footer className={`border-t py-12 mt-20 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>NextGen</span>
                            </div>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                                Empowering students with quality education and career opportunities.
                            </p>
                        </div>
                        <div>
                            <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="/courses" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Browse Courses</a></li>
                                <li><a href="/about" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>About Us</a></li>
                                <li><a href="/careers" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Careers</a></li>
                                <li><a href="/blog" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="/TermsAndCondition" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Terms of Service</a></li>
                                <li><a href="/privacy" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Privacy Policy</a></li>
                                <li><a href="/refund" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Refund Policy</a></li>
                                <li><a href="/cookie-policy" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Cookie Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Support</h4>
                            <ul className="space-y-2">
                                <li><a href="/help_center" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Help Center</a></li>
                                <li><a href="/contact" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Contact Us</a></li>
                                <li><a href="/community" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>Community</a></li>
                                <li><a href="/status" className={`text-sm ${isDark ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'} transition-colors`}>System Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className={`pt-8 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                © 2025 NextGen Platform. All rights reserved.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} flex items-center justify-center transition-all`}>
                                    <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} flex items-center justify-center transition-all`}>
                                    <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} flex items-center justify-center transition-all`}>
                                    <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-all z-50 hover:scale-110`}
                >
                    <ArrowLeft className="w-5 h-5 rotate-90" />
                </button>
            )}
        </div>
    );
}