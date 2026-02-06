import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Zap,
  DollarSign,
  Globe,
  Code,
  Palette,
  Settings,
  Award,
  Coffee,
  Laptop,
  Calendar,
  Target,
  Rocket,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  GraduationCap,
  BookOpen,
  MessageSquare,
  ChevronDown,
  Search,
  Filter,
  X,
  Play,
  Sparkles,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Headphones,
  Video,
  FileText,
  Send,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Youtube,
  ChevronRight,
  ExternalLink,
  Download,
  Share2,
  Upload,
  Bookmark,
  Bell,
  Eye,
  ThumbsUp,
  MessageCircle,
  Percent,
  Flame,
  Crown,
  Gift,
  Ticket,
  Wallet,
  CreditCard,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Lock,
  Unlock,
  Key,
  UserPlus,
  UserCheck,
  UserMinus,
  UserX,
  Users2,
  Group,
  Radio,
  Wifi,
  WifiOff,
  Signal,
  Bluetooth,
  Battery,
  BatteryCharging,
  Power,
  Plug,
  Layers,
  Layout,
  Sidebar,
  PanelLeft,
  Menu,
  MoreVertical,
  MoreHorizontal,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  RotateCw,
  RotateCcw,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Pause,
  StopCircle,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Image,
  Film,
  Music,
  Headset,
  Speaker,
  Cast,
  Airplay,
  Tv,
  Radio as RadioIcon,
  Podcast,
  Voicemail,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneForwarded,
  PhoneOff,
  Mailbox,
  Inbox,
  Archive,
  Trash,
  Trash2,
  FolderOpen,
  Folder,
  File,
  Files,
  Copy,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardList,
  Edit,
  Edit2,
  Edit3,
  Save,
  Plus,
  Minus,
  Check,
  CheckCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  XCircle,
  XOctagon,
  Slash,
  Ban,
  StopCircle as Stop,
  AlertOctagon
} from 'lucide-react';

export default function Careers(props: any) {
  const isDashboard = props?.isDashboard || false;
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollPosition / windowHeight) * 100;
      setScrollProgress(progress);
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const departments = [
    { id: 'all', name: 'All Positions', icon: Briefcase, color: 'bg-blue-500', count: 10 },
    { id: 'engineering', name: 'Engineering', icon: Code, color: 'bg-purple-500', count: 5 },
    { id: 'design', name: 'Design', icon: Palette, color: 'bg-pink-500', count: 2 },
    { id: 'operations', name: 'Operations', icon: Settings, color: 'bg-green-500', count: 2 },
    { id: 'sales', name: 'Sales & Marketing', icon: TrendingUp, color: 'bg-orange-500', count: 1 }
  ];

  const locations = [
    { id: 'all', name: 'All Locations', icon: Globe },
    { id: 'remote', name: 'Remote', icon: Laptop },
    { id: 'hybrid', name: 'Hybrid', icon: Building },
    { id: 'san-francisco', name: 'San Francisco', icon: MapPin },
    { id: 'new-york', name: 'New York', icon: MapPin },
    { id: 'austin', name: 'Austin', icon: MapPin }
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types', icon: Briefcase },
    { id: 'full-time', name: 'Full-time', icon: Clock },
    { id: 'part-time', name: 'Part-time', icon: Clock },
    { id: 'contract', name: 'Contract', icon: FileText },
    { id: 'internship', name: 'Internship', icon: GraduationCap }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'engineering',
      location: 'remote',
      locationName: 'Remote / Hybrid',
      type: 'full-time',
      salary: '$120k - $180k',
      description: 'Build scalable solutions that bridge communities and create meaningful connections. Lead architectural decisions and mentor junior developers.',
      longDescription: 'We are seeking an experienced Senior Full Stack Engineer to join our rapidly growing engineering team. In this role, you will be responsible for designing, developing, and maintaining scalable web applications that serve millions of users worldwide. You will work closely with product managers, designers, and other engineers to deliver high-quality features that directly impact our users.',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'GraphQL'],
      requirements: [
        '5+ years of full-stack development experience',
        'Expert knowledge of React and Node.js',
        'Experience with microservices architecture',
        'Strong problem-solving and communication skills',
        'Experience with cloud platforms (AWS, GCP, or Azure)',
        'Proficiency in database design and optimization',
        'Track record of leading technical projects'
      ],
      responsibilities: [
        'Design and implement scalable web applications',
        'Lead code reviews and architectural discussions',
        'Mentor junior and mid-level engineers',
        'Collaborate with product and design teams',
        'Optimize application performance and scalability',
        'Contribute to technical documentation and best practices',
        'Participate in on-call rotation for production support'
      ],
      niceToHave: [
        'Experience with machine learning or AI',
        'Open source contributions',
        'Public speaking or technical writing experience',
        'Experience in a startup environment'
      ],
      featured: true,
      urgent: true,
      remote: true,
      postedDays: 2,
      applicants: 45,
      views: 230
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'design',
      location: 'san-francisco',
      locationName: 'San Francisco, CA',
      type: 'full-time',
      salary: '$100k - $150k',
      description: 'Design intuitive experiences that help people connect and collaborate seamlessly. Own the design process from research to delivery.',
      longDescription: 'Join our design team to create beautiful, intuitive experiences that delight our users. You will own the entire design process from initial research through final implementation, working closely with product managers and engineers to bring your vision to life.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'UI/UX', 'Adobe Creative Suite'],
      requirements: [
        '4+ years of product design experience',
        'Portfolio showcasing user-centered design',
        'Experience with design systems',
        'Strong collaboration skills',
        'Proficiency in Figma and prototyping tools',
        'Understanding of front-end development principles'
      ],
      responsibilities: [
        'Lead design projects from concept to launch',
        'Conduct user research and usability testing',
        'Create and maintain design system',
        'Present designs to stakeholders',
        'Collaborate with engineers on implementation',
        'Contribute to product strategy and roadmap'
      ],
      niceToHave: [
        'Motion design experience',
        'Illustration skills',
        'Experience with design tokens',
        'Knowledge of accessibility standards'
      ],
      featured: false,
      urgent: false,
      remote: false,
      postedDays: 5,
      applicants: 32,
      views: 156
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'operations',
      location: 'new-york',
      locationName: 'New York, NY',
      type: 'full-time',
      salary: '$70k - $100k',
      description: 'Be the bridge between our users and our mission to create impactful connections. Drive customer satisfaction and retention.',
      longDescription: 'As a Customer Success Manager, you will be the primary point of contact for our enterprise customers, ensuring they derive maximum value from our platform. You will build strong relationships, drive product adoption, and identify opportunities for account growth.',
      skills: ['Communication', 'Problem Solving', 'CRM', 'Analytics', 'Salesforce', 'Customer Success'],
      requirements: [
        '3+ years in customer success or account management',
        'Experience with SaaS products',
        'Data-driven decision making',
        'Excellent communication skills',
        'Proficiency in CRM tools like Salesforce',
        'Strong presentation skills'
      ],
      responsibilities: [
        'Manage key customer relationships',
        'Drive product adoption and engagement',
        'Identify upsell opportunities',
        'Analyze customer health metrics',
        'Conduct quarterly business reviews',
        'Advocate for customer needs internally'
      ],
      niceToHave: [
        'Technical background',
        'Experience in EdTech or HR Tech',
        'Project management certification',
        'Multi-language proficiency'
      ],
      featured: false,
      urgent: false,
      remote: false,
      postedDays: 7,
      applicants: 28,
      views: 142
    },
    {
      id: 4,
      title: 'Marketing Lead',
      department: 'sales',
      location: 'remote',
      locationName: 'Remote',
      type: 'full-time',
      salary: '$90k - $130k',
      description: 'Tell our story and build bridges with communities around the world. Lead marketing strategy and execution.',
      longDescription: 'We are looking for a strategic Marketing Lead to shape our brand narrative and drive growth through innovative marketing campaigns. You will lead our marketing efforts across multiple channels and build a high-performing team.',
      skills: ['Content Strategy', 'SEO', 'Social Media', 'Analytics', 'Marketing Automation', 'Brand Strategy'],
      requirements: [
        '5+ years marketing experience',
        'Proven track record in B2B marketing',
        'Strong analytical and creative skills',
        'Experience managing marketing budgets',
        'Expertise in digital marketing channels',
        'Leadership experience'
      ],
      responsibilities: [
        'Develop and execute marketing strategy',
        'Lead content creation and campaigns',
        'Manage marketing team and budget',
        'Track and optimize marketing ROI',
        'Build and nurture brand partnerships',
        'Oversee product launches and go-to-market strategies'
      ],
      niceToHave: [
        'Growth hacking experience',
        'Video production skills',
        'PR and media relations experience',
        'International marketing experience'
      ],
      featured: true,
      urgent: false,
      remote: true,
      postedDays: 3,
      applicants: 38,
      views: 198
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'remote',
      locationName: 'Remote',
      type: 'full-time',
      salary: '$110k - $160k',
      description: 'Maintain the infrastructure that keeps our bridges strong and reliable. Ensure 99.9% uptime and optimal performance.',
      longDescription: 'Join our infrastructure team to build and maintain the systems that power our platform. You will work on cutting-edge technologies to ensure our services are reliable, scalable, and secure.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Monitoring', 'Linux', 'Python'],
      requirements: [
        '4+ years DevOps experience',
        'Strong knowledge of AWS services',
        'Experience with container orchestration',
        'Automation and scripting expertise',
        'Understanding of networking and security',
        'Experience with infrastructure as code'
      ],
      responsibilities: [
        'Manage cloud infrastructure and deployments',
        'Implement CI/CD pipelines',
        'Monitor system performance and reliability',
        'Respond to incidents and outages',
        'Optimize infrastructure costs',
        'Implement security best practices'
      ],
      niceToHave: [
        'Kubernetes certification',
        'Experience with multi-cloud environments',
        'Security certifications',
        'Experience with chaos engineering'
      ],
      featured: false,
      urgent: true,
      remote: true,
      postedDays: 1,
      applicants: 52,
      views: 267
    },
    {
      id: 6,
      title: 'UX Researcher',
      department: 'design',
      location: 'austin',
      locationName: 'Austin, TX',
      type: 'contract',
      salary: '$80k - $120k',
      description: 'Uncover insights that help us build better connections for our users. Conduct comprehensive user research studies.',
      longDescription: 'We are seeking a UX Researcher to help us deeply understand our users and inform product decisions with data-driven insights. You will design and conduct research studies using both qualitative and quantitative methods.',
      skills: ['User Testing', 'Data Analysis', 'Qualitative Research', 'Surveys', 'Statistics', 'Research Methods'],
      requirements: [
        '3+ years UX research experience',
        'Mixed methods research expertise',
        'Strong analytical skills',
        'Experience presenting to stakeholders',
        'Proficiency in research tools',
        'Understanding of statistical analysis'
      ],
      responsibilities: [
        'Plan and conduct user research studies',
        'Analyze and synthesize research findings',
        'Present insights to product teams',
        'Build research repository and guidelines',
        'Collaborate with designers and PMs',
        'Advocate for user needs'
      ],
      niceToHave: [
        'PhD in HCI or related field',
        'Experience with eye-tracking studies',
        'Knowledge of accessibility research',
        'Experience in international research'
      ],
      featured: false,
      urgent: false,
      remote: false,
      postedDays: 4,
      applicants: 19,
      views: 98
    },
    {
      id: 7,
      title: 'Frontend Engineer',
      department: 'engineering',
      location: 'hybrid',
      locationName: 'San Francisco / Remote',
      type: 'full-time',
      salary: '$100k - $150k',
      description: 'Create beautiful, performant user interfaces that delight our users. Work with cutting-edge frontend technologies.',
      longDescription: 'We are looking for a talented Frontend Engineer to join our team and build exceptional user experiences. You will work with React, TypeScript, and modern frontend tools to create fast, accessible, and beautiful web applications.',
      skills: ['React', 'TypeScript', 'CSS', 'Testing', 'Performance', 'Accessibility', 'Next.js'],
      requirements: [
        '3+ years frontend development',
        'Deep React expertise',
        'Understanding of web performance',
        'Eye for design and UX',
        'Strong CSS and styling skills',
        'Experience with testing frameworks'
      ],
      responsibilities: [
        'Build responsive web applications',
        'Optimize frontend performance',
        'Collaborate with designers',
        'Write maintainable, tested code',
        'Contribute to component library',
        'Improve developer experience'
      ],
      niceToHave: [
        'Experience with Web3 or blockchain',
        'WebGL or Three.js experience',
        'Animation expertise',
        'Design system experience'
      ],
      featured: false,
      urgent: false,
      remote: false,
      postedDays: 6,
      applicants: 41,
      views: 189
    },
    {
      id: 8,
      title: 'Product Manager',
      department: 'operations',
      location: 'san-francisco',
      locationName: 'San Francisco, CA',
      type: 'full-time',
      salary: '$130k - $180k',
      description: 'Drive product vision and strategy. Work cross-functionally to deliver products that users love.',
      longDescription: 'We are seeking an experienced Product Manager to lead strategic product initiatives and drive the roadmap for key features. You will work closely with engineering, design, and business stakeholders to deliver impactful products.',
      skills: ['Product Strategy', 'Roadmapping', 'Analytics', 'Agile', 'Stakeholder Management', 'SQL'],
      requirements: [
        '5+ years product management',
        'Technical background preferred',
        'Strong analytical skills',
        'Excellent communication',
        'Experience with data-driven decision making',
        'Track record of shipping successful products'
      ],
      responsibilities: [
        'Define product roadmap and priorities',
        'Work with engineering and design teams',
        'Analyze metrics and user feedback',
        'Present to executives and stakeholders',
        'Conduct competitive analysis',
        'Drive go-to-market strategies'
      ],
      niceToHave: [
        'MBA or advanced degree',
        'Experience in marketplace or platform products',
        'Background in consulting',
        'International product experience'
      ],
      featured: true,
      urgent: false,
      remote: false,
      postedDays: 8,
      applicants: 67,
      views: 312
    },
    {
      id: 9,
      title: 'Data Scientist',
      department: 'engineering',
      location: 'remote',
      locationName: 'Remote',
      type: 'full-time',
      salary: '$120k - $170k',
      description: 'Use data to drive insights and build ML models. Help us make data-driven decisions across the company.',
      longDescription: 'Join our data science team to build predictive models and extract insights from our vast datasets. You will work on challenging problems in recommendation systems, personalization, and business intelligence.',
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization', 'TensorFlow', 'PyTorch'],
      requirements: [
        '4+ years data science experience',
        'Strong ML and statistical skills',
        'Experience with large datasets',
        'Business acumen',
        'Proficiency in Python and SQL',
        'Experience deploying ML models to production'
      ],
      responsibilities: [
        'Build predictive models and algorithms',
        'Analyze complex datasets',
        'Create data visualizations',
        'Partner with product teams',
        'Communicate findings to stakeholders',
        'Mentor junior data scientists'
      ],
      niceToHave: [
        'PhD in related field',
        'Experience with NLP or computer vision',
        'Published research',
        'Kaggle competition experience'
      ],
      featured: false,
      urgent: false,
      remote: true,
      postedDays: 10,
      applicants: 56,
      views: 245
    },
    {
      id: 10,
      title: 'Software Engineering Intern',
      department: 'engineering',
      location: 'hybrid',
      locationName: 'San Francisco / Remote',
      type: 'internship',
      salary: '$40/hr - $50/hr',
      description: 'Learn from experienced engineers while contributing to real projects. Perfect for students seeking hands-on experience.',
      longDescription: 'Our internship program is designed to give students real-world experience working on meaningful projects. You will be paired with a mentor and work alongside our engineering team to ship features that impact millions of users.',
      skills: ['Programming', 'Computer Science', 'Problem Solving', 'Git'],
      requirements: [
        'Currently pursuing CS or related degree',
        'Knowledge of at least one programming language',
        'Strong problem-solving skills',
        'Passion for learning',
        'Available for 12-week program',
        'Strong academic record'
      ],
      responsibilities: [
        'Work on real product features',
        'Participate in code reviews',
        'Learn from mentors',
        'Contribute to team goals',
        'Attend engineering meetings',
        'Present final project at end of internship'
      ],
      niceToHave: [
        'Previous internship experience',
        'Personal projects or portfolio',
        'Open source contributions',
        'Hackathon participation'
      ],
      featured: false,
      urgent: false,
      remote: false,
      postedDays: 12,
      applicants: 134,
      views: 489
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive medical, dental, and vision coverage for you and your family',
      details: [
        'Premium health insurance with multiple plan options',
        'Mental health support and counseling services',
        'Gym membership reimbursement up to $100/month',
        '$500 annual wellness stipend for fitness equipment',
        'Regular wellness workshops and yoga classes',
        'On-site health screenings and flu shots'
      ],
      color: 'from-red-500 to-pink-500',
      iconBg: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      icon: TrendingUp,
      title: 'Growth & Development',
      description: 'Professional development budget and learning opportunities to advance your career',
      details: [
        '$2,000 annual learning and development budget',
        'Access to online learning platforms (Coursera, Udemy)',
        'Conference attendance and speaking opportunities',
        'Internal mentorship programs',
        'Career coaching and skills workshops',
        'Tuition reimbursement for advanced degrees'
      ],
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Users,
      title: 'Community & Culture',
      description: 'Collaborative culture with diverse, talented teammates and regular team events',
      details: [
        'Quarterly team offsites and retreats',
        'Employee Resource Groups (ERGs)',
        'Regular social events and team building',
        'Inclusive and diverse work environment',
        'Volunteer time off for community service',
        'Company-wide celebrations and milestones'
      ],
      color: 'from-purple-500 to-indigo-500',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Zap,
      title: 'Work-Life Balance',
      description: 'Remote-first with flexible working hours and unlimited PTO',
      details: [
        'Unlimited paid time off policy',
        'Flexible working hours',
        'Work from anywhere in the world',
        '12 weeks paid parental leave',
        'Sabbatical program after 5 years',
        'No meeting Fridays'
      ],
      color: 'from-yellow-500 to-orange-500',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Market-leading salaries with equity and performance bonuses',
      details: [
        'Competitive base salary benchmarked to market',
        'Generous equity packages for all employees',
        'Annual performance bonuses up to 20%',
        '401(k) matching up to 6% of salary',
        'Stock option refresh grants',
        'Transparent compensation bands'
      ],
      color: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Coffee,
      title: 'Perks & Benefits',
      description: 'Office perks, equipment stipend, and more to make your work enjoyable',
      details: [
        '$3,000 home office setup budget',
        'Free snacks, drinks, and catered meals',
        'Monthly team lunch stipend',
        'Company swag and merchandise',
        'Commuter benefits and parking',
        'Pet-friendly office spaces'
      ],
      color: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Laptop,
      title: 'Latest Equipment',
      description: 'Top-tier hardware and software tools to help you do your best work',
      details: [
        'MacBook Pro or high-end PC of your choice',
        'Multiple 4K monitors and accessories',
        'Ergonomic desk and chair setup',
        'Premium software licenses and tools',
        'Regular equipment upgrades',
        'IT support and technical assistance'
      ],
      color: 'from-cyan-500 to-blue-500',
      iconBg: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      icon: Globe,
      title: 'Remote First',
      description: 'Work from anywhere in the world with async-friendly processes',
      details: [
        'Global team across 15+ countries',
        'Async-first communication culture',
        'Flexible timezone collaboration',
        '$200/month co-working space stipend',
        'Annual company-wide summit',
        'Home internet reimbursement'
      ],
      color: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  const companyValues = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'We are passionate about connecting people and creating meaningful relationships that transform careers and lives.',
      color: 'from-blue-500 to-cyan-500',
      stats: { label: 'Impact Score', value: '98%' }
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'We push boundaries and embrace new ideas to solve complex problems with creative solutions.',
      color: 'from-purple-500 to-pink-500',
      stats: { label: 'R&D Investment', value: '25%' }
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and accountability in everything we do, building trust with our users.',
      color: 'from-green-500 to-emerald-500',
      stats: { label: 'Trust Rating', value: '4.9/5' }
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'We strive for excellence and continuous improvement in our work, our growth, and our impact on the world.',
      color: 'from-yellow-500 to-orange-500',
      stats: { label: 'Quality Score', value: '96%' }
    }
  ];

  const hiringProcess = [
    {
      step: 1,
      title: 'Application Review',
      description: 'Submit your application through our careers portal. Our recruitment team carefully reviews every application.',
      duration: '3-5 days',
      icon: FileText,
      details: [
        'Review by hiring manager',
        'Skills and experience assessment',
        'Cultural fit evaluation',
        'Portfolio or work samples review'
      ]
    },
    {
      step: 2,
      title: 'Initial Screening',
      description: 'A brief 30-minute call with our recruiting team to discuss your background, experience, and the role.',
      duration: '30 min',
      icon: Phone,
      details: [
        'Introduction to the company and role',
        'Discussion of your background',
        'Salary expectations alignment',
        'Answer your initial questions'
      ]
    },
    {
      step: 3,
      title: 'Technical/Skills Assessment',
      description: 'Depending on the role, complete a take-home assignment or participate in a technical interview.',
      duration: '1-2 hours',
      icon: Code,
      details: [
        'Role-specific evaluation',
        'Real-world problem solving',
        'Technical or design challenge',
        'Work sample submission'
      ]
    },
    {
      step: 4,
      title: 'Team Interviews',
      description: 'Meet with team members and hiring managers to discuss your experience, approach, and potential fit.',
      duration: '2-3 hours',
      icon: Users,
      details: [
        'Meet potential teammates',
        'Behavioral interviews',
        'Case studies or scenarios',
        'Team collaboration assessment'
      ]
    },
    {
      step: 5,
      title: 'Final Interview',
      description: 'Final conversation with leadership to align on expectations, vision, and answer any remaining questions.',
      duration: '45 min',
      icon: Award,
      details: [
        'Meet leadership team',
        'Discuss company vision and values',
        'Career growth opportunities',
        'Final Q&A session'
      ]
    },
    {
      step: 6,
      title: 'Offer & Onboarding',
      description: 'Receive your offer and get ready to join our amazing team! We will guide you through the onboarding process.',
      duration: '1-2 days',
      icon: Gift,
      details: [
        'Competitive offer presentation',
        'Negotiation and finalization',
        'Welcome package',
        'Onboarding schedule and setup'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineer',
      department: 'Engineering',
      avatar: 'SC',
      image: null,
      quote: 'The culture here is incredible. I have learned more in one year than my previous three years combined. The mentorship and growth opportunities are unmatched.',
      rating: 5,
      tenure: '2 years',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Designer',
      department: 'Design',
      avatar: 'MJ',
      image: null,
      quote: 'The team truly values creativity and gives us the freedom to explore innovative solutions. Every day brings new challenges and opportunities to make an impact.',
      rating: 5,
      tenure: '1.5 years',
      color: 'bg-gradient-to-br from-purple-500 to-pink-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      department: 'Marketing',
      avatar: 'ER',
      image: null,
      quote: 'Work-life balance is not just a buzzword here. The flexibility has been life-changing, allowing me to excel in my career while being present for my family.',
      rating: 5,
      tenure: '3 years',
      color: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      name: 'David Park',
      role: 'DevOps Lead',
      department: 'Engineering',
      avatar: 'DP',
      image: null,
      quote: 'The technical challenges are amazing, and the team is world-class. We are building infrastructure at scale that directly impacts millions of users.',
      rating: 5,
      tenure: '2.5 years',
      color: 'bg-gradient-to-br from-orange-500 to-red-500'
    }
  ];

  const faqs = [
    {
      question: 'What is the interview process like?',
      answer: 'Our interview process typically includes an initial screening call, technical/skills assessment, team interviews, and a final conversation with leadership. The entire process usually takes 2-3 weeks from application to offer. We are committed to making the process transparent, respectful, and efficient.',
      category: 'Process',
      icon: HelpCircle
    },
    {
      question: 'Do you offer remote work options?',
      answer: 'Yes! We are a remote-first company with team members across the globe in 15+ countries. Many positions are fully remote, and some offer hybrid options for those near our office locations in San Francisco, New York, and Austin. We provide a co-working stipend and home office setup budget for all remote employees.',
      category: 'Work Model',
      icon: Laptop
    },
    {
      question: 'What benefits do you offer?',
      answer: 'We offer comprehensive health insurance (medical, dental, vision), unlimited PTO, equity packages, 401k matching up to 6%, professional development budget ($2,000/year), home office stipend, gym membership, mental health support, and much more. Check out our benefits section above for full details.',
      category: 'Benefits',
      icon: Heart
    },
    {
      question: 'Do you sponsor work visas?',
      answer: 'Yes, we sponsor H-1B visas and other work authorization for qualified candidates in the United States. For international positions, we work with immigration specialists to support the visa process. Our team will work with you throughout the entire process and cover associated costs.',
      category: 'Immigration',
      icon: Globe
    },
    {
      question: 'What is the salary range for positions?',
      answer: 'We believe in transparent compensation. Each job listing includes a salary range based on market data and experience level. We are committed to paying competitive, fair salaries that reflect your skills and contributions. Compensation packages also include equity and performance bonuses.',
      category: 'Compensation',
      icon: DollarSign
    },
    {
      question: 'Do you hire interns or new graduates?',
      answer: 'Absolutely! We have dedicated 12-week internship programs running in Summer and Fall, and actively hire new graduates for full-time positions. We believe in investing in emerging talent and provide structured mentorship, learning opportunities, and real project ownership.',
      category: 'Early Career',
      icon: GraduationCap
    },
    {
      question: 'What is your diversity and inclusion policy?',
      answer: 'We are committed to building a diverse and inclusive workplace where everyone feels valued and empowered. We have active Employee Resource Groups (ERGs), unconscious bias training, and inclusive hiring practices. Our leadership team prioritizes diversity metrics and regularly reports on progress.',
      category: 'Culture',
      icon: Users
    },
    {
      question: 'How do you support professional development?',
      answer: 'We provide a $2,000 annual learning budget for courses, books, and conferences. We also offer internal mentorship programs, lunch-and-learn sessions, and career coaching. After 5 years, employees are eligible for a 4-week paid sabbatical to pursue personal development.',
      category: 'Growth',
      icon: TrendingUp
    },
    {
      question: 'What is the company culture like?',
      answer: 'Our culture is collaborative, innovative, and mission-driven. We value transparency, encourage experimentation, and celebrate both successes and failures as learning opportunities. We have a flat organizational structure with open communication across all levels. Work-life balance is a core value.',
      category: 'Culture',
      icon: Star
    },
    {
      question: 'How often do performance reviews happen?',
      answer: 'We conduct formal performance reviews bi-annually, with continuous feedback throughout the year. We use a 360-degree review process where you receive feedback from peers, reports, and managers. Reviews are tied to compensation adjustments, promotions, and career development planning.',
      category: 'Performance',
      icon: BarChart3
    },
    {
      question: 'What tools and technologies do you use?',
      answer: 'We use modern tech stacks including React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, and Kubernetes. For collaboration, we use Slack, Notion, Figma, and GitHub. We are technology-agnostic and always evaluate new tools that can improve our efficiency and product quality.',
      category: 'Technology',
      icon: Code
    },
    {
      question: 'How do you handle work-life balance?',
      answer: 'We offer unlimited PTO, flexible working hours, and a strong async-first culture that respects different timezones. We have "No Meeting Fridays" and discourage after-hours communication. Leadership actively models healthy work-life balance and we track burnout indicators to ensure team wellbeing.',
      category: 'Work-Life',
      icon: Zap
    }
  ];

  const stats = [
    {
      label: 'Team Members',
      value: '200+',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      description: 'Talented professionals',
      trend: '+15%'
    },
    {
      label: 'Countries',
      value: '15+',
      icon: Globe,
      color: 'from-purple-500 to-pink-500',
      description: 'Global presence',
      trend: '+3'
    },
    {
      label: 'Open Positions',
      value: '25+',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      description: 'Join us now',
      trend: '+8'
    },
    {
      label: 'Avg Rating',
      value: '4.9/5',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      description: 'Employee satisfaction',
      trend: '+0.2'
    }
  ];

  const perks = [
    { icon: Heart, label: 'Health Insurance', color: 'text-red-500' },
    { icon: Zap, label: 'Unlimited PTO', color: 'text-yellow-500' },
    { icon: Laptop, label: 'Remote Work', color: 'text-blue-500' },
    { icon: Coffee, label: 'Free Meals', color: 'text-orange-500' },
    { icon: TrendingUp, label: '$2K Learning Budget', color: 'text-green-500' },
    { icon: Users, label: 'Team Events', color: 'text-purple-500' },
    { icon: Gift, label: 'Equity Options', color: 'text-pink-500' },
    { icon: Globe, label: 'Work Anywhere', color: 'text-cyan-500' }
  ];

  const officeLocations = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 400, San Francisco, CA 94103',
      employees: 80,
      image: null,
      amenities: ['Rooftop terrace', 'Gym', 'Game room', 'Cafe'],
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 12, New York, NY 10013',
      employees: 65,
      image: null,
      amenities: ['City views', 'Meditation room', 'Coffee bar', 'Library'],
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      city: 'Austin',
      address: '789 Congress Avenue, Austin, TX 78701',
      employees: 45,
      image: null,
      amenities: ['Outdoor patio', 'Bike storage', 'Snack bar', 'Music room'],
      coordinates: { lat: 30.2672, lng: -97.7431 }
    }
  ];

  // Filter jobs
  let filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDepartment && matchesLocation && matchesType && matchesSearch;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const urgentJobs = filteredJobs.filter(job => job.urgent);
  const regularJobs = filteredJobs.filter(job => !job.featured && !job.urgent);

  const ApplicationModal = () => {
    const job = jobs.find(j => j.id === selectedJobForApplication);
    if (!job) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-border p-6 flex items-center justify-between z-10">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Apply for Position</h3>
              <p className="text-sm text-muted-foreground mt-1">{job.title}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApplicationModal(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">LinkedIn Profile</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Resume/CV *</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (max 10MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Cover Letter (Optional)</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Portfolio/Website</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">How did you hear about us?</label>
                <select className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                  <option>Select an option</option>
                  <option>LinkedIn</option>
                  <option>Job Board</option>
                  <option>Referral</option>
                  <option>Company Website</option>
                  <option>Social Media</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowApplicationModal(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Send className="mr-2 h-4 w-4" />
                Submit Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" : "bg-transparent"} transition-colors duration-300`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Header - Only show when not in dashboard */}
      {!isDashboard && (
        <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                className={`hover:bg-muted transition-all ${isScrolled ? '' : 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm'}`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 px-3 py-1">
                  <Flame className="h-3 w-3 mr-1" />
                  {filteredJobs.length} Open Positions
                </Badge>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${!isDashboard ? "container mx-auto px-4 py-8 max-w-7xl" : "p-0"} ${!isDashboard ? 'pt-24' : ''}`}>
        {/* Hero Section - Hide if dashboard */}
        {!isDashboard && (
          <div className="text-center mb-20 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-full mb-8 backdrop-blur-sm">
                <Rocket className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-bounce" />
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Join Our Mission
                </span>
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Build Bridges
                </span>
                <br />
                <span className="text-foreground">With Us</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                Join our mission to connect people, ideas, and opportunities. We're building more than software—
                <span className="text-foreground font-semibold"> we're creating meaningful connections that change lives</span>.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 h-14 px-8 text-lg font-semibold rounded-2xl"
                  onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Open Roles
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 h-14 px-8 text-lg font-semibold rounded-2xl hover:bg-muted"
                  onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  View Benefits
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="relative overflow-hidden border-2 border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      <CardContent className="pt-6 text-center relative z-10">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                        <div className="text-xs text-muted-foreground">{stat.description}</div>
                        <Badge variant="secondary" className="mt-2 bg-green-500/10 text-green-700 dark:text-green-400 border-0">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.trend}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Perks Ticker */}
        {!isDashboard && (
          <div className="mb-20 overflow-hidden">
            <div className="flex gap-6 animate-scroll">
              {[...perks, ...perks].map((perk, index) => {
                const Icon = perk.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-full border border-border shadow-sm whitespace-nowrap"
                  >
                    <Icon className={`h-5 w-5 ${perk.color}`} />
                    <span className="font-semibold text-sm">{perk.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Company Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
              <Star className="h-3 w-3 mr-1" />
              Our DNA
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              What We Stand For
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape our culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-2 border-border bg-card hover:border-primary/30 transition-all duration-300 group hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <CardContent className="pt-8 text-center relative z-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${value.color} mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-black text-2xl mb-4 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{value.description}</p>
                    <div className="pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1">{value.stats.label}</div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${value.color} bg-clip-text text-transparent`}>
                        {value.stats.value}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div id="benefits" className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
              <Heart className="h-3 w-3 mr-1" />
              Perks & Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              We Take Care of Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive benefits and perks designed to support your whole self
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isSelected = selectedBenefit === index;

              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${isSelected
                      ? 'border-2 border-primary shadow-2xl scale-105 z-10'
                      : 'border-2 border-border hover:border-primary/50 hover:shadow-xl'
                    }`}
                  onClick={() => setSelectedBenefit(isSelected ? null : index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 ${isSelected ? 'opacity-10' : 'group-hover:opacity-5'} transition-opacity duration-300`} />
                  <CardContent className="pt-6 relative z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${benefit.iconBg} mb-4 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                      <Icon className={`h-7 w-7 ${benefit.iconColor}`} />
                    </div>
                    <h3 className="font-black text-xl mb-3 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{benefit.description}</p>

                    {isSelected && (
                      <ul className="space-y-2 mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {benefit.details.map((detail, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 text-primary hover:bg-primary/10"
                    >
                      {isSelected ? 'Show Less' : 'Learn More'}
                      <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div id="open-positions" className="mb-12 scroll-mt-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
              <Briefcase className="h-3 w-3 mr-1" />
              Open Positions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Next Role
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore opportunities across different teams and locations
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search by role, skill, or keyword (e.g., React, Design, Remote)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-border bg-white dark:bg-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg shadow-lg"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`hover:bg-muted border-2 transition-all ${showFilters ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <Filter className="mr-2 h-4 w-4 text-primary" />
              Filters
              {(selectedDepartment !== 'all' || selectedLocation !== 'all' || selectedType !== 'all') && (
                <Badge variant="secondary" className="ml-2 bg-primary text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {[selectedDepartment !== 'all', selectedLocation !== 'all', selectedType !== 'all'].filter(Boolean).length}
                </Badge>
              )}
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <Sidebar className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 mb-8 border-2 border-border shadow-xl animate-in slide-in-from-top-4 duration-300">
              {/* Department Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Department
                  </h3>
                  {selectedDepartment !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDepartment('all')}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {departments.map(dept => {
                    const Icon = dept.icon;
                    const isActive = selectedDepartment === dept.id;
                    return (
                      <Button
                        key={dept.id}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setSelectedDepartment(dept.id)}
                        className={`transition-all ${isActive
                            ? `${dept.color} text-white shadow-lg hover:shadow-xl`
                            : "hover:bg-muted border-2 border-border"
                          }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {dept.name}
                        <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
                          {dept.count}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </h3>
                  {selectedLocation !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLocation('all')}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {locations.map(loc => {
                    const Icon = loc.icon;
                    const isActive = selectedLocation === loc.id;
                    return (
                      <Button
                        key={loc.id}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setSelectedLocation(loc.id)}
                        className={`transition-all ${isActive
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                            : "hover:bg-muted border-2 border-border"
                          }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {loc.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Employment Type
                  </h3>
                  {selectedType !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedType('all')}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {jobTypes.map(type => {
                    const Icon = type.icon;
                    const isActive = selectedType === type.id;
                    return (
                      <Button
                        key={type.id}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setSelectedType(type.id)}
                        className={`transition-all ${isActive
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                            : "hover:bg-muted border-2 border-border"
                          }`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Position' : 'Positions'} Available
            </h3>
            {(selectedDepartment !== 'all' || selectedLocation !== 'all' || selectedType !== 'all' || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedLocation('all');
                  setSelectedType('all');
                  setSearchQuery('');
                }}
                className="border-2"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Urgent Jobs */}
          {urgentJobs.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-foreground">
                <Flame className="h-6 w-6 text-orange-500" />
                Urgent Openings
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-0">
                  Hiring Fast!
                </Badge>
              </h3>
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
                {urgentJobs.map(job => {
                  const isExpanded = expandedJob === job.id;
                  return (
                    <Card
                      key={job.id}
                      className="group relative overflow-hidden border-2 border-orange-500/30 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-900/10 dark:to-slate-900 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-[100px]" />

                      <CardHeader className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 font-bold">
                                <Flame className="h-3 w-3 mr-1" />
                                URGENT
                              </Badge>
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                                {departments.find(d => d.id === job.department)?.name}
                              </Badge>
                            </div>
                            <CardTitle className="text-2xl mb-3 flex items-start gap-3 text-foreground group-hover:text-primary transition-colors">
                              <Briefcase className="h-6 w-6 flex-shrink-0 mt-1" />
                              <span>{job.title}</span>
                            </CardTitle>
                            <CardDescription className="text-base text-muted-foreground leading-relaxed">
                              {job.description}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                            <MapPin className="h-4 w-4 text-primary" />
                            {job.locationName}
                          </div>
                          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                            <Clock className="h-4 w-4 text-primary" />
                            {jobTypes.find(t => t.id === job.type)?.name}
                          </div>
                          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                            <DollarSign className="h-4 w-4 text-primary" />
                            {job.salary}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Posted {job.postedDays} days ago
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applicants} applicants
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.views} views
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="relative z-10">
                        <div className="mb-6">
                          <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Required Skills:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="px-3 py-1.5 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="space-y-6 mb-6 animate-in slide-in-from-top-4 duration-300">
                            <div>
                              <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Requirements:
                              </h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Responsibilities:
                              </h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((resp, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {job.niceToHave && job.niceToHave.length > 0 && (
                              <div>
                                <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <Sparkles className="h-4 w-4" />
                                  Nice to Have:
                                </h4>
                                <ul className="space-y-2">
                                  {job.niceToHave.map((nice, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                      <span>{nice}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
                            onClick={() => {
                              setSelectedJobForApplication(job.id);
                              setShowApplicationModal(true);
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            className="border-2"
                            onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                          >
                            {isExpanded ? (
                              <>
                                Show Less
                                <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
                              </>
                            ) : (
                              <>
                                View Details
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Featured Jobs */}
          {featuredJobs.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-foreground">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                Featured Positions
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-0">
                  Highlighted
                </Badge>
              </h3>
              <div className="space-y-6">
                {featuredJobs.map(job => {
                  const isExpanded = expandedJob === job.id;
                  return (
                    <Card
                      key={job.id}
                      className="group relative overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 p-6">
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 font-bold px-4 py-1.5 shadow-lg">
                          <Crown className="h-4 w-4 mr-1" />
                          FEATURED
                        </Badge>
                      </div>

                      <CardHeader className="pr-32">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">
                                {departments.find(d => d.id === job.department)?.name}
                              </Badge>
                              {job.remote && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
                                  <Laptop className="h-3 w-3 mr-1" />
                                  Remote OK
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-3xl mb-4 flex items-start gap-3 text-foreground group-hover:text-primary transition-colors">
                              <div className="p-3 bg-primary/10 rounded-2xl">
                                <Briefcase className="h-7 w-7 text-primary" />
                              </div>
                              <span>{job.title}</span>
                            </CardTitle>
                            <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                              {job.description}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-6">
                          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
                            <MapPin className="h-4 w-4 text-primary" />
                            {job.locationName}
                          </div>
                          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
                            <Clock className="h-4 w-4 text-primary" />
                            {jobTypes.find(t => t.id === job.type)?.name}
                          </div>
                          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border">
                            <DollarSign className="h-4 w-4 text-primary" />
                            {job.salary}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Posted {job.postedDays} days ago
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applicants} applicants
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.views} views
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="mb-6">
                          <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Expertise Required:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="px-3 py-1.5 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors font-medium"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="space-y-6 mb-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="bg-muted/30 rounded-xl p-6">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {job.longDescription}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Requirements:
                              </h4>
                              <ul className="space-y-2">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Responsibilities:
                              </h4>
                              <ul className="space-y-2">
                                {job.responsibilities.map((resp, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {job.niceToHave && job.niceToHave.length > 0 && (
                              <div>
                                <h4 className="font-black text-sm mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                  <Sparkles className="h-4 w-4" />
                                  Nice to Have:
                                </h4>
                                <ul className="space-y-2">
                                  {job.niceToHave.map((nice, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                      <span>{nice}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                            onClick={() => {
                              setSelectedJobForApplication(job.id);
                              setShowApplicationModal(true);
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            className="border-2"
                            onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                          >
                            {isExpanded ? (
                              <>
                                Show Less
                                <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
                              </>
                            ) : (
                              <>
                                View Details
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Jobs */}
          {regularJobs.length > 0 && (
            <div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-foreground">
                <Briefcase className="h-6 w-6 text-primary" />
                All Other Positions
              </h3>
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
                {regularJobs.map(job => {
                  const isExpanded = expandedJob === job.id;
                  return (
                    <Card
                      key={job.id}
                      className="group relative overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-0">
                              {departments.find(d => d.id === job.department)?.name}
                            </Badge>
                            {job.remote && (
                              <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-600 border-0">
                                <Laptop className="h-3 w-3 mr-1" />
                                Remote
                              </Badge>
                            )}
                            <CardTitle className="text-xl mb-2 flex items-start gap-2 text-foreground">
                              <Briefcase className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                              <span>{job.title}</span>
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                              {job.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-3">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.locationName}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{jobTypes.find(t => t.id === job.type)?.name}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 6).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        {isExpanded && (
                          <div className="space-y-4 mb-4 animate-in slide-in-from-top-2 duration-200">
                            <p className="text-sm text-muted-foreground">{job.longDescription}</p>
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {job.requirements.slice(0, 4).map((req, idx) => (
                                  <li key={idx} className="flex gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedJobForApplication(job.id);
                              setShowApplicationModal(true);
                            }}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Apply
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                          >
                            {isExpanded ? 'Show Less' : 'View Details'}
                            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {filteredJobs.length === 0 && (
            <Card className="border-2 border-dashed border-border p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">No positions match your filters</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters to see more results.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); setSelectedLocation('all'); setSelectedType('all'); }}>
                Clear filters
              </Button>
            </Card>
          )}
        </div>

        {/* Hiring Process - Only when not in dashboard */}
        {!isDashboard && (
          <div className="mb-24">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
                <Target className="h-3 w-3 mr-1" />
                How We Hire
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Hiring Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparent steps from application to offer
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiringProcess.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step} className="border-2 border-border hover:border-primary/30 transition-all overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">Step {step.step}</Badge>
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription className="text-sm">{step.description}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {step.duration}
                      </p>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Testimonials - Only when not in dashboard */}
        {!isDashboard && (
          <div className="mb-24">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
                <MessageSquare className="h-3 w-3 mr-1" />
                Team Voices
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                What Our Team Says
              </h2>
            </div>
            <Card className="border-2 border-border overflow-hidden">
              <CardContent className="p-8 md:p-12">
                {testimonials[activeTestimonial] && (
                  <div className="text-center max-w-3xl mx-auto">
                    <div className={`w-20 h-20 rounded-full ${testimonials[activeTestimonial].color} flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6`}>
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <p className="text-xl text-muted-foreground italic mb-4">&ldquo;{testimonials[activeTestimonial].quote}&rdquo;</p>
                    <p className="font-bold text-foreground">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].role} · {testimonials[activeTestimonial].tenure}</p>
                    <div className="flex justify-center gap-2 mt-6">
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTestimonial(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-primary scale-125' : 'bg-muted-foreground/30'}`}
                          aria-label={`View testimonial ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQs */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
              <HelpCircle className="h-3 w-3 mr-1" />
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.slice(0, 6).map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = expandedFaq === index;
              return (
                <Card
                  key={index}
                  className={`border-2 transition-all cursor-pointer ${isOpen ? 'border-primary shadow-lg' : 'border-border hover:border-primary/30'}`}
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <CardTitle className="text-base font-semibold text-left">{faq.question}</CardTitle>
                          {isOpen && (
                            <p className="text-sm text-muted-foreground mt-2 text-left">{faq.answer}</p>
                          )}
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Office Locations - Only when not in dashboard */}
        {!isDashboard && officeLocations.length > 0 && (
          <div className="mb-24">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
                <MapPin className="h-3 w-3 mr-1" />
                Our Offices
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Where We Work
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {officeLocations.map((office, index) => (
                <Card key={index} className="border-2 border-border hover:border-primary/30 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      {office.city}
                    </CardTitle>
                    <CardDescription className="text-sm">{office.address}</CardDescription>
                    <p className="text-xs text-muted-foreground">{office.employees} team members</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {office.amenities.map((a, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA - Only when not in dashboard */}
        {!isDashboard && (
          <div className="mb-16 text-center">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden">
              <CardContent className="py-16 px-8">
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
                  Ready to Build Bridges With Us?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Don&apos;t see the right role? We&apos;re always interested in meeting talented people. Reach out and tell us how you can contribute.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Browse Open Roles
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="mailto:careers@company.com">
                      <Mail className="mr-2 h-5 w-5" />
                      Contact Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showApplicationModal && <ApplicationModal />}
    </div>
  );
}