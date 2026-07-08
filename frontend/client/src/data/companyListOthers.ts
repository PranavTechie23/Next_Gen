import { Company, mkSvc, mkStart, mkProd, mkFin } from "./companyProblemPools";

// ─── Service + Startup + Remaining Companies ────────────────────────────
export const OTHER_COMPANIES: Company[] = [
    // ═══ SERVICE COMPANIES ═══
    {
        id: "accenture",
        name: "Accenture",
        logo: "https://unavatar.io/accenture.com?fallback=https://ui-avatars.com/api/?name=A&background=random",
        gradient: "from-purple-600 to-purple-500",
        tier: "Service",
        description: "Global IT services, consulting & outsourcing",
        avgPackage: "₹5-10 LPA",
        interviewRounds: ["Cognitive & Technical", "Coding Round", "Communication Round", "Technical & HR Interview"],
        interviewTips: [
            "Cognitive round is high-elimination; practice 'Pseudocode' and 'Abstract Reasoning' samples.",
            "Communication round is AI-based (Versant style). Repeat sentences clearly and stay audible.",
            "Technical interviews at Accenture often focus heavily on your Resume/Project description."
        ],
        resources: [
            { label: "Accenture Recruitment Process", url: "https://www.accenture.com/in-en/careers/local/recruitment-process-india" },
            { label: "GFG Accenture Prep", url: "https://www.geeksforgeeks.org/accenture-recruitment-process/" }
        ],
        problems: [
            { id: "acc1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "acc2", title: "Find the Duplicate Number", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/find-the-duplicate-number/", frequency: "High", acceptance: "63.0%" },
            { id: "acc3", title: "Reverse String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/reverse-string/", frequency: "High", acceptance: "79.8%" },
            { id: "acc4", title: "Valid Anagram", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/valid-anagram/", frequency: "High", acceptance: "66.7%" },
            { id: "acc5", title: "Palindrome Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/palindrome-number/", frequency: "High", acceptance: "59.2%" },
            { id: "acc6", title: "Fibonacci Number", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/fibonacci-number/", frequency: "High", acceptance: "72.9%" },
            { id: "acc7", title: "Power of Two", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/power-of-two/", frequency: "Medium", acceptance: "46.2%" },
            { id: "acc8", title: "Move Zeroes", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/move-zeroes/", frequency: "High", acceptance: "61.3%" },
            { id: "acc9", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "acc10", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "acc11", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "acc12", title: "Search Insert Position", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/search-insert-position/", frequency: "High", acceptance: "48.2%" },
            { id: "acc13", title: "Majority Element", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/majority-element/", frequency: "High", acceptance: "65.7%" },
            { id: "acc14", title: "Missing Number", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/missing-number/", frequency: "High", acceptance: "70.1%" },
            { id: "acc15", title: "Intersection of Two Arrays", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/intersection-of-two-arrays/", frequency: "Medium", acceptance: "71.6%" },
            { id: "acc16", title: "First Unique Character in a String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", frequency: "Medium", acceptance: "60.4%" },
            { id: "acc17", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "acc18", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "acc19", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "acc20", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "acc21", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "56.8%" },
            { id: "acc22", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "acc23", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "acc24", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "acc25", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "acc26", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "acc27", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "acc28", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "acc29", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" },
            { id: "acc30", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "acc31", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "acc32", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" }
        ]
    },
    {
        id: "cognizant",
        name: "Cognizant",
        logo: "https://unavatar.io/cognizant.com?fallback=https://ui-avatars.com/api/?name=C&background=random",
        gradient: "from-blue-600 to-blue-500",
        tier: "Service",
        description: "IT services, consulting and digital transformation",
        avgPackage: "₹5-10 LPA",
        interviewRounds: ["Skill Based Assessment", "Technical Interview", "HR Round"],
        interviewTips: [
            "GenC vs GenC Next: Prepare for competitive coding if you're aiming for the 'Next' track (higher package).",
            "Be strong in OOPS concepts and SQL queries; they are GenC favorites.",
            "Explain your project's architecture clearly using the STAR method."
        ],
        resources: [
            { label: "Cognizant Careers India", url: "https://www.cognizant.com/in/en/careers" },
            { label: "PrepInsta Cognizant Guide", url: "https://prepinsta.com/cognizant/interview-preparation/" }
        ],
        problems: [
            { id: "cog1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "cog2", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", frequency: "High", acceptance: "79.2%" },
            { id: "cog3", title: "Valid Palindrome", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/valid-palindrome/", frequency: "High", acceptance: "48.6%" },
            { id: "cog4", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/", frequency: "High", acceptance: "64.1%" },
            { id: "cog5", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", frequency: "High", acceptance: "60.4%" },
            { id: "cog6", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", frequency: "High", acceptance: "55.3%" },
            { id: "cog7", title: "Rotate Array", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/rotate-array/", frequency: "High", acceptance: "43.0%" },
            { id: "cog8", title: "Binary Search", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/binary-search/", frequency: "High", acceptance: "59.6%" },
            { id: "cog9", title: "Symmetric Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/symmetric-tree/", frequency: "Medium", acceptance: "59.3%" },
            { id: "cog10", title: "Implement Queue using Stacks", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/implement-queue-using-stacks/", frequency: "Medium", acceptance: "64.5%" },
            { id: "cog11", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", frequency: "Medium", acceptance: "42.8%" },
            { id: "cog12", title: "Delete Node in a Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/delete-node-in-a-linked-list/", frequency: "High", acceptance: "42.7%" },
            { id: "cog13", title: "Excel Sheet Column Title", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/excel-sheet-column-title/", frequency: "Medium", acceptance: "40.2%" },
            { id: "cog14", title: "Sqrt(x)", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/sqrtx/", frequency: "High", acceptance: "38.2%" },
            { id: "cog15", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "cog16", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "cog17", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "cog18", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "56.8%" },
            { id: "cog19", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "cog20", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "cog21", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "cog22", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "cog23", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "cog24", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "cog25", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "cog26", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" },
            { id: "cog27", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "cog28", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "cog29", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" }
        ]
    },
    {
        id: "capgemini",
        name: "Capgemini",
        logo: "https://unavatar.io/capgemini.com?fallback=https://ui-avatars.com/api/?name=C&background=random",
        gradient: "from-blue-700 to-indigo-500",
        tier: "Service",
        description: "Global IT consulting and technology services",
        avgPackage: "₹5-8 LPA",
        interviewRounds: ["Aptitude & Game-based", "Coding Round", "Technical Interview", "HR Round"],
        interviewTips: [
            "Game-based aptitude is unique; practice grid-matching and number-sequence games.",
            "Expect pseudo-code questions in the assessment — they test your dry-run skills.",
            "Discussion on 'Latest Tech Trends' (Cloud, AI) is common in Technical rounds."
        ],
        resources: [
            { label: "Capgemini Recruitment Portfolio", url: "https://www.capgemini.com/in-en/careers/recruitment-process/" },
            { label: "PrepInsta Capgemini Guide", url: "https://prepinsta.com/capgemini/interview-preparation/" }
        ],
        problems: [
            { id: "cap1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "cap2", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "cap3", title: "Pascal's Triangle", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/pascals-triangle/", frequency: "Medium", acceptance: "77.0%" },
            { id: "cap4", title: "Reverse String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/reverse-string/", frequency: "High", acceptance: "79.8%" },
            { id: "cap5", title: "Check if Array Is Sorted and Rotated", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/", frequency: "High", acceptance: "51.0%" },
            { id: "cap6", title: "Missing Number", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/missing-number/", frequency: "High", acceptance: "70.1%" },
            { id: "cap7", title: "Find First and Last Position of Element", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", frequency: "Medium", acceptance: "46.8%" },
            { id: "cap8", title: "Basic Calculator II", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/basic-calculator-ii/", frequency: "High", acceptance: "43.5%" },
            { id: "cap9", title: "Power of Three", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/power-of-three/", frequency: "Medium", acceptance: "45.7%" },
            { id: "cap10", title: "Happy Number", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/happy-number/", frequency: "Medium", acceptance: "59.2%" },
            { id: "cap11", title: "Is Subsequence", difficulty: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/is-subsequence/", frequency: "High", acceptance: "47.7%" },
            { id: "cap12", title: "Design HashMap", difficulty: "Easy", topic: "Design", url: "https://leetcode.com/problems/design-hashmap/", frequency: "Medium", acceptance: "65.6%" },
            { id: "cap13", title: "Intersection of Two Linked Lists", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/intersection-of-two-linked-lists/", frequency: "High", acceptance: "51.8%" },
            { id: "cap14", title: "Single Number", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/single-number/", frequency: "High", acceptance: "75.2%" },
            { id: "cap15", title: "Count Primes", difficulty: "Medium", topic: "Math", url: "https://leetcode.com/problems/count-primes/", frequency: "Medium", acceptance: "33.9%" },
            { id: "cap16", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "cap17", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "cap18", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "cap19", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "56.8%" },
            { id: "cap20", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "cap21", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "cap22", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "cap23", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "cap24", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "cap25", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "cap26", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "cap27", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" },
            { id: "cap28", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "cap29", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "cap30", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" }
        ]
    },
    {
        id: "hcl",
        name: "HCL Technologies",
        logo: "https://unavatar.io/hcltech.com?fallback=https://ui-avatars.com/api/?name=H&background=random",
        gradient: "from-blue-600 to-blue-400",
        tier: "Service",
        description: "IT services, engineering and R&D company",
        avgPackage: "₹5-8 LPA",
        interviewRounds: ["Online Test", "Technical Interview", "HR Round"],
        interviewTips: [
            "Focus on 'Computer Fundamentals' (OS, Networking) — they feature heavily in the assessment.",
            "HCL often asks about specific service lines (Engineering vs IT). Know which one you're interviewing for.",
            "Communication is key; maintain a professional tone throughout the AI-proctored test."
        ],
        resources: [
            { label: "HCLTech Careers", url: "https://www.hcltech.com/careers" }
        ],
        problems: [
            { id: "hcl1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "hcl2", title: "Reverse String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/reverse-string/", frequency: "High", acceptance: "79.8%" },
            { id: "hcl3", title: "Intersection of Two Arrays II", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/intersection-of-two-arrays-ii/", frequency: "Medium", acceptance: "58.2%" },
            { id: "hcl4", title: "Rotate String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/rotate-string/", frequency: "Medium", acceptance: "58.1%" },
            { id: "hcl5", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "Medium", acceptance: "45.1%" },
            { id: "hcl6", title: "Implement Stack using Queues", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/implement-stack-using-queues/", frequency: "Medium", acceptance: "66.4%" },
            { id: "hcl7", title: "Binary Tree Inorder Traversal", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/", frequency: "Medium", acceptance: "77.5%" },
            { id: "hcl8", title: "Reverse Words in a String", difficulty: "Medium", topic: "String", url: "https://leetcode.com/problems/reverse-words-in-a-string/", frequency: "Medium", acceptance: "43.5%" },
            { id: "hcl9", title: "Remove Duplicates from Sorted List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/", frequency: "High", acceptance: "53.6%" },
            { id: "hcl10", title: "Same Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/same-tree/", frequency: "Medium", acceptance: "63.9%" },
            { id: "hcl11", title: "Number of 1 Bits", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/number-of-1-bits/", frequency: "High", acceptance: "73.2%" },
            { id: "hcl12", title: "Move Zeroes", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/move-zeroes/", frequency: "High", acceptance: "61.3%" },
            { id: "hcl13", title: "Valid Palindrome", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/valid-palindrome/", frequency: "High", acceptance: "48.6%" },
            { id: "hcl14", title: "First Unique Character in a String", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", frequency: "Medium", acceptance: "60.4%" },
            { id: "hcl15", title: "Fibonacci Number", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/fibonacci-number/", frequency: "High", acceptance: "72.9%" },
            { id: "hcl16", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "hcl17", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "hcl18", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "hcl19", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "56.8%" },
            { id: "hcl20", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "hcl21", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "hcl22", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "hcl23", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "hcl24", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "hcl25", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "hcl26", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "hcl27", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" },
            { id: "hcl28", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "hcl29", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "hcl30", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" }
        ]
    },
    mkSvc("hexaware", "Hexaware Technologies", "https://unavatar.io/hexaware.com?fallback=https://ui-avatars.com/api/?name=H&background=random", "from-blue-500 to-cyan-500", "IT and BPO services company", "₹5-8 LPA", 1),
    mkSvc("ltinfotech", "L&T Infotech", "https://unavatar.io/ltimindtree.com?fallback=https://ui-avatars.com/api/?name=L&background=random", "from-orange-600 to-yellow-500", "Global technology consulting and digital solutions", "₹6-11 LPA", 2, ["Online Assessment", "Technical Round", "HR Round"],
        [
            "LTIMindtree's assessment is long (120+ mins); build endurance and focus.",
            "Technical round focuses on OOPs and DBMS. Practice 'Normalization' and 'Joins'.",
            "Be ready to explain every single project and internship in your resume in detail."
        ],
        [
            { label: "LTIMindtree Careers", url: "https://www.ltimindtree.com/careers/" }
        ]
    ),
    {
        id: "persistent",
        name: "Persistent Systems",
        logo: "https://unavatar.io/persistent.com?fallback=https://ui-avatars.com/api/?name=P&background=random",
        gradient: "from-orange-600 to-red-500",
        tier: "Service",
        description: "Digital engineering and enterprise modernization",
        avgPackage: "₹6-14 LPA",
        interviewRounds: ["Aptitude Test", "Technical Round 1", "Technical Round 2", "HR Round"],
        interviewTips: [
            "Strong Java/C++ fundamentals are mandatory. Expect questions on 'Java Memory Model' or 'Pointers'.",
            "If you clear the 'Super Achiever' test, you can double your package offer.",
            "Focus on your Final Year Project's technical architecture."
        ],
        resources: [
            { label: "Persistent Recruitment", url: "https://www.persistent.com/careers/" }
        ],
        problems: [
            { id: "ps1", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-increasing-subsequence/", frequency: "High", acceptance: "56.4%" },
            { id: "ps2", title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/spiral-matrix/", frequency: "Medium", acceptance: "53.9%" },
            { id: "ps3", title: "Trapping Rain Water", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "Medium", acceptance: "65.1%" },
            { id: "ps4", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "ps5", title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", frequency: "Medium", acceptance: "73.2%" },
            { id: "ps6", title: "Decode Ways", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/decode-ways/", frequency: "Medium", acceptance: "35.8%" },
            { id: "ps7", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "45.2%" },
            { id: "ps8", title: "Search a 2D Matrix", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-a-2d-matrix/", frequency: "Medium", acceptance: "52.8%" },
            { id: "ps9", title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", frequency: "High", acceptance: "62.4%" },
            { id: "ps10", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "High", acceptance: "70.9%" },
            { id: "ps11", title: "Sort Colors", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/sort-colors/", frequency: "Medium", acceptance: "64.9%" },
            { id: "ps12", title: "Permutations", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", frequency: "Medium", acceptance: "80.7%" },
            { id: "ps13", title: "Rotting Oranges", difficulty: "Medium", topic: "BFS", url: "https://leetcode.com/problems/rotting-oranges/", frequency: "Medium", acceptance: "55.1%" },
            { id: "ps14", title: "Word Break", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/word-break/", frequency: "Medium", acceptance: "48.1%" },
            { id: "ps15", title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-palindromic-substring/", frequency: "High", acceptance: "34.5%" },
            { id: "ps16", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "ps17", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "ps18", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "ps19", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "ps20", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "ps21", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "ps22", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "ps23", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "ps24", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "ps25", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "ps26", title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/sudoku-solver/", frequency: "Medium", acceptance: "55.0%" },
            { id: "ps27", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "ps28", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "ps29", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" },
            { id: "ps30", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" }
        ]
    },
    mkSvc("atos", "Atos", "https://unavatar.io/atos.net?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-blue-700 to-blue-500", "Digital transformation and IT services", "₹5-10 LPA", 1),
    mkSvc("nttdata", "NTT Data", "https://unavatar.io/nttdata.com?fallback=https://ui-avatars.com/api/?name=N&background=random", "from-blue-600 to-indigo-500", "Global IT services and consulting", "₹5-10 LPA", 2),
    mkSvc("quantiphi", "Quantiphi", "https://unavatar.io/quantiphi.com?fallback=https://ui-avatars.com/api/?name=Q&background=random", "from-blue-600 to-indigo-400", "AI-first digital engineering company", "₹7-14 LPA", 0, ["Online Assessment", "Technical Interview 1", "Technical Interview 2", "HR"],
        [
            "Quantiphi is an AI company; know basic ML terminology even for SDE roles.",
            "Technical rounds involve solving DSA problems on a shared screen compiler.",
            "Be prepared to solve 'Guesstimates' or 'System Design' for data-heavy situations."
        ],
        [
            { label: "Quantiphi Careers", url: "https://quantiphi.com/careers/" }
        ]
    ),
    mkSvc("igt", "IGT Solutions", "https://unavatar.io/igtsolutions.com?fallback=https://ui-avatars.com/api/?name=I&background=random", "from-blue-500 to-blue-400", "Customer experience and digital services", "₹4-7 LPA", 1),
    {
        id: "zsassociates",
        name: "ZS Associates",
        logo: "https://unavatar.io/zs.com?fallback=https://ui-avatars.com/api/?name=Z&background=random",
        gradient: "from-red-600 to-red-400",
        tier: "Service",
        description: "Global professional services firm — consulting & analytics",
        avgPackage: "₹10-19 LPA",
        interviewRounds: ["Online Test", "Video Assessment", "Case Study Round", "EBI Interview"],
        interviewTips: [
            "Case Study round is the MOST important. Practice analyzing charts and Guesstimates.",
            "The Video assessment (PSDD) requires you to speak clearly with very short prep time.",
            "Expect brain-teasers and high-level analytical puzzles throughout the process."
        ],
        resources: [
            { label: "ZS Careers India", url: "https://www.zs.com/careers/india" }
        ],
        problems: [
            { id: "zs1", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "43.8%" },
            { id: "zs2", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "Medium", acceptance: "56.8%" },
            { id: "zs3", title: "Trapping Rain Water", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "zs4", title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/longest-consecutive-sequence/", frequency: "Medium", acceptance: "47.0%" },
            { id: "zs5", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "Medium", acceptance: "44.7%" },
            { id: "zs6", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "Medium", acceptance: "40.8%" },
            { id: "zs7", title: "Palindrome Partitioning", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/palindrome-partitioning/", frequency: "Medium", acceptance: "70.3%" },
            { id: "zs8", title: "Candy", difficulty: "Hard", topic: "Greedy", url: "https://leetcode.com/problems/candy/", frequency: "Medium", acceptance: "45.0%" },
            { id: "zs9", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "48.2%" },
            { id: "zs10", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "Medium", acceptance: "40.9%" },
            { id: "zs11", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "Medium", acceptance: "44.6%" },
            { id: "zs12", title: "Edit Distance", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "Medium", acceptance: "56.9%" },
            { id: "zs13", title: "Course Schedule II", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule-ii/", frequency: "Medium", acceptance: "51.1%" },
            { id: "zs14", title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/product-of-array-except-self/", frequency: "High", acceptance: "67.8%" },
            { id: "zs15", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "47.2%" },
            { id: "zs16", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "zs17", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "zs18", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "zs19", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "zs20", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" }
        ]
    },
    mkSvc("ezest", "e-Zest", "https://unavatar.io/e-zest.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-orange-500 to-amber-500", "Digital engineering and IT services", "₹5-8 LPA", 0),
    mkSvc("codenation", "Code Nation", "https://unavatar.io/codenation.co.in?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-purple-600 to-indigo-500", "Coding education and tech talent pipeline", "₹5-10 LPA", 1),
    mkSvc("inteliment", "Inteliment", "https://unavatar.io/inteliment.com?fallback=https://ui-avatars.com/api/?name=I&background=random", "from-blue-600 to-blue-400", "Data analytics and cloud services", "₹5-10 LPA", 2),

    {
        id: "tcsdigital", name: "TCS Digital", logo: "https://unavatar.io/tcs.com?fallback=https://ui-avatars.com/api/?name=T&background=random", gradient: "from-blue-600 to-blue-400",
        tier: "Service", description: "TCS premium hiring — digital & innovation roles",
        avgPackage: "₹8-13 LPA",
        interviewRounds: ["TCS NQT (Advanced)", "Technical Interview", "Managerial", "HR"],
        interviewTips: [
            "Advanced NQT coding questions often involve DP or Graph — don't settle for basic logic.",
            "In the Managerial round, expect situational questions like 'How do you handle a toxic teammate?'.",
            "Knowledge of modern tech like GenAI, Blockchain, or Cloud gives you a massive edge."
        ],
        resources: [
            { label: "TCS NextStep Portal", url: "https://nextstep.tcs.com/" },
            { label: "Striver's TCS NQT Sheet", url: "https://takeuforward.org/tcs-nqt-preparation-sheet/" }
        ],
        problems: [
            { id: "td1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "td2", title: "Maximum Subarray (Kadane's)", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "td3", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "td4", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", frequency: "High", acceptance: "40.2%" },
            { id: "td5", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-increasing-subsequence/", frequency: "High", acceptance: "52.8%" },
            { id: "td6", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "58.4%" },
            { id: "td7", title: "Subsets", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", frequency: "Medium", acceptance: "80.9%" },
            { id: "td8", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "td9", title: "Next Permutation", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/next-permutation/", frequency: "High", acceptance: "43.1%" },
            { id: "td10", title: "Word Break", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/word-break/", frequency: "High", acceptance: "48.1%" },
            { id: "td11", title: "Lowest Common Ancestor of a BT", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", frequency: "High", acceptance: "61.3%" },
            { id: "td12", title: "Valid Sudoku", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/valid-sudoku/", frequency: "Medium", acceptance: "62.3%" },
            { id: "td13", title: "Course Schedule", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "55.0%" },
            { id: "td14", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "High", acceptance: "45.5%" },
            { id: "td15", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "54.7%" },
            { id: "td16", title: "Find the Duplicate Number", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-the-duplicate-number/", frequency: "High", acceptance: "63.0%" },
            { id: "td17", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "40.8%" },
            { id: "td18", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "High", acceptance: "77.9%" },
            { id: "td19", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "td20", title: "Minimum Path Sum", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/minimum-path-sum/", frequency: "Medium", acceptance: "66.5%" },
            { id: "td21", title: "Permutations", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", frequency: "High", acceptance: "80.7%" },
            { id: "td22", title: "Clone Graph", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/clone-graph/", frequency: "Medium", acceptance: "55.7%" },
            { id: "td23", title: "Maximum Product Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-product-subarray/", frequency: "Medium", acceptance: "35.3%" },
            { id: "td24", title: "Jump Game", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game/", frequency: "High", acceptance: "38.6%" },
            { id: "td25", title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Prefix Sum", url: "https://leetcode.com/problems/subarray-sum-equals-k/", frequency: "Medium", acceptance: "45.5%" },
            { id: "td26", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "td27", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "td28", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "td29", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "td30", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "td31", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "td32", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "td33", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "td34", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "td35", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "td36", title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/sudoku-solver/", frequency: "Medium", acceptance: "55.0%" },
            { id: "td37", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "td38", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "td39", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" },
            { id: "td40", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" },
        ]
    },
    {
        id: "tcsninja", name: "TCS Ninja", logo: "https://unavatar.io/tcs.com?fallback=https://ui-avatars.com/api/?name=T&background=random", gradient: "from-blue-500 to-sky-500",
        tier: "Service", description: "TCS standard hiring — IT services roles",
        avgPackage: "₹4-8 LPA",
        interviewRounds: ["TCS NQT (Aptitude + Coding)", "Technical Interview", "HR"],
        interviewTips: [
            "Focus on Aptitude speed. TCS Ninja is often a game of clearing the cutoff in time.",
            "Prepare basic String/Array coding (Palindrome, Fibonacci, GCD).",
            "Be enthusiastic about being 'Trainable' and 'Open to relocate'."
        ],
        resources: [
            { label: "TCS iON Hub", url: "https://www.tcsion.com/hub/national-qualifier-test/" }
        ],
        problems: [
            { id: "tn1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "tn2", title: "Palindrome Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/palindrome-number/", frequency: "High", acceptance: "59.2%" },
            { id: "tn3", title: "Valid Anagram", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/valid-anagram/", frequency: "High", acceptance: "66.7%" },
            { id: "tn4", title: "Valid Palindrome", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/valid-palindrome/", frequency: "High", acceptance: "48.6%" },
            { id: "tn5", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", frequency: "High", acceptance: "60.4%" },
            { id: "tn6", title: "Reverse String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/reverse-string/", frequency: "High", acceptance: "79.8%" },
            { id: "tn7", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", frequency: "High", acceptance: "55.3%" },
            { id: "tn8", title: "Fibonacci Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/fibonacci-number/", frequency: "High", acceptance: "72.9%" },
            { id: "tn9", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "tn10", title: "Binary Search", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/binary-search/", frequency: "High", acceptance: "59.6%" },
            { id: "tn11", title: "Move Zeroes", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/move-zeroes/", frequency: "High", acceptance: "61.3%" },
            { id: "tn12", title: "Search Insert Position", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/search-insert-position/", frequency: "High", acceptance: "48.2%" },
            { id: "tn13", title: "Contains Duplicate", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/contains-duplicate/", frequency: "High", acceptance: "61.7%" },
            { id: "tn14", title: "Missing Number", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/missing-number/", frequency: "High", acceptance: "70.1%" },
            { id: "tn15", title: "Pascal's Triangle", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/pascals-triangle/", frequency: "Medium", acceptance: "77.0%" },
            { id: "tn16", title: "Power of Two", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/power-of-two/", frequency: "Medium", acceptance: "46.2%" },
            { id: "tn17", title: "Length of Last Word", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/length-of-last-word/", frequency: "Medium", acceptance: "50.1%" },
            { id: "tn18", title: "Plus One", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/plus-one/", frequency: "Medium", acceptance: "45.0%" },
            { id: "tn19", title: "Sqrt(x)", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/sqrtx/", frequency: "Medium", acceptance: "38.2%" },
            { id: "tn20", title: "Single Number", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/single-number/", frequency: "High", acceptance: "75.2%" },
            { id: "tn21", title: "Intersection of Two Arrays", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/intersection-of-two-arrays/", frequency: "Medium", acceptance: "71.6%" },
            { id: "tn22", title: "First Unique Character in a String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", frequency: "Medium", acceptance: "60.4%" },
            { id: "tn23", title: "Majority Element", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/majority-element/", frequency: "High", acceptance: "65.7%" },
            { id: "tn24", title: "Excel Sheet Column Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/excel-sheet-column-number/", frequency: "Low", acceptance: "64.1%" },
            { id: "tn25", title: "Reverse Bits", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/reverse-bits/", frequency: "Low", acceptance: "58.2%" },
        ]
    },

    // ═══ SERVICE — Infosys & Wipro (custom data) ═══
    {
        id: "infosys", name: "Infosys", logo: "https://unavatar.io/infosys.com?fallback=https://ui-avatars.com/api/?name=I&background=random", gradient: "from-blue-600 to-cyan-500",
        tier: "Service", description: "Global IT consulting and outsourcing company",
        avgPackage: "₹4-10 LPA",
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
            { id: "inf21", title: "0-1 Knapsack Problem", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/partition-equal-subset-sum/", frequency: "High", acceptance: "48.2%" },
            { id: "inf22", title: "Longest Common Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-common-subsequence/", frequency: "High", acceptance: "68.2%" },
            { id: "inf23", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "Medium", acceptance: "58.8%" },
            { id: "inf24", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.3%" },
            { id: "inf25", title: "Minimize the Heights II", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs/", frequency: "Medium", acceptance: "41.6%" },
            { id: "inf26", title: "Allocate Minimum Number of Pages", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/split-array-largest-sum/", frequency: "High", acceptance: "55.1%" },
            { id: "inf27", title: "Jump Game II", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game-ii/", frequency: "High", acceptance: "40.2%" },
            { id: "inf28", title: "Find First and Last Position of Element", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", frequency: "High", acceptance: "42.8%" },
            { id: "inf29", title: "Search Insert Position", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/search-insert-position/", frequency: "High", acceptance: "48.2%" },
            { id: "inf30", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "54.7%" },
            { id: "inf31", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/", frequency: "High", acceptance: "64.1%" },
            { id: "inf32", title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/linked-list-cycle/", frequency: "High", acceptance: "48.6%" },
            { id: "inf33", title: "Intersection of Two Arrays", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/intersection-of-two-arrays/", frequency: "High", acceptance: "71.6%" },
            { id: "inf34", title: "Valid Anagram", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/valid-anagram/", frequency: "High", acceptance: "66.7%" },
            { id: "inf35", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "inf36", title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", frequency: "High", acceptance: "77.1%" },
            { id: "inf37", title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", frequency: "High", acceptance: "68.8%" },
            { id: "inf38", title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/top-k-frequent-elements/", frequency: "High", acceptance: "65.4%" },
            { id: "inf39", title: "Course Schedule", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "55.0%" },
            { id: "inf40", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "58.4%" },
            { id: "inf41", title: "Subsets", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", frequency: "Medium", acceptance: "80.9%" },
            { id: "inf42", title: "Word Search", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", frequency: "High", acceptance: "41.0%" },
            { id: "inf43", title: "Coin Change", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/coin-change/", frequency: "High", acceptance: "44.6%" },
            { id: "inf44", title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/spiral-matrix/", frequency: "High", acceptance: "53.9%" },
            { id: "inf45", title: "Find the Duplicate Number", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-the-duplicate-number/", frequency: "High", acceptance: "63.0%" },
            { id: "inf46", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "inf47", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "inf48", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "inf49", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "inf50", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "inf51", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "inf52", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "inf53", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "inf54", title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/sudoku-solver/", frequency: "Medium", acceptance: "55.0%" },
            { id: "inf55", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "inf56", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" }
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
        id: "wipro", name: "Wipro", logo: "https://unavatar.io/wipro.com?fallback=https://ui-avatars.com/api/?name=W&background=random", gradient: "from-violet-600 to-purple-500",
        tier: "Service", description: "IT services, consulting and business process services",
        avgPackage: "₹4-7 LPA",
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
            { id: "wp19", title: "Isomorphic Strings", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/isomorphic-strings/", frequency: "Medium", acceptance: "46.9%" },
            { id: "wp20", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "Medium", acceptance: "70.9%" },
            { id: "wp21", title: "Reverse String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/reverse-string/", frequency: "High", acceptance: "79.8%" },
            { id: "wp22", title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/linked-list-cycle/", frequency: "High", acceptance: "48.6%" },
            { id: "wp23", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/", frequency: "High", acceptance: "64.1%" },
            { id: "wp24", title: "Search Insert Position", difficulty: "Easy", topic: "Binary Search", url: "https://leetcode.com/problems/search-insert-position/", frequency: "High", acceptance: "48.2%" },
            { id: "wp25", title: "Pascal's Triangle", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/pascals-triangle/", frequency: "Medium", acceptance: "77.0%" },
            { id: "wp26", title: "Max Depth of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", frequency: "High", acceptance: "77.1%" },
            { id: "wp27", title: "Symmetric Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/symmetric-tree/", frequency: "Medium", acceptance: "59.3%" },
            { id: "wp28", title: "Invert Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/invert-binary-tree/", frequency: "Medium", acceptance: "75.3%" },
            { id: "wp29", title: "Sort Colors", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/sort-colors/", frequency: "Medium", acceptance: "67.6%" },
            { id: "wp30", title: "Valid Palindrome", difficulty: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/valid-palindrome/", frequency: "High", acceptance: "48.6%" },
            { id: "wp31", title: "First Unique Character in a String", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", frequency: "Medium", acceptance: "60.4%" },
            { id: "wp32", title: "Find the Index of the First Occurrence", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", frequency: "High", acceptance: "45.0%" },
            { id: "wp33", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "Medium", acceptance: "77.9%" },
            { id: "wp34", title: "Word Search", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", frequency: "High", acceptance: "41.0%" },
            { id: "wp35", title: "Subsets", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", frequency: "High", acceptance: "80.9%" },
            { id: "wp36", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "58.4%" },
            { id: "wp37", title: "Course Schedule", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "55.0%" },
            { id: "wp38", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "54.7%" },
            { id: "wp39", title: "Check if One String Swap Can Make Strings Equal", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/", frequency: "Medium", acceptance: "46.2%" },
            { id: "wp40", title: "Plus One", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/plus-one/", frequency: "Medium", acceptance: "45.0%" },
            { id: "wp41", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "wp42", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "Medium", acceptance: "58.8%" },
            { id: "wp43", title: "Longest Common Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-common-subsequence/", frequency: "High", acceptance: "68.2%" },
            { id: "wp44", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "wp45", title: "Excel Sheet Column Number", difficulty: "Easy", topic: "Math", url: "https://leetcode.com/problems/excel-sheet-column-number/", frequency: "Low", acceptance: "64.1%" },
            { id: "wp46", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "wp47", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "46.7%" },
            { id: "wp48", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "wp49", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "wp50", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "wp51", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "wp52", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "56.8%" },
            { id: "wp53", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "wp54", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "wp55", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "wp56", title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/sudoku-solver/", frequency: "Medium", acceptance: "55.0%" },
            { id: "wp57", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "wp58", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "wp59", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" }
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
        id: "deloitte", name: "Deloitte", logo: "https://unavatar.io/deloitte.com?fallback=https://ui-avatars.com/api/?name=D&background=random", gradient: "from-green-700 to-green-500",
        tier: "Service", description: "Professional services — audit, consulting, advisory, tax",
        avgPackage: "₹7-17 LPA",
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
            { id: "dl17", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "35.5%" },
            { id: "dl18", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "36.5%" },
            { id: "dl19", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "41.0%" },
            { id: "dl20", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "42.0%" },
            { id: "dl21", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "32.0%" },
            { id: "dl22", title: "Edit Distance", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "51.0%" },
            { id: "dl23", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "56.8%" },
            { id: "dl24", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.0%" },
            { id: "dl25", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "Medium", acceptance: "28.0%" },
            { id: "dl26", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "Medium", acceptance: "60.0%" },
            { id: "dl27", title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/sudoku-solver/", frequency: "Medium", acceptance: "55.0%" },
            { id: "dl28", title: "Word Ladder", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "36.0%" },
            { id: "dl29", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.0%" },
            { id: "dl30", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "39.0%" },
            { id: "dl31", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "40.0%" }
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
    mkSvc("techmahindra", "Tech Mahindra", "https://unavatar.io/techmahindra.com?fallback=https://ui-avatars.com/api/?name=T&background=random", "from-blue-700 to-blue-500", "IT services, BPO, and digital transformation", "₹4-8 LPA", 0, ["Aptitude & Essay", "Technical & Psychometric", "Conversational Test", "Technical Interview"],
        [
            "The 'Essay Writing' round is unique; focus on grammar and coherence.",
            "Psychometric test assesses personality; be consistent in your answers.",
            "Technical rounds cover Pseudocode, SQL, and basic Programming (Palindrome, Prime)."
        ],
        [
            { label: "Tech Mahindra Careers", url: "https://careers.techmahindra.com/" },
            { label: "GFG Tech Mahindra Prep", url: "https://www.geeksforgeeks.org/tech-mahindra-recruitment-process/" }
        ]
    ),
    mkSvc("mphasis", "Mphasis", "https://unavatar.io/mphasis.com?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-purple-600 to-purple-400", "IT services and applied technology", "₹5-10 LPA", 1, ["Online Assessment", "Technical Interview", "HR Round"],
        [
            "Assessment includes a dedicated 'Computer Science Fundamentals' section (OS, DBMS).",
            "Be prepared to explain your project architecture and DB schema in detail.",
            "SVAR (Voice Assessment) round tests your English fluency and pronunciation."
        ],
        [
            { label: "Mphasis Careers", url: "https://careers.mphasis.com/" }
        ]
    ),
    mkSvc("mindtree", "Mindtree", "https://unavatar.io/mindtree.com?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-green-600 to-green-400", "Digital transformation and technology services", "₹5-10 LPA", 2),
    mkSvc("kpit", "KPIT Technologies", "https://unavatar.io/kpit.com?fallback=https://ui-avatars.com/api/?name=K&background=random", "from-blue-600 to-indigo-500", "Automotive embedded tech and mobility solutions", "₹6-12 LPA", 0, ["Aptitude & Technical MCQ", "Coding & English", "Technical Interview", "HR"],
        [
            "Heavy, heavy focus on C/C++ pointers and Embedded Systems concepts.",
            "Gamified assessment rounds test memory and speed/accuracy.",
            "Expect questions on Microprocessors and Digital Electronics."
        ],
        [
            { label: "KPIT Careers", url: "https://www.kpit.com/careers/" }
        ]
    ),
    mkSvc("cyient", "Cyient", "https://unavatar.io/cyient.com?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-blue-500 to-teal-500", "Engineering, manufacturing and geospatial services", "₹5-10 LPA", 1, ["Online Test", "Technical Round", "HR Round"],
        [
            "Technical round may involve writing pseudo-code on a notepad.",
            "Java 8 features (Lambdas, Streams) are frequently asked.",
            "Focus on Core Engineering concepts if applying for core roles."
        ],
        [
            { label: "Cyient Careers", url: "https://www.cyient.com/careers" }
        ]
    ),
    mkSvc("birlasoft", "Birlasoft", "https://unavatar.io/birlasoft.com?fallback=https://ui-avatars.com/api/?name=B&background=random", "from-emerald-600 to-green-500", "Enterprise digital solutions and IT services", "₹5-8 LPA", 2, ["English Assessment", "Technical MCQ & Coding", "Technical Interview", "HR"],
        [
            "English Assessment evaluates listening and speaking skills (Versant-style).",
            "Technical MCQs cover a broad range: C/C++, DBMS, OS, Networking.",
            "Be ready to explain project database schema (Normal forms, Joins)."
        ],
        [
            { label: "Birlasoft Careers", url: "https://www.birlasoft.com/careers" }
        ]
    ),


    // ═══ STARTUP COMPANIES (A-Z from placement list) ═══
    mkSvc("3ea", "3EA", "https://unavatar.io/3ea.in?fallback=https://ui-avatars.com/api/?name=3&background=random", "from-red-600 to-red-400", "Management consulting and business transformation", "₹5-10 LPA", 1),
    mkSvc("64squares", "64squares", "https://unavatar.io/64squares.com?fallback=https://ui-avatars.com/api/?name=6&background=random", "from-slate-700 to-slate-500", "Data analytics and digital solutions", "₹7-14 LPA", 2),
    mkSvc("agiliad", "Agiliad", "https://unavatar.io/agiliad.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-blue-600 to-blue-400", "Software engineering and digital product development", "₹6-12 LPA", 0),
    mkStart("abs", "ABS", "https://unavatar.io/abs-solutions.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-blue-600 to-blue-400", "Technology solutions provider", "₹4-7 LPA", 2),
    mkStart("aligned", "Aligned Automation", "https://unavatar.io/alignedautomation.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-blue-500 to-blue-400", "Business process automation", "₹5-8 LPA", 1),
    mkStart("altizon", "Altizon Inc.", "https://unavatar.io/altizon.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-orange-500 to-amber-500", "Industrial IoT platform company", "₹6-12 LPA", 2),

    mkStart("amura", "Amura", "https://unavatar.io/amuratech.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-pink-500 to-rose-500", "Marketing technology solutions", "₹5-10 LPA", 3),
    mkStart("anchanto", "Anchanto", "https://unavatar.io/anchanto.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-indigo-500 to-blue-500", "SaaS platform for e-commerce logistics", "₹6-12 LPA", 0),

    mkStart("apisero", "Apisero", "https://unavatar.io/apisero.com?fallback=https://ui-avatars.com/api/?name=A&background=random", "from-green-600 to-teal-500", "MuleSoft and Salesforce consulting", "₹6-12 LPA", 1),

    mkStart("bitwise", "Bitwise", "https://unavatar.io/bitwiseglobal.com?fallback=https://ui-avatars.com/api/?name=B&background=random", "from-blue-600 to-indigo-500", "IT and software services company", "₹5-10 LPA", 2),

    mkSvc("bizamica", "bizAmica Software", "https://unavatar.io/bizamica.com?fallback=https://ui-avatars.com/api/?name=B&background=random", "from-blue-500 to-indigo-500", "AI and machine learning based software solutions", "₹6-11 LPA", 1),
    mkStart("brightchamps", "BrightChamps", "https://unavatar.io/brightchamps.com?fallback=https://ui-avatars.com/api/?name=B&background=random", "from-orange-500 to-yellow-400", "EdTech — coding & STEM for kids", "₹5-10 LPA", 0),

    mkSvc("buddi-ai", "BUDDI.AI", "https://unavatar.io/buddi.ai?fallback=https://ui-avatars.com/api/?name=B&background=random", "from-green-600 to-emerald-500", "AI-driven healthcare revenue cycle management", "₹7-14 LPA", 2),
    mkStart("cakesoft", "CakeSoft Technologies", "https://unavatar.io/cakesoft.com?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-pink-500 to-red-500", "Web and mobile app development", "₹4-7 LPA", 2),
    mkSvc("centiro", "Centiro", "https://unavatar.io/centiro.com?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-blue-600 to-sky-500", "Cloud-based delivery management and logistics", "₹10-17 LPA", 1),
    mkSvc("cloudwerx", "Cloudwerx", "https://unavatar.io/cloudwerx.tech?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-blue-500 to-cyan-500", "Google Cloud consulting and digital transformation", "₹10-18 LPA", 1),
    mkStart("codevita", "Codevita Live", "https://unavatar.io/codevita.live?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-blue-500 to-purple-500", "Coding competition and talent platform", "₹5-10 LPA", 1),
    mkStart("deqode", "Deqode", "https://unavatar.io/deqode.com?fallback=https://ui-avatars.com/api/?name=D&background=random", "from-indigo-600 to-blue-500", "Blockchain and web3 development", "₹6-12 LPA", 2),

    mkProd("elasticrun", "ElasticRun", "https://unavatar.io/elasticrun.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-blue-600 to-blue-400", "B2B eCommerce Platform for rural India", "₹14-30 LPA", 3, ["Coding Round", "Technical x2", "Managerial"], ["Focus on Graph/Tree algorithms.", "Expect deep questions on your Resume Projects."], [{ label: "ElasticRun Careers", url: "https://www.elastic.run/" }]),

    mkStart("enthralltech", "EnthrallTech", "https://unavatar.io/enthralltech.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-green-500 to-emerald-500", "Digital solutions and consultancy", "₹4-7 LPA", 0),
    mkStart("epikindifi", "EPIKInDiFi", "https://unavatar.io/epikindifi.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-purple-600 to-indigo-500", "Fintech and digital finance solutions", "₹5-10 LPA", 1),
    {
        ...mkSvc("eqtechnologic", "eQ Technologic", "https://unavatar.io/eqtechnologic.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-blue-700 to-blue-500", "Enterprise data synchronization and analytics", "₹10-19 LPA", 1),
        interviewExperiences: [
            {
                title: "eQ Technologic Interview Experience (On-Campus SDE)",
                author: "Anonymous",
                summary: "The selection process included an online test with aptitude and coding, followed by 2 technical rounds. Core focus was on Java, SQL, and Object-Oriented Programming concepts.",
                url: "https://www.pict.live/company/eq-technologic"
            }
        ]
    },
    mkStart("eumentis", "Eumentis Cloud", "https://unavatar.io/eumentis.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-sky-500 to-blue-500", "Cloud infrastructure and DevOps", "₹5-10 LPA", 3),
    mkSvc("extramarks", "Extramarks Education", "https://unavatar.io/extramarks.com?fallback=https://ui-avatars.com/api/?name=E&background=random", "from-orange-500 to-red-500", "Digital learning solutions and edtech platform", "₹6-12 LPA", 1),
    mkStart("fabricinc", "Fabric Inc", "https://unavatar.io/fabric.inc?fallback=https://ui-avatars.com/api/?name=F&background=random", "from-purple-500 to-violet-500", "Micro-fulfillment technology", "₹6-12 LPA", 1),
    mkStart("flogroup", "Flo Group", "https://unavatar.io/flo-group.com?fallback=https://ui-avatars.com/api/?name=F&background=random", "from-blue-500 to-blue-400", "Technology and business consulting", "₹4-7 LPA", 2),
    mkStart("gns", "GNS Engineering India", "https://unavatar.io/gns-mbh.com?fallback=https://ui-avatars.com/api/?name=G&background=random", "from-blue-600 to-blue-500", "Engineering design services", "₹4-7 LPA", 3),
    mkSvc("growisto", "Growisto", "https://unavatar.io/growisto.com?fallback=https://ui-avatars.com/api/?name=G&background=random", "from-blue-600 to-blue-400", "E-commerce marketing and technology services", "₹7-14 LPA", 4),
    mkStart("helpshift", "Helpshift Technologies", "https://unavatar.io/helpshift.com?fallback=https://ui-avatars.com/api/?name=H&background=random", "from-blue-500 to-indigo-500", "AI-powered customer service platform", "₹7-14 LPA", 1),

    mkSvc("hexaview", "Hexaview Technologies", "https://unavatar.io/hexaviewtech.com?fallback=https://ui-avatars.com/api/?name=H&background=random", "from-blue-700 to-indigo-500", "Digital transformation and software consulting", "₹7-14 LPA", 1),
    mkStart("infogenlabs", "Infogen Labs", "https://unavatar.io/infogenlabs.com?fallback=https://ui-avatars.com/api/?name=I&background=random", "from-green-600 to-green-500", "Software development services", "₹4-7 LPA", 3),
    mkSvc("integrichain", "IntegriChain", "https://unavatar.io/integrichain.com?fallback=https://ui-avatars.com/api/?name=I&background=random", "from-blue-600 to-sky-500", "Life sciences data and analytics platform", "₹10-19 LPA", 1),
    mkStart("iqdigital", "iQ Digital", "https://unavatar.io/iqdigital.com?fallback=https://ui-avatars.com/api/?name=I&background=random", "from-purple-500 to-pink-500", "Digital marketing and technology", "₹4-7 LPA", 1),
    mkSvc("jaro", "Jaro Education", "https://unavatar.io/jaroeducation.com?fallback=https://ui-avatars.com/api/?name=J&background=random", "from-blue-800 to-blue-600", "Online higher education and executive programs", "₹7-14 LPA", 1),
    mkStart("jisasoftech", "JISA Softech", "https://unavatar.io/jisasoftech.com?fallback=https://ui-avatars.com/api/?name=J&background=random", "from-blue-500 to-blue-400", "Payment solutions and fintech", "₹4-7 LPA", 3),
    mkSvc("jombay", "Jombay", "https://unavatar.io/jombay.com?fallback=https://ui-avatars.com/api/?name=J&background=random", "from-blue-600 to-blue-400", "Talent assessment and leadership development", "₹7-14 LPA", 1, ["Online Assessment", "Technical Interview", "HR Round"],
        [
            "Focus on Backend (Node.js/Ruby) and DBs (MongoDB/Postgres).",
            "Understanding of RESTful APIs and Linux basics is crucial.",
            "Expect questions on HTTP protocol and OWASP security standards."
        ],
        [
            { label: "Jombay Careers", url: "https://www.jombay.com/careers/" }
        ]
    ),
    mkStart("k12techno", "K12 Techno Services", "https://unavatar.io/k12techno.com?fallback=https://ui-avatars.com/api/?name=K&background=random", "from-blue-600 to-blue-400", "K-12 education technology services", "₹4-7 LPA", 1),
    mkSvc("kylas", "Kylas", "https://unavatar.io/kylas.io?fallback=https://ui-avatars.com/api/?name=K&background=random", "from-indigo-600 to-blue-500", "Sales CRM for small and medium businesses", "₹6-12 LPA", 1),
    mkStart("mastercard2", "McKinley & Rice", "https://unavatar.io/mckinleyrice.com?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-orange-600 to-orange-400", "Design and technology agency", "₹5-10 LPA", 3),
    mkStart("medlypharmacy", "Medly Pharmacy", "https://unavatar.io/medly.com?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-green-500 to-teal-500", "Digital pharmacy platform", "₹5-10 LPA", 0),

    mkStart("mindstix", "Mindstix Software Labs", "https://unavatar.io/mindstix.com?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-blue-500 to-blue-400", "Software product engineering", "₹4-7 LPA", 1),
    mkStart("miniorange", "miniOrange", "https://unavatar.io/miniorange.com?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-orange-500 to-yellow-400", "Identity and access management", "₹5-10 LPA", 2),

    mkStart("moxie", "Moxie", "https://unavatar.io/moxie.ai?fallback=https://ui-avatars.com/api/?name=M&background=random", "from-purple-600 to-pink-500", "Customer experience analytics", "₹5-10 LPA", 3),
    mkStart("onextel", "oneXtel", "https://unavatar.io/onextel.com?fallback=https://ui-avatars.com/api/?name=O&background=random", "from-blue-600 to-blue-500", "Cloud communication platform", "₹4-7 LPA", 0),
    mkSvc("planetspark", "PlanetSpark", "https://unavatar.io/planetspark.in?fallback=https://ui-avatars.com/api/?name=P&background=random", "from-orange-500 to-red-500", "Edtech platform for communication skills", "₹6-12 LPA", 1),
    mkStart("productdossier", "Product Dossier", "https://unavatar.io/productdossier.com?fallback=https://ui-avatars.com/api/?name=P&background=random", "from-blue-500 to-blue-400", "Project management SaaS", "₹5-10 LPA", 2),
    mkProd("purplle", "Purplle", "https://unavatar.io/purplle.com?fallback=https://ui-avatars.com/api/?name=P&background=random", "from-purple-500 to-pink-500", "Online beauty and personal care unicorn", "₹18-36 LPA", 3, ["DSA Round", "HLD Round", "Culture Fit"], ["HLD for E-commerce (Scalability) is key.", "DSA often involves Strings/Palindromes."], [{ label: "Purplle Careers", url: "https://www.purplle.com/careers" }]),

    mkStart("rackware", "RackWare Technologies", "https://unavatar.io/rackware.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-blue-700 to-blue-500", "Cloud migration and DR solutions", "₹5-10 LPA", 0),
    mkStart("raydendesign", "Rayden Design", "https://unavatar.io/raydendesign.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-pink-500 to-rose-500", "UI/UX design and development", "₹4-7 LPA", 1),
    mkStart("redpanda", "Red Panda", "https://unavatar.io/redpanda.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-red-500 to-orange-400", "Technology consulting services", "₹4-7 LPA", 2),
    mkStart("riaadvisory", "RIA Advisory", "https://unavatar.io/riaadvisory.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-blue-600 to-blue-400", "Technology advisory and consulting", "₹5-10 LPA", 3),
    mkStart("rtcamp", "rtCamp", "https://unavatar.io/rtcamp.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-orange-500 to-red-500", "WordPress VIP and web engineering", "₹6-12 LPA", 0, ["Assignment/GitHub Review", "Technical Round 1", "Technical Round 2", "HR"],
        [
            "Selection often based on Github profile & Open Source contributions (WordPress/React).",
            "Deep questions on Web Fundamentals (DNS, HTTP, Cookies, Sessions).",
            "Assignments often involve building a plugin or a React component."
        ],
        [
            { label: "rtCamp Careers", url: "https://rtcamp.com/careers/" },
            { label: "rtCamp Campus Guide", url: "https://careers.rtcamp.com/campus/" }
        ]
    ),

    mkStart("rudder", "Rudder Analytics", "https://unavatar.io/rudderanalytics.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-teal-500 to-green-500", "Business intelligence solutions", "₹5-10 LPA", 1),
    mkStart("ryussi", "Ryussi Technologies", "https://unavatar.io/ryussi.com?fallback=https://ui-avatars.com/api/?name=R&background=random", "from-blue-500 to-indigo-500", "AI-powered analytics platform", "₹5-10 LPA", 2),
    mkSvc("sagitec", "Sagitec", "https://unavatar.io/sagitec.com?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-blue-700 to-blue-500", "Software solutions for pension and healthcare", "₹7-14 LPA", 0),
    mkStart("scalex", "Scalex Technology", "https://unavatar.io/scalex.in?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-green-500 to-emerald-500", "Scalable technology solutions", "₹4-7 LPA", 0),
    mkProd("gupshup", "Gupshup", "https://unavatar.io/gupshup.io?fallback=https://ui-avatars.com/api/?name=G&background=random", "from-purple-500 to-indigo-500", "Conversational messaging unicorn", "₹12-24 LPA", 1, ["Online Assessment", "Code Review", "Technical"], ["OA is unique: 1 question in 3 hours (Clean Code focus).", "Manual Code Review is a distinct stage."], [{ label: "Gupshup Careers", url: "https://www.gupshup.io/careers" }]),
    mkStart("se2", "SE2", "https://unavatar.io/se2.com?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-blue-700 to-blue-500", "Life insurance administration platform", "₹6-12 LPA", 2),
    mkStart("sedemac", "Sedemac Mechatronics", "https://unavatar.io/sedemac.com?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-green-600 to-green-400", "Automotive electronics systems", "₹5-10 LPA", 3),
    mkStart("selldo", "Sell.do", "https://unavatar.io/sell.do?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-blue-600 to-cyan-500", "Real estate CRM platform", "₹5-10 LPA", 0),

    mkStart("swasthyaai", "Swasthya AI", "https://unavatar.io/swasthya.ai?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-green-500 to-teal-500", "AI-powered healthcare diagnostics", "₹6-12 LPA", 1),

    mkStart("symblai", "Symbl.ai", "https://unavatar.io/symbl.ai?fallback=https://ui-avatars.com/api/?name=S&background=random", "from-purple-600 to-indigo-500", "Conversational intelligence API platform", "₹7-14 LPA", 2),

    mkStart("talentio", "Talentio", "https://unavatar.io/talentio.in?fallback=https://ui-avatars.com/api/?name=T&background=random", "from-blue-500 to-blue-400", "HR tech and recruitment platform", "₹4-7 LPA", 3),

    mkStart("techverito", "TechVerito", "https://unavatar.io/techverito.com?fallback=https://ui-avatars.com/api/?name=T&background=random", "from-orange-500 to-amber-500", "Agile software development services", "₹6-12 LPA", 0),
    mkProd("tracelink", "Tracelink", "https://unavatar.io/tracelink.com?fallback=https://ui-avatars.com/api/?name=T&background=random", "from-blue-600 to-sky-500", "Digital supply chain network for life sciences", "₹10-19 LPA", 1),
    mkProd("tripstack", "TripStack", "https://unavatar.io/tripstack.com?fallback=https://ui-avatars.com/api/?name=T&background=random", "from-blue-500 to-cyan-500", "Travel technology and flight booking solutions", "₹10-19 LPA", 1),
    mkStart("udchalo", "udChalo", "https://unavatar.io/udchalo.com?fallback=https://ui-avatars.com/api/?name=U&background=random", "from-orange-500 to-red-500", "Travel platform for armed forces", "₹5-10 LPA", 3),

    mkStart("unschool", "Unschool", "https://unavatar.io/unschool.in?fallback=https://ui-avatars.com/api/?name=U&background=random", "from-purple-500 to-pink-500", "Online professional learning platform", "₹4-7 LPA", 0),

    mkStart("uolocom", "Uolo.com", "https://unavatar.io/uolo.com?fallback=https://ui-avatars.com/api/?name=U&background=random", "from-blue-500 to-indigo-500", "EdTech for schools and parents", "₹4-7 LPA", 1),

    mkStart("vadini", "Vadini Infocenter", "https://unavatar.io/vadiniinfocenter.com?fallback=https://ui-avatars.com/api/?name=V&background=random", "from-green-500 to-green-400", "IT infrastructure services", "₹4-7 LPA", 2),
    mkStart("valuence", "Valuence Holdings", "https://unavatar.io/valuence.inc?fallback=https://ui-avatars.com/api/?name=V&background=random", "from-blue-600 to-blue-500", "Luxury brand marketplace", "₹5-10 LPA", 3),
    mkStart("verticalfox", "Vertical Fox", "https://unavatar.io/verticalfox.com?fallback=https://ui-avatars.com/api/?name=V&background=random", "from-orange-500 to-amber-400", "Digital marketing agency", "₹4-7 LPA", 0),
    mkSvc("wednesday", "Wednesday Solutions", "https://unavatar.io/wednesday.solutions?fallback=https://ui-avatars.com/api/?name=W&background=random", "from-blue-600 to-blue-400", "Digital product agency and software consulting", "₹10-19 LPA", 1),
    mkStart("whizai", "Whiz.ai", "https://unavatar.io/whiz.ai?fallback=https://ui-avatars.com/api/?name=W&background=random", "from-purple-600 to-blue-500", "AI analytics for life sciences", "₹7-14 LPA", 2),

    mkStart("winjit", "Winjit Technologies", "https://unavatar.io/winjit.com?fallback=https://ui-avatars.com/api/?name=W&background=random", "from-blue-500 to-blue-400", "IoT and mobility solutions", "₹5-10 LPA", 3),

    mkStart("yardi", "Yardi Software", "https://unavatar.io/yardi.com?fallback=https://ui-avatars.com/api/?name=Y&background=random", "from-green-600 to-emerald-500", "Real estate investment and property management", "₹6-11 LPA", 0, ["Aptitude", "Technical (SQL/Java)", "Managerial"], ["SQL (Joins, Stored Procedures) is heavily tested.", "Java OOPs and String manipulation are common."], [{ label: "Yardi Careers", url: "https://www.yardi.com/about-us/careers/" }]),

    mkStart("zlen", "Zlen", "https://unavatar.io/zlen.io?fallback=https://ui-avatars.com/api/?name=Z&background=random", "from-blue-600 to-cyan-500", "Technology solutions company", "₹4-7 LPA", 1),
    mkStart("hashedin", "HashedIn Technologies", "https://unavatar.io/hashedin.com?fallback=https://ui-avatars.com/api/?name=H&background=random", "from-orange-500 to-red-500", "Product engineering and cloud-native development", "₹7-14 LPA", 2, ["Coding Round", "Technical Interview 1", "Technical Interview 2", "HR"],
        [
            "HashedIn focuses heavily on 'Clean Code' and 'Design Patterns'.",
            "Expect 2-3 Medium/Hard LeetCode problems in the first tech round.",
            "Knowledge of Cloud (AWS/Azure) is a huge plus."
        ],
        [
            { label: "HashedIn Careers", url: "https://hashedin.com/careers/" }
        ]
    ),
    mkStart("geekyants", "GeekyAnts", "https://unavatar.io/geekyants.com?fallback=https://ui-avatars.com/api/?name=G&background=random", "from-blue-500 to-indigo-500", "Mobile and web app development studio", "₹6-12 LPA", 3, ["Prelim Assessment", "Technical Assignment", "Technical Interview"],
        [
            "Strong focus on ReactJS, React Native, and Next.js ecosystem.",
            "Assignments are practical: 'Build a dashboard' or 'To-Do app' in 2-3 days.",
            "System Design questions for freshers (e.g., 'Design a parking lot')."
        ],
        [
            { label: "GeekyAnts Careers", url: "https://geekyants.com/careers" }
        ]
    ),
    mkProd("clevertap", "CleverTap", "https://unavatar.io/clevertap.com?fallback=https://ui-avatars.com/api/?name=C&background=random", "from-red-500 to-pink-500", "Customer retention and engagement platform", "₹17-34 LPA", 0, ["Phone Screen", "Onsite Coding", "Behavioral"], ["Java internals (GC, Memory Model) are asked.", "DB concepts (MongoDB, JSON structure)."], [{ label: "CleverTap Engineering", url: "https://clevertap.com/blog/category/engineering/" }]),
    mkProd("postman", "Postman", "https://unavatar.io/postman.com?fallback=https://ui-avatars.com/api/?name=P&background=random", "from-orange-500 to-orange-400", "API development collaboration platform", "₹10-22 LPA", 1, ["Online Coding", "System Design", "Technical Round", "Behavioral"],
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
