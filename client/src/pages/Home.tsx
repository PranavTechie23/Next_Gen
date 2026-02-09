import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowRight, Sparkles, TrendingUp, Brain, Rocket,
  Users, Building2, Target, Award, LineChart, Zap,
  CheckCircle, XCircle, Star, Globe, Shield, Lock, Menu, X,
  Play, ChevronRight, Quote, BarChart3, Briefcase,
  GraduationCap, TrendingDown, Clock, ArrowUpRight, Minus,
  Code, Cpu, Database, FileText, MessageSquare, Send, Mail,
  Calendar, Info, Eye, Layers, Activity, Moon, Twitter, Linkedin, Instagram, Github
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from "framer-motion";
import { useLocation } from "wouter";

const companyLogos = [
  "/logos/google.jpg",
  "/logos/microsoft.png",
  "/logos/amazon.jpg",
  "/logos/meta.jpg",
  { dark: "/logos/netflix_dark.jpg", light: "/logos/netflix_light.jpg" },
  "/logos/adobe.jpg",
  "/logos/uber.jpg",
  "/logos/airbnb.jpg",
  "/logos/stripe.jpg",
  "/logos/goldman.jpg",
  "/logos/morgan.jpg"
];

// --- Inline Components ---



function Footer({ role }: { role?: string }) {
  const { theme } = useTheme();
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 pt-16 pb-8 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-0 mb-6 group cursor-pointer" onClick={() => window.location.href = "/"}>
              <img
                src="/NG/NextGen_light.png"
                alt="NextGen Logo"
                className="h-24 w-24 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="flex flex-col justify-center leading-tight">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">AI-Driven</p>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm font-medium">
              Empowering the next generation of tech leaders with AI-driven insights and personalized career roadmaps.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Platform</h4>
            <ul className="space-y-2.5 text-base">
              {["Features", "Pricing", "Success Stories", "For Colleges", "For Students"].map((item) => (
                <li key={item}>
                  <a href={item === "Features" ? "/features" : item === "Pricing" ? "/pricing" : item === "Success Stories" ? "/SuccessStories" : item === "For Colleges" ? "/college/college_info" : item === "For Students" ? "/student/student_info" : ""} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Resources</h4>
            <ul className="space-y-2.5 text-base">
              {["Blog", "Career Guide", "Resume Builder", "Interview Prep", "Help Center"].map((item) => (
                <li key={item}>
                  <a href={item === "Blog" ? "/blog" : item === "Career Guide" ? "/careers" : item === "Resume Builder" ? "/resume_builder" : item === "Interview Prep" ? "/interview_prep" : item === "Help Center" ? "/HelpCenter" : ""} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-2.5 text-base">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security", "Contact"].map((item) => (
                <li key={item}>
                  <a href={item === "Privacy Policy" ? "/PrivacyPage" : item === "Terms of Service" ? "/TermsAndCondition" : item === "Cookie Policy" ? "/Cookie" : item === "Security" ? "/Security" : item === "Contact" ? "/ContactUs" : ""} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 font-medium text-sm">© {new Date().getFullYear()} NextGen Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Typewriter({ text, speed = 30, delay = 0, className = "" }: { text: string; speed?: number; delay?: number; className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setIndex((prev) => {
          if (prev < text.length) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, speed);
      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {text.slice(0, index)}
      <span className="opacity-0">{text.slice(index)}</span>
    </span>
  );
}

function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalSteps = 60;
      const increment = end / totalSteps;
      const stepTime = (duration * 1000) / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function PremiumLandingPage() {
  const { theme } = useTheme();
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [comparisonView, setComparisonView] = useState("after");
  const [audience, setAudience] = useState<"colleges" | "placements" | "students">("colleges");
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);

  // Use a specific ref for the journey section to perfectly sync scroll
  const journeySectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: journeySectionRef,
    offset: ["start 20%", "end 90%"] // Starts drawing when top hits 20%, ends when bottom hits 90%
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
          containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroCopy = {
    students: {
      title: "Land your dream job with",
      subtitle: "AI-powered preparation",
      description: "Get personalized skill assessments, industry benchmarking, and a clear roadmap to crack top tech companies. Join 50,000+ students already preparing smarter.",
      cta: "Start your journey",
    },
    colleges: {
      title: "Bridge the Student-Industry Gap with",
      subtitle: "Intelligent Analytics",
      description: "Transform placement outcomes with intelligent skill mapping, real-time industry benchmarking, and personalized career guidance powered by advanced machine learning.",
      cta: "Request a Demo",
    },
    placements: {
      title: "Make data-driven decisions with",
      subtitle: "ML-powered forecasting",
      description: "Identify at-risk students early, track cohort readiness in real-time, and optimize placement strategies with ML-powered forecasting. Reduce cycle time by 40%.",
      cta: "Explore platform",
    },
  };

  const stats = [
    { value: "50K+", label: "Students Empowered", icon: Users, gradient: "from-blue-500 to-cyan-500" },
    { value: "100+", label: "Partner Colleges", icon: Building2, gradient: "from-purple-500 to-pink-500" },
    { value: "95%", label: "Placement Success", icon: Target, gradient: "from-green-500 to-emerald-500" },
    { value: "1000+", label: "Dream Companies", icon: Rocket, gradient: "from-orange-500 to-red-500" },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Skill Intelligence",
      description: "Advanced neural networks analyze 50+ parameters including DSA, development, projects, and soft skills to provide hyper-accurate readiness scores.",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      stats: "98% accuracy",
      benefits: ["Real-time skill gap identification", "Automated competency mapping", "Predictive success modeling"]
    },
    {
      icon: LineChart,
      title: "Real-Time Industry Pulse",
      description: "Live benchmarking against 1000+ companies' requirements. Know exactly where you stand in the competitive landscape.",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      stats: "Updated hourly",
      benefits: ["Company-specific requirements", "Role-based scoring", "Competitive positioning"]
    },
    {
      icon: Rocket,
      title: "Personalized Career Rockets",
      description: "Custom AI-generated roadmaps with specific courses, projects, and resources tailored to your dream role.",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      stats: "10K+ paths",
      benefits: ["Adaptive learning recommendations", "Progress tracking", "Milestone-based achievements"]
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics Dashboard",
      description: "ML-powered placement probability across company tiers. Get data-driven insights to optimize your preparation strategy.",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      stats: "92% prediction rate",
      benefits: ["Real-time placement pipeline", "Curriculum effectiveness analysis", "Budget optimization insights"]
    },
    {
      icon: Users,
      title: "Collaborative Ecosystem",
      description: "Connect students, mentors, TPOs, and recruiters in one intelligent platform. Share experiences, get guidance, track progress.",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      stats: "50K+ community",
      benefits: ["Centralized communication", "Task automation", "Performance monitoring"]
    },
    {
      icon: Zap,
      title: "Instant Skill Gap Analysis",
      description: "Real-time comparison with top performers. Identify weaknesses and get actionable improvement plans in seconds.",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      stats: "<1s analysis",
      benefits: ["Fastest feedback loop", "Quantitative benchmarking", "Drill-down skill views"]
    },
  ];

  const testimonials = [
    {
      quote: "Campus Career's AI recommendations helped me land offers from Google and Microsoft. The skill gap analysis was a game-changer!",
      author: "Rahul Sharma",
      role: "SDE @ Google",
      company: "Google",
      avatar: "RS",
      rating: 5,
      package: "₹42 LPA",
      stat: "Top 0.1% score"
    },
    {
      quote: "Our placement rate jumped from 78% to 96% in just one semester. The predictive analytics helped us identify at-risk students early.",
      author: "Dr. Priya Mehta",
      role: "Head of Placements",
      company: "IIT Delhi",
      avatar: "PM",
      rating: 5,
      package: "96% placement",
      stat: "35% increase"
    },
    {
      quote: "The personalized learning path and industry benchmarking gave me confidence. Placed in Amazon within 3 months of focused prep!",
      author: "Sneha Reddy",
      role: "SDE-1 @ Amazon",
      company: "Amazon",
      avatar: "SR",
      rating: 5,
      package: "₹28 LPA",
      stat: "3mo prep cycle"
    },
  ];

  // const pricingPlans = [
  //   {
  //     name: "Student Free",
  //     price: "₹0",
  //     period: "forever",
  //     description: "Perfect for individual students starting their journey",
  //     features: [
  //       "Basic skill assessment",
  //       "Industry benchmarking",
  //       "Learning roadmap",
  //       "Job recommendations",
  //       "Community access"
  //     ],
  //     gradient: "from-gray-500 to-gray-700",
  //     popular: false,
  //     cta: "Start Free"
  //   },
  //   {
  //     name: "College Pro",
  //     price: "₹99",
  //     period: "per student/year",
  //     description: "Comprehensive solution for forward-thinking institutions",
  //     features: [
  //       "Everything in Free",
  //       "Advanced AI analytics",
  //       "Predictive placement scores",
  //       "Real-time dashboards",
  //       "Priority support",
  //       "Custom integrations",
  //       "Dedicated success manager"
  //     ],
  //     gradient: "from-blue-600 via-purple-600 to-pink-600",
  //     popular: true,
  //     cta: "Request Demo"
  //   },
  //   {
  //     name: "Enterprise",
  //     price: "Custom",
  //     period: "contact sales",
  //     description: "Tailored for multi-campus universities",
  //     features: [
  //       "Everything in Pro",
  //       "Unlimited students",
  //       "White-label platform",
  //       "Custom AI models",
  //       "API access",
  //       "Advanced security",
  //       "On-premise deployment"
  //     ],
  //     gradient: "from-green-600 to-emerald-600",
  //     popular: false,
  //     cta: "Contact Sales"
  //   },
  // ];

  const faqs = [
    {
      question: "How does the AI skill assessment work?",
      answer: "Our AI analyzes multiple data points including coding profiles, project complexity, internship experience, and soft skills. It uses deep learning models trained on 100,000+ successful placement profiles to generate accurate readiness scores."
    },
    {
      question: "How long does implementation take?",
      answer: "Typical implementation for colleges takes 2-4 weeks. Individual students can get started instantly by creating a free account."
    },
    {
      question: "Can we integrate with existing systems?",
      answer: "Yes! We offer APIs and pre-built integrations with popular LMS platforms, HRMS systems, and college management software."
    },
    {
      question: "What's the ROI timeline?",
      answer: "Most institutions see measurable improvements within one semester. Key metrics like student engagement and interview success rates typically show 20-30% improvement in the first 6 months."
    }
  ];

  const successMetrics = [
    { metric: "35%", label: "Increase in top-tier placements", icon: TrendingUp, color: "text-green-400" },
    { metric: "40%", label: "Reduction in placement cycle time", icon: Clock, color: "text-blue-400" },
    { metric: "3x", label: "Higher student engagement", icon: Users, color: "text-purple-400" },
    { metric: "92%", label: "Placement Success Rate", icon: Target, color: "text-orange-400" }
  ];



  // Defines the SVG Path specifically tuned to zigzag between the cards
  // Start Center -> Right(DSA) -> Left(Project) -> Right(Mock) -> Left(Intern) -> Center(Job)
  // Adjusted Y-values to ensure it reaches the Internship card (2100) and Job card (2600)
  const pathDefinition = "M 300 0 C 300 150 550 350 550 600 C 550 850 50 850 50 1100 C 50 1350 550 1350 550 1600 C 550 1850 50 1850 50 2100 C 50 2350 300 2450 300 2600 L 300 3100";

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-200 grainy-bg">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{
            top: 'calc(var(--mouse-y, 0px) / 20)',
            left: 'calc(var(--mouse-x, 0px) / 20)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/5 dark:bg-pink-600/10 rounded-full blur-3xl" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
        ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] rounded-3xl py-2'
        : 'bg-transparent py-4'
        }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center h-20">
            {/* Logo Section */}
            <div className="flex-1 flex justify-start">
              <div className="flex items-center gap-0 group cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src="/NG/NextGen_light.png"
                  alt="NextGen Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                    NextGen
                  </h1>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 font-bold uppercase tracking-widest mt-0.5">AI-Driven</p>
                </div>
              </div>
            </div>

            {/* Navigation Links - Dead Center */}
            <div className="hidden lg:flex items-center justify-center gap-12 flex-1">
              <a href="#features" className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-110">Features</a>
              <a href="#how-it-works" className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-110">How It Works</a>
              <a href="#testimonials" className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-110">Students</a>
              {/*<a href="#pricing" className="text-lg font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-110">Pricing</a>*/}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center justify-end gap-x-4 flex-1">
              <ThemeToggle />
              <Button variant="ghost" className="text-lg font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => navigate("/login")}>Login</Button>
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 transition-transform text-lg text-white font-bold px-8 py-6 rounded-2xl" onClick={() => navigate("/signup")}>
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center justify-end flex-1 gap-2">
              <ThemeToggle />
              <button className="p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden overflow-hidden"
              >
                <div className="py-8 space-y-8 px-2">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Platform Features', href: '#features', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                      { label: 'How It Works', href: '#how-it-works', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                      { label: 'Success Stories', href: '#testimonials', icon: Award, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                      { label: 'For Colleges', href: '/college/college_info', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                      { label: 'For Students', href: '/student/student_info', icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    ].map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-200 text-lg">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 mt-4 border-t border-slate-100 dark:border-white/5">
                    <Button
                      variant="ghost"
                      className="w-full h-16 rounded-2xl font-bold text-lg dark:text-white"
                      onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full h-16 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-white"
                      onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
                    >
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  <div className="flex justify-center gap-6 pb-4">
                    {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                      <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all hover:scale-110">
                        <Icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-10"
          >
            <Tabs value={audience} onValueChange={(v) => setAudience(v as "colleges" | "placements" | "students")} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg max-w-full overflow-x-auto scrollbar-hide">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="colleges" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold rounded-xl px-3 sm:px-6 transition-all underline-none hover:bg-blue-600 hover:text-white text-xs sm:text-base">Colleges</TabsTrigger>
                <TabsTrigger value="placements" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold rounded-xl px-3 sm:px-6 transition-all border-none hover:bg-purple-600  hover:text-white text-xs sm:text-base">Placement Team</TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white font-bold rounded-xl px-3 sm:px-6 transition-all border-none hover:bg-pink-600 hover:text-white text-xs sm:text-base">Students</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-6xl lg:text-8xl font-black leading-[1.1] mb-6 tracking-tight px-2"
          >
            <span className="bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent">
              <Typewriter text={heroCopy[audience].title} speed={100} />
            </span>
            <br />
            <motion.span
              key={audience}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              className={`bg-gradient-to-r ${audience === 'colleges' ? 'from-blue-600 to-cyan-600' : audience === 'placements' ? 'from-purple-600 to-pink-600' : 'from-pink-400 to-rose-600'} bg-clip-text text-transparent drop-shadow-sm`}
            >
              <Typewriter text={heroCopy[audience].subtitle} speed={100} delay={2500} />
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mb-12 font-medium px-4 md:px-0"
          >
            <Typewriter text={heroCopy[audience].description} speed={40} delay={5000} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 px-4"
          >
            <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-lg font-bold bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-500/20 group" onClick={() => navigate("/login")}>
              {heroCopy[audience].cta}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-12 text-lg font-bold border-2 border-slate-200 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 group dark:text-white text-slate-700" onClick={() => setDemoOpen(true)}>
              <Play className="w-5 h-5 mr-2 group-hover:scale-110" />
              Watch Demo
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 sm:p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-2 group shadow-lg">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid and Tabs */}
      <section className="py-24 px-4 sm:px-6 relative" id="features">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 px-4">
            <Badge className="px-4 py-2 bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-300 font-bold mb-6">Our Capabilities</Badge>
            <h2 className="text-3xl sm:text-6xl font-black mb-6 text-slate-900 dark:text-white leading-tight">Built for High-Growth Careers</h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">Everything you need to transform career readiness and institutional outcomes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Card
                  onMouseEnter={() => setActiveFeatureTab(idx)}
                  className={`p-6 sm:p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all hover:scale-[1.03] group relative overflow-hidden h-full shadow-lg ${activeFeatureTab === idx ? 'ring-2 ring-blue-500/50 ring-offset-4 ring-offset-white dark:ring-offset-slate-950' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity`} />
                  <div className="relative z-10 text-center sm:text-left">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-xl mx-auto sm:mx-0`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="mb-4 border-slate-200 dark:border-white/20 text-slate-500 dark:text-slate-400">{feature.stats}</Badge>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6 h-auto sm:h-20 lg:h-24">{feature.description}</p>
                    <div className="space-y-3 mb-8">
                      {feature.benefits.map((benefit, bi) => (
                        <div key={bi} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - The Edge */}
      <section className="py-32 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-24">
            <Badge className="px-6 py-2 bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-300 font-black mb-6 uppercase tracking-widest">
              The Edge
            </Badge>
            <h2 className="text-3xl sm:text-7xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-tight px-4">
              The Competitive Advantage
            </h2>

            {/* SEGMENTED TOGGLE */}
            <div className="flex justify-center mt-12 px-4">
              <div className="relative w-full max-w-[420px] p-2 bg-slate-200 dark:bg-slate-900 rounded-full border-2 border-slate-300 dark:border-white/10 overflow-hidden  ">
                {/* SLIDER */}
                <motion.div
                  className={`absolute top-2 bottom-2 left-2 w-1/2 rounded-full border-2 shadow-xl ${comparisonView === "before"
                    ? "bg-red-500 border-red-600"
                    : "bg-green-500 border-green-600"
                    }`}
                  animate={{ x: comparisonView === "after" ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {/* BUTTONS */}
                <div className="relative z-10 flex">
                  <button
                    onClick={() => setComparisonView("before")}
                    className={`w-1/2 py-4 font-black text-sm sm:text-lg transition-colors ${comparisonView === "before"
                      ? "text-white"
                      : "text-slate-900 dark:text-slate-300"
                      }`}
                  >
                    Traditional
                  </button>
                  <button
                    onClick={() => setComparisonView("after")}
                    className={`w-1/2 py-4 font-black text-sm sm:text-lg transition-colors ${comparisonView === "after"
                      ? "text-white"
                      : "text-slate-900 dark:text-slate-300"
                      }`}
                  >
                    NextGen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch px-4">
            {/* Traditional */}
            <motion.div
              animate={{
                scale: comparisonView === "before" ? 1 : 0.95,
                opacity: comparisonView === "before" ? 1 : 0.4,
                rotate: comparisonView === "before" ? 0 : -2,
                filter: comparisonView === "before" ? "grayscale(0%)" : "grayscale(100%)",
              }}
              onClick={() => setComparisonView("before")}
              className="cursor-pointer"
            >
              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-slate-200 dark:border-white/5 shadow-2xl h-full ">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                  <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Traditional</h3>
                    <p className="text-red-500 font-black uppercase tracking-widest text-[10px] sm:text-sm mt-1">Manual & Reactive</p>
                  </div>
                </div>

                {["Manual Screenings", "Fragmented Data", "Static Reports", "Blind Careers"].map((title, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-white/5 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Minus className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" />
                    </div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-800 dark:text-slate-200">{title}</h4>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Powered */}
            <motion.div
              animate={{
                scale: comparisonView === "after" ? 1.05 : 0.95,
                opacity: comparisonView === "after" ? 1 : 0.4,
                rotate: comparisonView === "after" ? 0 : 2,
                filter: comparisonView === "after" ? "grayscale(0%)" : "grayscale(100%)",
              }}
              onClick={() => setComparisonView("after")}
              className="cursor-pointer"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border-2 border-indigo-200 dark:border-blue-500/20 shadow-2xl h-full">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center border border-white/20">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">NextGen AI</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-[10px] sm:text-sm mt-1">Real-time & Intelligent</p>
                  </div>
                </div>

                {["Auto-Synthesis", "Live Benchmarking", "Early Intervention", "Outcome Predictor"].map((title, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white dark:bg-white/10 rounded-2xl sm:rounded-3xl border border-indigo-100 dark:border-white/10 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-800 dark:text-white">{title}</h4>
                  </div>
                ))}

                <Button
                  onClick={() => navigate && navigate("/signup")}
                  className="w-full py-6 sm:py-8 text-lg sm:text-xl font-black bg-blue-600 text-white rounded-2xl sm:rounded-3xl mt-10 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Unlock AI Advantage
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works / Scroll Journey */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-50" id="how-it-works" ref={journeySectionRef}>

        {/* Background Decorative Blurs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center mb-24 px-4">
            <Badge className="px-4 py-2 bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-300 font-bold mb-6">The Journey to Success</Badge>
            <h2 className="text-3xl sm:text-7xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white leading-tight">Your Path to Excellence</h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">Watch your career trajectory transform from a student to a professional with AI at every turn.</p>
          </div>

          <div className="relative min-h-[3100px] py-10 overflow-hidden">
            {/* The Winding Path SVG */}
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <svg
                width="600"
                height="3100"
                viewBox="0 0 600 3100"
                fill="none"
                className="w-full max-w-[800px]"
                // Crucial: Ensures the SVG scales correctly without distortion
                preserveAspectRatio="xMidYMin meet"
              >
                <defs>
                  <linearGradient id="journey-gradient" x1="300" y1="0" x2="300" y2="3100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="0.2" stopColor="#8B5CF6" />
                    <stop offset="0.4" stopColor="#EC4899" />
                    <stop offset="0.6" stopColor="#F59E0B" />
                    <stop offset="0.8" stopColor="#10B981" />
                    <stop offset="1" stopColor="#3B82F6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background Shadow Path */}
                <motion.path
                  d={pathDefinition}
                  stroke="url(#journey-gradient)"
                  strokeWidth="60"
                  strokeLinecap="round"
                  className="blur-3xl opacity-10 dark:opacity-20"
                  style={{ pathLength: scrollYProgress }}
                />

                {/* Main Animated Path */}
                <motion.path
                  d={pathDefinition}
                  stroke="url(#journey-gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                  filter="url(#glow)"
                />

                {/* Animated Glow Bead */}
                <motion.circle
                  r="12"
                  fill="white"
                  className="shadow-2xl"
                  style={{
                    offsetPath: `path('${pathDefinition}')`,
                    offsetDistance: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                  }}
                />
              </svg>
            </div>

            {/* Journey Stops */}
            <div className="relative z-10 px-4">
              {/* Start: Profile */}
              <div className="h-[400px] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-4 sm:p-6 pr-6 sm:pr-12 rounded-[2rem] sm:rounded-[2.5rem] flex items-center gap-4 sm:gap-6 shadow-2xl group hover:scale-105 transition-transform cursor-pointer relative overflow-hidden max-w-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-60 transition-opacity" />
                    <div className="relative w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white shadow-xl border border-white/20">
                      <Users className="w-7 h-7 sm:w-10 sm:h-10" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">Alex Chen</h4>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] sm:text-sm uppercase tracking-widest mb-1 sm:mb-3">Final Year</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-500 dark:text-blue-300/60 tracking-wider">Strength</p>
                      <span className="text-[10px] sm:text-xs font-black text-blue-600 dark:text-blue-400"><AnimatedNumber value={85} />%</span>
                    </div>
                  </div>

                </motion.div>
              </div>

              {/* Stop 1: DSA Mastery (RIGHT) */}
              <div className="h-[500px] flex items-center justify-end md:pr-[5%]">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  className="max-w-xs sm:max-w-sm w-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative overflow-hidden border-blue-500/20"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-500/20">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">DSA Mastery</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">Conquered 450+ patterns with AI gap analysis.</p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Readiness</p>
                      <span className="text-[10px] sm:text-xs font-black text-blue-600 dark:text-blue-400"><AnimatedNumber value={92} />%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "92%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stop 2: Project Alpha (LEFT) */}
              <div className="h-[500px] flex items-center justify-start md:pl-[5%]">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  className="max-w-xs sm:max-w-sm w-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative overflow-hidden sm:text-right"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full -ml-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 dark:bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 sm:ml-auto border border-purple-200 dark:border-purple-500/20">
                    <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">Project Alpha</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 sm:text-right">System Design validated by AI Experts.</p>

                  <div className="space-y-4 mb-4">
                    <div className="flex justify-between items-end sm:flex-row-reverse">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-300">Fidelity</p>
                      <span className="text-[10px] sm:text-xs font-black text-purple-600 dark:text-purple-400"><AnimatedNumber value={88} />%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "88%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-l from-purple-600 to-pink-400 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Badge variant="outline" className="bg-white/50 dark:bg-white/5 border-purple-100 dark:border-white/10 text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-purple-600 dark:text-purple-300">React</Badge>
                    <Badge variant="outline" className="bg-white/50 dark:bg-white/5 border-purple-100 dark:border-white/10 text-[8px] sm:text-[10px] font-black tracking-widest uppercase text-purple-600 dark:text-purple-300">Kafka</Badge>
                  </div>
                </motion.div>
              </div>

              {/* Stop 3: Mock Interview (RIGHT) */}
              <div className="h-[500px] flex items-center justify-end md:pr-[5%]">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  className="max-w-sm w-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative overflow-hidden border-indigo-500/20"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/20">
                    <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Mock Interview</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">Cracked 12 simulated Big-Tech rounds with real-time feedback.</p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Interview IQ</p>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={94} />%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "94%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full"
                      />
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-indigo-500/10 rounded-[1.5rem] border border-slate-200 dark:border-indigo-500/20">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300 mb-2 text-center">Performance Spike</p>
                      <div className="flex gap-1 h-10 items-end justify-center">
                        {[30, 45, 35, 60, 55, 80, 95].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex-grow bg-indigo-600/60 dark:bg-indigo-500/40 rounded-t-sm max-w-[12px]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stop 4: Internship (LEFT) */}
              <div className="h-[500px] flex items-center justify-start md:pl-[5%]">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  className="max-w-sm w-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] shadow-2xl group hover:scale-[1.02] transition-all relative overflow-hidden border-blue-500/20 text-right"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-20 h-20 bg-blue-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-10 shadow-xl border border-blue-200 dark:border-white/10 ml-auto">
                    <Globe className="w-12 h-12 text-blue-600 dark:text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Internship at Google</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-8">Selected via exclusive partner referral through Campus Career analytics.</p>

                  <div className="space-y-4 mb-8 text-left">
                    <div className="flex justify-between items-end flex-row-reverse">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Referral Index</p>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">Top <AnimatedNumber value={1} />%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "99%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-l from-blue-600 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-2xl border border-green-500/20 w-fit ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    <span className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Active Placement</span>
                  </div>
                </motion.div>
              </div>

              {/* Final Stop: Job Offer (CENTER) */}
              <div className="h-[650px] flex items-center justify-center mt-15">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-pink-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 p-12 rounded-[3.5rem] shadow-3xl text-center relative z-10 border border-white/20 hover:scale-105 transition-transform">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-3xl rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform">
                      <Briefcase className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="mb-6 bg-white/20 text-white border-0 font-black px-6 py-2 rounded-full uppercase tracking-tighter">Mission Accomplished</Badge>
                    <h3 className="text-5xl font-black text-white mb-4 tracking-tighter">Job Offer</h3>
                    <p className="text-white/80 font-black text-3xl mb-8">₹42.5 LPA • SDE-1</p>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <p className="text-[10px] font-black uppercase text-pink-200 tracking-[0.2em] mb-1 text-center">Career Growth</p>
                      <p className="text-4xl font-black text-white text-center"><AnimatedNumber value={5} />X</p>
                    </div>
                  </div>

                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Success Metrics */}
      <section className="py-24 relative overflow-hidden bg-white dark:bg-black">
        {/* Dynamic Background: Gradient shows more subtly in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-grey-500/20 dark:via-black-500/50 dark:to-purple-500/20" />

        {/* Glassmorphism Blur Layer */}
        <div className="absolute inset-0 backdrop-blur-3xl opacity-50" />

        <div className="container mx-auto max-w-7xl relative z-10 px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {successMetrics.map((sm, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 sm:p-8 group relative"
              >
                {/* Icon Container with Adaptive Glass Effect */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-white/5 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 mx-auto 
                        group-hover:rotate-6 transition-all duration-300 shadow-xl 
                        border border-slate-200 dark:border-white/10 group-hover:border-purple-500/50">
                  <sm.icon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-800 dark:text-white font-bold transition-colors" />
                </div>

                {/* Metric Number */}
                <motion.p
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  className="text-4xl sm:text-6xl font-black mb-2 tracking-tighter bg-gradient-to-br from-slate-900 to-slate-600 
                       dark:from-white dark:to-slate-400 bg-clip-text text-transparent"
                >
                  {sm.metric}
                </motion.p>

                {/* Label */}
                <p className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 leading-tight">
                  {sm.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 relative" id="testimonials">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 sm:mb-20 px-4">
            <Badge className="px-4 py-2 bg-yellow-600/10 text-yellow-600 dark:bg-yellow-600/20 dark:text-yellow-300 font-bold mb-6">Wall of Success</Badge>
            <h2 className="text-3xl sm:text-6xl font-black mb-6 text-slate-900 dark:text-white leading-tight">Proven Breakthroughs</h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">Trusted by tier-1 institutions and high-growth recruiters.</p>
          </div>

          <div className="max-w-5xl mx-auto px-2 sm:px-0">
            <Card className="p-6 sm:p-10 lg:p-16 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden rounded-[2rem] sm:rounded-[3rem]">
              <div className="absolute top-0 right-0 p-10 opacity-5 hidden sm:block">
                <Quote className="w-40 h-40 text-slate-900 dark:text-white" />
              </div>
              <div className="flex gap-1 mb-6 sm:mb-8">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-8 sm:mb-10 leading-[1.3] relative z-10">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-6 border-t border-slate-100 dark:border-white/5 pt-8 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-black text-xl sm:text-3xl shadow-xl">{testimonials[activeTestimonial].avatar}</div>
                  <div>
                    <h4 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">{testimonials[activeTestimonial].author}</h4>
                    <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-bold">{testimonials[activeTestimonial].role}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] sm:text-sm tracking-widest uppercase">{testimonials[activeTestimonial].company}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <Badge className="bg-green-600 text-white border-0 text-sm sm:text-xl px-4 sm:px-6 py-2 sm:py-3 font-black mb-2 shadow-lg shadow-green-600/20">{testimonials[activeTestimonial].package}</Badge>
                  <p className="text-slate-500 font-bold text-[10px] sm:text-sm uppercase">{testimonials[activeTestimonial].stat}</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} className={`h-2 sm:h-3 rounded-full transition-all ${i === activeTestimonial ? 'w-12 sm:w-20 bg-blue-600' : 'w-2 sm:w-3 bg-slate-300 dark:bg-slate-800'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Companies Scroll */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/20 border-y border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center font-bold text-blue-600 text-lg sm:text-2xl mb-12 uppercase tracking-[0.2em] sm:tracking-[0.4em] px-4">Where our students get placed</p>
          <div className="flex gap-10 animate-scroll w-max flex-nowrap">
            {[...companyLogos, ...companyLogos].map((c, i) => {
              const src = typeof c === 'string' ? c : (theme === 'dark' ? c.dark : c.light);
              return (
                <div key={i} className="flex flex-shrink-0 items-center justify-center h-24 sm:h-36 px-8 sm:px-16 transition-all group">
                  <img
                    src={src}
                    alt="Company Logo"
                    className="h-8 sm:h-12 w-auto object-contain transition-all grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing
      <section className="py-24 px-4 sm:px-6 relative" id="pricing">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 text-center">
            <Badge className="px-4 py-2 bg-green-600/10 text-green-600 dark:bg-green-600/20 dark:text-green-300 font-bold mb-6">Plans & Pricing</Badge>
            <h2 className="text-4xl sm:text-6xl font-black mb-6 text-slate-900 dark:text-white">Scale Your Success</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">Flexible options tailored for growth.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card key={i} className={`p-12 bg-white dark:bg-slate-900/50 border-2 transition-all hover:scale-105 shadow-xl ${plan.popular ? 'border-blue-500/50 dark:border-blue-500/50 shadow-blue-500/10 ring-2 ring-blue-500/10' : 'border-slate-200 dark:border-white/10'}`}>
                {plan.popular && <Badge className="mb-6 bg-blue-600 text-white border-0 font-black px-4 py-1">MOST POPULAR</Badge>}
                <h3 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">{plan.description}</p>
                <div className="mb-10">
                  <p className="text-6xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">{plan.price}</p>
                  <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">{plan.period}</p>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300 font-bold">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full py-8 text-lg font-black tracking-widest hover:scale-[1.02] transition-transform ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'}`} onClick={() => navigate("/login")}>
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900 dark:text-white leading-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">Everything you need to know about the platform.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 overflow-hidden transition-all hover:border-blue-500/30 group shadow-lg rounded-2xl">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-4">
                  <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center transition-transform flex-shrink-0 ${activeFaq === i ? 'rotate-180 bg-blue-600 border-blue-600 text-white' : 'text-slate-400'}`}>
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </button>
                {activeFaq === i && (
                  <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-4">
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10 dark:opacity-20" />
        <div className="container mx-auto max-w-5xl relative z-10 text-center px-4">
          <Badge className="px-6 sm:px-8 py-3 sm:py-4 bg-white/40 dark:bg-white/10 backdrop-blur-3xl border border-blue-500/20 dark:border-white/20 text-blue-600 dark:text-white font-black text-sm sm:text-lg mb-10 shadow-3xl rounded-2xl">
            <Zap className="w-5 h-5 mr-3 inline" />
            Join the Revolution Today
          </Badge>
          <h2 className="text-4xl sm:text-8xl font-black mb-10 leading-[1.1] tracking-tight text-slate-900 dark:text-white">
            Ready to <span className="sm:inline hidden"><br /></span> Accelerate Your <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent underline decoration-blue-500/20 dark:decoration-white/20">Future?</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed font-bold">
            Join 50,000+ students already using AI to unlock their peak placement potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <Button size="lg" className="w-full sm:w-auto h-16 sm:h-20 px-8 sm:px-16 text-lg sm:text-xl font-black bg-blue-600 text-white hover:bg-blue-700 shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:scale-105 transition-all group rounded-2xl sm:rounded-3xl" onClick={() => navigate("/login")}>
              Get Started Now
              <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 sm:h-20 px-8 sm:px-16 text-lg sm:text-xl font-black border-2 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl" onClick={() => navigate("/login")}>
              Contact Sales
            </Button>
          </div>

        </div>
      </section>

      {/* Demo Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-4xl bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black">Experience the Platform</DialogTitle>
            <DialogDescription className="text-slate-400 text-lg">
              Quick 2-minute walkthrough of AI-powered skill mapping and placement predictions.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center relative group">
            <Play className="w-20 h-20 text-white/20 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent" />
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <Button variant="ghost" onClick={() => setDemoOpen(false)} className="font-bold">Close</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 font-black px-8" onClick={() => navigate("/login")}>Book Full Demo</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer role="public" />

      {/* Global Style Overlay for Animations */}
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 60s linear infinite;
        }
        .animate-pulse {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
