import { Company, mkSvc, mkStart, mkProd, mkFin } from "./companyProblemPools";

// ─── Service + Startup + Remaining Companies ────────────────────────────
export const OTHER_COMPANIES: Company[] = [
    // ═══ SERVICE COMPANIES ═══
    mkSvc("accenture", "Accenture", "https://logo.clearbit.com/accenture.com", "from-purple-600 to-purple-500", "Global IT services, consulting & outsourcing", "₹4-8 LPA", 0, ["Cognitive & Technical", "Coding Round", "Communication Round", "Technical & HR Interview"],

        [
            "Cognitive round is high-elimination; practice 'Pseudocode' and 'Abstract Reasoning' samples.",
            "Communication round is AI-based (Versant style). Repeat sentences clearly and stay audible.",
            "Technical interviews at Accenture often focus heavily on your Resume/Project description."
        ],
        [
            { label: "Accenture Recruitment Process", url: "https://www.accenture.com/in-en/careers/local/recruitment-process-india" },
            { label: "GFG Accenture Prep", url: "https://www.geeksforgeeks.org/accenture-recruitment-process/" }
        ]
    ),
    mkSvc("cognizant", "Cognizant", "https://logo.clearbit.com/cognizant.com", "from-blue-600 to-blue-500", "IT services, consulting and digital transformation", "₹4-8 LPA", 1, ["Skill Based Assessment", "Technical Interview", "HR Round"],
        [
            "GenC vs GenC Next: Prepare for competitive coding if you're aiming for the 'Next' track (higher package).",
            "Be strong in OOPS concepts and SQL queries; they are GenC favorites.",
            "Explain your project's architecture clearly using the STAR method."
        ],
        [
            { label: "Cognizant Careers India", url: "https://www.cognizant.com/in/en/careers" },
            { label: "PrepInsta Cognizant Guide", url: "https://prepinsta.com/cognizant/interview-preparation/" }
        ]
    ),
    mkSvc("capgemini", "Capgemini", "https://logo.clearbit.com/capgemini.com", "from-blue-700 to-indigo-500", "Global IT consulting and technology services", "₹4-7 LPA", 2, ["Aptitude & Game-based", "Coding Round", "Technical Interview", "HR Round"],
        [
            "Game-based aptitude is unique; practice grid-matching and number-sequence games.",
            "Expect pseudo-code questions in the assessment — they test your dry-run skills.",
            "Discussion on 'Latest Tech Trends' (Cloud, AI) is common in Technical rounds."
        ],
        [
            { label: "Capgemini Recruitment Portfolio", url: "https://www.capgemini.com/in-en/careers/recruitment-process/" },
            { label: "PrepInsta Capgemini Guide", url: "https://prepinsta.com/capgemini/interview-preparation/" }
        ]
    ),
    mkSvc("hcl", "HCL Technologies", "https://logo.clearbit.com/hcltech.com", "from-blue-600 to-blue-400", "IT services, engineering and R&D company", "₹4-7 LPA", 0, ["Online Test", "Technical Interview", "HR Round"],
        [
            "Focus on 'Computer Fundamentals' (OS, Networking) — they feature heavily in the assessment.",
            "HCL often asks about specific service lines (Engineering vs IT). Know which one you're interviewing for.",
            "Communication is key; maintain a professional tone throughout the AI-proctored test."
        ],
        [
            { label: "HCLTech Careers", url: "https://www.hcltech.com/careers" }
        ]
    ),
    mkSvc("hexaware", "Hexaware Technologies", "https://logo.clearbit.com/hexaware.com", "from-blue-500 to-cyan-500", "IT and BPO services company", "₹4-7 LPA", 1),
    mkSvc("ltinfotech", "L&T Infotech", "https://logo.clearbit.com/ltimindtree.com", "from-orange-600 to-yellow-500", "Global technology consulting and digital solutions", "₹5-9 LPA", 2, ["Online Assessment", "Technical Round", "HR Round"],
        [
            "LTIMindtree's assessment is long (120+ mins); build endurance and focus.",
            "Technical round focuses on OOPs and DBMS. Practice 'Normalization' and 'Joins'.",
            "Be ready to explain every single project and internship in your resume in detail."
        ],
        [
            { label: "LTIMindtree Careers", url: "https://www.ltimindtree.com/careers/" }
        ]
    ),
    mkSvc("persistent", "Persistent Systems", "https://logo.clearbit.com/persistent.com", "from-orange-600 to-red-500", "Digital engineering and enterprise modernization", "₹5-12 LPA", 0, ["Aptitude Test", "Technical Round 1", "Technical Round 2", "HR Round"],
        [
            "Strong Java/C++ fundamentals are mandatory. Expect questions on 'Java Memory Model' or 'Pointers'.",
            "If you clear the 'Super Achiever' test, you can double your package offer.",
            "Focus on your Final Year Project's technical architecture."
        ],
        [
            { label: "Persistent Recruitment", url: "https://www.persistent.com/careers/" }
        ]
    ),
    mkSvc("atos", "Atos", "https://logo.clearbit.com/atos.net", "from-blue-700 to-blue-500", "Digital transformation and IT services", "₹4-8 LPA", 1),
    mkSvc("nttdata", "NTT Data", "https://logo.clearbit.com/nttdata.com", "from-blue-600 to-indigo-500", "Global IT services and consulting", "₹4-8 LPA", 2),
    mkSvc("quantiphi", "Quantiphi", "https://logo.clearbit.com/quantiphi.com", "from-blue-600 to-indigo-400", "AI-first digital engineering company", "₹6-12 LPA", 0, ["Online Assessment", "Technical Interview 1", "Technical Interview 2", "HR"],
        [
            "Quantiphi is an AI company; know basic ML terminology even for SDE roles.",
            "Technical rounds involve solving DSA problems on a shared screen compiler.",
            "Be prepared to solve 'Guesstimates' or 'System Design' for data-heavy situations."
        ],
        [
            { label: "Quantiphi Careers", url: "https://quantiphi.com/careers/" }
        ]
    ),
    mkSvc("igt", "IGT Solutions", "https://logo.clearbit.com/igtsolutions.com", "from-blue-500 to-blue-400", "Customer experience and digital services", "₹3-6 LPA", 1),
    mkSvc("zsassociates", "ZS Associates", "https://logo.clearbit.com/zs.com", "from-red-600 to-red-400", "Global professional services firm — consulting & analytics", "₹8-16 LPA", 2, ["Online Test", "Video Assessment", "Case Study Round", "EBI Interview"],
        [
            "Case Study round is the MOST important. Practice analyzing charts and Guesstimates.",
            "The Video assessment (PSDD) requires you to speak clearly with very short prep time.",
            "Expect brain-teasers and high-level analytical puzzles throughout the process."
        ],
        [
            { label: "ZS Careers India", url: "https://www.zs.com/careers/india" }
        ]
    ),
    mkSvc("ezest", "e-Zest", "https://logo.clearbit.com/e-zest.com", "from-orange-500 to-amber-500", "Digital engineering and IT services", "₹4-7 LPA", 0),
    mkSvc("codenation", "Code Nation", "https://logo.clearbit.com/codenation.co.in", "from-purple-600 to-indigo-500", "Coding education and tech talent pipeline", "₹4-8 LPA", 1),
    mkSvc("inteliment", "Inteliment", "https://logo.clearbit.com/inteliment.com", "from-blue-600 to-blue-400", "Data analytics and cloud services", "₹4-8 LPA", 2),

    // ═══ SERVICE — TCS Tracks ═══
    mkSvc("tcsdigital", "TCS Digital", "https://logo.clearbit.com/tcs.com", "from-blue-600 to-blue-400", "TCS premium hiring — digital & innovation roles", "₹7-11 LPA", 0, ["TCS NQT (Advanced)", "Technical Interview", "Managerial", "HR"],
        [
            "Advanced NQT coding questions often involve DP or Graph — don't settle for basic logic.",
            "In the Managerial round, expect situational questions like 'How do you handle a toxic teammate?'.",
            "Knowledge of modern tech like GenAI, Blockchain, or Cloud gives you a massive edge."
        ],
        [
            { label: "TCS NextStep Portal", url: "https://nextstep.tcs.com/" },
            { label: "Striver's TCS NQT Sheet", url: "https://takeuforward.org/tcs-nqt-preparation-sheet/" }
        ]
    ),
    mkSvc("tcsninja", "TCS Ninja", "https://logo.clearbit.com/tcs.com", "from-blue-500 to-sky-500", "TCS standard hiring — IT services roles", "₹3.5-7 LPA", 1, ["TCS NQT (Aptitude + Coding)", "Technical Interview", "HR"],
        [
            "Focus on Aptitude speed. TCS Ninja is often a game of clearing the cutoff in time.",
            "Prepare basic String/Array coding (Palindrome, Fibonacci, GCD).",
            "Be enthusiastic about being 'Trainable' and 'Open to relocate'."
        ],
        [
            { label: "TCS iON Hub", url: "https://www.tcsion.com/hub/national-qualifier-test/" }
        ]
    ),

    // ═══ SERVICE — Infosys & Wipro (custom data) ═══
    {
        id: "infosys", name: "Infosys", logo: "https://logo.clearbit.com/infosys.com", gradient: "from-blue-600 to-cyan-500",
        tier: "Service", description: "Global IT consulting and outsourcing company",
        avgPackage: "₹3.6-8 LPA",
        interviewRounds: ["InfyTQ / HackWithInfy", "Technical Round", "HR Round"],

        problems: [
            { id: "inf1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "inf2", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", frequency: "High", acceptance: "55.3%" },
            { id: "inf3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "inf4", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "inf5", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "inf6", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "inf7", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "Medium", acceptance: "70.9%" },
            { id: "inf8", title: "Sort Characters By Frequency", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/sort-characters-by-frequency/", frequency: "Medium", acceptance: "74.1%" },
            { id: "inf9", title: "Next Permutation", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/next-permutation/", frequency: "High", acceptance: "43.1%" },
            { id: "inf10", title: "Palindrome Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/palindrome-number/", frequency: "High", acceptance: "59.2%" },
            { id: "inf11", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", frequency: "High", acceptance: "60.4%" },
            { id: "inf12", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "inf13", title: "Reverse String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/reverse-string/", frequency: "High", acceptance: "79.8%" },
            { id: "inf14", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "High", acceptance: "45.5%" },
            { id: "inf15", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "High", acceptance: "77.9%" },
            { id: "inf16", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "inf17", title: "Valid Anagram", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/valid-anagram/", frequency: "High", acceptance: "66.7%" },
            { id: "inf18", title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/product-of-array-except-self/", frequency: "High", acceptance: "67.8%" },
            { id: "inf19", title: "Check if One String Swap Can Make Strings Equal", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/", frequency: "Medium", acceptance: "46.2%" },
            { id: "inf20", title: "Minimum Operations to Exceed Threshold Value I", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/minimum-operations-to-exceed-threshold-value-i/", frequency: "Medium", acceptance: "81.0%" },
        ],
        interviewTips: [
            "Infosys values the 'Learning Quotient'. Mention any certifications or self-learned skills.",
            "For 'Power Programmer' (SES) roles, focus on Hard DSA and Competitive Programming.",
            "The InfyTQ certification is the fastest way to get an interview call."
        ],
        resources: [
            { label: "Infosys Springboard", url: "https://infyspringboard.onwingspan.com/" },
            { label: "LeetCode Infosys Tag", url: "https://leetcode.com/company/infosys/" }
        ]
    },
    {
        id: "wipro", name: "Wipro", logo: "https://logo.clearbit.com/wipro.com", gradient: "from-violet-600 to-purple-500",
        tier: "Service", description: "IT services, consulting and business process services",
        avgPackage: "₹3.5-6 LPA",
        interviewRounds: ["Wipro NLTH (Aptitude + Coding)", "Technical Interview", "HR"],

        problems: [
            { id: "wp1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "wp2", title: "Reverse Integer", difficulty: "Medium", topic: "Math", url: "https://leetcode.com/problems/reverse-integer/", frequency: "High", acceptance: "30.3%" },
            { id: "wp3", title: "Palindrome Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/palindrome-number/", frequency: "High", acceptance: "59.2%" },
            { id: "wp4", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "wp5", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", frequency: "High", acceptance: "60.4%" },
            { id: "wp6", title: "Valid Anagram", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/valid-anagram/", frequency: "High", acceptance: "66.7%" },
            { id: "wp7", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "Medium", acceptance: "36.9%" },
            { id: "wp8", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "wp9", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "wp10", title: "Fibonacci Number", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/fibonacci-number/", frequency: "High", acceptance: "72.9%" },
            { id: "wp11", title: "Roman to Integer", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/roman-to-integer/", frequency: "High", acceptance: "64.9%" },
            { id: "wp12", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", frequency: "High", acceptance: "79.2%" },
            { id: "wp13", title: "Binary Search", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/binary-search/", frequency: "High", acceptance: "59.6%" },
            { id: "wp14", title: "Rotate Array", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/rotate-array/", frequency: "High", acceptance: "43.0%" },
            { id: "wp15", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "wp16", title: "Missing Number", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/missing-number/", frequency: "High", acceptance: "70.1%" },
            { id: "wp17", title: "Maximum Value of a String in an Array", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/maximum-value-of-a-string-in-an-array/", frequency: "Medium", acceptance: "74.5%" },
            { id: "wp18", title: "Count Pairs Whose Sum is Less than Target", difficulty: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target/", frequency: "High", acceptance: "86.3%" },
        ],
        interviewTips: [
            "Wipro's 'Business Discussion' is a combined Tech+HR round; expect questions on both simultaneously.",
            "Improve your typing speed and grammar for the WriteX (Essay writing) round.",
            "Mention Wipro's values: 'Intensity to Win', 'Act with Sensitivity', 'Unyielding Integrity'."
        ],
        resources: [
            { label: "Wipro Careers India", url: "https://careers.wipro.com/india" },
            { label: "GFG Wipro Prep", url: "https://www.geeksforgeeks.org/wipro-recruitment-process/" }
        ]
    },
    {
        id: "deloitte", name: "Deloitte", logo: "https://logo.clearbit.com/deloitte.com", gradient: "from-green-700 to-green-500",
        tier: "Service", description: "Professional services — audit, consulting, advisory, tax",
        avgPackage: "₹6-14 LPA",
        interviewRounds: ["Aptitude Test", "Technical Round", "Case Study", "Partner Interview"],

        problems: [
            { id: "dl1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "dl2", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "56.8%" },
            { id: "dl3", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "dl4", title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-palindromic-substring/", frequency: "High", acceptance: "35.8%" },
            { id: "dl5", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "dl6", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "High", acceptance: "45.5%" },
            { id: "dl7", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", frequency: "High", acceptance: "79.2%" },
            { id: "dl8", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", frequency: "High", acceptance: "55.3%" },
            { id: "dl9", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "dl10", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", frequency: "High", acceptance: "37.1%" },
            { id: "dl11", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "dl12", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "62.3%" },
            { id: "dl13", title: "Coin Change", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/coin-change/", frequency: "Medium", acceptance: "46.5%" },
            { id: "dl14", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "Medium", acceptance: "70.9%" },
            { id: "dl15", title: "Sort Vowels in a String", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/sort-vowels-in-a-string/", frequency: "Medium", acceptance: "80.1%" },
            { id: "dl16", title: "Determine if a Cell Is Reachable at a Given Time", difficulty: "Medium", topic: "Math", url: "https://leetcode.com/problems/determine-if-a-cell-is-reachable-at-a-given-time/", frequency: "Medium", acceptance: "35.2%" },
        ],
        interviewTips: [
            "Deloitte interviews focus heavily on Case Studies and Guesstimates. Practice solving business problems.",
            "Know your 'Impact' — Deloitte loves candidates who can explain how their work added value.",
            "Versant test (Communication) is part of the process; ensure high quality audio."
        ],
        resources: [
            { label: "Deloitte Case Study Prep", url: "https://www2.deloitte.com/us/en/pages/careers/articles/graduates-case-study-tips.html" },
            { label: "GFG Deloitte Prep", url: "https://www.geeksforgeeks.org/deloitte-recruitment-process/" }
        ]
    },

    // ═══ MORE SERVICE COMPANIES ═══
    mkSvc("techmahindra", "Tech Mahindra", "https://logo.clearbit.com/techmahindra.com", "from-blue-700 to-blue-500", "IT services, BPO, and digital transformation", "₹3.5-7 LPA", 0, ["Coding + Aptitude", "Technical Round", "HR Round"]),
    mkSvc("mphasis", "Mphasis", "https://logo.clearbit.com/mphasis.com", "from-purple-600 to-purple-400", "IT services and applied technology", "₹4-8 LPA", 1, ["Online Assessment", "Technical Round", "HR Round"]),
    mkSvc("mindtree", "Mindtree", "https://logo.clearbit.com/mindtree.com", "from-green-600 to-green-400", "Digital transformation and technology services", "₹4-8 LPA", 2),
    mkSvc("kpit", "KPIT Technologies", "https://logo.clearbit.com/kpit.com", "from-blue-600 to-indigo-500", "Automotive embedded tech and mobility solutions", "₹5-10 LPA", 0, ["Coding Test", "Technical x2", "HR"]),
    mkSvc("cyient", "Cyient", "https://logo.clearbit.com/cyient.com", "from-blue-500 to-teal-500", "Engineering, manufacturing and geospatial services", "₹4-8 LPA", 1),
    mkSvc("birlasoft", "Birlasoft", "https://logo.clearbit.com/birlasoft.com", "from-emerald-600 to-green-500", "Enterprise digital solutions and IT services", "₹4-7 LPA", 2),


    // ═══ STARTUP COMPANIES (A-Z from placement list) ═══
    mkStart("3ea", "3EA", "3E", "from-blue-500 to-cyan-500", "Custom software development", "₹3-6 LPA", 0),
    mkStart("64squares", "64squares", "64", "from-green-500 to-emerald-500", "Software development and consulting", "₹3-6 LPA", 1),
    mkStart("abs", "ABS", "AB", "from-blue-600 to-blue-400", "Technology solutions provider", "₹3-6 LPA", 2),
    mkStart("agiliad", "Agiliad", "AG", "from-purple-500 to-indigo-500", "Digital transformation consulting", "₹4-7 LPA", 3),
    mkStart("alefedge", "AlefEdge", "AE", "from-teal-500 to-cyan-500", "Edge computing and IoT solutions", "₹5-10 LPA", 0),
    mkStart("aligned", "Aligned Automation", "AA", "from-blue-500 to-blue-400", "Business process automation", "₹4-7 LPA", 1),
    mkStart("altizon", "Altizon Inc.", "https://logo.clearbit.com/altizon.com", "from-orange-500 to-amber-500", "Industrial IoT platform company", "₹5-10 LPA", 2),

    mkStart("amura", "Amura", "AU", "from-pink-500 to-rose-500", "Marketing technology solutions", "₹4-8 LPA", 3),
    mkStart("anchanto", "Anchanto", "https://logo.clearbit.com/anchanto.com", "from-indigo-500 to-blue-500", "SaaS platform for e-commerce logistics", "₹5-10 LPA", 0),

    mkStart("apisero", "Apisero", "https://logo.clearbit.com/apisero.com", "from-green-600 to-teal-500", "MuleSoft and Salesforce consulting", "₹5-10 LPA", 1),

    mkStart("bitwise", "Bitwise", "https://logo.clearbit.com/bitwiseglobal.com", "from-blue-600 to-indigo-500", "IT and software services company", "₹4-8 LPA", 2),

    mkStart("bizamica", "bizAmica Software", "BA", "from-teal-500 to-green-500", "Enterprise software solutions", "₹3-6 LPA", 3),
    mkStart("brightchamps", "BrightChamps", "https://logo.clearbit.com/brightchamps.com", "from-orange-500 to-yellow-400", "EdTech — coding & STEM for kids", "₹4-8 LPA", 0),

    mkStart("buddiai", "BUDDI.AI", "BD", "from-blue-600 to-purple-500", "AI/ML healthcare solutions", "₹5-10 LPA", 1),
    mkStart("cakesoft", "CakeSoft Technologies", "CK", "from-pink-500 to-red-500", "Web and mobile app development", "₹3-6 LPA", 2),
    mkStart("centiro", "Centiro", "CE", "from-blue-500 to-blue-400", "Supply chain execution platform", "₹5-10 LPA", 3),
    mkStart("cloudwerx", "Cloudwerx", "CW", "from-sky-600 to-blue-500", "Google Cloud consulting partner", "₹5-10 LPA", 0),
    mkStart("codevita", "Codevita Live", "CV", "from-blue-500 to-purple-500", "Coding competition and talent platform", "₹4-8 LPA", 1),
    mkStart("deqode", "Deqode", "https://logo.clearbit.com/deqode.com", "from-indigo-600 to-blue-500", "Blockchain and web3 development", "₹5-10 LPA", 2),

    mkStart("elasticrun", "ElasticRun", "https://logo.clearbit.com/elasticrun.com", "from-blue-600 to-blue-400", "Technology-led commerce platform", "₹5-10 LPA", 3),

    mkStart("enthralltech", "EnthrallTech", "ET", "from-green-500 to-emerald-500", "Digital solutions and consultancy", "₹3-6 LPA", 0),
    mkStart("epikindifi", "EPIKInDiFi", "EP", "from-purple-600 to-indigo-500", "Fintech and digital finance solutions", "₹4-8 LPA", 1),
    mkStart("eqtech", "eQ Technologic", "EQ", "from-blue-500 to-cyan-500", "Enterprise data management platform", "₹4-8 LPA", 2),
    mkStart("eumentis", "Eumentis Cloud", "EC", "from-sky-500 to-blue-500", "Cloud infrastructure and DevOps", "₹4-8 LPA", 3),
    mkStart("extramarks", "Extramarks Education", "EX", "from-cyan-600 to-blue-500", "EdTech and digital learning platform", "₹4-8 LPA", 0),
    mkStart("fabricinc", "Fabric Inc", "FI", "from-purple-500 to-violet-500", "Micro-fulfillment technology", "₹5-10 LPA", 1),
    mkStart("flogroup", "Flo Group", "FG", "from-blue-500 to-blue-400", "Technology and business consulting", "₹3-6 LPA", 2),
    mkStart("gns", "GNS Engineering India", "GN", "from-blue-600 to-blue-500", "Engineering design services", "₹3-6 LPA", 3),
    mkStart("growisto", "Growisto", "GR", "from-green-500 to-teal-500", "E-commerce growth consulting", "₹4-8 LPA", 0),
    mkStart("helpshift", "Helpshift Technologies", "https://logo.clearbit.com/helpshift.com", "from-blue-500 to-indigo-500", "AI-powered customer service platform", "₹6-12 LPA", 1),

    mkStart("hexaview", "Hexaview Technologies", "HT", "from-blue-600 to-cyan-500", "IT services and cloud solutions", "₹4-8 LPA", 2),
    mkStart("infogenlabs", "Infogen Labs", "IL", "from-green-600 to-green-500", "Software development services", "₹3-6 LPA", 3),
    mkStart("integrichain", "IntegriChain Inc.", "IC", "from-blue-600 to-blue-400", "Life sciences data and analytics", "₹5-10 LPA", 0),
    mkStart("iqdigital", "iQ Digital", "IQ", "from-purple-500 to-pink-500", "Digital marketing and technology", "₹3-6 LPA", 1),
    mkStart("jaroeducation", "Jaro Education", "JE", "from-orange-500 to-amber-500", "Online higher education platform", "₹3-6 LPA", 2),
    mkStart("jisasoftech", "JISA Softech", "JS", "from-blue-500 to-blue-400", "Payment solutions and fintech", "₹3-6 LPA", 3),
    mkStart("jombay", "Jombay", "JB", "from-teal-500 to-cyan-500", "People analytics and assessment platform", "₹4-8 LPA", 0),
    mkStart("k12techno", "K12 Techno Services", "K1", "from-blue-600 to-blue-400", "K-12 education technology services", "₹3-6 LPA", 1),
    mkStart("kylas", "Kylas", "KY", "from-blue-500 to-indigo-500", "Enterprise CRM for growing businesses", "₹4-8 LPA", 2),
    mkStart("mastercard2", "McKinley & Rice", "MR", "from-orange-600 to-orange-400", "Design and technology agency", "₹4-8 LPA", 3),
    mkStart("medlypharmacy", "Medly Pharmacy", "https://logo.clearbit.com/medly.com", "from-green-500 to-teal-500", "Digital pharmacy platform", "₹4-8 LPA", 0),

    mkStart("mindstix", "Mindstix Software Labs", "ML", "from-blue-500 to-blue-400", "Software product engineering", "₹3-6 LPA", 1),
    mkStart("miniorange", "miniOrange", "https://logo.clearbit.com/miniorange.com", "from-orange-500 to-yellow-400", "Identity and access management", "₹4-8 LPA", 2),

    mkStart("moxie", "Moxie", "MX", "from-purple-600 to-pink-500", "Customer experience analytics", "₹4-8 LPA", 3),
    mkStart("onextel", "oneXtel", "OX", "from-blue-600 to-blue-500", "Cloud communication platform", "₹3-6 LPA", 0),
    mkStart("planetspark", "PlanetSpark", "PK", "from-yellow-500 to-orange-400", "EdTech for kids — communication skills", "₹4-8 LPA", 1),
    mkStart("productdossier", "Product Dossier", "PD", "from-blue-500 to-blue-400", "Project management SaaS", "₹4-8 LPA", 2),
    mkStart("purplle", "Purplle.com", "https://logo.clearbit.com/purplle.com", "from-purple-500 to-pink-500", "Online beauty and personal care", "₹5-10 LPA", 3),

    mkStart("rackware", "RackWare Technologies", "RW", "from-blue-700 to-blue-500", "Cloud migration and DR solutions", "₹4-8 LPA", 0),
    mkStart("raydendesign", "Rayden Design", "RD", "from-pink-500 to-rose-500", "UI/UX design and development", "₹3-6 LPA", 1),
    mkStart("redpanda", "Red Panda", "RP", "from-red-500 to-orange-400", "Technology consulting services", "₹3-6 LPA", 2),
    mkStart("riaadvisory", "RIA Advisory", "RA", "from-blue-600 to-blue-400", "Technology advisory and consulting", "₹4-8 LPA", 3),
    mkStart("rtcamp", "rtCamp", "https://logo.clearbit.com/rtcamp.com", "from-orange-500 to-red-500", "WordPress VIP and web engineering", "₹5-10 LPA", 0),

    mkStart("rudder", "Rudder Analytics", "RU", "from-teal-500 to-green-500", "Business intelligence solutions", "₹4-8 LPA", 1),
    mkStart("ryussi", "Ryussi Technologies", "RY", "from-blue-500 to-indigo-500", "AI-powered analytics platform", "₹4-8 LPA", 2),
    mkStart("sagitec", "Sagitec", "SG", "from-blue-600 to-blue-400", "Benefits administration software", "₹5-10 LPA", 3),
    mkStart("scalex", "Scalex Technology", "SX", "from-green-500 to-emerald-500", "Scalable technology solutions", "₹3-6 LPA", 0),
    mkStart("screenmagic", "Screen Magic", "SM", "from-purple-500 to-indigo-500", "Business messaging solutions", "₹3-6 LPA", 1),
    mkStart("se2", "SE2", "S2", "from-blue-700 to-blue-500", "Life insurance administration platform", "₹5-10 LPA", 2),
    mkStart("sedemac", "Sedemac Mechatronics", "SD", "from-green-600 to-green-400", "Automotive electronics systems", "₹4-8 LPA", 3),
    mkStart("selldo", "Sell.do", "https://logo.clearbit.com/sell.do", "from-blue-600 to-cyan-500", "Real estate CRM platform", "₹4-8 LPA", 0),

    mkStart("swasthyaai", "Swasthya AI", "https://logo.clearbit.com/swasthya.ai", "from-green-500 to-teal-500", "AI-powered healthcare diagnostics", "₹5-10 LPA", 1),

    mkStart("symblai", "Symbl.ai", "https://logo.clearbit.com/symbl.ai", "from-purple-600 to-indigo-500", "Conversational intelligence API platform", "₹6-12 LPA", 2),

    mkStart("talentio", "Talentio", "https://logo.clearbit.com/talentio.in", "from-blue-500 to-blue-400", "HR tech and recruitment platform", "₹3-6 LPA", 3),

    mkStart("techverito", "TechVerito", "TV", "from-orange-500 to-amber-500", "Agile software development services", "₹5-10 LPA", 0),
    mkStart("tracelink", "Tracelink", "TK", "from-blue-600 to-blue-500", "Supply chain digital network", "₹5-10 LPA", 1),
    mkStart("tripstack", "TripStack", "TS", "from-sky-500 to-blue-500", "Travel technology platform", "₹5-10 LPA", 2),
    mkStart("udchalo", "udChalo", "https://logo.clearbit.com/udchalo.com", "from-orange-500 to-red-500", "Travel platform for armed forces", "₹4-8 LPA", 3),

    mkStart("unschool", "Unschool", "https://logo.clearbit.com/unschool.in", "from-purple-500 to-pink-500", "Online professional learning platform", "₹3-6 LPA", 0),

    mkStart("uolocom", "Uolo.com", "https://logo.clearbit.com/uolo.com", "from-blue-500 to-indigo-500", "EdTech for schools and parents", "₹3-6 LPA", 1),

    mkStart("vadini", "Vadini Infocenter", "VI", "from-green-500 to-green-400", "IT infrastructure services", "₹3-6 LPA", 2),
    mkStart("valuence", "Valuence Holdings", "VH", "from-blue-600 to-blue-500", "Luxury brand marketplace", "₹4-8 LPA", 3),
    mkStart("verticalfox", "Vertical Fox", "VF", "from-orange-500 to-amber-400", "Digital marketing agency", "₹3-6 LPA", 0),
    mkStart("wednesday", "Wednesday Solutions", "WS", "from-blue-600 to-indigo-500", "Product engineering consultancy", "₹5-10 LPA", 1),
    mkStart("whizai", "Whiz.ai", "https://logo.clearbit.com/whiz.ai", "from-purple-600 to-blue-500", "AI analytics for life sciences", "₹6-12 LPA", 2),

    mkStart("winjit", "Winjit Technologies", "https://logo.clearbit.com/winjit.com", "from-blue-500 to-blue-400", "IoT and mobility solutions", "₹4-8 LPA", 3),

    mkStart("yardi", "Yardi", "https://logo.clearbit.com/yardi.com", "from-green-600 to-emerald-500", "Real estate and property management tech", "₹5-10 LPA", 0),

    mkStart("zlen", "Zlen", "ZL", "from-blue-600 to-cyan-500", "Technology solutions company", "₹3-6 LPA", 1),
    mkStart("hashedin", "HashedIn Technologies", "https://logo.clearbit.com/hashedin.com", "from-orange-500 to-red-500", "Product engineering and cloud-native development", "₹6-12 LPA", 2, ["Coding Round", "Technical Interview 1", "Technical Interview 2", "HR"],
        [
            "HashedIn focuses heavily on 'Clean Code' and 'Design Patterns'.",
            "Expect 2-3 Medium/Hard LeetCode problems in the first tech round.",
            "Knowledge of Cloud (AWS/Azure) is a huge plus."
        ],
        [
            { label: "HashedIn Careers", url: "https://hashedin.com/careers/" }
        ]
    ),
    mkStart("geekyants", "GeekyAnts", "https://logo.clearbit.com/geekyants.com", "from-blue-500 to-indigo-500", "Mobile and web app development studio", "₹5-10 LPA", 3),
    mkStart("clevertap", "CleverTap", "https://logo.clearbit.com/clevertap.com", "from-red-500 to-pink-500", "Customer engagement and retention platform", "₹6-12 LPA", 0),
    mkStart("postman", "Postman", "https://logo.clearbit.com/postman.com", "from-orange-500 to-orange-400", "API development collaboration platform", "₹8-18 LPA", 1, ["Online Coding", "System Design", "Technical Round", "Behavioral"],
        [
            "Postman bar is very high. Focus on System Design (API Design, Rate Limiting, Latency).",
            "Be an expert in at least one backend language (Node.js/Go/Java).",
            "Contribute to Open Source or have a strong 'Postman' specific project to stand out."
        ],
        [
            { label: "Postman Careers", url: "https://www.postman.com/company/careers/" }
        ]
    ),

];
