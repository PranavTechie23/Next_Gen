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
  Calendar, Info, Eye, Layers, Activity, Moon, Twitter, Linkedin, Instagram, Github,
  ChevronDown
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from "framer-motion";
import { useLocation } from "wouter";
import { useBranding } from "@/contexts/BrandingContext";
import { publicApi } from "@/services/publicApi";



// --- Inline Components ---
import Footer from "./Footer";

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
  const { config: branding } = useBranding();
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
  const { scrollYProgress: pathProgress } = useScroll({
    target: journeySectionRef,
    offset: ["start start", "end end"]
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

  const [testimonials, setTestimonials] = useState([
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
    }
  ]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await publicApi.getTestimonials();
        if (data && data.length > 0) setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchContent();
  }, []);

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

  const faqCategories = [
    'General Queries',
    'Subscription & Future Updates',
    'Features & Functionality',
    'Course Content & Curriculum',
    'Account Management',
    'Course Access & Technical Support',
    'Mentorship & Community Support',
    'Certification',
    'Career Guidance',
    'Internships & Job Assistance'
  ];
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]);

  const [faqs, setFaqs] = useState([
    // General Queries
    { category: 'General Queries', question: "How does the AI skill assessment work?", answer: "Our AI analyzes multiple data points including coding profiles, project complexity, internship experience, and soft skills. It uses deep learning models trained on 100,000+ successful placement profiles to generate accurate readiness scores." },
    { category: 'General Queries', question: "What's the ROI timeline?", answer: "Most institutions see measurable improvements within one semester. Key metrics like student engagement and interview success rates typically show 20-30% improvement in the first 6 months." },
    { category: 'General Queries', question: "Who is this platform best suited for?", answer: "Our platform is designed for college students aiming for top-tier tech placements, as well as educational institutions looking to streamline and improve their campus recruitment processes." },
    { category: 'General Queries', question: "Do I need prior coding experience?", answer: "Not at all. We have pathways designed for absolute beginners as well as advanced learners aiming for product-based companies." },
    { category: 'General Queries', question: "How is this different from regular coding platforms?", answer: "Unlike standard coding platforms, we provide a holistic, AI-driven career roadmap that aligns your skills directly with real-time industry demands and company-specific requirements." },
    { category: 'General Queries', question: "Is my personal data secure?", answer: "Yes, we adhere to strict data privacy regulations. Your academic and personal data is encrypted and never shared with third parties without your explicit consent." },
    { category: 'General Queries', question: "Can I use the platform for off-campus placements?", answer: "Absolutely! The skills and benchmarks you achieve here are universally recognized and will significantly boost your off-campus application success rate." },
    { category: 'General Queries', question: "How often is the industry data updated?", answer: "Our industry pulse and benchmarking data are updated in real-time by analyzing job postings and hiring trends across 1000+ companies." },

    // Subscription & Future Updates
    { category: 'Subscription & Future Updates', question: "How do subscriptions work?", answer: "Subscriptions are billed either monthly or annually. You get access to all features corresponding to your selected tier, plus all updates released during your active billing period." },
    { category: 'Subscription & Future Updates', question: "Will I get future updates for free?", answer: "Yes! As long as your subscription is active, you will receive all future updates, new courses, and feature enhancements at no extra cost." },
    { category: 'Subscription & Future Updates', question: "Can I cancel my subscription anytime?", answer: "Yes, you can cancel your subscription at any time. You will continue to have access until the end of your current billing cycle." },
    { category: 'Subscription & Future Updates', question: "Is there a free trial available?", answer: "We offer a 7-day free trial for individual students to explore the premium features before committing to a paid plan." },
    { category: 'Subscription & Future Updates', question: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, UPI, net banking, and popular mobile wallets." },
    { category: 'Subscription & Future Updates', question: "Do you offer discounts for bulk college purchases?", answer: "Yes, we offer custom enterprise pricing and significant volume discounts for university-wide deployments. Contact our sales team for details." },
    { category: 'Subscription & Future Updates', question: "How do I upgrade from a monthly to an annual plan?", answer: "You can switch to an annual plan directly from your account settings. A prorated discount will be applied based on your remaining monthly balance." },
    { category: 'Subscription & Future Updates', question: "What happens if my subscription expires?", answer: "If your subscription expires, your account will revert to the free tier. Your progress and profile will be saved, but access to premium content will be restricted." },

    // Features & Functionality
    { category: 'Features & Functionality', question: "Can we integrate with existing systems?", answer: "Yes! We offer APIs and pre-built integrations with popular LMS platforms, HRMS systems, and college management software." },
    { category: 'Features & Functionality', question: "Does it support automated resume building?", answer: "Absolutely. Our platform parses student achievements, projects, and skills to dynamically generate ATS-friendly resumes optimized for their target roles." },
    { category: 'Features & Functionality', question: "Is there a real-time analytics dashboard?", answer: "Yes, our dashboard provides real-time insights into student performance, placement probabilities, and cohort-level skill gaps." },
    { category: 'Features & Functionality', question: "Does the platform conduct mock interviews?", answer: "Yes, we feature AI-driven mock interviews that simulate real technical and HR rounds, providing instant feedback on communication and technical accuracy." },
    { category: 'Features & Functionality', question: "Can I track my coding speed and accuracy?", answer: "Our built-in IDE tracks your keystrokes, compilation errors, and execution time to provide detailed metrics on your coding efficiency." },
    { category: 'Features & Functionality', question: "Are there company-specific preparation modules?", answer: "Yes, we have tailored modules simulating the exact interview patterns, question types, and difficulty levels of top companies like Amazon, Microsoft, and Google." },
    { category: 'Features & Functionality', question: "Can professors assign specific tasks to students?", answer: "Yes, in the enterprise version, educators can create custom cohorts, assign specific learning modules, and track completion rates." },
    { category: 'Features & Functionality', question: "Does the platform support multiple programming languages?", answer: "Our coding environment supports over 15 programming languages including C++, Java, Python, JavaScript, and Go." },

    // Course Content & Curriculum
    { category: 'Course Content & Curriculum', question: "Does the platform include YouTube content?", answer: "While we curate some excellent free resources from platforms like YouTube, our core curriculum consists of proprietary, structured learning modules designed specifically for this platform." },
    { category: 'Course Content & Curriculum', question: "What topics are covered in the DSA course?", answer: "The DSA course covers everything from basic arrays and strings to advanced topics like Dynamic Programming, Graphs, Tries, and Segment Trees." },
    { category: 'Course Content & Curriculum', question: "Are there any prerequisites?", answer: "No strict prerequisites! We start from the basics. However, basic familiarity with a programming language (like C++, Java, or Python) will help you grasp concepts faster." },
    { category: 'Course Content & Curriculum', question: "Is the content updated regularly?", answer: "Yes, our curriculum is updated every quarter to reflect the latest industry trends and frequently asked interview questions." },
    { category: 'Course Content & Curriculum', question: "Does the platform help with doubts and interview follow-ups?", answer: "Yes! We have dedicated TAs to resolve your doubts, and our community forum is highly active. We also provide interview experiences and follow-up guidance." },
    { category: 'Course Content & Curriculum', question: "Can I get a sample lesson?", answer: "Absolutely! Sign up for a free account to access our introductory modules and experience the learning platform firsthand." },
    { category: 'Course Content & Curriculum', question: "How much time is needed to complete the course?", answer: "On average, it takes about 3-4 months if you dedicate 10-15 hours a week. However, the platform is self-paced so you can learn at your own convenience." },
    { category: 'Course Content & Curriculum', question: "Are there practical projects included?", answer: "Yes, our curriculum includes several capstone projects ranging from full-stack web applications to machine learning models to help build your portfolio." },

    // Account Management
    { category: 'Account Management', question: "How do I add multiple college administrators?", answer: "From your dashboard, go to Settings > Team and click 'Invite Member'. You can assign different roles like TPO, Department Head, or Faculty." },
    { category: 'Account Management', question: "Can students update their profiles after graduation?", answer: "Yes, students retain access to their alumni profiles indefinitely, helping you track long-term career progression and build an alumni network." },
    { category: 'Account Management', question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login screen. You will receive an email with instructions to securely reset your password." },
    { category: 'Account Management', question: "Can I change my registered email address?", answer: "Yes, you can update your primary email address from your account settings. You will need to verify the new email before the change takes effect." },
    { category: 'Account Management', question: "How can I delete my account?", answer: "If you wish to permanently delete your account, please contact our support team. Please note that this action is irreversible and all your data will be erased." },
    { category: 'Account Management', question: "Can I merge two different accounts?", answer: "Currently, we do not support merging accounts. We recommend choosing one primary account and completing all your modules there." },
    { category: 'Account Management', question: "Where can I download my invoice?", answer: "Invoices for all your transactions can be downloaded from the 'Billing History' section in your account settings." },
    { category: 'Account Management', question: "How do role-based access controls work?", answer: "Enterprise admins can assign granular permissions. For example, a 'Faculty' role can view student progress, while a 'TPO' role can manage job postings and campus drives." },

    // Course Access & Technical Support
    { category: 'Course Access & Technical Support', question: "How long does implementation take?", answer: "Typical implementation for colleges takes 2-4 weeks. Individual students can get started instantly by creating a free account." },
    { category: 'Course Access & Technical Support', question: "What kind of support is included?", answer: "All enterprise plans include 24/7 priority email support, a dedicated success manager, and weekly onboarding sessions for the first month." },
    { category: 'Course Access & Technical Support', question: "Can I access the courses on mobile?", answer: "Yes, our platform is fully responsive and can be accessed seamlessly on desktops, tablets, and smartphones." },
    { category: 'Course Access & Technical Support', question: "Is there an offline viewing mode?", answer: "Currently, an active internet connection is required to access the platform. We are working on a mobile app that will support offline video downloads." },
    { category: 'Course Access & Technical Support', question: "What are the minimum system requirements?", answer: "Our platform runs entirely in the browser. Any modern browser (Chrome, Firefox, Safari, Edge) updated within the last 2 years will work perfectly." },
    { category: 'Course Access & Technical Support', question: "Why is the code editor not loading for me?", answer: "This is usually caused by aggressive ad-blockers or strict corporate network firewalls blocking WebSocket connections. Try disabling them or whitelisting our domain." },
    { category: 'Course Access & Technical Support', question: "How do I report a bug on the platform?", answer: "You can report bugs directly using the 'Report an Issue' button located in the bottom right corner of your dashboard. Our technical team usually responds within 24 hours." },
    { category: 'Course Access & Technical Support', question: "Can I share my account with a friend?", answer: "Account sharing is strictly against our terms of service. Concurrent logins from multiple IP addresses may result in automatic account suspension." },

    // Mentorship & Community Support
    { category: 'Mentorship & Community Support', question: "Do I get 1-on-1 mentorship?", answer: "Yes, our premium plans include 1-on-1 mentorship sessions with industry experts from top tech companies." },
    { category: 'Mentorship & Community Support', question: "Is there a community forum?", answer: "Yes! We have an active Discord community where you can interact with peers, share resources, and participate in weekly coding contests." },
    { category: 'Mentorship & Community Support', question: "How are mentors assigned?", answer: "Mentors are assigned based on your target role, preferred tech stack, and current skill level to ensure you get the most relevant guidance possible." },
    { category: 'Mentorship & Community Support', question: "Can I choose my own mentor?", answer: "While our algorithm suggests the best matches, you can browse mentor profiles and request sessions with specific industry experts." },
    { category: 'Mentorship & Community Support', question: "How often are the community AMAs held?", answer: "We host 'Ask Me Anything' (AMA) sessions with industry leaders and successful alumni every alternate weekend." },
    { category: 'Mentorship & Community Support', question: "Is the community moderated?", answer: "Yes, we have strict community guidelines. Our moderation team ensures that the forums remain a safe, respectful, and highly productive environment." },
    { category: 'Mentorship & Community Support', question: "What happens in a 1-on-1 session?", answer: "You can use 1-on-1 sessions for resume reviews, mock interviews, career strategy discussions, or deep-diving into specific technical concepts." },
    { category: 'Mentorship & Community Support', question: "Can I become a mentor myself?", answer: "Absolutely! Alumni who have successfully placed in top tier companies are highly encouraged to join our mentorship program and give back to the community." },

    // Certification
    { category: 'Certification', question: "Do you provide certificates?", answer: "Yes, upon successfully completing a course and passing the final assessment, you will receive a verifiable digital certificate." },
    { category: 'Certification', question: "Are these certificates recognized by employers?", answer: "Our certificates are highly regarded in the industry, particularly because they are backed by rigorous, AI-proctored final assessments rather than just 'watch-time'." },
    { category: 'Certification', question: "How can I add my certificate to LinkedIn?", answer: "Your dashboard will provide a direct 'Add to LinkedIn' button, which automatically populates the credential details on your profile." },
    { category: 'Certification', question: "Is there an expiry date on the certificates?", answer: "No, the certifications you earn are valid for life. They demonstrate your foundational understanding of the core concepts at the time of completion." },
    { category: 'Certification', question: "What is the passing criteria for a certificate?", answer: "You must complete 100% of the core modules and score at least 70% in the final AI-proctored certification exam." },
    { category: 'Certification', question: "Can I retake the certification exam if I fail?", answer: "Yes, you can retake the certification exam. However, there is a mandatory 7-day cooldown period between attempts to ensure adequate preparation." },
    { category: 'Certification', question: "Do you offer physical copies of the certificates?", answer: "We only provide high-resolution digital certificates, which are better suited for modern digital recruitment processes." },
    { category: 'Certification', question: "How can employers verify my certificate?", answer: "Every certificate contains a unique credential ID and a QR code that directly links to a secure verification page on our platform." },

    // Career Guidance
    { category: 'Career Guidance', question: "How do you help with career guidance?", answer: "We provide AI-driven career roadmaps, resume reviews, mock interviews, and personalized advice based on your current skill level and target roles." },
    { category: 'Career Guidance', question: "What is an AI-driven career roadmap?", answer: "It is a dynamic timeline that outlines exactly which skills to learn, projects to build, and platforms to practice on, continuously adapting based on your progress." },
    { category: 'Career Guidance', question: "Can I get my resume reviewed by a human?", answer: "Yes, while our AI provides instant feedback, premium users can request detailed, line-by-line manual reviews from our expert career coaches." },
    { category: 'Career Guidance', question: "Do you help with salary negotiation?", answer: "Our career coaches provide extensive guidance on how to evaluate job offers, handle HR rounds, and negotiate compensation packages effectively." },
    { category: 'Career Guidance', question: "How do I choose between different career paths?", answer: "Our initial assessment helps identify your strengths. You can also explore introductory modules for both paths before committing to a specialized roadmap." },
    { category: 'Career Guidance', question: "What if I want to switch my target role midway?", answer: "You can update your career goals at any time. The AI will recalculate your roadmap, identifying transferable skills and highlighting the new gaps you need to bridge." },
    { category: 'Career Guidance', question: "Do you help with building a portfolio?", answer: "Yes, we guide you on how to structure your GitHub, what kind of projects to showcase, and how to write compelling READMEs." },
    { category: 'Career Guidance', question: "Is career guidance available after I get placed?", answer: "Yes! We offer guidance on navigating your first 90 days, managing promotions, and planning long-term career growth in the tech industry." },

    // Internships & Job Assistance
    { category: 'Internships & Job Assistance', question: "Do you guarantee job placements?", answer: "While we don't guarantee jobs, our comprehensive preparation and direct tie-ups with 500+ hiring partners significantly boost your placement probability." },
    { category: 'Internships & Job Assistance', question: "Are there exclusive internship opportunities?", answer: "Yes, we regularly host exclusive hiring drives and list curated internship opportunities available only to our active users." },
    { category: 'Internships & Job Assistance', question: "How does the platform match me with companies?", answer: "When your readiness score crosses a certain threshold, our algorithm automatically highlights your profile to hiring partners whose requirements match your skill graph." },
    { category: 'Internships & Job Assistance', question: "Can I apply for jobs directly through the platform?", answer: "Yes, our 'Jobs Board' allows you to apply directly using your platform profile and auto-generated resume with just one click." },
    { category: 'Internships & Job Assistance', question: "What types of companies hire from this platform?", answer: "We have partnerships ranging from high-growth startups to Fortune 500 product companies. You'll find roles across various tiers and compensation brackets." },
    { category: 'Internships & Job Assistance', question: "Is there a minimum score required to access the jobs board?", answer: "While you can view the jobs board immediately, you need to achieve a baseline readiness score of 60% before you can start applying through the platform." },
    { category: 'Internships & Job Assistance', question: "Do you help with off-campus drives?", answer: "Yes, we aggregate and verify off-campus drive links, provide referral networks, and send alerts for upcoming mass hiring events." },
    { category: 'Internships & Job Assistance', question: "What if a company requires a specific skill I haven't learned?", answer: "If a matched company requires a niche skill, our AI immediately alerts you and provides a rapid 'crash-course' module to help you prepare before the interview." }
  ]);

  useEffect(() => {
    // const fetchFaqs = async () => {
    //   try {
    //     const data = await publicApi.getFaqs();
    //     if (data && data.length > 0) {
    //       const processedData = data.map((faq: any) => ({
    //         ...faq,
    //         category: faq.category || 'General Queries'
    //       }));
    //       setFaqs(processedData);
    //     }
    //   } catch (err) {
    //     console.error("Error fetching faqs:", err);
    //   }
    // };
    // fetchFaqs();
  }, []);

  const successMetrics = [
    { metric: "35%", label: "Increase in top-tier placements", icon: TrendingUp, color: "text-green-400" },
    { metric: "40%", label: "Reduction in placement cycle time", icon: Clock, color: "text-blue-400" },
    { metric: "3x", label: "Higher student engagement", icon: Users, color: "text-purple-400" },
    { metric: "92%", label: "Placement Success Rate", icon: Target, color: "text-orange-400" }
  ];

  const pathDefinition = "M 640 0 L 640 320 C 640 440 960 440 960 560 L 960 820 C 960 940 320 940 320 1060 L 320 1320 C 320 1440 960 1440 960 1560 L 960 1820 C 960 1940 320 1940 320 2060 L 320 2320 C 320 2440 640 2440 640 2560 L 640 2640";
  const mobilePathDefinition = "M 640 0 L 640 2640";

  return (
    <div ref={containerRef} className="min-h-dvh overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none grainy-bg">
        <div
          className="absolute w-[800px] h-[800px] rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)',
            top: 'calc(var(--mouse-y, 0px) / 20)',
            left: 'calc(var(--mouse-x, 0px) / 20)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div
          className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0) 70%)',
            animationDelay: '1s'
          }}
        />
        <div
          className="absolute bottom-[-200px] left-[-200px] w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0) 70%)',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed left-1/2 z-50 w-[min(95%,calc(100vw-0.75rem))] -translate-x-1/2 transition-all duration-500 ease-out ${scrolled || mobileMenuOpen
        ? 'top-2 max-w-[1024px] bg-white/80 dark:bg-black/60 backdrop-blur-lg border border-slate-200/50 dark:border-white/10 shadow-xl rounded-full py-1.5'
        : 'top-0 sm:top-2 max-w-7xl bg-transparent py-2 border border-transparent'
        }`}>
        <div className="container mx-auto max-w-full px-3 sm:px-6">
          <div className="flex h-14 min-w-0 items-center gap-2 sm:h-16">
            {/* Logo Section */}
            <div className="flex min-w-0 flex-1 justify-start">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src={branding.APP_LOGO_URL || "/NG/NextGen_light.png"}
                  alt={`${branding.APP_NAME} Logo`}
                  className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                    {branding.APP_NAME?.replace(/\s*AI\s*$/i, '')}
                  </h1>
                  <p className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Data-Driven</p>
                </div>
              </div>
            </div>

            {/* Navigation Links - Dead Center */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-8 lg:flex">
              <a href="#features" className="text-[14px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-105">Features</a>
              <a href="#how-it-works" className="text-[14px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-105">How It Works</a>
              <a href="#testimonials" className="text-[14px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all hover:scale-105">Students</a>
            </div>

            {/* Right Side Actions */}
            <div className="hidden min-w-0 flex-1 items-center justify-end gap-x-4 lg:flex">
              <ThemeToggle />
              <Button variant="ghost" className="text-[14px] font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => navigate("/login")}>Login</Button>
              <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 transition-transform text-[14px] text-white font-bold px-5 py-2 h-9 rounded-full" onClick={() => navigate("/signup")}>
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2 lg:hidden">
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
      <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:pt-32 lg:pt-36">
        <div className="container mx-auto max-w-7xl relative z-10 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-10"
          >
            <Tabs value={audience} onValueChange={(v) => setAudience(v as "colleges" | "placements" | "students")} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl p-1.5 rounded-full border border-slate-200/50 dark:border-white/10 shadow-2xl mx-auto w-fit">
              <TabsList className="bg-transparent h-10 sm:h-12 gap-1 sm:gap-2">
                <TabsTrigger
                  value="colleges"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 text-slate-600 dark:text-slate-400 font-bold rounded-full px-4 sm:px-6 text-xs sm:text-sm transition-all hover:text-slate-900 dark:hover:text-white"
                >
                  Colleges
                </TabsTrigger>
                <TabsTrigger
                  value="placements"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 text-slate-600 dark:text-slate-400 font-bold rounded-full px-4 sm:px-6 text-xs sm:text-sm transition-all hover:text-slate-900 dark:hover:text-white"
                >
                  Placement Team
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 text-slate-600 dark:text-slate-400 font-bold rounded-full px-4 sm:px-6 text-xs sm:text-sm transition-all hover:text-slate-900 dark:hover:text-white"
                >
                  Students
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-extrabold leading-[1.1] mb-5 tracking-tight px-2"
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
            className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10 font-medium px-4 md:px-0"
          >
            <Typewriter text={heroCopy[audience].description} speed={40} delay={5000} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4"
          >
            <Button size="lg" className="w-full sm:w-auto h-11 px-6 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm rounded-full" onClick={() => navigate("/login")}>
              {heroCopy[audience].cta}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-11 px-6 text-sm font-medium border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 dark:text-white text-slate-700 rounded-full" onClick={() => setDemoOpen(true)}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Watch Demo
            </Button>
          </motion.div>


        </div>
      </section>

      {/* Features Grid and Tabs */}
      <section className="pt-0 pb-12 px-4 sm:px-6 relative" id="features">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 px-4">
            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white leading-tight">Built for High-Growth Careers</h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">Everything you need to transform career readiness and institutional outcomes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
            {features.slice(0, 3).map((feature, idx) => (
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
                  className={`p-5 sm:p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all hover:scale-[1.03] group relative overflow-hidden h-full shadow-lg ${activeFeatureTab === idx ? 'ring-2 ring-blue-500/50 ring-offset-4 ring-offset-white dark:ring-offset-slate-950' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity`} />
                  <div className="relative z-10 text-center sm:text-left">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-xl mx-auto sm:mx-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="mb-3 border-slate-200 dark:border-white/20 text-slate-500 dark:text-slate-400">{feature.stats}</Badge>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 h-auto sm:h-20 lg:h-24">{feature.description}</p>

                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - The Edge */}
      <section className="py-16 relative overflow-hidden transition-colors duration-500">

        <div className="container mx-auto max-w-5xl px-4 relative z-10">
          <div className="text-center mb-16">

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white leading-tight px-4">
              The Competitive Advantage
            </h2>

            {/* SEGMENTED TOGGLE */}
            <div className="flex justify-center mt-8 px-4" onMouseLeave={() => setComparisonView("after")}>
              <div className="relative w-full max-w-[300px] p-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                {/* SLIDER */}
                <motion.div
                  className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full border shadow-sm z-0 pointer-events-none ${comparisonView === "before"
                    ? "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    : "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800"
                    }`}
                  animate={{ x: comparisonView === "after" ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {/* BUTTONS */}
                <div className="relative z-10 flex">
                  <button
                    onMouseEnter={() => setComparisonView("before")}
                    onClick={() => setComparisonView("before")}
                    className={`w-1/2 py-2.5 font-medium text-sm transition-colors outline-none focus:outline-none ${comparisonView === "before"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400"
                      }`}
                  >
                    Traditional
                  </button>
                  <button
                    onMouseEnter={() => setComparisonView("after")}
                    onClick={() => setComparisonView("after")}
                    className={`w-1/2 py-2.5 font-medium text-sm transition-colors outline-none focus:outline-none ${comparisonView === "after"
                      ? "text-green-700 dark:text-green-400"
                      : "text-slate-500 dark:text-slate-400"
                      }`}
                  >
                    {branding.APP_NAME}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch px-4 mt-8">
            {/* Traditional */}
            <motion.div
              animate={{
                scale: comparisonView === "before" ? 1.02 : 0.95,
                opacity: comparisonView === "before" ? 1 : 0.5,
                rotate: comparisonView === "before" ? 0 : -2,
                filter: comparisonView === "before" ? "grayscale(0%)" : "grayscale(80%)",
              }}
              className={`relative ${comparisonView === "before" ? "z-10 block" : "z-0 block"}`}
            >
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-slate-900/60 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 shadow-inner">
                    <XCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Traditional System</h3>
                    <p className="text-red-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manual & Reactive</p>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  {["Manual Screenings", "Fragmented Data", "Static Reports", "Blind Careers"].map((title, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 items-center transition-all">
                      <div className="w-8 h-8 bg-white dark:bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 dark:border-transparent">
                        <Minus className="w-4 h-4 text-red-500" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">{title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Powered (Default) */}
            <motion.div
              animate={{
                scale: comparisonView === "after" ? 1.05 : 0.95,
                opacity: comparisonView === "after" ? 1 : 0.5,
                rotate: comparisonView === "after" ? 0 : 2,
                filter: comparisonView === "after" ? "grayscale(0%)" : "grayscale(80%)",
              }}
              className={`relative ${comparisonView === "after" ? "z-10 block" : "z-0 block"}`}
            >
              <div className="h-full rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-8 shadow-2xl dark:border-blue-500/30 dark:from-slate-900 dark:to-indigo-950/60 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 relative z-10">
                  <div className="w-14 h-14 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md"></div>
                    <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-500/30 flex items-center justify-center shadow-lg">
                      <img src={branding.APP_LOGO_URL || "/NG/NextGen_light.png"} alt={`${branding.APP_NAME} Logo`} className="w-8 h-8 object-contain" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{branding.APP_NAME?.replace(/\s*AI\s*$/i, '')} </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time & Intelligent</p>
                  </div>
                </div>

                <div className="space-y-4 mt-8 relative z-10">
                  {["Auto-Synthesis", "Live Benchmarking", "Early Intervention", "Outcome Predictor"].map((title, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white/60 dark:bg-white/10 rounded-2xl border border-indigo-50/50 dark:border-white/10 items-center backdrop-blur-sm shadow-sm transition-all hover:scale-[1.02]">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0 border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{title}</h4>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => navigate && navigate("/signup")}
                  className="w-full py-6 text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl mt-8 shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] relative z-10"
                >
                  Unlock Future Readiness
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works / Scroll Journey */}
      <section className="relative overflow-hidden px-4 pt-20 pb-0 sm:px-6 sm:pt-32 lg:px-8" id="how-it-works" ref={journeySectionRef}>

        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="mb-16 px-2 text-center sm:mb-24 sm:px-4">
            <h2 className="mb-6 text-3xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white sm:mb-8 sm:text-5xl md:text-7xl">Your Path to Excellence</h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">Watch your career trajectory transform from a student to a professional with AI at every turn.</p>
          </div>

          <div className="relative min-h-[2500px] overflow-hidden py-6 sm:min-h-[2800px] sm:py-10 md:min-h-[2800px]">
            {/* The Winding Path SVG */}
            <div className="absolute inset-0 flex justify-center pointer-events-none z-0">
              <svg
                width="1280"
                height="100%"
                viewBox="0 0 1280 2880"
                fill="none"
                className="w-full max-w-7xl"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="journey-gradient" x1="640" y1="0" x2="640" y2="3100" gradientUnits="userSpaceOnUse">
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

                {/* === DESKTOP PATHS (Hidden on mobile) === */}
                {/* Desktop Shadow Path */}
                <motion.path
                  d={pathDefinition}
                  stroke="url(#journey-gradient)"
                  strokeWidth="60"
                  strokeLinecap="round"
                  className="blur-3xl opacity-10 dark:opacity-20 hidden md:block" // Hidden on mobile
                  style={{ pathLength: pathProgress }}
                />

                {/* Desktop Main Animated Path */}
                <motion.path
                  d={pathDefinition}
                  stroke="url(#journey-gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="hidden md:block" // Hidden on mobile
                  style={{ pathLength: pathProgress }}
                  filter="url(#glow)"
                />

                {/* Desktop Bead */}
                <motion.circle
                  r="12"
                  fill="white"
                  className="shadow-2xl hidden md:block" // Hidden on mobile
                  style={{
                    offsetPath: `path('${pathDefinition}')`,
                    ...({ "offset-distance": useTransform(pathProgress, [0, 1], ["0%", "100%"]) } as any),
                  }}
                />

                {/* === MOBILE PATHS (Visible only on mobile) === */}
                {/* Mobile Shadow Path */}
                <motion.path
                  d={mobilePathDefinition}
                  stroke="url(#journey-gradient)"
                  strokeWidth="40"
                  strokeLinecap="round"
                  className="blur-3xl opacity-10 dark:opacity-20 md:hidden" // Visible on mobile
                  style={{ pathLength: pathProgress }}
                />

                {/* Mobile Main Animated Path */}
                <motion.path
                  d={mobilePathDefinition}
                  stroke="url(#journey-gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="md:hidden" // Visible on mobile
                  style={{ pathLength: pathProgress }}
                  filter="url(#glow)"
                />

                {/* Mobile Bead */}
                <motion.circle
                  r="12"
                  fill="white"
                  className="shadow-2xl md:hidden" // Visible on mobile
                  style={{
                    offsetPath: `path('${mobilePathDefinition}')`,
                    ...({ "offset-distance": useTransform(pathProgress, [0, 1], ["0%", "100%"]) } as any),
                  }}
                />
              </svg>
            </div>

            {/* Journey Stops */}
            <div className="relative z-30 px-4 space-y-24 sm:space-y-0">
              {/* Start: Profile */}
              <div className="h-[400px] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-4 sm:p-6 pr-6 sm:pr-12 rounded-[2rem] sm:rounded-[2.5rem] flex items-center gap-4 sm:gap-6 shadow-2xl group hover:scale-105 transition-transform cursor-pointer relative z-10 overflow-hidden max-w-md"
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
              <div className="h-[500px] grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:block" />
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-xs sm:max-w-sm w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative z-10 overflow-hidden border-blue-500/20 aspect-square sm:aspect-auto sm:min-h-[320px]"
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
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Stop 2: Project Alpha (LEFT) */}
              <div className="h-[500px] grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-xs sm:max-w-sm w-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative z-10 overflow-hidden sm:text-right aspect-square sm:aspect-auto sm:min-h-[320px]"
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
                          viewport={{ once: true }}
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
                <div className="hidden md:block" />
              </div>

              {/* Stop 3: Mock Interview (RIGHT) */}
              <div className="h-[500px] grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:block" />
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-sm w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative z-10 overflow-hidden border-indigo-500/20 aspect-square sm:aspect-auto sm:min-h-[320px]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 dark:bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/20">
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">Mock Interview</h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4 sm:mb-6">Cracked 12 simulated Big-Tech rounds with real-time feedback.</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Interview IQ</p>
                        <span className="text-[10px] sm:text-xs font-black text-indigo-600 dark:text-indigo-400"><AnimatedNumber value={94} />%</span>
                      </div>
                      <div className="h-1.5 sm:h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "94%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full"
                        />
                      </div>
                      <div className="mt-2 p-2 sm:p-3 bg-slate-50 dark:bg-indigo-500/10 rounded-xl border border-slate-200 dark:border-indigo-500/20">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300 mb-1 sm:mb-2 text-center">Performance Spike</p>
                        <div className="flex gap-1 h-6 sm:h-8 items-end justify-center">
                          {[30, 45, 35, 60, 55, 80, 95].map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className="flex-grow bg-indigo-600/60 dark:bg-indigo-500/40 rounded-t-[1px] max-w-[8px] sm:max-w-[10px]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Stop 4: Internship (LEFT) */}
              <div className="h-[500px] grid grid-cols-1 md:grid-cols-2">
                <div className="flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="group relative z-10 w-full max-w-sm overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 bg-white/70 p-6 sm:p-8 text-right shadow-2xl backdrop-blur-2xl transition-all hover:scale-[1.02] dark:border-blue-500/20 dark:bg-slate-900/80 aspect-square sm:aspect-auto sm:min-h-[320px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-blue-200 dark:border-white/10 ml-auto">
                      <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-500" />
                    </div>
                    <h3 className="mb-2 sm:mb-3 text-lg sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Internship at Google</h3>
                    <p className="mb-4 sm:mb-6 text-sm sm:text-base font-bold leading-relaxed text-slate-600 dark:text-slate-400">Selected via exclusive partner referral through Campus Career analytics.</p>

                    <div className="space-y-3 mb-3 text-left">
                      <div className="flex justify-between items-end flex-row-reverse">
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Referral Index</p>
                        <span className="text-[10px] sm:text-xs font-black text-blue-600 dark:text-blue-400">Top <AnimatedNumber value={1} />%</span>
                      </div>
                      <div className="h-1.5 sm:h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "99%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-l from-blue-600 to-cyan-400 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-500/10 rounded-xl border border-green-500/20 w-fit ml-auto">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-ping" />
                      <span className="text-[10px] sm:text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Active Placement</span>
                    </div>
                  </motion.div>
                </div>
                <div className="hidden md:block" />
              </div>

              {/* Final Stop: Job Offer (CENTER) */}
              <div className="h-[400px] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="max-w-sm w-full mx-auto bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl group hover:-translate-y-2 transition-all relative z-10 overflow-hidden border-pink-500/20 aspect-square sm:aspect-auto sm:min-h-[320px] text-center flex flex-col items-center justify-center"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -ml-16 -mb-16 transition-transform duration-700 group-hover:scale-150" />

                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    <div className="mx-auto mb-4 sm:mb-6 flex w-12 h-12 sm:w-14 sm:h-14 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-600/20 border border-pink-200 dark:border-pink-500/20 shadow-xl transition-transform group-hover:scale-110">
                      <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 dark:text-pink-400" />
                    </div>

                    <Badge className="mb-2 sm:mb-3 rounded-full border border-pink-200 dark:border-pink-500/30 bg-pink-50 dark:bg-pink-500/10 px-3 py-1 font-black uppercase tracking-tighter text-pink-600 dark:text-pink-400 text-[9px] sm:text-[10px]">Mission Accomplished</Badge>

                    <h3 className="mb-1 sm:mb-2 text-lg sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Job Offer</h3>
                    <p className="mb-3 sm:mb-4 font-black text-sm sm:text-base text-slate-600 dark:text-slate-400">₹42.5 LPA • SDE-1</p>

                    <div className="rounded-xl border border-pink-200 dark:border-pink-500/20 bg-pink-50 dark:bg-pink-500/10 p-2 sm:p-3 max-w-[140px] sm:max-w-[160px] mx-auto w-full mt-2">
                      <p className="mb-0.5 text-center text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] text-pink-600 dark:text-pink-400">Career Growth</p>
                      <p className="text-center text-lg sm:text-xl font-black text-pink-600 dark:text-pink-400"><AnimatedNumber value={5} />X</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Success Metrics */}
      <section className="pt-8 pb-24 relative overflow-hidden" >
        <div className="container mx-auto max-w-6xl relative z-10 px-4">
          <div className="grid grid-cols-2 gap-4 text-center sm:gap-6 lg:gap-8 lg:grid-cols-4">
            {successMetrics.map((sm, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 sm:p-8 group relative bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Icon Container with Adaptive Glass Effect */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 dark:bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 mx-auto 
                        group-hover:rotate-6 transition-all duration-300 shadow-sm 
                        border border-slate-200 dark:border-white/10 group-hover:border-purple-500/50">
                  <sm.icon className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800 dark:text-white font-semibold transition-colors" />
                </div>

                {/* Metric Number */}
                <motion.p
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  className="text-3xl sm:text-4xl font-black mb-2 tracking-tight text-slate-900 dark:text-white"
                >
                  {sm.metric}
                </motion.p>

                {/* Label */}
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 leading-snug max-w-[120px] mx-auto">
                  {sm.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 relative" id="testimonials" >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white leading-tight">Proven Breakthroughs</h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">Trusted by tier-1 institutions and high-growth recruiters.</p>
          </div>

          <div className="max-w-4xl mx-auto px-2 sm:px-0">
            <Card className="p-6 sm:p-8 lg:p-10 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 p-8 opacity-5 hidden sm:block">
                <Quote className="w-24 h-24 text-slate-900 dark:text-white" />
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="relative z-10 mb-8 text-pretty break-words text-lg font-semibold leading-relaxed text-slate-900 dark:text-white sm:mb-10 sm:text-2xl">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-6 border-t border-slate-100 dark:border-white/5 pt-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-sm">{testimonials[activeTestimonial].avatar}</div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{testimonials[activeTestimonial].author}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{testimonials[activeTestimonial].role}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-[10px] tracking-widest uppercase mt-0.5">{testimonials[activeTestimonial].company}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <Badge className="bg-green-600 text-white border-0 text-sm px-4 py-1.5 font-bold mb-1 shadow-sm shadow-green-600/20">{testimonials[activeTestimonial].package}</Badge>
                  <p className="text-slate-500 font-medium text-[10px] uppercase">{testimonials[activeTestimonial].stat}</p>
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
      <section className="py-16 px-4 sm:px-6 relative overflow-hidden transition-colors duration-500" id="faq">
        <div className="container mx-auto max-w-6xl relative z-10 px-4">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Frequently Asked <br className="hidden sm:block" />
              Questions
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* Left Sidebar: Categories */}
            <div className="w-full lg:w-1/3">
              <div className="flex flex-col items-start gap-3 sticky top-32">
                {faqCategories.map((category, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveFaq(null);
                    }}
                    className={`relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[14px] sm:text-[15px] font-medium transition-colors text-left border ${activeCategory === category
                        ? 'border-transparent text-slate-900 dark:text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:bg-[#0c0814] dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:border-white/20'
                      }`}
                  >
                    {activeCategory === category && (
                      <motion.div
                        layoutId="activeCategoryBox"
                        className="absolute -inset-px bg-slate-100 border border-slate-300 rounded-full shadow-sm dark:bg-white/10 dark:border-white/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content Area: Accordion */}
            <div className="w-full lg:w-2/3 min-h-[400px]">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0814] divide-y divide-slate-100 dark:divide-white/5 overflow-hidden shadow-sm">
                <AnimatePresence mode="wait">
                  {faqs.filter(faq => faq.category === activeCategory).map((faq, i) => (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="group bg-transparent transition-colors"
                    >
                      <button
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className={`text-[15px] sm:text-[16px] font-medium pr-4 transition-colors ${activeFaq === i ? 'text-blue-600 dark:text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                          }`}>
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 ${activeFaq === i ? 'rotate-180 text-blue-600 dark:text-white' : ''
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeFaq === i && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden bg-slate-50/50 dark:bg-white/5"
                          >
                            <div className="px-5 sm:px-6 pb-6 pt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10 text-center px-4">

          <h2 className="mb-3 sm:mb-4 px-1 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
            Ready to Accelerate Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent underline decoration-blue-500/20 dark:decoration-white/20">
              Future?
            </span>
          </h2>
          <p className="mx-auto mb-6 sm:mb-8 max-w-2xl px-2 text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Join 50,000+ students already using AI to unlock their peak placement potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" className="w-full sm:w-auto h-10 sm:h-12 px-6 text-sm sm:text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:scale-105 transition-all group rounded-full" onClick={() => navigate("/login")}>
              Get Started Now
              <Rocket className="w-4 h-4 ml-2 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-10 sm:h-12 px-6 text-sm sm:text-base font-bold border-2 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-xl rounded-full" onClick={() => navigate("/login")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="mx-4 max-h-[min(92dvh,900px)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto border-white/10 bg-slate-900 text-white sm:mx-auto sm:max-w-4xl">
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
    </div >
  );
}
