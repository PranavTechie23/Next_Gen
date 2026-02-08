import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sparkles,
  Target,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  FileText,
  Video,
  Star,
  Award,
  Zap,
  Shield,
  Globe,
  BarChart,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  PlayCircle,
  Eye,
  Download,
  Share2,
  Settings,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Brain,
  Mic,
  FileCheck,
  Building,
  Network,
  DollarSign,
  Map,
  Navigation,
  Puzzle,
  Rocket,
  Heart,
  Crown,
  Lock,
  Unlock,
  RefreshCw,
  Smartphone,
  Laptop,
  Tablet,
  ArrowLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from "../../contexts/ThemeContext";

// Mock data for features
const FEATURE_CATEGORIES = [
  {
    id: 'ai-coach',
    title: 'AI Career Coach',
    icon: Sparkles,
    description: 'Personalized AI guidance for your career journey',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'resume-tools',
    title: 'Resume & Portfolio',
    icon: FileText,
    description: 'Build professional resumes and portfolios',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'interview',
    title: 'Interview Prep',
    icon: Mic,
    description: 'Master interviews with AI simulations',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'job-search',
    title: 'Job Search',
    icon: Briefcase,
    description: 'Smart job matching and applications',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'skills',
    title: 'Skill Development',
    icon: Brain,
    description: 'Learn in-demand career skills',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    id: 'network',
    title: 'Networking',
    icon: Users,
    description: 'Connect with professionals and peers',
    color: 'from-rose-500 to-pink-500'
  }
];

const AI_COACH_FEATURES = [
  {
    title: 'Personalized Career Path',
    description: 'AI-generated roadmap based on your major, skills, and interests',
    icon: Navigation,
    status: 'active',
    progress: 85,
    badges: ['Smart Matching', 'Real-time Updates']
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills for your dream job with actionable recommendations',
    icon: Puzzle,
    status: 'active',
    progress: 60,
    badges: ['AI-Powered', 'Industry Trends']
  },
  {
    title: 'Weekly Progress Tracking',
    description: 'Monitor your career readiness with detailed analytics and insights',
    icon: BarChart,
    status: 'active',
    progress: 45,
    badges: ['Visual Reports', 'Milestones']
  },
  {
    title: 'Industry Insights',
    description: 'Real-time data on job market trends and salary expectations',
    icon: TrendingUp,
    status: 'beta',
    progress: 30,
    badges: ['Live Data', 'Predictive Analytics']
  }
];

const RESUME_FEATURES = [
  {
    title: 'ATS-Optimized Builder',
    description: 'Create resumes that pass through Applicant Tracking Systems',
    icon: FileCheck,
    status: 'active',
    stats: '98% Success Rate',
    testimonials: 1245
  },
  {
    title: 'Portfolio Generator',
    description: 'Build stunning online portfolios with customizable templates',
    icon: Globe,
    status: 'active',
    stats: '50+ Templates',
    testimonials: 892
  },
  {
    title: 'Real-time Feedback',
    description: 'Get instant AI feedback on your resume content and design',
    icon: RefreshCw,
    status: 'active',
    stats: 'Instant Analysis',
    testimonials: 2103
  },
  {
    title: 'Cover Letter AI',
    description: 'Generate personalized cover letters for each application',
    icon: FileText,
    status: 'beta',
    stats: 'AI-Powered',
    testimonials: 567
  }
];

const INTERVIEW_FEATURES = [
  {
    title: 'Mock Interviews',
    description: 'Practice with AI-powered mock interviews and get detailed feedback',
    icon: Video,
    status: 'active',
    difficulty: ['Beginner', 'Intermediate', 'Advanced']
  },
  {
    title: 'Behavioral Questions',
    description: 'Master STAR method with practice questions from real companies',
    icon: MessageSquare,
    status: 'active',
    difficulty: ['All Levels']
  },
  {
    title: 'Technical Assessments',
    description: 'Practice coding challenges and technical questions',
    icon: MessageSquare,
    status: 'active',
    difficulty: ['Intermediate', 'Advanced']
  }
];

const STUDENT_TESTIMONIALS = [
  {
    name: 'Alex Johnson',
    university: 'Stanford University',
    major: 'Computer Science',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'Software Engineer Intern',
    company: 'Google',
    quote: 'The AI career coach helped me land 3 internship offers!',
    rating: 5,
    features: ['AI Coach', 'Resume Builder']
  },
  {
    name: 'Maya Rodriguez',
    university: 'NYU',
    major: 'Business Administration',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    role: 'Marketing Analyst',
    company: 'Meta',
    quote: 'Interview prep feature was a game-changer for me.',
    rating: 5,
    features: ['Interview Prep', 'Skill Development']
  },
  {
    name: 'David Kim',
    university: 'MIT',
    major: 'Electrical Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'Hardware Engineer',
    company: 'Apple',
    quote: 'Best platform for engineering students!',
    rating: 4,
    features: ['Job Search', 'Networking']
  }
];

const PLATFORM_STATS = [
  { label: 'Students Helped', value: '50,000+', icon: Users, change: '+25%' },
  { label: 'Jobs Secured', value: '15,000+', icon: Briefcase, change: '+40%' },
  { label: 'Mock Interviews', value: '200,000+', icon: Video, change: '+60%' },
  { label: 'Resumes Built', value: '75,000+', icon: FileText, change: '+35%' },
  { label: 'Skill Courses', value: '500+', icon: BookOpen, change: '+50%' },
  { label: 'Partner Companies', value: '1,000+', icon: Building, change: '+30%' }
];

const STUDENT_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Essential tools to start your career journey',
    features: [
      { name: 'Basic Resume Builder', included: true },
      { name: '5 Mock Interviews/month', included: true },
      { name: 'Career Assessment', included: true },
      { name: 'Job Board Access', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'AI Career Coach', included: false },
      { name: 'Unlimited Resumes', included: false },
      { name: 'Priority Support', included: false }
    ],
    cta: 'Get Started',
    popular: false,
    color: 'border-slate-200'
  },
  {
    name: 'Student Pro',
    price: '$9',
    period: 'per month',
    description: 'Everything you need for career success',
    features: [
      { name: 'Advanced AI Career Coach', included: true },
      { name: 'Unlimited Mock Interviews', included: true },
      { name: 'ATS Resume Optimization', included: true },
      { name: 'Priority Job Matching', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Cover Letter Generator', included: true },
      { name: 'Skill Assessment Tests', included: true },
      { name: '24/7 Support', included: true }
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'border-blue-300'
  },
  {
    name: 'University',
    price: 'Custom',
    period: 'per institution',
    description: 'Complete solution for universities',
    features: [
      { name: 'Unlimited Student Access', included: true },
      { name: 'Admin Dashboard', included: true },
      { name: 'Custom Branding', included: true },
      { name: 'Career Analytics', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'API Access', included: true },
      { name: 'Workshop Tools', included: true },
      { name: 'Custom Integrations', included: true }
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'border-purple-300'
  }
];

// Custom icon for code
const Code: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const FeatureCard: React.FC<{
  feature: typeof AI_COACH_FEATURES[0];
  category: string;
}> = ({ feature, category }) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/5 dark:bg-slate-900/40 border-white/10 backdrop-blur-3xl overflow-hidden premium-card-glow hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                  {feature.status === 'active' ? 'Active' : 'Beta'}
                </Badge>
                {feature.progress && (
                  <Badge variant="outline" className="text-xs">
                    {feature.progress}% Complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 mb-4">{feature.description}</p>

        {feature.progress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium">{feature.progress}%</span>
            </div>
            <Progress value={feature.progress} className="h-2" />
          </div>
        )}

        {feature.badges && (
          <div className="flex flex-wrap gap-2">
            {feature.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}
        {/* 
          Removed broken dynamic props:
          {feature.stats && (...)}
          {feature.testimonials && (...)}
          These are not valid properties on the feature object type.
        */}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          Explore Feature
        </Button>
      </CardFooter>
    </Card>
  );
};

const TestimonialCard: React.FC<{ testimonial: typeof STUDENT_TESTIMONIALS[0] }> = ({ testimonial }) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 bg-white/5 dark:bg-slate-900/40 border-white/10 backdrop-blur-3xl overflow-hidden premium-card-glow hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={testimonial.avatar} />
            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-slate-600">{testimonial.major} • {testimonial.university}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">Secured: {testimonial.role} @ {testimonial.company}</span>
          </div>

          <p className="text-slate-700 italic">"{testimonial.quote}"</p>
        </div>

        <Separator className="my-4" />

        <div>
          <p className="text-sm text-slate-600 mb-2">Features used:</p>
          <div className="flex flex-wrap gap-2">
            {testimonial.features.map((feature) => (
              <Badge key={feature} variant="outline">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PlanCard: React.FC<{ plan: typeof STUDENT_PLANS[0] }> = ({ plan }) => {
  return (
    <Card className={`h-full border border-white/10 bg-white/5 dark:bg-slate-900/40 backdrop-blur-3xl overflow-hidden premium-card-glow hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className={plan.popular ? 'pt-8' : ''}>
        <CardTitle>{plan.name}</CardTitle>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold">{plan.price}</span>
          <span className="text-slate-600">/{plan.period}</span>
        </div>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-3">
              {feature.included ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-300" />
              )}
              <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.popular ? 'default' : 'outline'}
          size="lg"
        >
          {plan.cta}
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturesPage: React.FC<any> = (props: any) => {
  const isDashboard = props?.isDashboard || false;
  const [activeTab, setActiveTab] = useState('overview');
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-transparent relative overflow-hidden" : "bg-transparent"} transition-colors duration-300`}>
      {/* Premium Background Glows */}
      {!isDashboard && (
        <div className="premium-glow-bg">
          <div className="premium-glow-1" />
          <div className="premium-glow-2" />
          <div className="premium-glow-3" />
        </div>
      )}
      {/* Hero Section - Hide if dashboard */}
      {!isDashboard && (
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 px-4 py-1.5 bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Built for Students
              </Badge>
              <h1 className={`text-4xl md:text-7xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-8 leading-tight tracking-tight`}>
                Everything You Need to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
                  {' '}Launch Your Career
                </span>
              </h1>
              <p className={`text-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-10 max-w-2xl mx-auto leading-relaxed font-medium`}>
                AI-powered career platform designed specifically for students. From resume building to interview prep, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 h-14 px-8 text-lg font-bold">
                  <Rocket className="w-5 h-5 mr-3" />
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border hover:bg-muted">
                  <PlayCircle className="w-5 h-5 mr-3" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${!isDashboard ? "container mx-auto px-4 sm:px-6 lg:px-8 py-12" : "py-0"}`}>
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {PLATFORM_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`text-center ${darkMode ? 'bg-card border-border' : 'bg-white/80 border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'} backdrop-blur-3xl hover:border-blue-300 transition-all hover:shadow-xl group rounded-3xl`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl ${darkMode ? 'bg-primary/10' : 'bg-blue-50'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-1 tracking-tight`}>{stat.value}</div>
                  <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} font-bold uppercase tracking-wider`}>{stat.label}</div>
                  <div className="text-xs text-green-500 font-bold mt-2 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Categories */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 tracking-tight`}>
              Complete Career Toolkit
            </h2>
            <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto font-medium`}>
              Six powerful modules working together to accelerate your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`group cursor-pointer ${darkMode ? 'bg-card border-border' : 'bg-white/80 border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'} rounded-3xl hover:shadow-xl transition-all duration-300 backdrop-blur-3xl`}
                  onClick={() => setActiveTab(category.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} mb-4 flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                      {category.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'} mb-4 font-medium`}>
                      {category.description}
                    </p>
                    <div className="flex items-center text-blue-600 group-hover:translate-x-2 transition-transform">
                      <span className="font-medium">Explore</span>
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Features Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
            <TabsTrigger value="resume-tools">Resume Tools</TabsTrigger>
            <TabsTrigger value="interview">Interview Prep</TabsTrigger>
            <TabsTrigger value="job-search">Job Search</TabsTrigger>
            <TabsTrigger value="network">Networking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            {/* AI Coach Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">AI Career Coach</h3>
                  <p className="text-slate-600">Personalized guidance at every step</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {AI_COACH_FEATURES.map((feature) => (
                  <FeatureCard key={feature.title} feature={feature} category="ai-coach" />
                ))}
              </div>
            </div>

            {/* Resume Tools Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Resume & Portfolio Tools</h3>
                  <p className="text-slate-600">Build professional documents that stand out</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {RESUME_FEATURES.map((feature) => (
                  <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <feature.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{feature.title}</h4>
                            <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-4">{feature.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-600">{feature.stats}</span>
                            <span className="text-sm text-slate-500">
                              {feature.testimonials.toLocaleString()} students
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-coach">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {AI_COACH_FEATURES.map((feature) => (
                    <FeatureCard key={feature.title} feature={feature} category="ai-coach" />
                  ))}
                </div>
              </div>
              <div>
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>AI Coach Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Career Goals</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Internship', 'Full-time', 'Grad School', 'Startup', 'Remote'].map((goal) => (
                          <Badge key={goal} variant="outline">{goal}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Industry Focus</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Tech', 'Finance', 'Healthcare', 'Marketing', 'Engineering'].map((industry) => (
                          <Badge key={industry} variant="secondary">{industry}</Badge>
                        ))}
                      </div>
                    </div>



                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <Switch id="notifications" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>AI Coach Intensity</Label>
                      <Progress value={70} className="h-2" />
                      <p className="text-xs text-slate-500">How frequently you want guidance</p>
                    </div>

                    <Button className="w-full">Update Preferences</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resume-tools">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {RESUME_FEATURES.map((feature) => (
                    <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <feature.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-lg">{feature.title}</h4>
                              <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                                {feature.status}
                              </Badge>
                            </div>
                            <p className="text-slate-600 mb-4">{feature.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-blue-600">{feature.stats}</span>
                              <span className="text-sm text-slate-500">
                                {feature.testimonials.toLocaleString()} students
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Resume Templates</CardTitle>
                    <CardDescription>Choose from 50+ ATS-friendly templates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Modern', 'Creative', 'Professional', 'Minimalist'].map((style) => (
                        <div key={style} className="border rounded-lg p-4 text-center hover:border-blue-300 cursor-pointer">
                          <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded mb-2" />
                          <span className="font-medium">{style}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      New Resume
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export Portfolio
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">✅ Use action verbs in bullet points</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium">📊 Quantify achievements with numbers</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium">🎯 Tailor resume for each application</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Student Success Stories */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See how students from top universities are accelerating their careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STUDENT_TESTIMONIALS.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Plans for Every Student
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start for free, upgrade as you grow. University discounts available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STUDENT_PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-600">
              All plans include our core features. Need help choosing?{' '}
              <Button variant="link" className="p-0">
                Talk to our team
              </Button>
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Career Journey?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 50,000+ students who have accelerated their careers with our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Crown className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <HelpCircle className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesPage;