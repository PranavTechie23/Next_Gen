import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    CheckCircle, Building2, Target, Check, Lightbulb, BookOpen,
    ExternalLink, Search, Code, ChevronRight, Filter
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// ─── Import Data ────────────────────────────────────────────────────────
import type { Company } from "@/data/companyProblemPools";
import { problemService } from "@/services/problemService";
import { Loader2 } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
    FAANG: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
    Product: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white",
    Service: "bg-gradient-to-r from-green-600 to-emerald-600 text-white",
    Finance: "bg-gradient-to-r from-amber-600 to-orange-600 text-white",
    Startup: "bg-gradient-to-r from-red-600 to-orange-600 text-white",
};

const TIER_TEXT_COLORS: Record<string, string> = {
    FAANG: "text-purple-600 dark:text-purple-400",
    Product: "text-blue-600 dark:text-blue-400",
    Service: "text-green-600 dark:text-green-400",
    Finance: "text-amber-600 dark:text-amber-400",
    Startup: "text-orange-600 dark:text-orange-400",
};


const DIFF_STYLES: Record<string, { bg: string; text: string }> = {
    Easy: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    Medium: { bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
    Hard: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
};

// ─── Typewriter Component (Looping) ───────────────────────────────────
function TypewriterText({ phrases, speed = 80, wait = 2000, className = "" }: { phrases: string[]; speed?: number; wait?: number; className?: string }) {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isDeleting && index < phrases[phraseIndex].length) {
                setIndex(prev => prev + 1);
            } else if (isDeleting && index > 0) {
                setIndex(prev => prev - 1);
            } else if (!isDeleting && index === phrases[phraseIndex].length) {
                setTimeout(() => setIsDeleting(true), wait);
            } else if (isDeleting && index === 0) {
                setIsDeleting(false);
                setPhraseIndex(prev => (prev + 1) % phrases.length);
            }
        }, isDeleting ? speed / 2 : speed);

        return () => clearTimeout(timeout);
    }, [index, isDeleting, phraseIndex, phrases, speed, wait]);

    return (
        <span className={className}>
            {phrases[phraseIndex].slice(0, index)}
            <span className="animate-pulse ml-0.5">|</span>
        </span>
    );
}

// ─── Company Logo Component ─────────────────────────────────────────────
const LOGO_MAP: Record<string, string> = {
    "Google": "google.com",
    "Amazon": "amazon.com",
    "Microsoft": "microsoft.com",
    "Meta": "meta.com",
    "Apple": "apple.com",
    "Netflix": "netflix.com",
    "Flipkart": "flipkart.com",
    "Uber": "uber.com",
    "Goldman Sachs": "goldmansachs.com",
    "J.P. Morgan": "jpmorgan.com",
    "JP Morgan": "jpmorgan.com",
    "Morgan Stanley": "morganstanley.com",
    "Adobe": "adobe.com",
    "Salesforce": "salesforce.com",
    "Barclays": "barclays.com",
    "TCS": "tcs.com",
    "TCS Digital": "tcs.com",
    "TCS Ninja": "tcs.com",
    "Infosys": "infosys.com",
    "Wipro": "wipro.com",
    "Cognizant": "cognizant.com",
    "Accenture": "accenture.com",
    "Capgemini": "capgemini.com",
    "Deloitte": "deloitte.com",
    "PhonePe": "phonepe.com",
    "Paytm": "paytm.com",
    "Zomato": "zomato.com",
    "Swiggy": "swiggy.com",
    "HCL Technologies": "hcltech.com",
    "Tech Mahindra": "techmahindra.com",
    "L & T Infotech": "lntinfotech.com",
    "LTI": "lntinfotech.com",
    "Mindtree": "mindtree.com",
    "Mphasis": "mphasis.com",
    "Hexaware": "hexaware.com",
    "Persistent": "persistent.com",
    "ZS Associates": "zs.com",
    "Media.net": "media.net",
    "PubMatic": "pubmatic.com",
    "Druva": "druva.com",
    "Icertis": "icertis.com",
    "Bajaj Finserv": "bajajfinserv.in",
    "Mastercard": "mastercard.com",
    "Visa": "visa.com",
    "American Express": "americanexpress.com",
    "Deutsche Bank": "db.com",
    "UBS": "ubs.com",
    "Credit Suisse": "credit-suisse.com",
    "Citi": "citigroup.com",
    "Wells Fargo": "wellsfargo.com",
    "Bank of America": "bankofamerica.com",
    "HSBC": "hsbc.com",
    "Standard Chartered": "sc.com",
    "BNY Mellon": "bnymellon.com",
    "BlackRock": "blackrock.com",
    "D. E. Shaw": "deshaw.com",
    "Arcesium": "arcesium.com",
    "Tower Research": "tower-research.com",
    "Graviton": "gravitonresearch.com",
    "Sprinklr": "sprinklr.com",
    "Zoho": "zoho.com",
    "Freshworks": "freshworks.com",
    "BrowserStack": "browserstack.com",
    "Dream11": "dream11.com",
    "InMobi": "inmobi.com",
    "Myntra": "myntra.com",
    "Nykaa": "nykaa.com",
    "Ola": "olacabs.com",
    "Oyo": "oyorooms.com",
    "Razorpay": "razorpay.com",
    "Udaan": "udaan.com",
    "ShareChat": "sharechat.com",
    "Cred": "cred.club",
    "Groww": "groww.in",
    "Zerodha": "zerodha.com",
    "Upstox": "upstox.com",
    "BharatPe": "bharatpe.com",
    "PolicyBazaar": "policybazaar.com",
    "Lenskart": "lenskart.com",
    "CarDekho": "cardekho.com",
    "Spinny": "spinny.com",
    "Cars24": "cars24.com",
    "PharmEasy": "pharmeasy.in",
    "1mg": "1mg.com",
    "Practo": "practo.com",
    "CureFit": "cure.fit",
    "Urban Company": "urbancompany.com",
    "Unacademy": "unacademy.com",
    "Byju's": "byjus.com",
    "Vedantu": "vedantu.com",
    "Toppr": "toppr.com",
    "Simplilearn": "simplilearn.com",
    "Great Learning": "mygreatlearning.com",
    "UpGrad": "upgrad.com",
    "Scaler": "scaler.com",
    "InterviewBit": "interviewbit.com",
    "LeetCode": "leetcode.com",
    "HackerRank": "hackerrank.com",
    "CodeChef": "codechef.com",
    "Codeforces": "codeforces.com",
    "GeeksforGeeks": "geeksforgeeks.org",
    "ElasticRun": "elastic.run",
    "eQ Technologic": "1eq.com",
    "Eumentis Cloud": "eumentis.com",
    "Extramarks Education": "extramarks.com",
    "GNS Engineering India": "gns-mbh.com",
    "Helpshift Technologies": "helpshift.com",
    "Hexaview Technologies": "hexaviewtech.com",
    "Fabric Inc": "fabric.inc",
    "EnthrallTech": "enthralltech.com",
    "Rakuten": "rakuten.com",
    "Delhivery": "delhivery.com",
    "Arista Networks": "arista.com",
    "Zocdoc": "zocdoc.com",
    "Siemens": "siemens.com",
    "Sophos": "sophos.com",
    "Vodafone": "vodafone.com",
    "TIBCO": "tibco.com",
    "Schlumberger": "slb.com",
    "Ciena": "ciena.com",
    "Veritas Technologies": "veritas.com",
    "MindTickle": "mindtickle.com",
    "Jio": "jio.com",
    "Jio Platforms": "jio.com",
    "Zensar": "zensar.com",
    "Coforge": "coforge.com",
    "LTIMindtree": "ltimindtree.com",
    "Societe Generale": "socgen.com",
    "IDFC FIRST Bank": "idfcfirstbank.com",
    "Worldline": "worldline.com",
    "FIS": "fisglobal.com",
    "Fiserv": "fiserv.com",
    "NCR Voyix": "ncrvoyix.com",
    "Diebold Nixdorf": "dieboldnixdorf.com",
    "Amdocs": "amdocs.com",
    "Cisco": "cisco.com",
    "Intel": "intel.com",
    "IBM": "ibm.com",
    "Oracle": "oracle.com",
    "SAP": "sap.com",
    "Dell": "dell.com",
    "HP": "hp.com",
    "Sony": "sony.com",
    "Samsung": "samsung.com",
    "Qualcomm": "qualcomm.com",
    "Nvidia": "nvidia.com",
    "Broadcom": "broadcom.com",
    "Texas Instruments": "ti.com",
    "VMware": "vmware.com",
    "Atlassian": "atlassian.com",
    "Twilio": "twilio.com",
    "Slack": "slack.com",
    "Zoom": "zoom.us",
    "Discord": "discord.com",
    "Spotify": "spotify.com",
    "Snap": "snapchat.com",
    "Pinterest": "pinterest.com",
    "Twitter": "twitter.com",
    "X": "x.com",
    "IndiaBix": "indiabix.com",
    "FreshersWorld": "freshersworld.com",
    "PrepInsta": "prepinsta.com",
    "Agiliad": "agiliad.com",
    "3EA": "3ea.in",
    "64squares": "64squares.com",
    "abs": "abs-solutions.com",
    "Aligned Automation": "alignedautomation.com",
    "Amura": "amuramarketing.com",
    "bizAmica Software": "bizamica.com",
    "BUDDI.AI": "buddi.ai",
    "CakeSoft Technologies": "cakesoft.com",
    "Centiro": "centiro.com",
    "Cloudwerx": "cloudwerx.tech",
    "Codevita Live": "codevita.live",
    "EPIKInDiFi": "epikindifi.com",
    "Flo Group": "flo-group.com",
    "Growisto": "growisto.com",
    "Infogen Labs": "infogenlabs.com",
    "IntegriChain": "integrichain.com",
    "iQ Digital": "iqdigital.com",
    "Jaro Education": "jaroeducation.com",
    "JISA Softech": "jisasoftech.com",
    "Jombay": "jombay.com",
    "K12 Techno Services": "k12techno.com",
    "Kylas": "kylas.io",
    "McKinley & Rice": "mckinleyrice.com",
    "Mindstix Software Labs": "mindstix.com",
    "Moxie": "moxie.ai",
    "oneXtel": "onextel.com",
    "PlanetSpark": "planetspark.in",
    "Product Dossier": "productdossier.com",
    "RackWare Technologies": "rackware.com",
    "Rayden Design": "raydendesign.com",
    "Red Panda": "redpanda.com",
    "RIA Advisory": "riaadvisory.com",
    "Rudder Analytics": "rudderanalytics.com",
    "Ryussi Technologies": "ryussi.com",
    "Sagitec": "sagitec.com",
    "Scalex Technology": "scalex.in",
    "Screen Magic": "gupshup.io",
    "SE2": "se2.com",
    "Sedemac Mechatronics": "sedemac.com",
    "TechVerito": "techverito.com",
    "Tracelink": "tracelink.com",
    "TripStack": "tripstack.com",
    "Vadini Infocenter": "vadiniinfocenter.com",
    "Valuence Holdings": "valuence.inc",
    "Vertical Fox": "verticalfox.com",
    "Wednesday Solutions": "wednesday.solutions",
    "Zlen": "zlen.io",
    "Coding Ninjas": "codingninjas.com",
    "NeetCode": "neetcode.io",
    "Take U Forward": "takeuforward.org",
    "CSES Problem Set": "cses.fi",
    "TLE Eliminators": "tle-eliminators.com",
    "AtCoder": "atcoder.jp"
};



// ─── Manual High-Quality Logos (Overrides) ──────────────────────────────
// Prefer local assets in /public/logos for reliability and performance.
const MANUAL_LOGOS: Record<string, string> = {
    "Google": "/logos/google.jpg",
    "Amazon": "/logos/amazon.jpg",
    "Meta": "/logos/meta.jpg",
    "Microsoft": "/logos/microsoft.png",
    "Netflix": "/logos/netflix_light.jpg",
    "Uber": "/logos/uber.jpg",
    "Stripe": "/logos/stripe.jpg",
    "Adobe": "/logos/adobe.jpg",
    "Goldman Sachs": "/logos/goldman.jpg",
    "J.P. Morgan": "/logos/morgan.jpg",
    "JP Morgan": "/logos/morgan.jpg",
    "Airbnb": "/logos/airbnb.jpg",
    // Add more mappings here as you add logo files
};

// ─── Logo Visibility Configuration ──────────────────────────────────────
const INVERT_IN_DARK = new Set(["Amazon", "Uber", "Tesla", "Sony", "Samsung", "HP", "Dell", "IBM", "Intel", "Cisco", "Oracle", "Fabric Inc", "GNS Engineering India"]);
const INVERT_IN_LIGHT = new Set(["Apple"]);

const CompanyLogo = ({ name, logoValue, textSize = "text-lg", padding = "p-2" }: { name: string; logoValue: string; textSize?: string; padding?: string }) => {
    // 1. Resolve domain from either explicit URL or known mapping
    const isExplicitUrl = logoValue.length > 5 && (logoValue.startsWith("http://") || logoValue.startsWith("https://"));

    let domain = "";
    if (isExplicitUrl) {
        // Try to extract domain from Clearbit URL
        const clearbitMatch = logoValue.match(/logo\.clearbit\.com\/([^/?]+)/i);
        if (clearbitMatch?.[1]) {
            domain = clearbitMatch[1];
        }
        // Fall back to our LOGO_MAP if we didn't get a domain
        if (!domain && LOGO_MAP[name]) {
            domain = LOGO_MAP[name];
        }
        // Last resort: derive from company name
        if (!domain) {
            domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
        }
    } else {
        if (LOGO_MAP[name]) {
            domain = LOGO_MAP[name];
        } else {
            domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
        }
    }

    // 2. Define Sources
    // Priority: Manual Override (local or curated) -> Explicit URL from data -> Clearbit -> Google Favicon

    const manualLogo = MANUAL_LOGOS[name];

    // Initial Source based on priority
    const getInitialSrc = () => {
        if (manualLogo) return manualLogo;
        if (isExplicitUrl) return logoValue;
        return `https://logo.clearbit.com/${domain}`;
    };

    const [src, setSrc] = useState(getInitialSrc());
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        // 1) If manual logo failed, nothing better to try
        if (src === manualLogo) {
            setHasError(true);
            return;
        }

        // 2) If explicit URL from data failed (e.g. Wikipedia / custom),
        //    try Clearbit as a fallback using the resolved domain.
        if (src === logoValue && isExplicitUrl) {
            if (domain) {
                const clearbitUrl = `https://logo.clearbit.com/${domain}`;
                if (src !== clearbitUrl) {
                    setSrc(clearbitUrl);
                    return;
                }
            }
        }

        // 3) If we were using Clearbit and it failed, try Google favicon.
        if (src.includes("logo.clearbit.com")) {
            if (domain) {
                setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
                return;
            }
        }

        // 4) As a final fallback, show stylized initials.
        setHasError(true);
    };

    if (hasError) {
        const fallbackText = isExplicitUrl ? name.substring(0, 1) : logoValue;
        return <span className={`text-white font-black drop-shadow-md ${textSize}`}>{fallbackText}</span>;
    }

    // Determine filter classes for theme visibility
    let filterClass = "";
    if (INVERT_IN_DARK.has(name)) {
        filterClass += " dark:brightness-0 dark:invert ";
    }
    if (INVERT_IN_LIGHT.has(name)) {
        // Base is White (e.g. Apple). Light mode: make Black. Dark mode: keep White.
        filterClass += " brightness-0 dark:filter-none dark:brightness-100 ";
    }

    return (
        <img
            src={src}
            alt={name}
            className={`w-full h-full object-contain ${padding} ${filterClass} transition-all duration-300`}
            onError={handleError}
            referrerPolicy="no-referrer"
            loading="lazy"
        />
    );
};

// ─── Main Component ─────────────────────────────────────────────────────
const WiseKit: React.FC<{ isDashboard?: boolean }> = ({ isDashboard = false }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // ─── State: Data ────────────────────────────────────────────────────
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    // ─── State: Preferences & Progress ──────────────────────────────────
    const [preferences, setPreferences] = useState<{
        role: string;
        tiers: string[];
        experience: string;
        onboarded: boolean;
    }>(() => {
        try { return JSON.parse(localStorage.getItem("cwk-prefs") || '{"role":"","tiers":[],"experience":"","onboarded":false}'); }
        catch { return { role: "", tiers: [], experience: "", onboarded: false }; }
    });

    const [showModal, setShowModal] = useState(!preferences.onboarded && !isDashboard);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [diffFilter, setDiffFilter] = useState<string>("all");
    const [topicFilter, setTopicFilter] = useState<string>("all");
    const [tierFilter, setTierFilter] = useState<string>("all");
    // How to order companies in the grid
    const [sortMode, setSortMode] = useState<"recommended" | "az" | "problems_desc" | "package_desc">("recommended");
    // Suggestion form state
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestionCompany, setSuggestionCompany] = useState<string>("");
    const [suggestionType, setSuggestionType] = useState<"tips" | "dos" | "donts" | "other">("tips");
    const [suggestionText, setSuggestionText] = useState("");
    const topRef = useRef<HTMLDivElement>(null);

    // Scroll to top when a company is selected
    useEffect(() => {
        if (selectedCompany) {
            // Instant scroll to top (no animation)
            topRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
            window.scrollTo(0, 0);
        }
    }, [selectedCompany]);

    // STORE PROBLEM TITLES instead of IDs for shared progress
    const [solvedTitles, setSolvedTitles] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem("cwk-solved-titles") || "[]")); }
        catch { return new Set(); }
    });

    // ─── Fetch Data ───────────────────────────────────────────────────
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await problemService.getAllCompanies();
                setCompanies(data);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setLoading(false);
            }
        };

        if (companies.length === 0) {
            loadData();
        }
    }, [companies.length]);

    useEffect(() => {
        localStorage.setItem("cwk-solved-titles", JSON.stringify(Array.from(solvedTitles)));
    }, [solvedTitles]);

    useEffect(() => {
        localStorage.setItem("cwk-prefs", JSON.stringify(preferences));
    }, [preferences]);

    const toggleSolved = (title: string) => {
        setSolvedTitles(prev => {
            const next = new Set(prev);
            next.has(title) ? next.delete(title) : next.add(title);
            return next;
        });
    };

    const company: Company | undefined = companies.find(c => c.id === selectedCompany);

    // ─── Dynamic Placeholder Hook ─────────────────────────────────────
    const searchPlaceholder = (() => {
        const phrases = ["Search by Company Name...", "Search for Specific Questions...", "Find FAANG Problems...", "Explore Startup Trends..."];
        const [pIdx, setPIdx] = useState(0);
        const [idx, setIdx] = useState(0);
        const [isDel, setIsDel] = useState(false);

        useEffect(() => {
            const timer = setTimeout(() => {
                if (!isDel && idx < phrases[pIdx].length) setIdx(i => i + 1);
                else if (isDel && idx > 0) setIdx(i => i - 1);
                else if (!isDel && idx === phrases[pIdx].length) setTimeout(() => setIsDel(true), 1500);
                else { setIsDel(false); setPIdx(p => (p + 1) % phrases.length); }
            }, isDel ? 40 : 80);
            return () => clearTimeout(timer);
        }, [idx, isDel, pIdx]);

        return phrases[pIdx].slice(0, idx);
    })();

    // ─── Filtering Logic ──────────────────────────────────────────────
    const filteredCompanies = useMemo(() => {
        // 1) Basic filtering by tier + search (Company Name OR Question Title)
        let list = companies.filter(c => {
            const matchesTier = tierFilter === "all" || c.tier === tierFilter;
            const searchTerm = search.toLowerCase();
            const matchesSearch = search === "" ||
                c.name.toLowerCase().includes(searchTerm) ||
                c.problems.some(p => p.title.toLowerCase().includes(searchTerm));

            return matchesTier && matchesSearch;
        });

        // 2) Sorting – dynamic but simple
        const safeList = [...list]; // avoid mutating derived arrays elsewhere

        // Helper: extract numeric part of avgPackage like "25 LPA"
        const getPackageValue = (pkg: string) => {
            const match = pkg?.toString().match(/[\d.]+/);
            return match ? parseFloat(match[0]) : 0;
        };

        if (sortMode === "az") {
            safeList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortMode === "problems_desc") {
            safeList.sort((a, b) => b.problems.length - a.problems.length);
        } else if (sortMode === "package_desc") {
            safeList.sort((a, b) => getPackageValue(b.avgPackage) - getPackageValue(a.avgPackage));
        } else {
            // "recommended" – prefer tiers the student picked in onboarding (FAANG/Product/etc.)
            safeList.sort((a, b) => {
                const aMatch = preferences.tiers.includes(a.tier) ? 1 : 0;
                const bMatch = preferences.tiers.includes(b.tier) ? 1 : 0;
                // If both equal on preference, fall back to name for stable ordering
                if (bMatch !== aMatch) return bMatch - aMatch;
                return a.name.localeCompare(b.name);
            });
        }

        return safeList;
    }, [tierFilter, search, sortMode, preferences, companies]);

    const filteredProblems = useMemo(() => {
        if (!company) return [];
        return company.problems.filter(p => {
            const matchesDiff = diffFilter === "all" || p.difficulty === diffFilter;
            const matchesTopic = topicFilter === "all" || p.topic === topicFilter;
            const matchesSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
            return matchesDiff && matchesTopic && matchesSearch;
        });
    }, [company, diffFilter, topicFilter, search]);

    const allTopics = useMemo(() => {
        if (!company) return [];
        return Array.from(new Set(company.problems.map(p => p.topic))).sort();
    }, [company]);

    // Use TITLE for checking solved status
    const solvedCount = company ? company.problems.filter(p => solvedTitles.has(p.title)).length : 0;
    // Calculate unique problems count across all companies
    const totalProblems = useMemo(() => new Set(companies.flatMap(c => c.problems.map(p => p.title))).size, [companies]);
    const uniqueSolvedCount = solvedTitles.size;

    const handleSubmitSuggestion = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            companyId: suggestionCompany || selectedCompany,
            type: suggestionType,
            text: suggestionText.trim(),
            submittedAt: new Date().toISOString(),
        };

        if (!payload.text) return;

        try {
            const existing = JSON.parse(localStorage.getItem("cwk-suggestions") || "[]");
            existing.push(payload);
            localStorage.setItem("cwk-suggestions", JSON.stringify(existing));
        } catch {
            // ignore errors, this is just a client-side stash
        }

        setShowSuggestion(false);
        setSuggestionText("");
    };

    // ─── Preferences Modal ─────────────────────────────────────────────
    const PreferencesModal = () => {
        const [localPrefs, setLocalPrefs] = useState(preferences);

        const toggleTier = (t: string) => {
            setLocalPrefs(prev => ({
                ...prev,
                tiers: prev.tiers.includes(t) ? prev.tiers.filter(x => x !== t) : [...prev.tiers, t]
            }));
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl ${isDark ? "bg-slate border border-white/10" : "bg-white"}`}>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Customize Your Goal</h2>
                        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Tell us what you're aiming for so we can personalize your roadmap.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Dream Companies (Select multiple)</label>
                            <div className="flex flex-wrap gap-2">
                                {["FAANG", "Product", "Service", "Finance", "Startup"].map(t => (
                                    <button key={t} onClick={() => toggleTier(t)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${localPrefs.tiers.includes(t)
                                            ? "bg-black-600 border-black-600 text-white shadow-md shadow-blue-500/20"
                                            : isDark ? "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Target Role</label>
                            <select value={localPrefs.role} onChange={e => setLocalPrefs({ ...localPrefs, role: e.target.value })}
                                className={`w-full px-4 py-3 rounded-xl text-sm font-bold outline-none border transition-all ${isDark ? "bg-white/5 border-white/10 text-white focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500"}`}>
                                <option value="" disabled>Select a role...</option>
                                <option value="SDE">Software Development Engineer (SDE)</option>
                                <option value="Data">Data Scientist / Analyst</option>
                                <option value="Web">Full Stack Web Developer</option>
                                <option value="QA">QA / Test Engineer</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Current Experience</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Beginner", "Intermediate", "Advanced"].map(l => (
                                    <button key={l} onClick={() => setLocalPrefs({ ...localPrefs, experience: l })}
                                        className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${localPrefs.experience === l
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : isDark ? "bg-white/5 border-white/10 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => { setPreferences({ ...localPrefs, onboarded: true }); setShowModal(false); }}
                        disabled={localPrefs.tiers.length === 0 || !localPrefs.role || !localPrefs.experience}
                        className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        Generate My Roadmap
                    </button>
                </motion.div>
            </div>
        );
    };

    // ─── Company Detail View ─────────────────────────────────────
    if (company) {
        const progress = company.problems.length > 0 ? Math.round((solvedCount / company.problems.length) * 100) : 0;
        const easyCount = company.problems.filter(p => p.difficulty === "Easy").length;
        const medCount = company.problems.filter(p => p.difficulty === "Medium").length;
        const hardCount = company.problems.filter(p => p.difficulty === "Hard").length;

        return (
            <div ref={topRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Back + Company Header */}
                <div className="mb-8">
                    <button onClick={() => { setSelectedCompany(null); setSearch(""); setDiffFilter("all"); setTopicFilter("all"); }}
                        className={`flex items-center gap-2 text-sm font-bold mb-6 transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Companies
                    </button>

                    <div className={`rounded-3xl p-6 sm:p-8 border ${isDark ? "bg-white/[0.03] border-white/[0.06]" : "bg-white border-slate-200 shadow-lg"}`}>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden`}>
                                <CompanyLogo name={company.name} logoValue={company.logo} textSize="text-2xl" padding="p-0" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{company.name}</h2>
                                    <Badge className={`${TIER_COLORS[company.tier]} font-black text-[10px] uppercase tracking-widest`}>{company.tier}</Badge>
                                </div>
                                <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}>{company.description}</p>
                                <div className="flex flex-wrap gap-3">
                                    <Badge variant="outline" className={`${isDark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600"} font-bold text-xs`}>
                                        💰 {company.avgPackage}
                                    </Badge>
                                    <Badge variant="outline" className={`${isDark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600"} font-bold text-xs`}>
                                        📝 {company.problems.length} Problems
                                    </Badge>
                                    <Badge variant="outline" className={`${isDark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600"} font-bold text-xs`}>
                                        ✅ {solvedCount} Solved
                                    </Badge>
                                </div>
                            </div>
                            {/* Progress Circle */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"} strokeWidth="8" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#prog)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${progress * 2.64} 264`} />
                                        <defs><linearGradient id="prog" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{progress}%</span>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Progress</span>
                            </div>
                        </div>

                        {/* Interview Rounds */}
                        <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Interview Process</p>
                            <div className="flex flex-wrap gap-2">
                                {company.interviewRounds.map((round, i) => (
                                    <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${isDark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-gradient-to-br ${company.gradient} text-white`}>{i + 1}</span>
                                        {round}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Breakdown */}
                        <div className={`mt-6 pt-6 border-t ${isDark ? "border-white/5" : "border-slate-100"} flex flex-wrap gap-4`}>
                            {[{ label: "Easy", count: easyCount, color: "bg-green-500" }, { label: "Medium", count: medCount, color: "bg-yellow-500" }, { label: "Hard", count: hardCount, color: "bg-red-500" }].map(d => (
                                <div key={d.label} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${d.color}`} />
                                    <span className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{d.label}: {d.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── INSIDE SCOOP: Tips & Resources ───────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {/* Interview Tips Card */}
                    <div className={`rounded-3xl p-6 sm:p-8 border h-full transition-all hover:shadow-lg ${isDark ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/30" : "bg-gradient-to-br from-amber-50 to-orange-50 border-orange-100 hover:border-orange-200"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 ${isDark ? "bg-amber-500/20 text-amber-400" : "bg-white text-orange-500"}`}>
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <h3 className={`text-xl font-black ${isDark ? "text-amber-100" : "text-slate-800"}`}>Interview Tips</h3>
                        </div>

                        {(company.interviewTips && company.interviewTips.length > 0) ? (
                            <ul className="space-y-4">
                                {company.interviewTips.map((tip, i) => (
                                    <li key={i} className="flex gap-3">
                                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-amber-500" : "bg-orange-500"}`} />
                                        <p className={`text-sm font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={`flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-2xl ${isDark ? "border-white/10" : "border-slate-200"}`}>
                                <p className={`text-sm font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>No specific tips available yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Resources Card */}
                    <div className={`rounded-3xl p-6 sm:p-8 border h-full transition-all hover:shadow-lg ${isDark ? "bg-blue-500/[0.03] border-blue-500/20 hover:border-blue-500/30" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-200"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ${isDark ? "bg-blue-500/20 text-blue-400" : "bg-white text-blue-600"}`}>
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className={`text-xl font-black ${isDark ? "text-blue-100" : "text-slate-800"}`}>Curated Resources</h3>
                        </div>

                        {(company.resources && company.resources.length > 0) ? (
                            <div className="grid gap-3">
                                {company.resources.map((res, i) => (
                                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${isDark
                                            ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30 text-slate-300 hover:text-white"
                                            : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-600 hover:text-blue-700"}`}>
                                        <span className="text-sm font-bold">{res.label}</span>
                                        <ExternalLink className={`w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${isDark ? "text-slate-500 group-hover:text-blue-400" : "text-slate-400 group-hover:text-blue-600"}`} />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className={`flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-2xl ${isDark ? "border-white/10" : "border-slate-200"}`}>
                                <p className={`text-sm font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}>No resources available yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className={`rounded-3xl p-5 mb-8 border flex flex-col md:flex-row gap-4 items-center ${isDark ? "bg-slate-900/40 border-white/[0.06] backdrop-blur-md" : "bg-white border-slate-200 shadow-sm"}`}>
                    <div className="relative flex-1 group w-full">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? "text-slate-500 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-600"}`} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search problems by name or topic..."
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-bold border transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDark ? "bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400"}`}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Select value={diffFilter} onValueChange={setDiffFilter}>
                            <SelectTrigger className={`h-11 px-5 min-w-[160px] rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${isDark ? "bg-white/[0.03] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent className={`border-none shadow-2xl rounded-2xl ${isDark ? "bg-slate-900 text-white border border-white/10" : "bg-white text-slate-900"}`}>
                                <SelectItem value="all" className="font-bold py-3 text-[10px] uppercase tracking-widest">All Difficulty</SelectItem>
                                <SelectItem value="Easy" className="font-bold py-3 text-[10px] uppercase tracking-widest text-green-500">Easy</SelectItem>
                                <SelectItem value="Medium" className="font-bold py-3 text-[10px] uppercase tracking-widest text-yellow-500">Medium</SelectItem>
                                <SelectItem value="Hard" className="font-bold py-3 text-[10px] uppercase tracking-widest text-red-500">Hard</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={topicFilter} onValueChange={setTopicFilter}>
                            <SelectTrigger className={`h-11 px-5 min-w-[180px] rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${isDark ? "bg-white/[0.03] border-white/10 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"}`}>
                                <SelectValue placeholder="Topic" />
                            </SelectTrigger>
                            <SelectContent className={`border-none shadow-2xl rounded-2xl max-h-[300px] ${isDark ? "bg-slate-900 text-white border border-white/10" : "bg-white text-slate-900"}`}>
                                <SelectItem value="all" className="font-bold py-3 text-[10px] uppercase tracking-widest">All Topics</SelectItem>
                                {allTopics.map(t => (
                                    <SelectItem key={t} value={t} className="font-bold py-3 text-[10px] uppercase tracking-widest">
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Problem Table */}
                <div className={`rounded-3xl border overflow-hidden ${isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-slate-200 shadow-sm"}`}>
                    <div className={`grid grid-cols-[40px_1fr_100px_100px_80px_80px] gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest ${isDark ? "bg-white/[0.03] text-slate-400 border-b border-white/5" : "bg-slate-50 text-slate-500 border-b border-slate-100"}`}>
                        <span className="flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                        <span>Problem</span>
                        <span>Difficulty</span>
                        <span>Topic</span>
                        <span>Freq</span>
                        <span>Link</span>
                    </div>

                    {filteredProblems.length > 0 ? filteredProblems.map((p) => {
                        const isSolved = solvedTitles.has(p.title);
                        const diff = DIFF_STYLES[p.difficulty];
                        return (
                            <div key={p.id} className={`grid grid-cols-[40px_1fr_100px_100px_80px_80px] gap-2 px-5 py-3.5 items-center transition-all ${isDark ? "hover:bg-white/[0.03] border-b border-white/[0.03]" : "hover:bg-slate-50 border-b border-slate-50"} ${isSolved ? (isDark ? "bg-green-500/5" : "bg-green-50/50") : ""}`}>
                                <button onClick={() => toggleSolved(p.title)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mx-auto ${isSolved ? "bg-green-500 text-white shadow-md shadow-green-500/30" : isDark ? "border border-white/15 hover:border-green-500/50 text-transparent hover:text-green-400" : "border border-slate-200 hover:border-green-500 text-transparent hover:text-green-500"}`}>
                                    <Check className="w-3.5 h-3.5" />
                                </button>
                                <span className={`text-sm font-bold truncate ${isSolved ? (isDark ? "text-slate-500 line-through" : "text-slate-400 line-through") : (isDark ? "text-white" : "text-slate-900")}`}>{p.title}</span>
                                <Badge className={`${diff.bg} ${diff.text} font-black text-[10px] uppercase w-fit`}>{p.difficulty}</Badge>
                                <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>{p.topic}</span>
                                <span className={`text-xs font-bold ${p.frequency === "High" ? "text-red-500" : p.frequency === "Medium" ? "text-yellow-500" : "text-slate-400"}`}>{p.frequency || "—"}</span>
                                <a href={p.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-xs font-bold transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}>
                                    Solve <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-16">
                            <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-slate-600" : "text-slate-300"}`} />
                            <p className={`font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>No problems match your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── Loading State ────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className={`p-4 rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                    <Loader2 className={`w-8 h-8 animate-spin ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                </div>
                <p className={`font-bold animate-pulse ${isDark ? "text-slate-500" : "text-slate-400"}`}>Fetching latest problems...</p>
            </div>
        );
    }

    // ─── Company List View ────────────────────────────────────────
    return (
        <div>
            {/* Suggestion modal */}
            {showSuggestion && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className={`w-[min(100%-2rem,720px)] max-w-2xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl ${isDark ? "bg-black border border-white/10" : "bg-white border border-slate-200"}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Suggest Company Insight</h2>
                                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                    Share interview tips, do&apos;s & don&apos;ts, or any helpful notes for this company.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSuggestion(false)}
                                className={`text-xs font-bold px-2 py-1 rounded-lg ${isDark ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"}`}
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                            <div className="space-y-1">
                                <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    Company (optional)
                                </label>
                                <Select
                                    value={suggestionCompany || selectedCompany || ""}
                                    onValueChange={setSuggestionCompany}
                                >
                                    <SelectTrigger className={isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-800"}>
                                        <SelectValue placeholder={companies.find(c => c.id === (suggestionCompany || selectedCompany))?.name || "Select a company"} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-64">
                                        {companies.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    What are you sharing?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: "tips", label: "Interview Tips" },
                                        { id: "dos", label: "Do's" },
                                        { id: "donts", label: "Don'ts" },
                                        { id: "other", label: "Other" },
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setSuggestionType(opt.id as typeof suggestionType)}
                                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${suggestionType === opt.id
                                                ? "bg-black-600 border-black-600 text-white"
                                                : isDark
                                                    ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                                    Your suggestion
                                </label>
                                <Textarea
                                    value={suggestionText}
                                    onChange={e => setSuggestionText(e.target.value)}
                                    rows={4}
                                    placeholder="Example: In Round 2 they focused a lot on system design for payment flows. Make sure you know ACID, isolation levels, and high-level architecture."
                                    className={isDark ? "bg-white/5 border-white/10 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowSuggestion(false)}
                                    className={isDark ? "border-white/10 text-slate-200" : ""}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!suggestionText.trim()}
                                    className="font-bold"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="max-w-2xl text-center md:text-left">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                        <TypewriterText
                            phrases={[
                                "Target any company — Ace your interviews.",
                                "Search by Company Name or Questions.",
                                "Track progress & ace placements.",
                                "Curated FAANG & Product resources."
                            ]}
                            speed={50}
                            wait={3000}
                            className={`text-xl sm:text-2xl lg:text-3xl font-black leading-tight bg-gradient-to-r ${isDark ? "from-blue-300 via-purple-300 to-pink-300" : "from-blue-600 via-purple-600 to-pink-600"} bg-clip-text text-transparent`}
                        />
                    </motion.div>
                    {preferences.onboarded && (
                        <div className={`mt-3 inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black border items-center gap-2 uppercase tracking-widest ${isDark ? "bg-white/5 border-white/10 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}>
                            <span>Target: {preferences.tiers.join(" • ")}</span>
                            <button onClick={() => setShowModal(true)} className="text-blue-500 hover:underline">Edit</button>
                        </div>
                    )}
                </div>
                {/* Suggestion button */}
                <button
                    onClick={() => setShowSuggestion(true)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm
                    ${isDark ? "bg-white/5 border-white/10 text-slate-100 hover:bg-white/10" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"}`}
                >
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    Suggest Insight
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Companies", value: companies.length.toString(), icon: Building2, gradient: "from-blue-500 to-cyan-500", glow: "group-hover:bg-blue-500/10" },
                    { label: "Total Problems", value: totalProblems.toString(), icon: Code, gradient: "from-emerald-500 to-teal-500", glow: "group-hover:bg-emerald-500/10" },
                    { label: "Unique Solved", value: uniqueSolvedCount.toString(), icon: CheckCircle, gradient: "from-purple-500 to-indigo-500", glow: "group-hover:bg-purple-500/10" },
                    { label: "Completion Rate", value: `${totalProblems > 0 ? Math.round((uniqueSolvedCount / totalProblems) * 100) : 0}%`, icon: Target, gradient: "from-orange-500 to-rose-500", glow: "group-hover:bg-orange-500/10" },
                ].map(s => (
                    <div key={s.label} className={`group rounded-2xl p-5 flex items-center gap-4 border transition-all hover:scale-[1.02] relative overflow-hidden ${isDark ? "bg-white/[0.03] border-white/[0.06] hover:border-white/10" : "bg-white border-slate-200 shadow-sm hover:shadow-md"}`}>
                        <div className={`absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 ${s.glow}`} />
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg relative z-10`}><s.icon className="w-5 h-5 text-white" /></div>
                        <div className="relative z-10">
                            <p className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{s.value}</p>
                            <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-500"}`}>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Tier Filter + Sort (SINGLE LINE CONSOLIDATED) */}
            <div className="flex flex-col items-center mb-10">
                <div className={`w-full max-w-7xl rounded-[40px] md:rounded-full p-2 md:p-3 border flex flex-col lg:flex-row items-center gap-4 ${isDark ? "bg-slate-950/60 border-white/[0.08] backdrop-blur-xl shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/40"}`}>

                    {/* Search Input (Narrower) */}
                    <div className="relative group w-full lg:w-72 pl-2">
                        <Search className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isDark ? "text-slate-500 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-600"}`} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className={`w-full pl-12 pr-4 py-3 rounded-full text-sm font-bold border transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${isDark ? "bg-white/[0.03] border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500/50" : "bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400"}`}
                        />
                    </div>

                    {/* Tier Filters (Center) */}
                    <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 px-4">
                        {["all", "Product", "Finance", "Service", "Startup"].map(t => {
                            const isActive = tierFilter === t;
                            const tierColors: Record<string, string> = {
                                Product: "hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400",
                                Finance: "hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400",
                                Service: "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400",
                                Startup: "hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400",
                                all: "hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400"
                            };
                            const tierGrads: Record<string, string> = {
                                FAANG: "from-purple-600 to-indigo-600",
                                Product: "from-blue-600 to-cyan-600",
                                Finance: "from-amber-500 to-orange-500",
                                Service: "from-emerald-600 to-teal-600",
                                Startup: "from-rose-600 to-pink-600",
                                all: "from-indigo-600 to-blue-600"
                            };

                            return (
                                <button
                                    key={t}
                                    onClick={() => setTierFilter(t)}
                                    className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden group/btn ${isActive
                                            ? "text-white shadow-lg z-10"
                                            : `${tierColors[t]} ${isDark ? "text-slate-400" : "text-slate-500"}`
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 bg-gradient-to-r ${tierGrads[t] || "from-blue-600 to-indigo-600"}`}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{t === "all" ? "Explore All" : t}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort (Right) */}
                    <div className="flex items-center gap-3 pr-4">
                        <span className={`hidden xl:inline text-[11px] font-black uppercase tracking-widest ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                            Sort by
                        </span>
                        <Select value={sortMode} onValueChange={value => setSortMode(value as typeof sortMode)}>
                            <SelectTrigger className={`h-11 px-5 min-w-[200px] rounded-full text-[11px] font-black uppercase tracking-widest border border-transparent transition-all ${isDark ? "bg-white/[0.03] text-slate-100 hover:border-white/10" : "bg-slate-50 text-slate-800 hover:bg-white hover:border-slate-200"}`}>
                                <SelectValue placeholder="Recommended" />
                            </SelectTrigger>
                            <SelectContent className={`border-none shadow-2xl rounded-2xl ${isDark ? "bg-slate-900 text-white border border-white/10" : "bg-white text-slate-900"}`}>
                                <SelectItem value="recommended" className="font-bold py-3 text-[11px] uppercase tracking-widest">Recommended</SelectItem>
                                <SelectItem value="az" className="font-bold py-3 text-[11px] uppercase tracking-widest">Alphabetical (A–Z)</SelectItem>
                                <SelectItem value="problems_desc" className="font-bold py-3 text-[11px] uppercase tracking-widest">Total Problems</SelectItem>
                                <SelectItem value="package_desc" className="font-bold py-3 text-[11px] uppercase tracking-widest">Highest Package</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Company Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredCompanies.map(c => {
                    const cSolved = c.problems.filter(p => solvedTitles.has(p.title)).length;
                    const cProgress = c.problems.length > 0 ? Math.round((cSolved / c.problems.length) * 100) : 0;
                    // Check if company matches preferences
                    const isRecommended = preferences.tiers.includes(c.tier);

                    return (
                        <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
                            onClick={() => { setSelectedCompany(c.id); setSearch(""); setDiffFilter("all"); setTopicFilter("all"); }}
                            className={`cursor-pointer rounded-3xl border overflow-hidden transition-all group relative ${isRecommended ? (isDark ? "border-blue-500/30" : "border-blue-200") : (isDark ? "border-white/[0.06]" : "border-slate-200")} ${isDark ? "bg-white/[0.03] hover:border-white/20" : "bg-white hover:border-blue-300 hover:shadow-xl"}`}>

                            {isRecommended && tierFilter === 'all' && search === '' && (
                                <div className="absolute top-3 left-3 z-10">
                                    <Badge className="bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest shadow-md border-0">Recommended</Badge>
                                </div>
                            )}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${c.gradient} opacity-80`} />
                            <div className="p-5 flex flex-col h-full relative">
                                <div className="absolute top-4 right-4 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                                    Solve Now →
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-14 h-14 min-w-[3.5rem] rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 overflow-hidden`}>
                                        <CompanyLogo name={c.name} logoValue={c.logo} padding="p-0" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className={`text-lg font-black leading-tight mb-1 group-hover:text-blue-500 transition-colors ${isDark ? "text-white" : "text-slate-900"}`}>{c.name}</h3>
                                        <Badge variant="secondary" className={`w-fit bg-opacity-10 dark:bg-opacity-20 hover:bg-opacity-20 px-2.5 py-1 h-auto text-[10px] font-extrabold uppercase tracking-wider border-0 ${TIER_TEXT_COLORS[c.tier] || "text-slate-500"}`}>
                                            {c.tier}
                                        </Badge>
                                    </div>
                                </div>

                                <p className={`text-xs line-clamp-2 mb-6 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{c.description}</p>

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                                                <Code className="w-3 h-3 text-blue-500" />
                                                <span className={`text-[10px] font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>{c.problems.length} Qs</span>
                                            </div>
                                            {cSolved > 0 && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10">
                                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400">{cSolved} done</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs font-black ${cProgress === 100 ? "text-green-500" : isDark ? "text-slate-500" : "text-slate-400"}`}>{cProgress}%</span>
                                    </div>
                                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                                        <div className={`h-full rounded-full bg-gradient-to-r ${c.gradient} transition-all duration-500 ease-out`} style={{ width: `${cProgress}%` }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default WiseKit;
