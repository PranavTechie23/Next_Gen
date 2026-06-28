import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ExternalLink, Search, Star, TrendingUp, BookOpen, Code, Brain,
    Zap, Users, Target, Award, Globe, Flame, ChevronRight, Filter,
    Rocket, GraduationCap, BarChart, Clock, CheckCircle, Sparkles,
    Briefcase, Monitor, FileText, Shield, ArrowUpRight, Cpu, Server, Cloud
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── Platform Data ──────────────────────────────────────────────────────
interface Platform {
    id: string;
    name: string;
    description: string;
    longDescription: string;
    url: string;
    logo: string;        // short code (IB, LC, etc.)
    logoUrl?: string;    // optional real logo URL
    gradient: string;
    category: string;
    tags: string[];
    rating: number;
    users: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
    features: string[];
    bestFor: string;
    isFree: boolean;
    type: "Platform" | "Course" | "Docs" | "Sheet" | "Roadmap" | "Playlist";
    timeToStart?: "15m" | "1h" | "1d" | "1w";
}

const CATEGORIES = [
    { id: "all", label: "All Platforms", icon: Globe, color: "from-blue-600 to-cyan-600" },
    { id: "aptitude", label: "Aptitude & Reasoning", icon: Brain, color: "from-purple-600 to-pink-600" },
    { id: "dsa", label: "DSA & Coding", icon: Code, color: "from-green-600 to-emerald-600" },
    { id: "interview", label: "Interview Prep", icon: Users, color: "from-orange-600 to-red-600" },
    { id: "system-design", label: "System Design", icon: Monitor, color: "from-indigo-600 to-violet-600" },
    { id: "competitive", label: "Competitive Programming", icon: Flame, color: "from-red-600 to-orange-600" },
    { id: "placement", label: "Placement Prep", icon: Briefcase, color: "from-teal-600 to-cyan-600" },
    { id: "core-cs", label: "Core CS (OS/DBMS/CN)", icon: Cpu, color: "from-slate-600 to-gray-700" },
    { id: "web", label: "Web Dev", icon: Globe, color: "from-sky-600 to-blue-700" },
    { id: "backend", label: "Backend", icon: Server, color: "from-emerald-600 to-teal-700" },
    { id: "devops", label: "DevOps & Cloud", icon: Cloud, color: "from-indigo-600 to-blue-800" },
    { id: "data", label: "Data / ML", icon: BarChart, color: "from-fuchsia-600 to-purple-700" },
    { id: "security", label: "Cybersecurity", icon: Shield, color: "from-rose-600 to-red-700" },
];

const PLATFORMS: Platform[] = [
    // ─── Aptitude & Reasoning ───
    {
        id: "indiabix",
        name: "IndiaBix",
        description: "India's #1 aptitude & reasoning practice platform with thousands of questions.",
        longDescription: "Master quantitative aptitude, logical reasoning, verbal ability, and GK with topic-wise practice sets, solutions, and shortcuts.",
        url: "https://www.indiabix.com",
        logo: "IB",
        logoUrl: "https://logo.clearbit.com/indiabix.com",
        gradient: "from-orange-500 to-red-500",
        category: "aptitude",
        tags: ["Aptitude", "Reasoning", "Verbal", "GK"],
        rating: 4.5,
        users: "50M+",
        difficulty: "All Levels",
        features: ["Topic-wise Practice", "Detailed Solutions", "Shortcut Methods", "Company-wise Papers"],
        bestFor: "Aptitude rounds in campus placements",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    
    {
        id: "prepinsta",
        name: "PrepInsta",
        description: "TCS, Infosys, Wipro — company-specific placement preparation.",
        longDescription: "Targeted preparation material for top IT company hiring rounds including aptitude, coding, and verbal sections with previous year questions.",
        url: "https://prepinsta.com",
        logo: "PI",
        logoUrl: "https://logo.clearbit.com/prepinsta.com",
        gradient: "from-green-500 to-teal-500",
        category: "aptitude",
        tags: ["TCS", "Infosys", "Wipro", "Company Prep"],
        rating: 4.4,
        users: "15M+",
        difficulty: "Beginner",
        features: ["Company-Specific Prep", "Previous Year Papers", "Topic-wise MCQs", "Coding Practice"],
        bestFor: "Service-based company placement rounds",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },

    // ─── DSA & Coding ───
    {
        id: "leetcode",
        name: "LeetCode",
        description: "The gold standard for coding interview preparation with 3000+ problems.",
        longDescription: "Practice data structures, algorithms, and system design problems. Used by millions to prepare for FAANG and top-tier tech company interviews.",
        url: "https://leetcode.com",
        logo: "LC",
        logoUrl: "https://logo.clearbit.com/leetcode.com",
        gradient: "from-yellow-500 to-orange-500",
        category: "dsa",
        tags: ["DSA", "Algorithms", "FAANG", "Contests"],
        rating: 4.8,
        users: "15M+",
        difficulty: "All Levels",
        features: ["3000+ Problems", "Company Tags", "Weekly Contests", "Discussion Forums"],
        bestFor: "FAANG & top-tier company interviews",
        isFree: false,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "gfg",
        name: "GeeksforGeeks",
        description: "Comprehensive DSA tutorials, practice problems, and courses for placements.",
        longDescription: "The most extensive library of DSA articles, tutorials, coding practice problems, and interview experiences covering every CS topic imaginable.",
        url: "https://www.geeksforgeeks.org",
        logo: "GG",
        logoUrl: "https://logo.clearbit.com/geeksforgeeks.org",
        gradient: "from-green-600 to-green-500",
        category: "dsa",
        tags: ["DSA", "Tutorials", "Courses", "Interview Prep"],
        rating: 4.7,
        users: "25M+",
        difficulty: "All Levels",
        features: ["1500+ DSA Problems", "Company-wise Practice", "SDE Sheet", "CS Tutorials"],
        bestFor: "In-depth CS fundamentals and DSA mastery",
        isFree: false,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "hackerrank",
        name: "HackerRank",
        description: "Practice coding, prepare for interviews, and get hired with skill badges.",
        longDescription: "Skill-based coding challenges across domains including algorithms, SQL, AI, and more. Many companies use HackerRank for their hiring assessments.",
        url: "https://www.hackerrank.com",
        logo: "HR",
        logoUrl: "https://logo.clearbit.com/hackerrank.com",
        gradient: "from-emerald-500 to-green-600",
        category: "dsa",
        tags: ["Coding", "SQL", "Certification", "Hiring"],
        rating: 4.5,
        users: "18M+",
        difficulty: "All Levels",
        features: ["Skill Certifications", "Domain-wise Practice", "Company Tests", "Leaderboards"],
        bestFor: "Earning verified skill badges for your resume",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "codingninjas",
        name: "Coding Ninjas",
        description: "Structured DSA courses and guided paths for placement preparation.",
        longDescription: "Well-structured curriculum with mentored courses covering DSA, web development, and competitive programming with placement assistance.",
        url: "https://www.codingninjas.com",
        logo: "CN",
        logoUrl: "https://logo.clearbit.com/codingninjas.com",
        gradient: "from-orange-600 to-red-600",
        category: "dsa",
        tags: ["DSA Course", "Mentored", "Placement"],
        rating: 4.6,
        users: "5M+",
        difficulty: "Beginner",
        features: ["Guided Learning Paths", "Mentor Support", "Mock Interviews", "Placement Assistance"],
        bestFor: "Structured, mentor-guided DSA learning",
        isFree: false,
        type: "Course",
        timeToStart: "1h",
    },
    {
        id: "neetcode",
        name: "NeetCode",
        description: "The best curated path to master LeetCode and Ace the Coding Interview.",
        longDescription: "Structured roadmaps, video solutions, and clean code for the most important LeetCode problems. Highly recommended by top software engineers.",
        url: "https://neetcode.io",
        logo: "NC",
        logoUrl: "https://logo.clearbit.com/neetcode.io",
        gradient: "from-sky-500 to-blue-700",
        category: "dsa",
        tags: ["LeetCode", "Roadmaps", "Video Solutions", "Interview Prep"],
        rating: 4.9,
        users: "2M+",
        difficulty: "All Levels",
        features: ["NeetCode 150", "Blind 75", "Topic-wise Roadmaps", "System Design"],
        bestFor: "Optimized, curated path for coding interview success",
        isFree: true,
        type: "Roadmap",
        timeToStart: "15m",
    },
    {
        id: "striver",
        name: "Take U Forward",
        description: "Striver's SDE Sheet and DSA A-to-Z Roadmap for top placements.",
        longDescription: "Home of the famous SDE Sheet and A-to-Z DSA Roadmap. Comprehensive video tutorials and problem lists that have helped thousands crack MAANG interviews.",
        url: "https://takeuforward.org",
        logo: "TUF",
        logoUrl: "https://logo.clearbit.com/takeuforward.org",
        gradient: "from-red-600 to-red-500",
        category: "dsa",
        tags: ["SDE Sheet", "DSA Roadmap", "Tutorials", "MAANG"],
        rating: 4.9,
        users: "2M+",
        difficulty: "All Levels",
        features: ["SDE Sheet", "DSA A-Z Series", "Company-specific Sheets", "Graphic Tutorials"],
        bestFor: "Topic-wise mastery with detailed video explanations",
        isFree: true,
        type: "Sheet",
        timeToStart: "15m",
    },
    {
        id: "cses",
        name: "CSES Problem Set",
        description: "Master algorithm techniques with this pure, high-quality problem set.",
        longDescription: "The CSES Problem Set contains a collection of high-quality algorithm problems. It covers a wide range of topics and is used for advanced algorithmic training.",
        url: "https://cses.fi/problemset/",
        logo: "CS",
        logoUrl: "https://logo.clearbit.com/cses.fi",
        gradient: "from-blue-600 to-cyan-700",
        category: "dsa",
        tags: ["Algorithms", "Advanced", "Problem Solving"],
        rating: 4.8,
        users: "500K+",
        difficulty: "Advanced",
        features: ["High-quality Problems", "Core Algorithms", "Fast Judge", "No Junk Problems"],
        bestFor: "Advanced algorithmic thinking and core implementation",
        isFree: true,
        type: "Sheet",
        timeToStart: "1h",
    },


    // ─── Interview Prep ───
    {
        id: "interviewbit",
        name: "InterviewBit",
        description: "Structured interview preparation with curated problem sets and mock interviews.",
        longDescription: "A focused platform for interview preparation with a curated path of problems organized by topics, plus mock interview scheduling with peers.",
        url: "https://www.interviewbit.com",
        logo: "IB",
        logoUrl: "https://logo.clearbit.com/interviewbit.com",
        gradient: "from-blue-600 to-indigo-600",
        category: "interview",
        tags: ["Mock Interviews", "Curated Problems", "Guided Path"],
        rating: 4.6,
        users: "5M+",
        difficulty: "Intermediate",
        features: ["Curated Problem Tracks", "Peer Mock Interviews", "Company Prep", "Progress Tracking"],
        bestFor: "Structured, goal-oriented interview preparation",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "algoexpert",
        name: "AlgoExpert",
        description: "The ultimate resource for coding interview preparation.",
        longDescription: "Premium platform with high-quality video explanations for 160+ hand-picked coding questions, covering algorithms, data structures, and system design.",
        url: "https://www.algoexpert.io",
        logo: "AE",
        logoUrl: "https://logo.clearbit.com/algoexpert.io",
        gradient: "from-blue-500 to-indigo-500",
        category: "interview",
        tags: ["Coding Questions", "Video Explanations", "System Design"],
        rating: 4.8,
        users: "1M+",
        difficulty: "All Levels",
        features: ["160+ Hand-picked Questions", "Detailed Video Solutions", "In-browser Coding", "Behavioral Prep"],
        bestFor: "High-quality, focused coding interview training",
        isFree: false,
        type: "Course",
        timeToStart: "1h",
    },

    {
        id: "pramp",
        name: "Pramp",
        description: "Free peer-to-peer mock interviews with real engineers.",
        longDescription: "Practice live coding interviews with peers and get real-time feedback. Covers behavioral, system design, and coding interviews.",
        url: "https://www.pramp.com",
        logo: "PR",
        logoUrl: "https://logo.clearbit.com/pramp.com",
        gradient: "from-purple-600 to-blue-600",
        category: "interview",
        tags: ["Mock Interviews", "Peer Practice", "Live Coding"],
        rating: 4.5,
        users: "2M+",
        difficulty: "Intermediate",
        features: ["Live Mock Interviews", "Peer Matching", "Behavioral Prep", "Instant Feedback"],
        bestFor: "Simulating real interview pressure",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "glassdoor",
        name: "Glassdoor",
        description: "Real interview questions, salaries, and company reviews from employees.",
        longDescription: "Research companies, access real interview questions shared by candidates, and compare salaries before your next interview.",
        url: "https://www.glassdoor.co.in",
        logo: "GD",
        logoUrl: "https://logo.clearbit.com/glassdoor.com",
        gradient: "from-green-500 to-lime-500",
        category: "interview",
        tags: ["Interview Questions", "Salaries", "Reviews"],
        rating: 4.3,
        users: "60M+",
        difficulty: "All Levels",
        features: ["Real Interview Questions", "Company Reviews", "Salary Data", "Job Listings"],
        bestFor: "Researching company culture and interview process",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },

    // ─── System Design ───
    {
        id: "educative",
        name: "Educative.io",
        description: "Interactive system design courses — Grokking the System Design Interview.",
        longDescription: "Text-based interactive courses with in-browser coding environments. Famous for the 'Grokking' series covering system design, coding patterns, and more.",
        url: "https://www.educative.io",
        logo: "ED",
        logoUrl: "https://logo.clearbit.com/educative.io",
        gradient: "from-indigo-600 to-blue-600",
        category: "system-design",
        tags: ["System Design", "Grokking", "Interactive"],
        rating: 4.7,
        users: "3M+",
        difficulty: "Advanced",
        features: ["Interactive Courses", "In-browser Coding", "Grokking Series", "Certifications"],
        bestFor: "Mastering system design from scratch",
        isFree: false,
        type: "Course",
        timeToStart: "1h",
    },
    {
        id: "systemdesignprimer",
        name: "System Design Primer",
        description: "Free open-source resource to learn large-scale system design.",
        longDescription: "A comprehensive GitHub repository with everything you need to prepare for system design interviews — diagrams, solutions, and real-world architectures.",
        url: "https://github.com/donnemartin/system-design-primer",
        logo: "SD",
        logoUrl: "https://logo.clearbit.com/github.com",
        gradient: "from-slate-600 to-gray-600",
        category: "system-design",
        tags: ["Open Source", "System Design", "GitHub"],
        rating: 4.9,
        users: "250K+ stars",
        difficulty: "Advanced",
        features: ["Free & Open Source", "Real-world Examples", "Diagrams", "Anki Flashcards"],
        bestFor: "Self-directed system design preparation",
        isFree: true,
        type: "Docs",
        timeToStart: "1h",
    },

    // ─── Competitive Programming ───
    {
        id: "codeforces",
        name: "Codeforces",
        description: "Competitive programming contests and an active problem-solving community.",
        longDescription: "Participate in regular programming contests, solve challenging problems, and improve your competitive programming rating.",
        url: "https://codeforces.com",
        logo: "CF",
        logoUrl: "https://logo.clearbit.com/codeforces.com",
        gradient: "from-blue-700 to-blue-500",
        category: "competitive",
        tags: ["Contests", "Competitive", "CP", "Rating"],
        rating: 4.7,
        users: "800K+",
        difficulty: "Advanced",
        features: ["Weekly Contests", "Rating System", "Problem Archive", "Editorials"],
        bestFor: "Sharpening problem-solving speed and accuracy",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "tle-eliminators",
        name: "TLE Eliminators",
        description: "Rank-up in competitive programming with structured coaching and contests.",
        longDescription: "A specialized platform for CP training with structured courses, weekly contests, and expert mentorship to help you reach Candidate Master and beyond.",
        url: "https://www.tle-eliminators.com",
        logo: "TE",
        logoUrl: "https://logo.clearbit.com/tle-eliminators.com",
        gradient: "from-indigo-600 to-blue-800",
        category: "competitive",
        tags: ["CP Coaching", "Rating Up", "Mentorship", "Contests"],
        rating: 4.8,
        users: "100K+",
        difficulty: "Advanced",
        features: ["Live Sessions", "CP Roadmap", "Rating-based Training", "Doubt Support"],
        bestFor: "Systematic improvement in competitive programming",
        isFree: false,
        type: "Course",
        timeToStart: "1h",
    },
    {
        id: "hackerearth",
        name: "HackerEarth",
        description: "Practice coding, compete in hackathons, and ace hiring challenges.",
        longDescription: "A leading developer recruitment platform that offers coding practice, hackathons, and hiring assessments used by thousands of companies.",
        url: "https://www.hackerearth.com",
        logo: "HE",
        logoUrl: "https://logo.clearbit.com/hackerearth.com",
        gradient: "from-purple-700 to-indigo-600",
        category: "competitive",
        tags: ["Hiring Challenges", "Hackathons", "Practice", "CP"],
        rating: 4.5,
        users: "7M+",
        difficulty: "All Levels",
        features: ["Hiring Challenges", "Hackathons", "Practice Problems", "Company Tests"],
        bestFor: "Participating in corporate hiring challenges",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },

    {
        id: "codechef",
        name: "CodeChef",
        description: "Monthly coding contests, practice problems, and learning paths from India.",
        longDescription: "India's leading competitive programming platform with regular contests, a structured learning path, and a strong community.",
        url: "https://www.codechef.com",
        logo: "CC",
        logoUrl: "https://logo.clearbit.com/codechef.com",
        gradient: "from-amber-600 to-yellow-500",
        category: "competitive",
        tags: ["Contests", "CP", "Learning Paths", "Community"],
        rating: 4.5,
        users: "3M+",
        difficulty: "All Levels",
        features: ["Monthly Contests", "Learning Paths", "Discuss Forum", "IDE Built-in"],
        bestFor: "Building competitive programming fundamentals",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "atcoder",
        name: "AtCoder",
        description: "Weekly high-quality competitive programming contests from Japan.",
        longDescription: "Highly regarded for its elegant and educational problem sets. Regular Beginner (ABC) and Regular (ARC) contests used by top competitive programmers.",
        url: "https://atcoder.jp",
        logo: "AC",
        logoUrl: "https://logo.clearbit.com/atcoder.jp",
        gradient: "from-slate-800 to-slate-900",
        category: "competitive",
        tags: ["Contests", "CP", "Beginner Friendly", "Japan"],
        rating: 4.8,
        users: "400K+",
        difficulty: "All Levels",
        features: ["Weekly Contests (ABC)", "Educational Problems", "Rating System", "Clean Interface"],
        bestFor: "Participating in high-quality, timed coding contests",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },


    // ─── Placement Prep ───
    {
        id: "naukri",
        name: "Naukri.com",
        description: "India's #1 job portal — apply to top companies and campus drives.",
        longDescription: "The largest job platform in India with millions of listings, resume hosting, company research, and application tracking.",
        url: "https://www.naukri.com",
        logo: "NK",
        logoUrl: "https://logo.clearbit.com/naukri.com",
        gradient: "from-blue-600 to-sky-500",
        category: "placement",
        tags: ["Jobs", "Resume", "Apply", "Campus"],
        rating: 4.3,
        users: "100M+",
        difficulty: "All Levels",
        features: ["Job Listings", "Resume Builder", "Company Research", "Application Tracking"],
        bestFor: "Finding and applying to jobs directly",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },
    {
        id: "linkedin-learning",
        name: "LinkedIn Learning",
        description: "Professional courses on soft skills, leadership, and technology.",
        longDescription: "Access thousands of expert-led courses on business, technology, and creative skills. Certificates can be added directly to your LinkedIn profile.",
        url: "https://www.linkedin.com/learning",
        logo: "LI",
        logoUrl: "https://logo.clearbit.com/linkedin.com",
        gradient: "from-blue-700 to-blue-600",
        category: "placement",
        tags: ["Soft Skills", "Courses", "Certifications"],
        rating: 4.4,
        users: "30M+",
        difficulty: "All Levels",
        features: ["Expert-led Courses", "LinkedIn Certificates", "Personalized Recommendations", "Offline Access"],
        bestFor: "Building soft skills and professional development",
        isFree: false,
        type: "Course",
        timeToStart: "1h",
    },
    {
        id: "unstop",
        name: "Unstop (D2C)",
        description: "Competitions, hackathons, and hiring challenges from top companies.",
        longDescription: "Participate in competitions, hackathons, quizzes, and hiring challenges hosted by top companies and colleges across India.",
        url: "https://unstop.com",
        logo: "UN",
        logoUrl: "https://res.cloudinary.com/dzu8o7ica/image/upload/v1707371558/unstop-logo_v4x_zqf0zv.png",
        gradient: "from-indigo-500 to-purple-600",
        category: "placement",
        tags: ["Hackathons", "Competitions", "Hiring Challenges"],
        rating: 4.5,
        users: "15M+",
        difficulty: "All Levels",
        features: ["Company Challenges", "Hackathons", "Quizzes & Competitions", "Mentorship"],
        bestFor: "Standing out through competitions and hackathons",
        isFree: true,
        type: "Platform",
        timeToStart: "15m",
    },

    // ─── Core CS ───
    {
        id: "lovebabbar-cs-subjects",
        name: "Core CS (Babbar Sheet)",
        description: "One-stop roadmap for OS, DBMS, CN, OOP with interview Q&A.",
        longDescription: "Curated notes and interview questions for core CS subjects. Great for quick revision before interviews and viva rounds.",
        url: "https://drive.google.com/drive/folders/1Xl-9pX6h7v7O-OS-DBMS-CN-OOP",
        logo: "CS",
        gradient: "from-slate-600 to-gray-700",
        category: "core-cs",
        tags: ["OS", "DBMS", "CN", "OOP", "Interview"],
        rating: 4.6,
        users: "Popular",
        difficulty: "All Levels",
        features: ["Subject-wise Notes", "Interview Questions", "Quick Revision"],
        bestFor: "Core subject revision (2-4 days)",
        isFree: true,
        type: "Sheet",
        timeToStart: "15m",
    },
    {
        id: "os-three-easy-pieces",
        name: "OSTEP (Operating Systems)",
        description: "The most recommended OS book (free) with great exercises.",
        longDescription: "Operating Systems: Three Easy Pieces (OSTEP) is a free, well-written OS book covering processes, threads, memory, and file systems with practical questions.",
        url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
        logo: "OS",
        logoUrl: "https://www.google.com/s2/favicons?domain=cs.wisc.edu&sz=128",
        gradient: "from-slate-700 to-zinc-800",
        category: "core-cs",
        tags: ["OS", "Book", "Processes", "Memory"],
        rating: 4.9,
        users: "Top pick",
        difficulty: "Advanced",
        features: ["Free Book", "Exercises", "Clear Explanations", "Practical"],
        bestFor: "Deep OS understanding (interviews + exams)",
        isFree: true,
        type: "Docs",
        timeToStart: "1h",
    },
    {
        id: "dbms-notes-gfg",
        name: "DBMS Notes (GFG)",
        description: "DBMS interview prep: normalization, indexing, transactions.",
        longDescription: "DBMS essentials explained with examples: ER model, normalization, indexing, transactions, ACID, locks, and SQL interview patterns.",
        url: "https://www.geeksforgeeks.org/dbms/",
        logo: "DB",
        logoUrl: "https://logo.clearbit.com/geeksforgeeks.org",
        gradient: "from-emerald-600 to-green-700",
        category: "core-cs",
        tags: ["DBMS", "SQL", "Indexing", "Transactions"],
        rating: 4.7,
        users: "25M+",
        difficulty: "All Levels",
        features: ["Topic-wise Notes", "Interview Qs", "SQL Practice"],
        bestFor: "DBMS interview revision",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },

    // ─── Web Dev ───
    {
        id: "roadmap-sh-web",
        name: "roadmap.sh (Web Dev)",
        description: "Interactive roadmaps for Web, React, Backend, DevOps and more.",
        longDescription: "Pick a role (Frontend/Backend/DevOps) and follow a step-by-step roadmap with checklists, resources, and best practices.",
        url: "https://roadmap.sh",
        logo: "RM",
        logoUrl: "https://logo.clearbit.com/roadmap.sh",
        gradient: "from-sky-600 to-blue-700",
        category: "web",
        tags: ["Roadmap", "Frontend", "React", "Backend"],
        rating: 4.8,
        users: "5M+",
        difficulty: "All Levels",
        features: ["Role Roadmaps", "Checklists", "Resource Links", "Free"],
        bestFor: "Choosing what to learn next",
        isFree: true,
        type: "Roadmap",
        timeToStart: "15m",
    },
    {
        id: "mdn-web-docs",
        name: "MDN Web Docs",
        description: "Best documentation for HTML, CSS, JavaScript, Web APIs.",
        longDescription: "Official, high-quality docs with examples for HTML/CSS/JS, accessibility, and web platform APIs used in real production apps.",
        url: "https://developer.mozilla.org",
        logo: "MDN",
        logoUrl: "https://logo.clearbit.com/mozilla.org",
        gradient: "from-zinc-800 to-slate-900",
        category: "web",
        tags: ["HTML", "CSS", "JavaScript", "Docs", "Web APIs"],
        rating: 4.9,
        users: "Most used",
        difficulty: "All Levels",
        features: ["Authoritative Docs", "Examples", "Guides", "Accessibility"],
        bestFor: "Learning web fundamentals correctly",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },
    {
        id: "react-docs",
        name: "React Documentation",
        description: "Official React docs — hooks, state, performance patterns.",
        longDescription: "Learn React the right way: components, hooks, state management, routing, performance, and best practices with examples.",
        url: "https://react.dev",
        logo: "RE",
        logoUrl: "https://logo.clearbit.com/react.dev",
        gradient: "from-cyan-500 to-blue-600",
        category: "web",
        tags: ["React", "Hooks", "Frontend", "Docs"],
        rating: 4.8,
        users: "Millions",
        difficulty: "All Levels",
        features: ["Official", "Modern Patterns", "Examples", "Best Practices"],
        bestFor: "Building strong frontend fundamentals",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },

    // ─── Backend ───
    {
        id: "nodejs-docs",
        name: "Node.js Docs",
        description: "Official Node docs for building backend services.",
        longDescription: "Learn Node core concepts: event loop, streams, HTTP, async patterns, and production practices.",
        url: "https://nodejs.org/en/docs",
        logo: "ND",
        logoUrl: "https://logo.clearbit.com/nodejs.org",
        gradient: "from-green-600 to-emerald-700",
        category: "backend",
        tags: ["Node.js", "Backend", "HTTP", "Async"],
        rating: 4.6,
        users: "Millions",
        difficulty: "All Levels",
        features: ["Official", "API Reference", "Guides", "Best Practices"],
        bestFor: "Writing correct backend code",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },
    {
        id: "expressjs-guide",
        name: "Express.js Guide",
        description: "Express basics + middleware patterns for APIs.",
        longDescription: "Build REST APIs with Express: routing, middleware, auth, error handling, security, and deployment tips.",
        url: "https://expressjs.com/en/guide/routing.html",
        logo: "EX",
        logoUrl: "https://logo.clearbit.com/expressjs.com",
        gradient: "from-slate-700 to-gray-900",
        category: "backend",
        tags: ["Express", "REST", "Middleware", "Auth"],
        rating: 4.6,
        users: "Popular",
        difficulty: "Beginner",
        features: ["Official Guide", "Examples", "Patterns", "Quick Start"],
        bestFor: "Building APIs for projects and internships",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },
    {
        id: "postgres-tutorial",
        name: "PostgreSQL Tutorial",
        description: "SQL + indexing + joins + performance fundamentals.",
        longDescription: "Learn SQL properly with joins, indexes, query planning basics, and practical examples for interview and real backend work.",
        url: "https://www.postgresql.org/docs/",
        logo: "PG",
        logoUrl: "https://logo.clearbit.com/postgresql.org",
        gradient: "from-blue-700 to-indigo-700",
        category: "backend",
        tags: ["SQL", "Postgres", "Indexes", "Joins"],
        rating: 4.7,
        users: "Top",
        difficulty: "Intermediate",
        features: ["Official Docs", "SQL Reference", "Performance Topics"],
        bestFor: "Backend + DB interview prep",
        isFree: true,
        type: "Docs",
        timeToStart: "1h",
    },

    // ─── DevOps & Cloud ───
    {
        id: "docker-docs",
        name: "Docker Docs",
        description: "Containers, images, compose — ship projects like production.",
        longDescription: "Learn Docker fundamentals to containerize apps, write Dockerfiles, run multi-service apps with docker-compose, and deploy cleanly.",
        url: "https://docs.docker.com",
        logo: "DK",
        logoUrl: "https://logo.clearbit.com/docker.com",
        gradient: "from-sky-500 to-blue-700",
        category: "devops",
        tags: ["Docker", "Containers", "Compose", "DevOps"],
        rating: 4.7,
        users: "Millions",
        difficulty: "All Levels",
        features: ["Official Docs", "Guides", "Examples", "Best Practices"],
        bestFor: "Internship-ready deployments",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },
    {
        id: "aws-skillbuilder",
        name: "AWS Skill Builder",
        description: "Free learning paths for cloud fundamentals and cert prep.",
        longDescription: "Start cloud with guided AWS courses, labs, and learning plans. Helpful for cloud internships and basic deployment knowledge.",
        url: "https://skillbuilder.aws",
        logo: "AWS",
        logoUrl: "https://logo.clearbit.com/aws.amazon.com",
        gradient: "from-amber-500 to-orange-600",
        category: "devops",
        tags: ["AWS", "Cloud", "Cert", "Labs"],
        rating: 4.5,
        users: "Large",
        difficulty: "Beginner",
        features: ["Learning Plans", "Hands-on Labs", "Certificates", "Free content"],
        bestFor: "Getting started with cloud in 1-2 weeks",
        isFree: true,
        type: "Course",
        timeToStart: "1h",
    },
    {
        id: "kubernetes-basics",
        name: "Kubernetes Basics",
        description: "Learn k8s concepts: pods, deployments, services.",
        longDescription: "Understand Kubernetes fundamentals with interactive examples. Great once you know Docker and want to level up DevOps skills.",
        url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        logo: "K8S",
        logoUrl: "https://logo.clearbit.com/kubernetes.io",
        gradient: "from-indigo-600 to-blue-800",
        category: "devops",
        tags: ["Kubernetes", "k8s", "DevOps", "Deployments"],
        rating: 4.6,
        users: "Popular",
        difficulty: "Intermediate",
        features: ["Official Tutorial", "Core Concepts", "Hands-on"],
        bestFor: "Deploying scalable services",
        isFree: true,
        type: "Docs",
        timeToStart: "1h",
    },

    // ─── Data / ML ───
    {
        id: "kaggle-learn",
        name: "Kaggle Learn",
        description: "Short, practical micro-courses on ML, Python, Pandas.",
        longDescription: "Fast micro-courses with exercises: Python, Pandas, SQL, ML, feature engineering, and model validation. Great for engineering students.",
        url: "https://www.kaggle.com/learn",
        logo: "KG",
        logoUrl: "https://logo.clearbit.com/kaggle.com",
        gradient: "from-sky-500 to-cyan-600",
        category: "data",
        tags: ["Python", "Pandas", "ML", "SQL"],
        rating: 4.7,
        users: "Millions",
        difficulty: "Beginner",
        features: ["Micro Courses", "Exercises", "Certificates", "Projects"],
        bestFor: "Starting ML in a structured way",
        isFree: true,
        type: "Course",
        timeToStart: "1h",
    },
    {
        id: "fastai-course",
        name: "fast.ai Practical Deep Learning",
        description: "Build deep learning models with practical approach.",
        longDescription: "One of the best practical deep learning courses: build models quickly, understand what works, and apply it to real datasets.",
        url: "https://course.fast.ai",
        logo: "FA",
        logoUrl: "https://logo.clearbit.com/fast.ai",
        gradient: "from-fuchsia-600 to-purple-700",
        category: "data",
        tags: ["Deep Learning", "PyTorch", "Course", "Projects"],
        rating: 4.8,
        users: "Popular",
        difficulty: "Intermediate",
        features: ["Practical", "Projects", "PyTorch", "Community"],
        bestFor: "Hands-on DL projects for resume",
        isFree: true,
        type: "Course",
        timeToStart: "1d",
    },

    // ─── Cybersecurity ───
    {
        id: "tryhackme",
        name: "TryHackMe",
        description: "Beginner-friendly cybersecurity labs and guided learning paths.",
        longDescription: "Hands-on labs for cyber fundamentals, web security, Linux, networking, and blue/red team basics with guided rooms.",
        url: "https://tryhackme.com",
        logo: "THM",
        logoUrl: "https://logo.clearbit.com/tryhackme.com",
        gradient: "from-rose-600 to-red-700",
        category: "security",
        tags: ["Cybersecurity", "Labs", "Networking", "Linux"],
        rating: 4.6,
        users: "2M+",
        difficulty: "Beginner",
        features: ["Hands-on Labs", "Guided Paths", "CTF Rooms", "Progress"],
        bestFor: "Starting cybersecurity with practice",
        isFree: false,
        type: "Platform",
        timeToStart: "1h",
    },
    {
        id: "owasp-top10",
        name: "OWASP Top 10",
        description: "Most important web app security risks and mitigations.",
        longDescription: "Industry standard list of web security risks. Learn the vulnerabilities, examples, and remediation patterns to build secure apps.",
        url: "https://owasp.org/www-project-top-ten/",
        logo: "OW",
        logoUrl: "https://logo.clearbit.com/owasp.org",
        gradient: "from-rose-600 to-red-600",
        category: "security",
        tags: ["OWASP", "Web Security", "Vulnerabilities", "Secure Coding"],
        rating: 4.7,
        users: "Standard",
        difficulty: "All Levels",
        features: ["Best Practices", "Risk List", "Mitigations", "Examples"],
        bestFor: "Secure coding + interviews",
        isFree: true,
        type: "Docs",
        timeToStart: "15m",
    },
];

// ─── Typewriter Component ───────────────────────────────────────────────
function TypewriterText({ text, speed = 40, delay = 0, className = "" }: { text: string; speed?: number; delay?: number; className?: string }) {
    const [index, setIndex] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
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
    }, [text, speed, delay, isInView]);

    return (
        <span ref={ref} className={className}>
            {text.slice(0, index)}
            {index < text.length && <span className="animate-pulse">|</span>}
        </span>
    );
}

// ─── Stat Cards ──────────────────────────────────────────────────────────
const QUICK_STATS = [
    { label: "Platforms Integrated", value: "24+", icon: Globe, gradient: "from-blue-500 to-cyan-500" },
    { label: "Practice Problems", value: "50K+", icon: Code, gradient: "from-green-500 to-emerald-500" },
    { label: "Mock Interviews", value: "Live", icon: Users, gradient: "from-purple-500 to-pink-500" },
    { label: "Success Rate", value: "95%", icon: Target, gradient: "from-orange-500 to-red-500" },
];

// ─── Platform Logo Component ─────────────────────────────────────────────
function PlatformLogo({ platform }: { platform: Platform }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [logoSrc, setLogoSrc] = useState<string | null>(() => {
        if (platform.logoUrl) return platform.logoUrl;
        try {
            const url = new URL(platform.url);
            return `https://logo.clearbit.com/${url.hostname}`;
        } catch {
            return null;
        }
    });

    const initials =
        platform.logo && platform.logo.length <= 3
            ? platform.logo.toUpperCase()
            : platform.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 3)
                .toUpperCase();

    if (!logoSrc) {
        return (
            <div className={`w-full h-full flex items-center justify-center overflow-hidden`}>
                <span className={`text-lg font-black ${isDark ? "text-white" : "text-slate-900"}`}>{initials}</span>
            </div>
        );
    }




    return (
        <img
            src={logoSrc}
            alt={`${platform.name} logo`}
            className="w-full h-full object-contain"
            onError={() => {
                if (logoSrc.includes("logo.clearbit.com")) {
                    try {
                        const url = new URL(platform.url);
                        setLogoSrc(`https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`);
                        return;
                    } catch { }
                }
                setLogoSrc(null);
            }}
        />

    );
}

// ─── Platform Card ──────────────────────────────────────────────────────
function PlatformCard({ platform, isDark }: { platform: Platform; isDark: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group"
        >
            <div className={`relative rounded-2xl overflow-hidden border transition-all duration-500 h-full flex flex-col ${isDark
                ? "bg-white/[0.03] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06]"
                : "bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10"
                }`}>
                {/* Top gradient accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${platform.gradient}`} />

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110`}>
                                <PlatformLogo platform={platform} />
                            </div>


                            <div>
                                <h3 className={`text-base font-black ${isDark ? "text-white" : "text-slate-900"} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                                    {platform.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(platform.rating) ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                                        ))}
                                    </div>
                                    <span className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{platform.rating}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {platform.isFree ? (
                                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 font-black text-[10px] uppercase tracking-widest border-green-500/20">Free</Badge>
                            ) : (
                                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest border-amber-500/20">Freemium</Badge>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {platform.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1 content-start">
                        {platform.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${isDark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                                {tag}
                            </span>
                        ))}
                        {platform.tags.length > 3 && (
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${isDark ? "bg-white/5 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                                +{platform.tags.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <Users className={`w-3.5 h-3.5 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
                                <span className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{platform.users}</span>
                            </div>
                            <Badge variant="outline" className={`text-[9px] font-bold px-1.5 py-0 ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                                {platform.difficulty}
                            </Badge>
                        </div>
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                size="sm"
                                className={`h-8 px-4 rounded-xl font-black text-[10px] uppercase tracking-wider gap-2 transition-all group-hover:scale-105 ${isDark
                                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                    : "bg-slate-900 hover:bg-blue-600 text-white shadow-md"
                                    }`}
                            >
                                Practice
                                <ExternalLink className="w-3 h-3" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────
interface AssessmentHubProps {
    isDashboard?: boolean;
    onBack?: () => void;
}

const AssessmentHub: React.FC<AssessmentHubProps> = ({ isDashboard = false, onBack }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState<Platform["difficulty"] | "Any">("Any");
    const [typeFilter, setTypeFilter] = useState<Platform["type"] | "Any">("Any");
    const [freeOnly, setFreeOnly] = useState(false);
    const [sortBy, setSortBy] = useState<"rating" | "name">("rating");
    const [showFilters, setShowFilters] = useState(false);

    const filteredPlatforms = PLATFORMS.filter((p) => {
        const matchesCategory = activeCategory === "all" || p.category === activeCategory;
        const matchesSearch =
            searchQuery === "" ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "Any" || p.difficulty === difficultyFilter;
        const matchesType = typeFilter === "Any" || p.type === typeFilter;
        const matchesFree = !freeOnly || p.isFree;
        return matchesCategory && matchesSearch && matchesDifficulty && matchesType && matchesFree;
    }).sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        // rating
        return (b.rating || 0) - (a.rating || 0);
    });

    return (
        <div className={`${isDashboard ? "" : "min-h-dvh overflow-x-hidden"} ${isDark ? "" : ""}`}>


            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {QUICK_STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-2xl p-4 flex items-center gap-3 border transition-all hover:scale-[1.02] ${isDark
                            ? "bg-white/[0.03] border-white/[0.06] hover:border-white/15"
                            : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className={`rounded-2xl p-4 mb-6 border ${isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search platforms, skills, or tags..."
                            className={`w-full pl-10 pr-4 py-3 rounded-xl font-semibold text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${isDark
                                ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                                }`}
                        />
                    </div>

                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
                            showFilters 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                            : isDark ? "bg-white/5 text-slate-300 border border-white/10" : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                    >
                        <Filter className={`w-4 h-4 ${showFilters ? "animate-pulse" : ""}`} />
                        <span>Filters ({filteredPlatforms.length})</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showFilters ? "rotate-90" : "rotate-0"}`} />
                    </button>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <label className="flex flex-col gap-1.5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Difficulty</span>
                                    <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as any)}>
                                        <SelectTrigger className={`h-11 rounded-xl text-sm font-semibold border outline-none transition-all ${isDark
                                            ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/40"
                                            : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/20"
                                            }`}>
                                            <SelectValue placeholder="Select Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Any">Any</SelectItem>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                            <SelectItem value="All Levels">All Levels</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </label>

                                <label className="flex flex-col gap-1.5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Type</span>
                                    <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                                        <SelectTrigger className={`h-11 rounded-xl text-sm font-semibold border outline-none transition-all ${isDark
                                            ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/40"
                                            : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/20"
                                            }`}>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Any">Any</SelectItem>
                                            <SelectItem value="Platform">Platform</SelectItem>
                                            <SelectItem value="Course">Course</SelectItem>
                                            <SelectItem value="Docs">Docs</SelectItem>
                                            <SelectItem value="Sheet">Sheet</SelectItem>
                                            <SelectItem value="Roadmap">Roadmap</SelectItem>
                                            <SelectItem value="Playlist">Playlist</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </label>

                                <div
                                    className={`flex items-center gap-3 h-11 px-4 rounded-xl border cursor-pointer select-none transition-all ${isDark
                                        ? "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
                                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                                        } lg:mt-6`}
                                    onClick={() => setFreeOnly(!freeOnly)}
                                >
                                    <Checkbox
                                        id="free-only"
                                        checked={freeOnly}
                                        onCheckedChange={(checked) => setFreeOnly(checked as boolean)}
                                        className="transition-all"
                                    />
                                    <label htmlFor="free-only" className="text-sm font-black cursor-pointer flex-1">Free only</label>
                                </div>

                                <label className="flex flex-col gap-1.5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>Sort</span>
                                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                                        <SelectTrigger className={`h-11 rounded-xl text-sm font-semibold border outline-none transition-all ${isDark
                                            ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/40"
                                            : "bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/20"
                                            }`}>
                                            <SelectValue placeholder="Sort By" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rating">Top rated</SelectItem>
                                            <SelectItem value="name">Name (A–Z)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </label>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${isActive
                                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-blue-500/20 scale-105`
                                : isDark
                                    ? "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
                                }`}
                        >
                            <cat.icon className="w-3.5 h-3.5" />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Platform Grid */}
            <AnimatePresence mode="wait">
                {filteredPlatforms.length > 0 ? (
                    <motion.div
                        key={activeCategory + searchQuery}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
                    >
                        {filteredPlatforms.map((platform) => (
                            <PlatformCard key={platform.id} platform={platform} isDark={isDark} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-center py-12 rounded-2xl border ${isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-slate-200"}`}
                    >
                        <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                        <h3 className={`text-lg font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>No platforms found</h3>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Try adjusting your search or filter criteria.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom CTA */}
            <div className={`mt-8 rounded-2xl p-6 sm:p-8 relative overflow-hidden ${isDark ? "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/5" : "bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-slate-200"}`}>
                <div className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" : ""}`} />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5">
                    <div>
                        <h3 className={`text-xl sm:text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"} tracking-tight`}>
                            Can't find what you need? 🤔
                        </h3>
                        <p className={`text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            Suggest a platform and we'll integrate it. We're building the most comprehensive preparation hub.
                        </p>
                    </div>
                    <Button
                        onClick={() => onBack?.()}
                        className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:opacity-90 transition-all gap-2 flex-shrink-0"
                    >
                        <FileText className="w-4 h-4" />
                        Share Feedback
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default AssessmentHub;
