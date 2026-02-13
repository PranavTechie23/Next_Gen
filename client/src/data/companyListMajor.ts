import { Company, mkP, mkProd, mkFin, PROD_POOL, FIN_POOL } from "./companyProblemPools";

// ─── FAANG + Major Companies with REAL LeetCode Data ────────────────────
export const MAJOR_COMPANIES: Company[] = [
    {
        id: "google", name: "Google", logo: "https://logo.clearbit.com/google.com", gradient: "from-blue-500 to-green-500",
        tier: "FAANG", description: "Search, Cloud, AI and global technology leader",
        avgPackage: "₹25-45 LPA",
        interviewRounds: ["Phone Screen", "Coding Round x2", "System Design", "Googlyness & Leadership"],
        interviewTips: [
            "Prepare specifically for 'Googlyness' — a measure of cultural fit, focusing on comfort with ambiguity, humility, and valuing feedback.",
            "Use the SPSIL framework (Situation, Problem, Solution, Impact, Lessons) for behavioral questions.",
            "Clarifying questions are crucial; never jump straight to coding. Google values 'Thought Process' over immediate answers.",
            "Expect a mix of standard algorithms and open-ended problems where you need to define the constraints."
        ],
        resources: [
            { label: "Google Tech Dev Guide", url: "https://techdevguide.withgoogle.com/" },
            { label: "LeetCode Google Discuss", url: "https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=most_relevant&query=google" },
            { label: "NeetCode Google Playlist", url: "https://www.youtube.com/playlist?list=PL7g1jYj15RUOaw9SC4J_5QyGZk-K_pZl4" }
        ],
        problems: [
            { id: "g1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "g2", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "g3", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "43.8%" },
            { id: "g4", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "g5", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "High", acceptance: "45.5%" },
            { id: "g6", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "g7", title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/longest-consecutive-sequence/", frequency: "High", acceptance: "47.0%" },
            { id: "g8", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "g9", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "Medium", acceptance: "77.9%" },
            { id: "g10", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", frequency: "High", acceptance: "42.8%" },
            { id: "g11", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", frequency: "Medium", acceptance: "79.2%" },
            { id: "g12", title: "4Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/4sum/", frequency: "Medium", acceptance: "38.2%" },
            { id: "g13", title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/find-median-from-data-stream/", frequency: "High", acceptance: "53.3%" },
            { id: "g14", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "53.7%" },
            { id: "g15", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "Medium", acceptance: "41.1%" },
            { id: "g16", title: "Find the Duplicate Number", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-the-duplicate-number/", frequency: "Medium", acceptance: "63.0%" },
            { id: "g17", title: "Minimum Path Sum", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/minimum-path-sum/", frequency: "Medium", acceptance: "66.5%" },
            { id: "g18", title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", frequency: "Medium", acceptance: "75.3%" },
            { id: "g19", title: "Clone Graph", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/clone-graph/", frequency: "Medium", acceptance: "62.4%" },
            { id: "g20", title: "Word Search II", difficulty: "Hard", topic: "Trie", url: "https://leetcode.com/problems/word-search-ii/", frequency: "Medium", acceptance: "37.3%" },
            { id: "g21", title: "Binary Tree Right Side View", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-right-side-view/", frequency: "Medium", acceptance: "67.0%" },
            { id: "g22", title: "The Skyline Problem", difficulty: "Hard", topic: "Divide and Conquer", url: "https://leetcode.com/problems/the-skyline-problem/", frequency: "Medium", acceptance: "44.0%" },
            { id: "g23", title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", frequency: "Medium", acceptance: "60.5%" },
            { id: "g24", title: "Flatten Binary Tree to Linked List", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/", frequency: "Medium", acceptance: "68.5%" },
            { id: "g25", title: "Shortest Palindrome", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/shortest-palindrome/", frequency: "Medium", acceptance: "40.7%" },
            { id: "g26", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-increasing-subsequence/", frequency: "High", acceptance: "52.8%" },
            { id: "g27", title: "Burst Balloons", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/burst-balloons/", frequency: "Medium", acceptance: "58.2%" },
            { id: "g28", title: "Alien Dictionary", difficulty: "Hard", topic: "Topological Sort", url: "https://leetcode.com/problems/alien-dictionary/", frequency: "Medium", acceptance: "35.4%" },
            { id: "g29", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "33.4%" },
            { id: "g30", title: "Russian Doll Envelopes", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/russian-doll-envelopes/", frequency: "Medium", acceptance: "37.6%" },
            { id: "g31", title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", frequency: "Medium", acceptance: "64.5%" },
            { id: "g32", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", frequency: "High", acceptance: "68.5%" },
            { id: "g33", title: "Accounts Merge", difficulty: "Hard", topic: "Union Find", url: "https://leetcode.com/problems/accounts-merge/", frequency: "Medium", acceptance: "49.2%" },
            { id: "g34", title: "Wildcard Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/wildcard-matching/", frequency: "Medium", acceptance: "27.3%" },
            { id: "g35", title: "Remove Duplicate from Sorted Array", difficulty: "Easy", topic: "Arrays", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", frequency: "High", acceptance: "60.0%" },
            { id: "g36", title: "Smallest Subarray with Sum Greater Than X", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-size-subarray-sum/", frequency: "High", acceptance: "46.1%" },
            { id: "g37", title: "Find First and Last Position of Element", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", frequency: "High", acceptance: "42.8%" },
            { id: "g38", title: "Range Sum of BST", difficulty: "Easy", topic: "Trees", url: "https://leetcode.com/problems/range-sum-of-bst/", frequency: "High", acceptance: "86.1%" },
            { id: "g39", title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Prefix Sum", url: "https://leetcode.com/problems/subarray-sum-equals-k/", frequency: "High", acceptance: "45.5%" },
            { id: "g40", title: "Super Egg Drop", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/super-egg-drop/", frequency: "Medium", acceptance: "27.0%" },
            { id: "g41", title: "Word Break", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/word-break/", frequency: "High", acceptance: "48.1%" },
            { id: "g42", title: "Subarray Product Less Than K", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/subarray-product-less-than-k/", frequency: "Medium", acceptance: "50.1%" },
            { id: "g43", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", frequency: "High", acceptance: "56.0%" },
            { id: "g44", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "58.4%" },
            { id: "g45", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "Medium", acceptance: "33.1%" },
            { id: "g46", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "40.8%" },
            { id: "g47", title: "Numbers With Same Consecutive Differences", difficulty: "Medium", topic: "BFS/DFS", url: "https://leetcode.com/problems/numbers-with-same-consecutive-differences/", frequency: "Medium", acceptance: "58.2%" },
            { id: "g48", title: "Minimum Knight Moves", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/minimum-knight-moves/", frequency: "Medium", acceptance: "41.3%" },
            { id: "g49", title: "Decode Ways", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/decode-ways/", frequency: "High", acceptance: "33.5%" },
            { id: "g50", title: "Construct BST from Preorder Traversal", difficulty: "Medium", topic: "Trees", url: "https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/", frequency: "Medium", acceptance: "81.6%" },
            { id: "g51", title: "Intersection of Two Arrays", difficulty: "Easy", topic: "Arrays", url: "https://leetcode.com/problems/intersection-of-two-arrays/", frequency: "High", acceptance: "71.6%" },
            { id: "g52", title: "Valid Sudoku", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/valid-sudoku/", frequency: "High", acceptance: "60.0%" },
            { id: "g53", title: "Add Strings", difficulty: "Easy", topic: "Strings", url: "https://leetcode.com/problems/add-strings/", frequency: "Medium", acceptance: "53.2%" },
            { id: "g54", title: "Maximum Product Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-product-subarray/", frequency: "Medium", acceptance: "35.3%" },
            { id: "g55", title: "String to Integer (atoi)", difficulty: "Medium", topic: "String", url: "https://leetcode.com/problems/string-to-integer-atoi/", frequency: "Medium", acceptance: "18.3%" },
            { id: "g56", title: "Valid Palindrome", difficulty: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/valid-palindrome/", frequency: "High", acceptance: "48.6%" },
            { id: "g57", title: "Longest Repeating Character Replacement", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", frequency: "Medium", acceptance: "53.2%" },
            { id: "g58", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "54.7%" },
            { id: "g59", title: "Is Subsequence", difficulty: "Easy", topic: "Two Pointers", url: "https://leetcode.com/problems/is-subsequence/", frequency: "High", acceptance: "47.7%" },
            { id: "g60", title: "Count of Smaller Numbers After Self", difficulty: "Hard", topic: "Segment Tree", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", frequency: "Medium", acceptance: "42.5%" },
            { id: "g61", title: "Longest Increasing Path in a Matrix", difficulty: "Hard", topic: "DFS", url: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", frequency: "Medium", acceptance: "53.2%" },
            { id: "g62", title: "Range Sum Query 2D - Mutable", difficulty: "Hard", topic: "Binary Indexed Tree", url: "https://leetcode.com/problems/range-sum-query-2d-mutable/", frequency: "Low", acceptance: "44.6%" },
            { id: "g63", title: "Split Array Largest Sum", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/split-array-largest-sum/", frequency: "High", acceptance: "54.7%" },
            { id: "g64", title: "Evaluate Division", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/evaluate-division/", frequency: "Medium", acceptance: "61.6%" },
            { id: "g65", title: "Bus Routes", difficulty: "Hard", topic: "BFS", url: "https://leetcode.com/problems/bus-routes/", frequency: "Medium", acceptance: "47.2%" },
            { id: "g66", title: "Swim in Rising Water", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/swim-in-rising-water/", frequency: "Medium", acceptance: "60.4%" },
            { id: "g67", title: "Cracking the Safe", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/cracking-the-safe/", frequency: "Low", acceptance: "56.8%" },
            { id: "g68", title: "Robot Room Cleaner", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/robot-room-cleaner/", frequency: "High", acceptance: "77.5%" },
            { id: "g69", title: "Logger Rate Limiter", difficulty: "Easy", topic: "Design", url: "https://leetcode.com/problems/logger-rate-limiter/", frequency: "High", acceptance: "74.8%" },
            { id: "g70", title: "Design Search Autocomplete System", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/design-search-autocomplete-system/", frequency: "High", acceptance: "47.7%" },
            { id: "g71", title: "Confusing Number II", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/confusing-number-ii/", frequency: "Medium", acceptance: "49.6%" },
            { id: "g72", title: "Text Justification", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/text-justification/", frequency: "High", acceptance: "42.0%" },
        ]
    },
    {
        id: "amazon", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", gradient: "from-orange-500 to-yellow-500",
        tier: "FAANG", description: "E-commerce, Cloud (AWS), and technology giant",
        avgPackage: "₹20-35 LPA",
        interviewRounds: ["Online Assessment (OA)", "Phone Screen", "Loop (4-5 rounds)", "Bar Raiser"],
        interviewTips: [
            "The 'Bar Raiser' round is unique — an outsider with veto power ensures you raise the hiring bar.",
            "Obsess over the 16 Leadership Principles (LPs). Prepare 2 STAR stories for EACH principle.",
            "OA often includes a 'Work Style Assessment' & 'Work Simulation' — be consistent with LPs.",
            "Customer Obsession, Ownership, and Bias for Action are the most frequently tested LPs.",
            "Write modular code; they care about code quality as much as correctness."
        ],
        resources: [
            { label: "Amazon Leadership Principles", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles" },
            { label: "Striver SDE Sheet", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
            { label: "LeetCode Amazon Discuss", url: "https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=most_relevant&query=amazon" }
        ],
        problems: [
            { id: "a1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "a2", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "a3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "a4", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "a5", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "High", acceptance: "70.9%" },
            { id: "a6", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "a7", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", frequency: "High", acceptance: "37.1%" },
            { id: "a8", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "a9", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "57.8%" },
            { id: "a10", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "56.8%" },
            { id: "a11", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "a12", title: "Generate Parentheses", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/generate-parentheses/", frequency: "High", acceptance: "77.1%" },
            { id: "a13", title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/spiral-matrix/", frequency: "High", acceptance: "53.9%" },
            { id: "a14", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "62.3%" },
            { id: "a15", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "41.1%" },
            { id: "a16", title: "Jump Game II", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game-ii/", frequency: "High", acceptance: "41.5%" },
            { id: "a17", title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/set-matrix-zeroes/", frequency: "High", acceptance: "60.7%" },
            { id: "a18", title: "Subsets", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", frequency: "High", acceptance: "80.9%" },
            { id: "a19", title: "Reverse Nodes in k-Group", difficulty: "Hard", topic: "Linked List", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", frequency: "High", acceptance: "63.0%" },
            { id: "a20", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "High", acceptance: "29.3%" },
            { id: "a21", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "45.4%" },
            { id: "a22", title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", frequency: "High", acceptance: "34.4%" },
            { id: "a23", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens/", frequency: "High", acceptance: "72.8%" },
            { id: "a24", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum/", frequency: "High", acceptance: "74.7%" },
            { id: "a25", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", frequency: "High", acceptance: "53.9%" },
            { id: "a26", title: "Word Ladder", difficulty: "Hard", topic: "BFS", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "48.0%" },
            { id: "a27", title: "Best Time to Buy and Sell Stock III", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/", frequency: "Medium", acceptance: "48.6%" },
            { id: "a28", title: "Binary Tree Path Sum", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/path-sum/", frequency: "Medium", acceptance: "55.6%" },
            { id: "a29", title: "Distinct Subsequences", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/distinct-subsequences/", frequency: "Medium", acceptance: "48.8%" },
            { id: "a30", title: "Odd Even Linked List", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/odd-even-linked-list/", frequency: "Medium", acceptance: "63.2%" },
            { id: "a31", title: "Palindrome Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/palindrome-linked-list/", frequency: "Medium", acceptance: "53.1%" },
            { id: "a32", title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/product-of-array-except-self/", frequency: "High", acceptance: "67.4%" },
            { id: "a33", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", frequency: "High", acceptance: "40.2%" },
            { id: "a34", title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/partition-equal-subset-sum/", frequency: "Medium", acceptance: "48.2%" },
            { id: "a35", title: "Reorder List", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/reorder-list/", frequency: "Medium", acceptance: "55.4%" },
            { id: "a36", title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", frequency: "High", acceptance: "53.6%" },
            { id: "a37", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "40.8%" },
            { id: "a38", title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/find-median-from-data-stream/", frequency: "High", acceptance: "51.8%" },
            { id: "a39", title: "Course Schedule", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "55.0%" },
            { id: "a40", title: "Word Break", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/word-break/", frequency: "High", acceptance: "48.1%" },
            { id: "a41", title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/longest-consecutive-sequence/", frequency: "High", acceptance: "47.0%" },
            { id: "a42", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "a43", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", frequency: "High", acceptance: "61.3%" },
            { id: "a44", title: "Subtree of Another Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/subtree-of-another-tree/", frequency: "Medium", acceptance: "47.7%" },
            { id: "a45", title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", frequency: "High", acceptance: "58.4%" },
            { id: "a46", title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", frequency: "High", acceptance: "68.8%" },
            { id: "a47", title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/top-k-frequent-elements/", frequency: "High", acceptance: "65.4%" },
            { id: "a48", title: "Min Stack", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/min-stack/", frequency: "High", acceptance: "54.8%" },
            { id: "a49", title: "Daily Temperatures", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/daily-temperatures/", frequency: "High", acceptance: "66.5%" },
            { id: "a50", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "47.4%" },
            { id: "a51", title: "Rotting Oranges", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/rotting-oranges/", frequency: "High", acceptance: "53.6%" },
            { id: "a52", title: "Walls and Gates", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/walls-and-gates/", frequency: "Medium", acceptance: "66.1%" },
            { id: "a53", title: "Surrounded Regions", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/surrounded-regions/", frequency: "Medium", acceptance: "38.2%" },
            { id: "a54", title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", frequency: "Medium", acceptance: "54.7%" },
            { id: "a55", title: "Clone Graph", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/clone-graph/", frequency: "Medium", acceptance: "55.7%" },
            { id: "a56", title: "Max Area of Island", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/max-area-of-island/", frequency: "Medium", acceptance: "71.9%" },
            { id: "a57", title: "Number of Enclaves", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-enclaves/", frequency: "Medium", acceptance: "68.2%" },
            { id: "a58", title: "Concatenated Words", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/concatenated-words/", frequency: "Medium", acceptance: "49.6%" },
            { id: "a59", title: "LFU Cache", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/lfu-cache/", frequency: "Medium", acceptance: "45.7%" },
            { id: "a60", title: "Design In-Memory File System", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/design-in-memory-file-system/", frequency: "High", acceptance: "63.9%" },
            { id: "a61", title: "Maximum Frequency Stack", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximum-frequency-stack/", frequency: "Medium", acceptance: "66.5%" },
            { id: "a62", title: "Reorganize String", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/reorganize-string/", frequency: "High", acceptance: "54.2%" },
            { id: "a63", title: "Boundary of Binary Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/boundary-of-binary-tree/", frequency: "High", acceptance: "44.6%" },
            { id: "a64", title: "All Nodes Distance K in Binary Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/", frequency: "Medium", acceptance: "64.0%" },
            { id: "a65", title: "Analyze User Website Visit Pattern", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/analyze-user-website-visit-pattern/", frequency: "High", acceptance: "44.5%" },
            { id: "a66", title: "Integer to English Words", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/integer-to-english-words/", frequency: "High", acceptance: "31.2%" },
            { id: "a67", title: "Design Tic-Tac-Toe", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/design-tic-tac-toe/", frequency: "High", acceptance: "59.3%" },
            { id: "a68", title: "Meeting Rooms II", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/meeting-rooms-ii/", frequency: "High", acceptance: "50.9%" },
            { id: "a69", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.3%" },
        ]
    },
    {
        id: "microsoft", name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", gradient: "from-blue-600 to-green-600",
        tier: "FAANG", description: "Cloud, productivity software & enterprise solutions",
        avgPackage: "₹22-40 LPA",
        interviewRounds: ["Online Assessment", "Phone Screen", "On-site (3-4 rounds)", "As-Appropriate (AA)"],
        interviewTips: [
            "Microsoft values 'Growth Mindset' — show how you learn from failures.",
            "The 'As Appropriate' (AA) interviewer is a senior leader who makes the final call (similar to Bar Raiser).",
            "Focus on Code Readability and Testing. Mentions of Unit Tests score bonus points.",
            "System Design is common for SDE-2 roles; focus on scalability and trade-offs."
        ],
        resources: [
            { label: "Microsoft Careers Tips", url: "https://careers.microsoft.com/v2/global/en/hiring-tips" },
            { label: "LeetCode Microsoft Discuss", url: "https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=most_relevant&query=microsoft" },
            { label: "Striver SDE Sheet", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" }
        ],
        problems: [
            { id: "ms1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "ms2", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "ms3", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "ms4", title: "Add Two Numbers", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/add-two-numbers/", frequency: "High", acceptance: "46.2%" },
            { id: "ms5", title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-palindromic-substring/", frequency: "High", acceptance: "35.8%" },
            { id: "ms6", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "ms7", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "ms8", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "ms9", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", frequency: "High", acceptance: "37.1%" },
            { id: "ms10", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "High", acceptance: "70.9%" },
            { id: "ms11", title: "Reverse Nodes in k-Group", difficulty: "Hard", topic: "Linked List", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", frequency: "High", acceptance: "63.0%" },
            { id: "ms12", title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/spiral-matrix/", frequency: "High", acceptance: "53.9%" },
            { id: "ms13", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "ms14", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "High", acceptance: "77.9%" },
            { id: "ms15", title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", frequency: "High", acceptance: "61.7%" },
            { id: "ms16", title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", frequency: "High", acceptance: "34.4%" },
            { id: "ms17", title: "First Missing Positive", difficulty: "Hard", topic: "Array", url: "https://leetcode.com/problems/first-missing-positive/", frequency: "High", acceptance: "41.1%" },
            { id: "ms18", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum/", frequency: "High", acceptance: "74.7%" },
            { id: "ms19", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "47.4%" },
            { id: "ms20", title: "Permutations", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", frequency: "High", acceptance: "80.7%" },
            { id: "ms21", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "ms22", title: "Edit Distance", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "58.8%" },
            { id: "ms23", title: "Maximal Rectangle", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/maximal-rectangle/", frequency: "Medium", acceptance: "53.7%" },
            { id: "ms24", title: "Valid Sudoku", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/valid-sudoku/", frequency: "Medium", acceptance: "62.3%" },
            { id: "ms25", title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", frequency: "High", acceptance: "68.8%" },
            { id: "ms26", title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/top-k-frequent-elements/", frequency: "High", acceptance: "65.4%" },
            { id: "ms27", title: "Invert Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/invert-binary-tree/", frequency: "Medium", acceptance: "75.3%" },
            { id: "ms28", title: "Course Schedule", difficulty: "Medium", topic: "Topological Sort", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "55.0%" },
            { id: "ms29", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "40.8%" },
            { id: "ms30", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "49.0%" },
            { id: "ms31", title: "Single Number", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/single-number/", frequency: "High", acceptance: "75.2%" },
            { id: "ms32", title: "Majority Element", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/majority-element/", frequency: "High", acceptance: "65.7%" },
            { id: "ms33", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", frequency: "High", acceptance: "40.2%" },
            { id: "ms34", title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/partition-equal-subset-sum/", frequency: "Medium", acceptance: "48.2%" },
            { id: "ms35", title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/set-matrix-zeroes/", frequency: "High", acceptance: "60.0%" },
            { id: "ms36", title: "Missing Number", difficulty: "Easy", topic: "Bit Manipulation", url: "https://leetcode.com/problems/missing-number/", frequency: "High", acceptance: "75.0%" },
            { id: "ms37", title: "String Compression", difficulty: "Medium", topic: "String", url: "https://leetcode.com/problems/string-compression/", frequency: "Medium", acceptance: "54.1%" },
            { id: "ms38", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-increasing-subsequence/", frequency: "High", acceptance: "52.8%" },
            { id: "ms39", title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", frequency: "High", acceptance: "53.6%" },
            { id: "ms40", title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/linked-list-cycle/", frequency: "High", acceptance: "48.6%" },
            { id: "ms41", title: "Sort List", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/sort-list/", frequency: "Medium", acceptance: "57.2%" },
            { id: "ms42", title: "Linked List Cycle II", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/linked-list-cycle-ii/", frequency: "High", acceptance: "50.4%" },
            { id: "ms43", title: "Delete Node in a Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/delete-node-in-a-linked-list/", frequency: "High", acceptance: "77.5%" },
            { id: "ms44", title: "Populating Next Right Pointers", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/", frequency: "High", acceptance: "61.3%" },
            { id: "ms45", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", frequency: "High", acceptance: "61.3%" },
            { id: "ms46", title: "Balanced Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/balanced-binary-tree/", frequency: "Medium", acceptance: "49.6%" },
            { id: "ms47", title: "Recover Binary Search Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/recover-binary-search-tree/", frequency: "Medium", acceptance: "33.9%" },
            { id: "ms48", title: "Subtree of Another Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/subtree-of-another-tree/", frequency: "Medium", acceptance: "47.7%" },
            { id: "ms49", title: "Flatten Binary Tree to Linked List", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/", frequency: "High", acceptance: "68.5%" },
            { id: "ms50", title: "Min Stack", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/min-stack/", frequency: "High", acceptance: "54.8%" },
            { id: "ms51", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "High", acceptance: "45.5%" },
            { id: "ms52", title: "Remove Duplicate Letters", difficulty: "Medium", topic: "String", url: "https://leetcode.com/problems/remove-duplicate-letters/", frequency: "Medium", acceptance: "46.2%" },
            { id: "ms53", title: "Jump Game", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game/", frequency: "High", acceptance: "38.6%" },
            { id: "ms54", title: "Word Search", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", frequency: "High", acceptance: "41.0%" },
            { id: "ms55", title: "4Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/4sum/", frequency: "Medium", acceptance: "38.2%" },
            { id: "ms56", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "33.4%" },
            { id: "ms57", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.3%" },
            { id: "ms58", title: "Serialize and Deserialize N-ary Tree", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/", frequency: "Medium", acceptance: "65.6%" },
            { id: "ms59", title: "Find All Anagrams in a String", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/", frequency: "High", acceptance: "50.7%" },
            { id: "ms60", title: "Basic Calculator II", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/basic-calculator-ii/", frequency: "Medium", acceptance: "43.5%" },
            { id: "ms61", title: "Max Stack", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/max-stack/", frequency: "Medium", acceptance: "43.8%" },
            { id: "ms62", title: "Design Hit Counter", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/design-hit-counter/", frequency: "High", acceptance: "69.0%" },
            { id: "ms63", title: "Encode and Decode TinyURL", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/encode-and-decode-tinyurl/", frequency: "Medium", acceptance: "86.7%" },
            { id: "ms64", title: "Random Pick with Weight", difficulty: "Medium", topic: "Math", url: "https://leetcode.com/problems/random-pick-with-weight/", frequency: "Medium", acceptance: "46.7%" },
            { id: "ms65", title: "Meeting Rooms II", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/meeting-rooms-ii/", frequency: "High", acceptance: "50.9%" },
            { id: "ms66", title: "Employee Free Time", difficulty: "Hard", topic: "Intervals", url: "https://leetcode.com/problems/employee-free-time/", frequency: "Medium", acceptance: "72.4%" },
            { id: "ms67", title: "Reconstruct Itinerary", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/reconstruct-itinerary/", frequency: "Medium", acceptance: "43.1%" },
        ]
    },
    {
        id: "meta", name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", gradient: "from-blue-600 to-indigo-600",
        tier: "FAANG", description: "Social media, VR/AR, and AI technology company",
        avgPackage: "₹30-50 LPA",
        interviewRounds: ["Recruiter Screen", "Coding Round x2", "System Design / Product Design", "Behavioral (Jedi)"],
        interviewTips: [
            "Meta has a 'Hacker Culture' — 'Move Fast' and 'Permissionless Engineering'.",
            "The 'Jedi' round focuses on behavioral questions and conflict resolution.",
            "Coding rounds are fast-paced (2 questions in 45 mins). Speed and bug-free code are paramount.",
            "For System Design (SDE-2+), focus on 'Product Architecture' rather than just backend scaling."
        ],
        resources: [
            { label: "Meta Engineering Culture", url: "https://engineering.fb.com/culture/" },
            { label: "LeetCode Meta Discuss", url: "https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=most_relevant&query=facebook" },
            { label: "Grokking System Design", url: "https://github.com/donnemartin/system-design-primer" }
        ],
        problems: [
            { id: "mt1", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "mt2", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "mt3", title: "Simplify Path", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/simplify-path/", frequency: "High", acceptance: "47.9%" },
            { id: "mt4", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "mt5", title: "Next Permutation", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/next-permutation/", frequency: "High", acceptance: "43.1%" },
            { id: "mt6", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "56.8%" },
            { id: "mt7", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", frequency: "High", acceptance: "37.1%" },
            { id: "mt8", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "mt9", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/", frequency: "High", acceptance: "45.4%" },
            { id: "mt10", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "mt11", title: "Subsets", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", frequency: "Medium", acceptance: "80.9%" },
            { id: "mt12", title: "Add Two Numbers", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/add-two-numbers/", frequency: "High", acceptance: "46.2%" },
            { id: "mt13", title: "Sort Colors", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/sort-colors/", frequency: "High", acceptance: "67.6%" },
            { id: "mt14", title: "Multiply Strings", difficulty: "Medium", topic: "Math", url: "https://leetcode.com/problems/multiply-strings/", frequency: "High", acceptance: "42.3%" },
            { id: "mt15", title: "Word Search", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", frequency: "High", acceptance: "45.3%" },
            { id: "mt16", title: "Generate Parentheses", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/generate-parentheses/", frequency: "High", acceptance: "77.1%" },
            { id: "mt17", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "High", acceptance: "77.9%" },
            { id: "mt18", title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/spiral-matrix/", frequency: "High", acceptance: "53.9%" },
            { id: "mt19", title: "Regular Expression Matching", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/regular-expression-matching/", frequency: "High", acceptance: "29.3%" },
            { id: "mt20", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "47.4%" },
            { id: "mt21", title: "Move Zeroes", difficulty: "Easy", topic: "Arrays", url: "https://leetcode.com/problems/move-zeroes/", frequency: "High", acceptance: "61.3%" },
            { id: "mt22", title: "Integer to Roman", difficulty: "Medium", topic: "Strings", url: "https://leetcode.com/problems/integer-to-roman/", frequency: "Medium", acceptance: "62.1%" },
            { id: "mt23", title: "Remove All Adjacent Duplicates In String", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/", frequency: "Medium", acceptance: "71.2%" },
            { id: "mt24", title: "Remove Nth Node From End of List", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", frequency: "High", acceptance: "42.8%" },
            { id: "mt25", title: "Minimum Depth of Binary Tree", difficulty: "Easy", topic: "Trees", url: "https://leetcode.com/problems/minimum-depth-of-binary-tree/", frequency: "Medium", acceptance: "47.6%" },
            { id: "mt26", title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Trees", url: "https://leetcode.com/problems/diameter-of-binary-tree/", frequency: "High", acceptance: "58.4%" },
            { id: "mt27", title: "Serialize and Deserialize a Binary Tree", difficulty: "Hard", topic: "Trees", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", frequency: "High", acceptance: "56.0%" },
            { id: "mt28", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "Trees", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", frequency: "High", acceptance: "61.3%" },
            { id: "mt29", title: "Course Schedule", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "55.0%" },
            { id: "mt30", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "58.4%" },
            { id: "mt31", title: "Palindrome Permutation", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/palindrome-permutation/", frequency: "Medium", acceptance: "41.0%" },
            { id: "mt32", title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays", url: "https://leetcode.com/problems/product-of-array-except-self/", frequency: "High", acceptance: "67.4%" },
            { id: "mt33", title: "String to Integer (atoi)", difficulty: "Medium", topic: "Strings", url: "https://leetcode.com/problems/string-to-integer-atoi/", frequency: "High", acceptance: "18.3%" },
            { id: "mt34", title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", frequency: "High", acceptance: "68.8%" },
            { id: "mt35", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "53.2%" },
            { id: "mt36", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "mt37", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "54.7%" },
            { id: "mt38", title: "Minimum Path Sum", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/minimum-path-sum/", frequency: "Medium", acceptance: "66.5%" },
            { id: "mt39", title: "Alien Dictionary", difficulty: "Hard", topic: "Topological Sort", url: "https://leetcode.com/problems/alien-dictionary/", frequency: "Medium", acceptance: "35.4%" },
            { id: "mt40", title: "Word Break", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/word-break/", frequency: "High", acceptance: "48.1%" },
            { id: "mt41", title: "Shortest Palindrome", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/shortest-palindrome/", frequency: "Medium", acceptance: "40.7%" },
            { id: "mt42", title: "Russian Doll Envelopes", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/russian-doll-envelopes/", frequency: "Medium", acceptance: "37.6%" },
            { id: "mt43", title: "Populating Next Right Pointers", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/", frequency: "High", acceptance: "61.3%" },
            { id: "mt44", title: "Reverse Nodes in k-Group", difficulty: "Hard", topic: "Linked List", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", frequency: "High", acceptance: "63.0%" },
            { id: "mt45", title: "Find the Duplicate Number", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/find-the-duplicate-number/", frequency: "High", acceptance: "63.0%" },
            { id: "mt46", title: "Binary Tree Vertical Order Traversal", difficulty: "Medium", topic: "BFS", url: "https://leetcode.com/problems/binary-tree-vertical-order-traversal/", frequency: "High", acceptance: "56.4%" },
            { id: "mt47", title: "Lowest Common Ancestor of a Binary Tree III", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/", frequency: "High", acceptance: "78.4%" },
            { id: "mt48", title: "Making A Large Island", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/making-a-large-island/", frequency: "High", acceptance: "46.9%" },
            { id: "mt49", title: "Shortest Distance from All Buildings", difficulty: "Hard", topic: "BFS", url: "https://leetcode.com/problems/shortest-distance-from-all-buildings/", frequency: "Medium", acceptance: "42.5%" },
            { id: "mt50", title: "Expression Add Operators", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/expression-add-operators/", frequency: "Medium", acceptance: "40.0%" },
            { id: "mt51", title: "Strobogrammatic Number II", difficulty: "Medium", topic: "Recursion", url: "https://leetcode.com/problems/strobogrammatic-number-ii/", frequency: "Medium", acceptance: "52.7%" },
            { id: "mt52", title: "Palindrome Pairs", difficulty: "Hard", topic: "Trie", url: "https://leetcode.com/problems/palindrome-pairs/", frequency: "Medium", acceptance: "35.2%" },
            { id: "mt53", title: "Simplify Path", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/simplify-path/", frequency: "High", acceptance: "41.6%" },
            { id: "mt54", title: "Custom Sort String", difficulty: "Medium", topic: "String", url: "https://leetcode.com/problems/custom-sort-string/", frequency: "Medium", acceptance: "70.5%" },
            { id: "mt55", title: "Interval List Intersections", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/interval-list-intersections/", frequency: "Medium", acceptance: "71.7%" },
        ]
    },
    {
        id: "apple", name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg", gradient: "from-gray-700 to-gray-500",
        tier: "FAANG", description: "Consumer electronics, software and services",
        avgPackage: "₹25-45 LPA",
        interviewRounds: ["Phone Screen", "Technical x3", "System Design", "Hiring Manager"],
        interviewTips: [
            "Apple teams operate like individual startups; interview focus varies heavily by team.",
            "Deep expertise in the specific domain (iOS, OS concepts, hardware) is often required.",
            "Cultural fit: Passion for product quality and attention to detail.",
            "NDAs are strict; don't expect much info about the specific team's roadmap."
        ],
        resources: [
            { label: "Apple Machine Learning Research", url: "https://machinelearning.apple.com/" },
            { label: "LeetCode Apple Discuss", url: "https://leetcode.com/discuss/interview-question?currentPage=1&orderBy=most_relevant&query=apple" }
        ],
        problems: [
            { id: "ap1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "ap2", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "ap3", title: "Longest Common Prefix", difficulty: "Easy", topic: "String", url: "https://leetcode.com/problems/longest-common-prefix/", frequency: "High", acceptance: "45.5%" },
            { id: "ap4", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "ap5", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "43.8%" },
            { id: "ap6", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "ap7", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "High", acceptance: "70.9%" },
            { id: "ap8", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "ap9", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "ap10", title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-palindromic-substring/", frequency: "High", acceptance: "35.8%" },
            { id: "ap11", title: "Rotate Image", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/rotate-image/", frequency: "Medium", acceptance: "77.9%" },
            { id: "ap12", title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", url: "https://leetcode.com/problems/spiral-matrix/", frequency: "Medium", acceptance: "53.9%" },
            { id: "ap13", title: "Insert Interval", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/insert-interval/", frequency: "High", acceptance: "43.5%" },
            { id: "ap14", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "47.4%" },
            { id: "ap15", title: "Permutations", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", frequency: "High", acceptance: "80.7%" },
            { id: "ap16", title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", frequency: "High", acceptance: "77.1%" },
            { id: "ap17", title: "Next Permutation", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/next-permutation/", frequency: "High", acceptance: "43.1%" },
            { id: "ap18", title: "Sort Colors", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/sort-colors/", frequency: "High", acceptance: "67.6%" },
            { id: "ap19", title: "Jump Game", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game/", frequency: "High", acceptance: "39.5%" },
            { id: "ap20", title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/validate-binary-search-tree/", frequency: "High", acceptance: "34.4%" },
            { id: "ap21", title: "Add Two Numbers", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/add-two-numbers/", frequency: "High", acceptance: "46.2%" },
            { id: "ap22", title: "Letter Combinations of a Phone Number", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", frequency: "Medium", acceptance: "62.4%" },
            { id: "ap23", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/", frequency: "High", acceptance: "64.1%" },
            { id: "ap24", title: "Generate Parentheses", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/generate-parentheses/", frequency: "Medium", acceptance: "77.1%" },
            { id: "ap25", title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/merge-k-sorted-lists/", frequency: "High", acceptance: "56.8%" },
            { id: "ap26", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "40.8%" },
            { id: "ap27", title: "Word Break", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/word-break/", frequency: "High", acceptance: "48.1%" },
            { id: "ap28", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", frequency: "High", acceptance: "40.2%" },
            { id: "ap29", title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", frequency: "High", acceptance: "53.6%" },
            { id: "ap30", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-increasing-subsequence/", frequency: "High", acceptance: "52.8%" },
            { id: "ap31", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "58.4%" },
            { id: "ap32", title: "Balanced Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/balanced-binary-tree/", frequency: "Medium", acceptance: "49.6%" },
            { id: "ap33", title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", frequency: "High", acceptance: "58.4%" },
            { id: "ap34", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", frequency: "High", acceptance: "61.3%" },
            { id: "ap35", title: "Populating Next Right Pointers", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/", frequency: "High", acceptance: "61.3%" },
            { id: "ap36", title: "Min Stack", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/min-stack/", frequency: "High", acceptance: "54.8%" },
            { id: "ap37", title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", frequency: "High", acceptance: "77.1%" },
            { id: "ap38", title: "Flatten Binary Tree to Linked List", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/", frequency: "High", acceptance: "68.5%" },
            { id: "ap39", title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", frequency: "Medium", acceptance: "64.2%" },
            { id: "ap40", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", frequency: "High", acceptance: "70.6%" },
            { id: "ap41", title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", frequency: "Medium", acceptance: "75.3%" },
            { id: "ap42", title: "Path Sum", difficulty: "Easy", topic: "Tree", url: "https://leetcode.com/problems/path-sum/", frequency: "Medium", acceptance: "55.6%" },
            { id: "ap43", title: "Subsets", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/subsets/", frequency: "Medium", acceptance: "80.9%" },
            { id: "ap44", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum/", frequency: "Medium", acceptance: "74.7%" },
            { id: "ap45", title: "Word Search", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", frequency: "High", acceptance: "41.0%" },
            { id: "ap46", title: "Design Twitter", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/design-twitter/", frequency: "Medium", acceptance: "39.2%" },
            { id: "ap47", title: "LFU Cache", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/lfu-cache/", frequency: "High", acceptance: "45.7%" },
            { id: "ap48", title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Union Find", url: "https://leetcode.com/problems/longest-consecutive-sequence/", frequency: "High", acceptance: "47.0%" },
            { id: "ap49", title: "Basic Calculator", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/basic-calculator/", frequency: "Medium", acceptance: "43.3%" },
            { id: "ap50", title: "Integer to English Words", difficulty: "Hard", topic: "Recursion", url: "https://leetcode.com/problems/integer-to-english-words/", frequency: "High", acceptance: "31.2%" },
            { id: "ap51", title: "Text Justification", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/text-justification/", frequency: "Medium", acceptance: "42.0%" },
            { id: "ap52", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Queue", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.3%" },
            { id: "ap53", title: "Max Points on a Line", difficulty: "Hard", topic: "Math", url: "https://leetcode.com/problems/max-points-on-a-line/", frequency: "Medium", acceptance: "25.0%" },
            { id: "ap54", title: "N-Queens II", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/n-queens-ii/", frequency: "Medium", acceptance: "74.1%" },
        ]
    },
    // ─── Major Finance ──────────────────────────────────────────────────
    {
        id: "barclays", name: "Barclays", logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Barclays_Logo.svg", gradient: "from-sky-600 to-blue-700",
        tier: "Finance", description: "Global financial services, technology & investment banking",
        avgPackage: "₹12-22 LPA",
        interviewRounds: ["Online Assessment", "Technical Round", "System Design", "HR Round"],
        interviewTips: [
            "Strong focus on Core Java/CPP concepts (Multithreading, OOPS, Collections).",
            "Be prepared for questions on SQL and Database normalization.",
            "Behavioral questions often revolve around their 'RISES' values (Respect, Integrity, Service, Excellence, Stewardship)."
        ],
        resources: [
            { label: "Barclays Rise", url: "https://home.barclays/who-we-are/our-strategy/purpose-and-values/" },
            { label: "GeeksforGeeks Barclays Archives", url: "https://www.geeksforgeeks.org/tag/barclays/" }
        ],
        problems: [
            { id: "bc1", title: "Mark Elements on Array by Performing Queries", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/mark-elements-on-array-by-performing-queries/", frequency: "High", acceptance: "47.7%" },
            { id: "bc2", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "bc3", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", url: "https://leetcode.com/problems/valid-parentheses/", frequency: "High", acceptance: "42.3%" },
            { id: "bc4", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "62.3%" },
            { id: "bc5", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "bc6", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", frequency: "High", acceptance: "37.1%" },
            { id: "bc7", title: "Isomorphic Strings", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/isomorphic-strings/", frequency: "High", acceptance: "46.9%" },
            { id: "bc8", title: "Merge Sorted Array", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/merge-sorted-array/", frequency: "High", acceptance: "52.9%" },
            { id: "bc9", title: "Maximum Employees to Be Invited to a Meeting", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/", frequency: "High", acceptance: "62.1%" },
            { id: "bc10", title: "Climbing Stairs", difficulty: "Easy", topic: "DP", url: "https://leetcode.com/problems/climbing-stairs/", frequency: "High", acceptance: "53.5%" },
            { id: "bc11", title: "Permutations", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/permutations/", frequency: "High", acceptance: "80.7%" },
            { id: "bc12", title: "Palindrome Linked List", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/palindrome-linked-list/", frequency: "High", acceptance: "55.9%" },
        ]
    },
    {
        id: "goldman", name: "Goldman Sachs", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg", gradient: "from-blue-800 to-blue-600",
        tier: "Finance", description: "Investment banking, securities and investment management",
        avgPackage: "₹18-35 LPA",
        interviewRounds: ["HackerRank Test", "Coderpad Round", "Technical Interviews x2", "HR Round"],
        interviewTips: [
            "The Coderpad round is collaborative; treat it like pair programming.",
            "Heavy focus on Math, Puzzles, and Probability questions alongside DSA.",
            "Dynamic Programming and Matrix problems are favorites.",
            "Be ready to discuss optimization and complexity in depth."
        ],
        resources: [
            { label: "Goldman Sachs Engineering", url: "https://www.goldmansachs.com/careers/divisions/engineering/" },
            { label: "LeetCode Goldman Sachs Tag", url: "https://leetcode.com/company/goldman-sachs/" }
        ],
        problems: [
            { id: "gs1", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "gs2", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "43.8%" },
            { id: "gs3", title: "First Unique Character in a String", difficulty: "Easy", topic: "Hash Map", url: "https://leetcode.com/problems/first-unique-character-in-a-string/", frequency: "High", acceptance: "63.7%" },
            { id: "gs4", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "gs5", title: "LRU Cache", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/lru-cache/", frequency: "High", acceptance: "45.2%" },
            { id: "gs6", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "57.8%" },
            { id: "gs7", title: "Group Anagrams", difficulty: "Medium", topic: "Hash Map", url: "https://leetcode.com/problems/group-anagrams/", frequency: "High", acceptance: "70.9%" },
            { id: "gs8", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", frequency: "High", acceptance: "55.3%" },
            { id: "gs9", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "62.3%" },
            { id: "gs10", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "gs11", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "Medium", acceptance: "47.6%" },
            { id: "gs12", title: "Search a 2D Matrix", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/search-a-2d-matrix/", frequency: "Medium", acceptance: "52.3%" },
            { id: "gs13", title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/product-of-array-except-self/", frequency: "Medium", acceptance: "67.8%" },
            { id: "gs14", title: "Word Search", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", frequency: "Medium", acceptance: "45.3%" },
            { id: "gs15", title: "House Robber", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/house-robber/", frequency: "Medium", acceptance: "52.3%" },
            { id: "gs16", title: "Subarray Sum Equals K", difficulty: "Medium", topic: "Prefix Sum", url: "https://leetcode.com/problems/subarray-sum-equals-k/", frequency: "Medium", acceptance: "45.5%" },
        ]
    },
    // ─── Major Product Companies ────────────────────────────────────────
    {
        id: "flipkart", name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Flipkart_logo_detail.svg", gradient: "from-yellow-400 to-blue-600",
        tier: "Product", description: "India's leading e-commerce marketplace",
        avgPackage: "₹15-28 LPA",
        interviewRounds: ["Online Coding", "Machine Coding", "Problem Solving + DS", "System Design", "Hiring Manager"],
        interviewTips: [
            "The 'Machine Coding' round is the make-or-break. You have ~90 mins to code a fully working app (CLI or API).",
            "Focus on Code Modularity, Separation of Concerns, and Handling Edge Cases.",
            "Common Machine Coding topics: Splitwise, Parking Lot, Snake & Ladder, Ride Sharing.",
            "System Design rounds (for SDE-2) focus heavily on Scalability and Concurrency."
        ],
        resources: [
            { label: "Flipkart Tech Blog", url: "https://tech.flipkart.com/" },
            { label: "GeeksforGeeks Machine Coding", url: "https://www.geeksforgeeks.org/machine-coding-round-preparation/" },
            { label: "Work at Flipkart", url: "https://www.flipkartcareers.com/" }
        ],
        problems: [
            { id: "fk1", title: "Smallest Range Covering Elements from K Lists", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/", frequency: "High", acceptance: "69.7%" },
            { id: "fk2", title: "Trapping Rain Water", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/trapping-rain-water/", frequency: "High", acceptance: "65.1%" },
            { id: "fk3", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "57.8%" },
            { id: "fk4", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "fk5", title: "Number of Islands", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/number-of-islands/", frequency: "High", acceptance: "62.3%" },
            { id: "fk6", title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/product-of-array-except-self/", frequency: "High", acceptance: "67.8%" },
            { id: "fk7", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "fk8", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", frequency: "High", acceptance: "41.2%" },
            { id: "fk9", title: "Koko Eating Bananas", difficulty: "Medium", topic: "Binary Search", url: "https://leetcode.com/problems/koko-eating-bananas/", frequency: "High", acceptance: "49.1%" },
            { id: "fk10", title: "Rotting Oranges", difficulty: "Medium", topic: "BFS", url: "https://leetcode.com/problems/rotting-oranges/", frequency: "High", acceptance: "56.6%" },
            { id: "fk11", title: "Course Schedule", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/course-schedule/", frequency: "High", acceptance: "49.2%" },
            { id: "fk12", title: "Maximum Profit in Job Scheduling", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/", frequency: "High", acceptance: "54.4%" },
            { id: "fk13", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", frequency: "High", acceptance: "47.4%" },
            { id: "fk14", title: "Dungeon Game", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/dungeon-game/", frequency: "High", acceptance: "39.5%" },
            { id: "fk15", title: "Sort Colors", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/sort-colors/", frequency: "High", acceptance: "67.6%" },
            { id: "fk16", title: "Edit Distance", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/edit-distance/", frequency: "High", acceptance: "58.8%" },
            { id: "fk17", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/", frequency: "High", acceptance: "66.8%" },
            { id: "fk18", title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/partition-equal-subset-sum/", frequency: "High", acceptance: "48.4%" },
            { id: "fk19", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", frequency: "High", acceptance: "43.8%" },
            { id: "fk20", title: "Burst Balloons", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/burst-balloons/", frequency: "High", acceptance: "61.3%" },
            { id: "fk21", title: "The Skyline Problem", difficulty: "Hard", topic: "Divide and Conquer", url: "https://leetcode.com/problems/the-skyline-problem/", frequency: "Medium", acceptance: "43.0%" },
            { id: "fk22", title: "Min Stack", difficulty: "Medium", topic: "Stack", url: "https://leetcode.com/problems/min-stack/", frequency: "High", acceptance: "54.8%" },
            { id: "fk23", title: "Snakes and Ladders", difficulty: "Medium", topic: "BFS", url: "https://leetcode.com/problems/snakes-and-ladders/", frequency: "High", acceptance: "44.6%" },
            { id: "fk24", title: "LFU Cache", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/lfu-cache/", frequency: "High", acceptance: "45.7%" },
            { id: "fk25", title: "Critical Connections in a Network", difficulty: "Hard", topic: "Graph", url: "https://leetcode.com/problems/critical-connections-in-a-network/", frequency: "Medium", acceptance: "57.3%" },
            { id: "fk26", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Queue", url: "https://leetcode.com/problems/sliding-window-maximum/", frequency: "High", acceptance: "46.3%" },
            { id: "fk27", title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap", url: "https://leetcode.com/problems/find-median-from-data-stream/", frequency: "High", acceptance: "51.8%" },
            { id: "fk28", title: "Word Ladder II", difficulty: "Hard", topic: "BFS", url: "https://leetcode.com/problems/word-ladder-ii/", frequency: "Medium", acceptance: "28.3%" },
            { id: "fk29", title: "Alien Dictionary", difficulty: "Hard", topic: "Topological Sort", url: "https://leetcode.com/problems/alien-dictionary/", frequency: "Medium", acceptance: "35.4%" },
        ]
    },
    // ─── Factory-generated Major Product Companies ──────────────────────
    mkProd("salesforce", "Salesforce", "https://logo.clearbit.com/salesforce.com", "from-blue-500 to-cyan-400", "CRM, cloud computing and enterprise solutions", "₹18-30 LPA", 0, ["Online Assessment", "Technical x2", "System Design", "HR"],

        [
            "Salesforce values the 'Ohana' culture — demonstrate empathy and collaborative spirit.",
            "Expect questions on 'Multitenant Architecture' and Salesforce's core products (Sales Cloud, Service Cloud).",
            "Technical rounds often focus on Java/OOPs and how to design scalable cloud services."
        ],
        [
            { label: "Salesforce Trailhead", url: "https://trailhead.salesforce.com/" },
            { label: "Salesforce Engineering Blog", url: "https://developer.salesforce.com/blogs" }
        ]
    ),
    mkProd("crowdstrike", "CrowdStrike", "https://logo.clearbit.com/crowdstrike.com", "from-red-600 to-red-500", "Cybersecurity and endpoint protection platform", "₹15-28 LPA", 1, ["Recruiter Screen", "Technical Assessment (Coding)", "System Design", "Technical Discussion"],
        [
            "Coding rounds often feature 2-3 LeetCode-style questions (String Compression, Key-Value Store).",
            "Be prepared for Deep-Dive questions on 'Thread Implementation' and 'LRU Cache'.",
            "System Design focus: Designing a scalable, read-heavy system like a Facebook feature or Key-Value store."
        ],
        [
            { label: "CrowdStrike Careers", url: "https://www.crowdstrike.com/careers/" }
        ]
    ),
    {
        id: "uber", name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", gradient: "from-black to-slate-700",
        tier: "Product", description: "Ride-sharing, food delivery and mobility technology",
        avgPackage: "₹25-40 LPA",
        interviewRounds: ["Phone Screen", "Coding x2", "System Design", "Behavioral"],
        interviewTips: [
            "Uber asks very specific 'Uber-style' problems (e.g., Grid traversal, Graph problems related to maps).",
            "System Design focus: Real-time data, Geohashing, and Quadtrees.",
            "They value 'Go Get It' attitude and ability to work in a fast-paced environment.",
            "The 'Bar Raiser' concept exists here too, ensuring high quality hires."
        ],
        resources: [
            { label: "Uber Engineering Blog", url: "https://eng.uber.com/" },
            { label: "LeetCode Uber Tag", url: "https://leetcode.com/company/uber/" }
        ],
        problems: [
            { id: "ub1", title: "Two Sum", difficulty: "Easy", topic: "Array", url: "https://leetcode.com/problems/two-sum/", frequency: "High", acceptance: "55.8%" },
            { id: "ub2", title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", url: "https://leetcode.com/problems/merge-intervals/", frequency: "High", acceptance: "49.4%" },
            { id: "ub3", title: "Word Break II", difficulty: "Hard", topic: "DP", url: "https://leetcode.com/problems/word-break-ii/", frequency: "High", acceptance: "53.6%" },
            { id: "ub4", title: "Maximum Subarray", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/maximum-subarray/", frequency: "High", acceptance: "52.1%" },
            { id: "ub5", title: "Sudoku Solver", difficulty: "Hard", topic: "Backtracking", url: "https://leetcode.com/problems/sudoku-solver/", frequency: "High", acceptance: "63.9%" },
            { id: "ub6", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", url: "https://leetcode.com/problems/combination-sum/", frequency: "High", acceptance: "74.7%" },
            { id: "ub7", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", frequency: "High", acceptance: "36.9%" },
            { id: "ub8", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", frequency: "High", acceptance: "57.8%" },
            { id: "ub9", title: "Clone Graph", difficulty: "Medium", topic: "Graph", url: "https://leetcode.com/problems/clone-graph/", frequency: "High", acceptance: "62.4%" },
            { id: "ub10", title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", frequency: "High", acceptance: "60.5%" },
            { id: "ub11", title: "Jump Game", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game/", frequency: "High", acceptance: "39.5%" },
            { id: "ub12", title: "Insert Interval", difficulty: "Medium", topic: "Array", url: "https://leetcode.com/problems/insert-interval/", frequency: "High", acceptance: "43.5%" },
            { id: "ub13", title: "Word Ladder", difficulty: "Hard", topic: "BFS", url: "https://leetcode.com/problems/word-ladder/", frequency: "High", acceptance: "42.8%" },
            { id: "ub14", title: "Longest Valid Parentheses", difficulty: "Hard", topic: "Stack", url: "https://leetcode.com/problems/longest-valid-parentheses/", frequency: "High", acceptance: "36.3%" },
            { id: "ub15", title: "Longest Palindromic Substring", difficulty: "Medium", topic: "DP", url: "https://leetcode.com/problems/longest-palindromic-substring/", frequency: "High", acceptance: "35.8%" },
            { id: "ub16", title: "Reverse Integer", difficulty: "Medium", topic: "Math", url: "https://leetcode.com/problems/reverse-integer/", frequency: "High", acceptance: "30.3%" },
            { id: "ub17", title: "Swap Nodes in Pairs", difficulty: "Medium", topic: "Linked List", url: "https://leetcode.com/problems/swap-nodes-in-pairs/", frequency: "High", acceptance: "67.2%" },
            { id: "ub18", title: "Jump Game II", difficulty: "Medium", topic: "Greedy", url: "https://leetcode.com/problems/jump-game-ii/", frequency: "High", acceptance: "41.5%" },
            { id: "ub19", title: "Bus Routes", difficulty: "Hard", topic: "BFS", url: "https://leetcode.com/problems/bus-routes/", frequency: "Medium", acceptance: "47.2%" },
            { id: "ub20", title: "Alien Dictionary", difficulty: "Hard", topic: "Topological Sort", url: "https://leetcode.com/problems/alien-dictionary/", frequency: "Medium", acceptance: "35.4%" },
            { id: "ub21", title: "Text Justification", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/text-justification/", frequency: "Medium", acceptance: "42.0%" },
            { id: "ub22", title: "Find the Closest Palindrome", difficulty: "Hard", topic: "String", url: "https://leetcode.com/problems/find-the-closest-palindrome/", frequency: "Low", acceptance: "22.6%" },
            { id: "ub23", title: "Serialize and Deserialize N-ary Tree", difficulty: "Hard", topic: "Tree", url: "https://leetcode.com/problems/serialize-and-deserialize-n-ary-tree/", frequency: "Medium", acceptance: "65.6%" },
            { id: "ub24", title: "Design Quad Tree", difficulty: "Medium", topic: "Tree", url: "https://leetcode.com/problems/construct-quad-tree/", frequency: "Low", acceptance: "77.5%" },
            { id: "ub25", title: "Employee Free Time", difficulty: "Hard", topic: "Intervals", url: "https://leetcode.com/problems/employee-free-time/", frequency: "Medium", acceptance: "72.4%" },
            { id: "ub26", title: "Max Stack", difficulty: "Hard", topic: "Design", url: "https://leetcode.com/problems/max-stack/", frequency: "Medium", acceptance: "43.8%" },
            { id: "ub27", title: "Design Hit Counter", difficulty: "Medium", topic: "Design", url: "https://leetcode.com/problems/design-hit-counter/", frequency: "High", acceptance: "69.0%" },
        ]
    },
    mkProd("mastercard", "Mastercard", "https://logo.clearbit.com/mastercard.com", "from-red-600 to-orange-500", "Global payments technology company", "₹14-25 LPA", 3, ["Recruiter Screen", "Phone Interview", "Technical Rounds x3", "HR"],
        [
            "Mastercard values payment domain knowledge. Understand how a transaction flows from 'Swipe' to 'Settlement'.",
            "Be prepared for scenario-based questions using the STAR method.",
            "Technical rounds often feature questions that test your thought process beyond standard algorithms."
        ],
        [
            { label: "Mastercard Newsroom", url: "https://www.mastercard.com/news/" },
            { label: "Mastercard Research", url: "https://www.mastercard.com/news/press/press-kits/innovation-research-and-development/" }
        ]
    ),
    mkProd("amdocs", "Amdocs", "https://logo.clearbit.com/amdocs.com", "from-indigo-600 to-blue-500", "IT services for communications and media", "₹8-16 LPA", 4, ["Online Assessment", "Technical Round 1", "Technical Round 2", "HR"],
        [
            "Focus on SQL and Unix commands. Amdocs roles often involve heavy backend and database work.",
            "DSA favorites: Trees, Sorting, and Searching. Be prepared for basic System Design.",
            "Academic criteria are strict (60-70% throughout); ensure your documents are in order."
        ],
        [
            { label: "Amdocs Careers", url: "https://www.amdocs.com/careers" }
        ]
    ),
    mkProd("media-net", "Media.net", "https://logo.clearbit.com/media.net", "from-blue-600 to-blue-400", "Digital advertising and contextual ads platform", "₹15-25 LPA", 1, ["Online Assessment", "DSA Round x2", "Technical + Design", "HR"],
        [
            "Media.net has a very high bar for DSA. Expect Hard-level DP and Graph problems.",
            "Networking fundamentals (HTTP, DNS, Latency) are frequently tested for their ad-tech stack.",
            "Clarify constraints early; they care about the Big-O efficiency significantly."
        ],
        [
            { label: "Media.net Blog", url: "https://blog.media.net/" }
        ]
    ),
    mkProd("mindtickle", "MindTickle", "https://logo.clearbit.com/mindtickle.com", "from-violet-500 to-purple-500", "Sales readiness and enablement platform", "₹10-18 LPA", 3, ["Online Coding", "Technical Rounds x3", "Hiring Manager", "HR"],
        [
            "MindTickle often asks Machine Coding or Low-Level Design (LLD) early on.",
            "Focus on 'Clean Code' and 'Design Patterns' in your coding solutions.",
            "Be prepared to discuss your projects and how you'd scale them for multiple users."
        ],
        [
            { label: "MindTickle Careers", url: "https://www.mindtickle.com/careers/" }
        ]
    ),
    mkProd("druva", "Druva", "https://logo.clearbit.com/druva.com", "from-blue-600 to-indigo-500", "Cloud data protection and management", "₹14-22 LPA", 4, ["Online Test (MCQs + Coding)", "Technical Round 1 (DSA/OS)", "Technical Round 2 (System Design/Projects)", "Managerial Round"],
        [
            "Don't just say 'I don't know'—ask for hints and show a 'never give up' attitude.",
            "Start with brute-force solutions before optimizing.",
            "Be ready for OS concepts like Mutex, Semaphore, and Memory Management."
        ],
        [
            { label: "Druva Engineering", url: "https://www.druva.com/about/engineering/" }
        ]
    ),

    mkProd("rakuten", "Rakuten", "https://logo.clearbit.com/rakuten.com", "from-red-600 to-rose-500", "Japanese e-commerce and internet services giant", "₹12-22 LPA", 0, ["Online Assessment (Aptitude + Coding)", "Technical Round 1 (DSA/DBMS)", "Technical Round 2 (System Design/Java)", "HR Round (Rakuten Shugi)"],
        [
            "Read about 'Rakuten Shugi' (core principles)—it's crucial for the HR round.",
            "Expect Java-heavy questions: SpringBoot, Multithreading, and Collections.",
            "System Design is asked even for SDE-2 roles (e.g., Load Balancing, SOLID)."
        ],
        [
            { label: "Rakuten Shugi", url: "https://rakuten.today/blog/rakuten-shugi-principles-for-success.html" }
        ]
    ),
    mkProd("delhivery", "Delhivery", "https://logo.clearbit.com/delhivery.com", "from-red-500 to-orange-400", "Logistics and supply chain services", "₹10-18 LPA", 1, ["Mettl Online Test", "Technical Round 1 (DSA)", "Technical Round 2 (Projects/DBMS)", "HR Round"],
        [
            "Know your resume projects inside out—expect deep dives into architecture and challenges.",
            "DBMS is a favorite: SQL queries, Normalization, and Indexing.",
            "Interviewers are friendly; treat it like a collaborative discussion."
        ],
        [
            { label: "Delhivery Technology", url: "https://www.delhivery.com/technology" }
        ]
    ),
    mkProd("icertis", "Icertis", "https://logo.clearbit.com/icertis.com", "from-green-600 to-emerald-500", "Contract management software platform", "₹12-22 LPA", 2, ["Online Test (MCQs + Coding)", "Technical Round 1 (OOPs/DSA)", "Technical Round 2 (DBMS/Projects)", "HR Round (FORTE)"],
        [
            "Align your answers with 'FORTE' values (Fairness, Openness, Respect, Teamwork, Execution).",
            "Strong focus on OOPs concepts and writing clean code on paper/whiteboard.",
            "SQL queries are almost guaranteed."
        ],
        [
            { label: "Icertis FORTE Values", url: "https://www.icertis.com/company/values/" }
        ]
    ),
    mkProd("arista", "Arista Networks", "https://logo.clearbit.com/arista.com", "from-blue-700 to-blue-500", "Cloud networking solutions", "₹15-28 LPA", 3, ["HackerRank/CoderPad", "Technical Round (C/C++ & OS)", "System Design", "Director Round"],
        [
            "Deep knowledge of C/C++ pointers, memory management (malloc/free), and OS internals is non-negotiable.",
            "DSA questions are often Medium-Hard (Linked Lists, Trees, Bit manipulation).",
            "Be prepared to code without an IDE (Whiteboard/Notepad)."
        ],
        [
            { label: "Arista Careers", url: "https://www.arista.com/en/careers" }
        ]
    ),


    mkProd("zocdoc", "Zocdoc", "https://logo.clearbit.com/zocdoc.com", "from-yellow-500 to-orange-500", "Healthcare marketplace for patients", "₹15-25 LPA", 4, ["Recruiter Screen", "Technical Round (Algo)", "System Design", "Behavioral (STAR method)"],
        [
            "Show passion for the healthcare mission—why Zocdoc?",
            "Use the STAR method for behavioral questions.",
            "Database schema design is a common technical topic."
        ],
        [
            { label: "Zocdoc Tech Blog", url: "https://www.zocdoc.com/tech/" }
        ]
    ),
    mkProd("siemens", "Siemens", "https://logo.clearbit.com/siemens.com", "from-teal-600 to-cyan-500", "Industrial automation and digital solutions", "₹8-16 LPA", 0, ["Online Technical Test", "Technical Round 1 (Projects/OOPs)", "Technical Round 2 (DSA/System Design)", "Managerial Round", "HR Round"],
        [
            "Strong emphasis on academic scores (70%+ or 7 CGPA).",
            "Deep dive into OOP concepts (inheritance, polymorphism) with real-world examples.",
            "Be prepared to screen-share and walk through your projects code-line by code-line."
        ],
        [
            { label: "Siemens Job Search", url: "https://jobs.siemens.com/jobs" }
        ]
    ),
    mkProd("sophos", "Sophos", "https://logo.clearbit.com/sophos.com", "from-blue-700 to-blue-500", "Cybersecurity solutions and services", "₹10-18 LPA", 1, ["Online Coding Assessment", "Technical Round 1 (C++/Java)", "Technical Round 2 (System Design/Networking)", "HR Round"],
        [
            "Networking fundamentals (TCP/IP, OSI model) are a massive plus.",
            "Expect detailed questions on C/C++ memory management and pointers.",
            "System Design questions focus on low-level API design."
        ],
        [
            { label: "Sophos Careers", url: "https://www.sophos.com/en-us/company/careers" }
        ]
    ),
    mkProd("vodafone", "Vodafone", "https://logo.clearbit.com/vodafone.com", "from-red-600 to-red-500", "Telecommunications and technology company", "₹8-15 LPA", 2, ["Aptitude & English Test", "Technical Round 1 (Java/Spring)", "Technical Round 2 (SQL/Agile)", "Group Discussion", "HR Round"],
        [
            "Java 8 features (Streams, Lambdas) and Spring Boot are very frequently asked.",
            "Prepare for competency-based behavioral questions (STAR method).",
            "Group discussions might cover current work trends (e.g., WFH vs WFO)."
        ],
        [
            { label: "Vodafone Careers", url: "https://www.vodafone.com/careers" }
        ]
    ),
    mkProd("tibco", "TIBCO", "https://logo.clearbit.com/tibco.com", "from-blue-600 to-indigo-600", "Enterprise middleware and analytics", "₹10-18 LPA", 3, ["Online Assessment", "Technical Round 1 (Java/Integration)", "Technical Round 2 (TIBCO Tools/Middleware)", "HR Round"],
        [
            "Familiarity with TIBCO BusinessWorks or EMS is a huge advantage.",
            "Strong focus on Middleware concepts, XML, and complex integration patterns.",
            "Explain how you handle performance tuning and version control in integration projects."
        ],
        [
            { label: "TIBCO Community", url: "https://community.tibco.com/" }
        ]
    ),
    mkProd("schlumberger", "Schlumberger", "https://logo.clearbit.com/slb.com", "from-blue-800 to-blue-600", "Oilfield services and technology company", "₹12-20 LPA", 4, ["Online Coding (Java/Logic)", "Group Discussion", "Technical Round (Embedded/C++)", "Managerial Round", "HR Round"],
        [
            "Embedded systems knowledge (SPI, I2C, Microcontrollers) is highly valued.",
            "Expect logic puzzles and math-based coding problems (e.g., Fibonacci, Decimal to Binary).",
            "Cultural fit is critical—demonstrate teamwork and ability to work in harsh environments."
        ],
        [
            { label: "SLB Early Careers", url: "https://careers.slb.com/early-careers" }
        ]
    ),
    mkProd("ciena", "Ciena", "https://logo.clearbit.com/ciena.com", "from-blue-500 to-cyan-500", "Networking systems and software provider", "₹12-20 LPA", 0, ["HR Screening", "Technical Assessment", "Technical Interview x2", "Behavioral"],
        [
            "Strong command of C/C++ and Linux environment is essential.",
            "Networking concepts (TCP/IP, DNS, Packet Switching) are heavily tested.",
            "DSA focus: Linked Lists (Reverse, Detect Loop), Trees, and custom smart pointers."
        ],
        [
            { label: "Ciena Careers", url: "https://www.ciena.com/about/careers" }
        ]
    ),
    mkProd("veritas", "Veritas Technologies", "https://logo.clearbit.com/veritas.com", "from-red-700 to-red-500", "Enterprise data management solutions", "₹10-18 LPA", 1, ["Aptitude Test (CS Fundamentals)", "Technical Round 1 (DSA/String Manipulation)", "Technical Round 2 (System Design/SQL)", "HR Round"],
        [
            "Focus on File Handling, OS concepts, and scalable backup system design.",
            "Expect a mix of C++ STL and SQL queries in technical rounds.",
            "Data Analysis and Integrity are key themes for Veritas."
        ],
        [
            { label: "Veritas Careers", url: "https://www.veritas.com/company/careers" }
        ]
    ),
    mkProd("nice", "NICE Systems", "https://logo.clearbit.com/nice.com", "from-blue-600 to-indigo-500", "AI-powered contact center and compliance", "₹10-18 LPA", 2, ["Online Test (Coding + Aptitude)", "Technical Round (DSA/DBMS)", "Managerial Round (Puzzles/Projects)", "HR Round"],
        [
            "Puzzles (like '9 coins') are frequently asked in Managerial rounds.",
            "Strong focus on SQL joins, normalization, and Employee/Salary queries.",
            "Be prepared to explain your project's tech stack in depth."
        ],
        [
            { label: "NICE Careers", url: "https://www.nice.com/careers" }
        ]
    ),
    mkProd("avaya", "Avaya", "https://logo.clearbit.com/avaya.com", "from-red-600 to-orange-500", "Unified communications and contact center", "₹8-14 LPA", 3, ["Online Test (MCQ + Coding)", "Technical Round 1 (C++/OS)", "Technical Round 2 (Networks/System Design)", "HR Round"],
        [
            "Networking concepts (Sockets, IP, TCP/UDP) are heavily tested.",
            "Expect OS questions on Threads, Process, and Deadlocks (Dining Philosophers).",
            "Be ready to explain how Google Search works internally."
        ],
        [
            { label: "Avaya Careers", url: "https://www.avaya.com/en/about-avaya/careers/" }
        ]
    ),
    mkProd("hitachi", "Hitachi Vantara", "https://logo.clearbit.com/hitachivantara.com", "from-red-600 to-red-400", "Data-driven digital solutions and IoT", "₹8-16 LPA", 4, ["Online Assessment", "Technical Round 1 (Java/SQL)", "Technical Round 2 (Project/Design)", "HR Round"],
        [
            "Java fundamentals (Collections, Multithreading) are essential.",
            "Expect React/JavaScript questions if applying for Full Stack roles.",
            "Communication clarity is very important."
        ],
        [
            { label: "Hitachi Vantara Careers", url: "https://www.hitachivantara.com/en-us/company/careers.html" }
        ]
    ),
    mkProd("pharmeasy", "PharmEasy", "https://logo.clearbit.com/pharmeasy.in", "from-green-600 to-green-400", "Online pharmacy and healthcare platform", "₹10-18 LPA", 0, ["Online Coding Round", "Technical Round 1 (JS/React/DSA)", "Technical Round 2 (System Design)", "Bar Raiser/Managerial"],
        [
            "Frontend roles face heavy JS questions: Hoisting, Currying, Closures.",
            "Behavioral questions focus on ' earning trust' and 'handling failure'.",
            "System design is crucial for SDE-2+ roles."
        ],
        [
            { label: "PharmEasy Tech", url: "https://blog.pharmeasy.in/tech/" }
        ]
    ),

    mkProd("platform9", "Platform9 Systems", "https://logo.clearbit.com/platform9.com", "from-blue-600 to-indigo-500", "Cloud-native Kubernetes infrastructure", "₹12-22 LPA", 1, ["Screening Round (JS/React)", "Technical Round 1 (React/State Management)", "Technical Round 2 (Output-based JS)", "Managerial Round"],
        [
            "Frontend roles focus heavily on 'Output-based Js questions' (Closures, Hoisting, Event Loop).",
            "Expect a machine coding round: e.g., 'Fetch Pokemon API and display in a table'.",
            "Platform engineers need strong Linux/PowerShell scripting and AWS/Azure knowledge."
        ],
        [
            { label: "Platform9 Careers", url: "https://platform9.com/company/careers/" }
        ]
    ),
    mkProd("ptcsoftware", "PTC Software", "https://logo.clearbit.com/ptc.com", "from-green-700 to-green-500", "CAD, PLM, IoT and AR solutions", "₹10-18 LPA", 2, ["Online Aptitude & Coding", "Technical Round 1 (DSA/OOPs)", "Technical Round 2 (System Design/Scaler)", "HR Round"],
        [
            "Aptitude tests are tricky (Logic/Data Interpretation)—prepare well.",
            "Expect questions on 'Handling large/messy datasets' and ensuring data integrity.",
            "Java/C++ proficiency is strict; know internal workings of HashMaps."
        ],
        [
            { label: "PTC Careers", url: "https://www.ptc.com/en/careers" }
        ]
    ),
    mkProd("espressif", "Espressif Systems", "https://logo.clearbit.com/espressif.com", "from-red-600 to-orange-500", "IoT wireless chip and module manufacturer", "₹10-18 LPA", 3, ["Technical Written Test", "Technical Round 1 (Embedded/C)", "Technical Round 2 (FreeRTOS/Protocols)", "HR Round"],
        [
            "Must know ESP32 architecture (Dual-core Xtensa, GPIOs, Deep Sleep).",
            "Deep dive into Communication Protocols: UART, SPI, I2C, and CAN.",
            "RTOS concepts (Mutex, Semaphore) and FreeRTOS specifics are mandatory."
        ],
        [
            { label: "Espressif Careers", url: "https://www.espressif.com/en/company/job-opportunities" }
        ]
    ),
    mkProd("endurance", "Endurance International", "https://logo.clearbit.com/endurance.com", "from-blue-500 to-indigo-500", "Web hosting and technology services", "₹8-14 LPA", 4, ["Online Assessment (MCQ + Coding)", "Technical Round 1 (DSA/CS Fundamentals)", "Technical Round 2 (System Design)", "HR Round"],
        [
            "Online test covers Linux concepts and 'Output-based C/C++' questions.",
            "System Design focus: Designing a Cache, handling threads and locks.",
            "Be ready to implement Heap operations or Merge Sort for Linked Lists."
        ],
        [
            { label: "Newfold Digital (Endurance)", url: "https://newfold.com/careers" }
        ]
    ),
    mkProd("avalara", "Avalara Technologies", "https://logo.clearbit.com/avalara.com", "from-orange-600 to-amber-500", "Tax compliance automation platform", "₹10-18 LPA", 0, ["Online Screening", "Technical Round 1 (Coding/DSA)", "Technical Round 2 (Design/Projects)", "Managerial Round"],
        [
            "TDD (Test Driven Development) and BDD are often discussed.",
            "Technical stack focus: .NET, Angular, and DBMS concepts.",
            "'How have you learned from a time you failed badly?' - Prepare a solid story."
        ],
        [
            { label: "Avalara Careers", url: "https://www.avalara.com/us/en/about/careers.html" }
        ]
    ),

    mkProd("aci", "ACI Worldwide", "https://logo.clearbit.com/aciworldwide.com", "from-blue-600 to-blue-400", "Electronic payment and banking solutions", "₹10-18 LPA", 1, ["Online Assessment (Coding + Aptitude)", "Technical Round 1 (Java/DSA)", "Technical Round 2 (DBMS/SQL)", "HR Round"],
        [
            "Coding on paper is sometimes asked—practice without an IDE.",
            "Deep focus on Java (Interfaces, Polymorphism) and JDBC connectivity.",
            "SQL questions are frequent: Nth highest salary, Stored Procedures, Triggers."
        ],
        [
            { label: "ACI Careers", url: "https://www.aciworldwide.com/about-aci/careers" }
        ]
    ),
    mkProd("acquia", "Acquia", "https://logo.clearbit.com/acquia.com", "from-blue-500 to-blue-400", "Cloud platform for Drupal digital experiences", "₹10-16 LPA", 2, ["Online Coding Challenge", "Technical Round 1 (PHP/Drupal)", "Technical Round 2 (System Design/CMS)", "HR Round"],
        [
            "Drupal knowledge (Modules, Hooks, Theming) is heavily tested for specific roles.",
            "PHP fundamentals: Sessions, Design Patterns, Class Loading.",
            "Expect practical questions like 'How to ensure code maintainability?'."
        ],
        [
            { label: "Acquia Careers", url: "https://www.acquia.com/careers" }
        ]
    ),
    mkProd("adp", "ADP", "https://logo.clearbit.com/adp.com", "from-red-600 to-red-500", "Human capital management and payroll", "₹8-15 LPA", 3, ["Online Aptitude & Coding", "Technical Round 1 (Java/OOPs)", "Technical Round 2 (SDLC/System Design)", "HR Round"],
        [
            "Strong emphasis on OOPs (Encapsulation vs Abstraction) and Java Collections.",
            "Explain SDLC (Software Development Life Cycle) and Agile methodologies.",
            "Behavioral questions focus on 'Handling conflict in a team' and 'Optimizing application performance'."
        ],
        [
            { label: "ADP Careers", url: "https://jobs.adp.com/" }
        ]
    ),
    mkProd("ideas", "IDeaS A SAS", "https://logo.clearbit.com/ideas.com", "from-blue-600 to-cyan-500", "Revenue management solutions for hospitality", "₹8-14 LPA", 4, ["Online Assessment", "Technical Round 1 (Java/Spring)", "Technical Round 2 (SQL/DB)", "HR Round"],
        [
            "Java 8 features, Spring Boot, and Hibernate are core requirements.",
            "Database knowledge (MSSQL, MySQL) and SQL query tuning are tested.",
            "Explain your understanding of Test Driven Development (TDD) and CI/CD."
        ],
        [
            { label: "IDeaS Careers", url: "https://ideas.com/careers/" }
        ]
    ),

    // ─── Factory-generated Finance Companies ────────────────────────────
    mkFin("hsbc", "HSBC", "https://logo.clearbit.com/hsbc.com", "from-red-700 to-red-500", "Global banking and financial services", "₹12-22 LPA", 0, ["Online Test", "Technical x2", "Value Assessment", "HR"],

        [
            "Be very thorough with your Final Year Project. HSBC often deep-dives into your design choices.",
            "Revise Java Collections, Multithreading, and basic SQL Queries.",
            "The Value Assessment is key — align your answers with HSBC's 'Courageous Integrity'."
        ],
        [
            { label: "HSBC Values", url: "https://www.hsbc.com/who-we-are/our-values" },
            { label: "GFG HSBC Prep", url: "https://www.geeksforgeeks.org/hsbc-recruitment-process/" }
        ]
    ),
    mkFin("deutsche", "Deutsche Bank", "https://logo.clearbit.com/db.com", "from-blue-700 to-blue-500", "Global investment bank and financial services", "₹14-24 LPA", 1, ["Online Coding", "Technical x2", "ProFit Round", "HR"],

        [
            "Deutsche Bank coding rounds are usually harder than other banks (DP/Binary Search).",
            "The 'ProFit' (Professional Fitness) round is a mix of situational HR and technical logic.",
            "Be prepared to explain Java internals (JVM, Garbage Collection) in detail."
        ],
        [
            { label: "Deutsche Bank Careers India", url: "https://www.db.com/careers/en/graduates/locations/india.html" }
        ]
    ),
    mkFin("ubs", "UBS", "https://logo.clearbit.com/ubs.com", "from-red-600 to-gray-600", "Swiss investment bank and wealth management", "₹15-28 LPA", 0, ["Online Assessment (HackerRank)", "Technical Round 1 (Java/DSA)", "Technical Round 2 (System Design/DB)", "HR Round"],
        [
            "DSA questions often involve Arrays (Missing number) and Sorting.",
            "Explain the 4 pillars of OOPs with real-world project examples.",
            "System Design: Analyze a simple web app backend or API design."
        ],
        [
            { label: "UBS Careers", url: "https://www.ubs.com/global/en/careers.html" }
        ]
    ),
    mkFin("jpmorgan", "JP Morgan", "https://logo.clearbit.com/jpmorgan.com", "from-slate-700 to-blue-800", "Global financial services and investment banking", "₹14-25 LPA", 1, ["HackerRank Coding", "Technical x2", "HireVue Behavioral", "Super Day"],
        [
            "JP Morgan is moving towards 'Super Day' — multiple back-to-back interviews in one day.",
            "HireVue rounds are AI-monitored; maintain eye contact with the camera and speak clearly.",
            "For tech roles, focus on System Design for high-frequency trading or massive data handling."
        ],
        [
            { label: "JPMC Tech Blog", url: "https://www.jpmorganchase.com/news-stories/tech-blog" },
            { label: "JP Morgan Business Principles", url: "https://www.jpmorganchase.com/about/our-business/business-principles" }
        ]
    ),
    mkFin("ey", "Ernst & Young", "https://logo.clearbit.com/ey.com", "from-yellow-500 to-yellow-400", "Professional services — audit, consulting, advisory", "₹6-14 LPA", 0, ["Online Assessment", "Technical Round 1 (Code/Logic)", "Technical Round 2 (System Design/Cloud)", "HR Round"],
        [
            "Focus on SQL queries (Joins, 2nd highest salary) and Normalization.",
            "Explain differences between Abstract Class vs Interface, Process vs Thread.",
            "Behavioral: Use the STAR method to describe teamwork and adaptability."
        ],
        [
            { label: "EY Careers", url: "https://www.ey.com/en_gl/careers" }
        ]
    ),
    mkFin("clsa", "CLSA", "https://logo.clearbit.com/clsa.com", "from-blue-700 to-indigo-600", "Asia-focused brokerage and investment group", "₹10-18 LPA", 1, ["Aptitude & Technical Test", "Coding Round (DSA)", "Technical Interviews (L1/L2)", "HR Round"],
        [
            "Aptitude test includes puzzles and data interpretation.",
            "Coding round focuses on DSA patterns (String manipulation, Subsets).",
            "L2 rounds deep-dive into Academic Projects and Java Core (Multithreading)."
        ],
        [
            { label: "CLSA Careers", url: "https://www.clsa.com/careers/" }
        ]
    ),
    mkFin("idfc", "IDFC FIRST Bank", "https://logo.clearbit.com/idfcfirstbank.com", "from-red-600 to-rose-500", "Universal banking and retail finance", "₹6-12 LPA", 0, ["Online Code-a-thon", "Technical Round 1 (Projects/DSA)", "Technical Round 2 (DBMS/OS)", "Managerial Round"],
        [
            "Assessment includes aptitude, technical MCQs (SQL/Excel), and coding.",
            "Project discussion is extensive: Architecture, Tech Stack, Challenges.",
            "Java/Python specifics: Exception Handling, Collections, Virtual Functions."
        ],
        [
            { label: "IDFC FIRST Bank Careers", url: "https://www.idfcfirstbank.com/careers" }
        ]
    ),
    mkFin("rbl", "RBL Bank", "https://logo.clearbit.com/rblbank.com", "from-blue-600 to-blue-500", "Private sector banking and financial services", "₹5-10 LPA", 1, ["Aptitude Test", "Technical Interview", "HR Interview"],
        [
            "General banking tech questions: Financial products, Compliance.",
            "Prepare for standard behavioral questions ('Tell me about yourself').",
            "Excel skills (for data management) and basic SQL are often tested."
        ],
        [
            { label: "RBL Bank Careers", url: "https://www.rblbank.com/careers" }
        ]
    ),
    mkFin("finiq", "FinIQ", "https://logo.clearbit.com/finiq.com", "from-green-600 to-teal-500", "Financial software for wealth management", "₹6-12 LPA", 0, ["Online Test (Reliscore)", "Technical Round (DBMS/Networking)", "HR Round"],
        [
            "Online test covers General Knowledge, Math, DBMS, and Logic.",
            "Networking: OSI Model, DNS, HTTP/HTTPS, IP/MAC Addresses.",
            "Coding questions are often mathematical (Prime, Armstrong, Matrix)."
        ],
        [
            { label: "FinIQ Careers", url: "https://www.finiq.com/careers" }
        ]
    ),

    mkFin("flextrade", "FlexTrade", "https://logo.clearbit.com/flextrade.com", "from-blue-600 to-cyan-500", "Multi-asset execution management systems", "₹10-18 LPA", 1, ["Online Test (Linux/C++/SQL)", "Technical Round 1 (Algo/Trading)", "Technical Round 2 (System Design)", "Managerial Round"],
        [
            "High-Frequency Trading concepts: Algorithm optimization, Multithreading.",
            "FIX Protocol knowledge is a significant plus.",
            "C++ roles: Deep dive into Pointers, References, and OOP."
        ],
        [
            { label: "FlexTrade Careers", url: "https://flextrade.com/careers/" }
        ]
    ),
    mkFin("iongroup", "ION Group", "https://logo.clearbit.com/iongroup.com", "from-blue-800 to-blue-600", "Trading and treasury technology solutions", "₹8-16 LPA", 0, ["Online Assessment (DSA/Logic)", "Technical Round 1 (OOP/OS)", "Case Study Round", "Leadership Round"],
        [
            "Online test includes DSA, Logic, and sometimes Graph-based problems.",
            "Case Study round assesses analytical business problem solving.",
            "Strong focus on CS Fundamentals: OS (Paging, Deadlocks), DBMS."
        ],
        [
            { label: "ION Group Careers", url: "https://iongroup.com/careers/" }
        ]
    ),

];
