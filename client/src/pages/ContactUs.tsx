import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Building,
  CheckCircle2,
  X,
  Star,
  Users,
  Shield,
  Zap,
  Globe,
  Video,
  Calendar,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Heart,
  Share2,
  Download,
  Printer,
  Settings,
  Search,
  AlertCircle,
  Target,
  Rocket,
  Sparkles,
  Sun,
  Moon,
  Headphones,
  Camera,
  Map,
  GraduationCap,
  Briefcase,
  Trophy,
  Award,
  BookOpen,
  TrendingUp,
  Coffee,
  Mailbox,
  Smartphone,
  ChevronUp,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Info,
  ThumbsUp,
  ThumbsDown,
  Bell,
  Lock,
  Unlock,
  Bookmark,
  Copy,
  Eye,
  Menu,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '../contexts/ThemeContext';

// Custom ShieldCheck component (if not available in your lucide version)
const ShieldCheck: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Team Members Data
const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'CEO & Founder',
    department: 'Executive Leadership',
    email: 'sarah@campuscareer.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Former Google AI researcher with 15+ years in education technology. Passionate about bridging the gap between education and employment.',
    expertise: ['AI/ML', 'EdTech', 'Leadership'],
    availability: 'Mon-Thu, 9AM-5PM PST',
    social: {
      linkedin: 'https://linkedin.com/in/sarah',
      twitter: 'https://twitter.com/sarah',
      github: 'https://github.com/sarah'
    }
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO',
    department: 'Technology',
    email: 'michael@campuscareer.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    bio: 'Ex-Microsoft engineer with expertise in scalable systems and AI infrastructure. Leads our technical innovation.',
    expertise: ['Cloud Computing', 'System Architecture', 'DevOps'],
    availability: 'Mon-Fri, 10AM-6PM PST',
    social: {
      linkedin: 'https://linkedin.com/in/michael',
      twitter: 'https://twitter.com/michael',
      github: 'https://github.com/michael'
    }
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Head of Customer Success',
    department: 'Operations',
    email: 'emma@campuscareer.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Customer experience expert with background in educational institutions and student support services.',
    expertise: ['Customer Support', 'Training', 'Process Optimization'],
    availability: 'Mon-Fri, 8AM-4PM PST',
    social: {
      linkedin: 'https://linkedin.com/in/emma',
      twitter: 'https://twitter.com/emma'
    }
  },
  {
    id: 4,
    name: 'David Kumar',
    role: 'Head of Partnerships',
    department: 'Business Development',
    email: 'david@campuscareer.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    bio: 'Former university relations director with extensive network in higher education and corporate recruitment.',
    expertise: ['Partnerships', 'Business Development', 'Networking'],
    availability: 'Tue-Fri, 9AM-5PM PST',
    social: {
      linkedin: 'https://linkedin.com/in/david',
      twitter: 'https://twitter.com/david'
    }
  }
];

// FAQ Data
const FAQS = [
  {
    question: 'What is NextGen and how can it help students?',
    answer: 'NextGen is an AI-powered career readiness platform designed specifically for students. We provide personalized career guidance, resume building tools, interview preparation, and job matching to help students bridge the gap between education and employment.',
    category: 'General'
  },
  {
    question: 'How does the AI Career Coach work?',
    answer: 'Our AI Career Coach analyzes your academic background, skills, interests, and career goals to create a personalized career roadmap. It provides real-time guidance, skill gap analysis, and actionable recommendations to help you achieve your career objectives.',
    category: 'Technology'
  },
  {
    question: 'Is NextGen free for students?',
    answer: 'We offer a free tier with essential features including basic resume building, job search, and career assessment. For advanced features like AI Career Coach, unlimited mock interviews, and personalized coaching, we offer premium plans starting at $9/month for students.',
    category: 'Pricing'
  },
  {
    question: 'How do I schedule a consultation with your team?',
    answer: 'You can schedule a consultation directly through our platform. Navigate to the "Book Consultation" section, choose your preferred time slot, select the team member you\'d like to speak with, and we\'ll confirm your appointment via email.',
    category: 'Support'
  },
  {
    question: 'What universities are you partnered with?',
    answer: 'We\'re partnered with over 500 universities worldwide including Stanford, MIT, Harvard, IITs, NITs, and leading institutions across Asia-Pacific, Europe, and North America. Our network is continuously expanding.',
    category: 'Partnerships'
  },
  {
    question: 'How secure is my data on your platform?',
    answer: 'We take data security very seriously. All data is encrypted both in transit and at rest. We are GDPR compliant and follow industry best practices for data protection. You can read our detailed privacy policy for more information.',
    category: 'Security'
  }
];

// Contact Channels
const CONTACT_CHANNELS = [
  {
    id: 'email',
    name: 'Email Support',
    description: 'Get detailed responses within 24 hours',
    icon: Mail,
    color: 'from-blue-500 to-cyan-500',
    responseTime: '24 hours',
    bestFor: ['Technical issues', 'Detailed inquiries', 'Documentation requests']
  },
  {
    id: 'phone',
    name: 'Phone Support',
    description: 'Speak directly with our support team',
    icon: Phone,
    color: 'from-purple-500 to-pink-500',
    responseTime: 'Immediate',
    bestFor: ['Urgent issues', 'Complex problems', 'Real-time assistance']
  },
  {
    id: 'chat',
    name: 'Live Chat',
    description: 'Instant messaging with our AI assistant',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    responseTime: '< 2 minutes',
    bestFor: ['Quick questions', 'Technical support', 'General guidance']
  },
  {
    id: 'video',
    name: 'Video Consultation',
    description: 'One-on-one meetings with experts',
    icon: Video,
    color: 'from-orange-500 to-red-500',
    responseTime: 'Schedule in advance',
    bestFor: ['In-depth discussions', 'Career counseling', 'Technical reviews']
  }
];

// Social Media Links
const SOCIAL_LINKS = [
  { platform: 'Twitter', icon: Twitter, url: 'https://twitter.com/campuscareer', followers: '25.8K', color: 'hover:bg-blue-50 hover:text-blue-600' },
  { platform: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/campuscareer', followers: '18.2K', color: 'hover:bg-blue-50 hover:text-blue-700' },
  { platform: 'GitHub', icon: Github, url: 'https://github.com/campuscareer', followers: '8.5K', color: 'hover:bg-gray-50 hover:text-gray-900' },
  { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com/campuscareer', followers: '32.1K', color: 'hover:bg-pink-50 hover:text-pink-600' },
  { platform: 'YouTube', icon: Youtube, url: 'https://youtube.com/campuscareer', followers: '15.3K', color: 'hover:bg-red-50 hover:text-red-600' }
];

// Office Locations
const OFFICE_LOCATIONS = [
  {
    city: 'San Francisco',
    country: 'USA',
    address: '123 Innovation Drive, Suite 500, San Francisco, CA 94102',
    phone: '+1 (555) 123-4567',
    email: 'sf@campuscareer.com',
    hours: 'Mon-Fri: 9AM-6PM PST',
    timezone: 'Pacific Time',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    city: 'Bangalore',
    country: 'India',
    address: '456 Tech Park, Koramangala, Bangalore, Karnataka 560034',
    phone: '+91 80 1234 5678',
    email: 'blr@campuscareer.com',
    hours: 'Mon-Fri: 9AM-6PM IST',
    timezone: 'Indian Standard Time',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    city: 'London',
    country: 'UK',
    address: '789 Business Avenue, Floor 3, London, EC1A 1BB',
    phone: '+44 20 1234 5678',
    email: 'lon@campuscareer.com',
    hours: 'Mon-Fri: 9AM-5:30PM GMT',
    timezone: 'Greenwich Mean Time',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  }
];

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  department: string;
  message: string;
  subscribe: boolean;
  contactMethod: string;
  preferredTime: string;
}

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    subject: '',
    priority: 'medium',
    department: 'general',
    message: '',
    subscribe: true,
    contactMethod: 'email',
    preferredTime: 'any'
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('contact-form');
  const [selectedTeamMember, setSelectedTeamMember] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: 'user' | 'bot'; time: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const formRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: '',
        subject: '',
        priority: 'medium',
        department: 'general',
        message: '',
        subscribe: true,
        contactMethod: 'email',
        preferredTime: 'any'
      });
    }, 5000);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      text: chatInput,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Our team will get back to you shortly.",
        "I can help you with that. Could you provide more details?",
        "Great question! Let me connect you with the right department.",
        "We're here to help. What specific issue are you facing?"
      ];
      const botMessage = {
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleBack = () => {
    window.history.back();
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScheduleCall = (memberId: number) => {
    setSelectedTeamMember(memberId);
    setActiveTab('consultation');
  };

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'sales', label: 'Sales & Partnership' },
    { value: 'career', label: 'Career Guidance' },
    { value: 'billing', label: 'Billing & Accounts' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High Priority', color: 'text-red-600 bg-red-100' }
  ];

  const contactMethods = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone Call', icon: Phone },
    { value: 'video', label: 'Video Call', icon: Video },
    { value: 'chat', label: 'Live Chat', icon: MessageSquare }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-purple-50'}`}>
      {/* Floating Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat Support</h3>
                <p className="text-xs text-white/80">Typically replies in 2 minutes</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Start a conversation with our support team</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                    {msg.text}
                  </div>
                  <div className={`text-xs text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.time}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleChatSend} className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 transition-all duration-500">
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-0 group cursor-pointer" onClick={() => window.location.href = "/"}>
                <img
                  src="/NG/NextGen_light.png"
                  alt="NextGen Logo"
                  className="h-14 w-14 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="font-black text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Contact Center</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Support Active</span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  Online Now
                </span>
              </div>
              <button
                onClick={() => setChatOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
              >
                Live Support
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 ${darkMode ? 'opacity-90' : ''}`} />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000')] opacity-10 mix-blend-overlay" />

        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 text-white text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              We're here to help you succeed
            </div>
            <h1 className="text-7xl md:text-8xl font-black mb-6 text-white tracking-tighter leading-none">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Touch</span>
            </h1>
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Reach out to our global team for personalized support, innovative partnerships, or specialized career guidance.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {[
                { label: "Secure Link", icon: Shield },
                { label: "AI Powered", icon: Zap },
                { label: "Global 24/7", icon: Globe }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-default">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-bold tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-10 py-8 rounded-2xl font-black text-xl"
            >
              Start Conversation
              <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <div className="flex justify-center mb-8">
            <TabsList className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg rounded-2xl p-1`}>
              <TabsTrigger value="contact-form" className="rounded-xl px-6">Contact Form</TabsTrigger>
              <TabsTrigger value="team" className="rounded-xl px-6">Meet Our Team</TabsTrigger>
              <TabsTrigger value="consultation" className="rounded-xl px-6">Book Consultation</TabsTrigger>
              <TabsTrigger value="faq" className="rounded-xl px-6">FAQ</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="contact-form" className="space-y-12">
            {/* Contact Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CONTACT_CHANNELS.map(channel => {
                const Icon = channel.icon;
                return (
                  <Card key={channel.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{channel.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{channel.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Response Time:</span>
                          <Badge variant="secondary">{channel.responseTime}</Badge>
                        </div>
                        <div className="text-xs text-slate-500">
                          Best for: {channel.bestFor.join(', ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Form */}
            <div ref={formRef}>
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl">
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="p-8">
                    {submitted ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                          Thank you for contacting NextGen. Our team will review your message and get back to you within 24 hours.
                        </p>
                        <Button onClick={() => setSubmitted(false)} variant="outline">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Personal Information */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <div className="relative mt-2">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="pl-11"
                                  placeholder="John Doe"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="email">Email Address *</Label>
                              <div className="relative mt-2">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="pl-11"
                                  placeholder="john@example.com"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <div className="relative mt-2">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="pl-11"
                                  placeholder="+1 (555) 123-4567"
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="company">Company/University</Label>
                              <div className="relative mt-2">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                  id="company"
                                  name="company"
                                  value={formData.company}
                                  onChange={handleChange}
                                  className="pl-11"
                                  placeholder="Stanford University"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Inquiry Details */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Inquiry Details
                          </h4>

                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <Label htmlFor="department">Department *</Label>
                              <Select name="department" value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map(dept => (
                                    <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="subject">Subject *</Label>
                              <Input
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="mt-2"
                                placeholder="Brief description of your inquiry"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label className="mb-3 block">Priority Level</Label>
                              <RadioGroup
                                value={formData.priority}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'low' | 'medium' | 'high' }))}
                                className="flex gap-4"
                              >
                                {priorities.map(priority => (
                                  <div key={priority.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={priority.value} id={`priority-${priority.value}`} />
                                    <Label
                                      htmlFor={`priority-${priority.value}`}
                                      className={`text-sm px-3 py-1 rounded-full ${priority.color} cursor-pointer`}
                                    >
                                      {priority.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>

                            <div>
                              <Label className="mb-3 block">Preferred Contact Method</Label>
                              <div className="flex flex-wrap gap-3">
                                {contactMethods.map(method => {
                                  const Icon = method.icon;
                                  return (
                                    <button
                                      key={method.value}
                                      type="button"
                                      onClick={() => setFormData(prev => ({ ...prev, contactMethod: method.value }))}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${formData.contactMethod === method.value ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-slate-300 hover:border-blue-300'}`}
                                    >
                                      <Icon className="w-4 h-4" />
                                      <span className="text-sm">{method.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Message */}
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Your Message *</h4>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="min-h-[200px] resize-none"
                            placeholder="Please provide detailed information about your inquiry, including any relevant context or specific questions you have..."
                            required
                          />
                        </div>

                        {/* Preferences */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="subscribe"
                                checked={formData.subscribe}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, subscribe: checked }))}
                              />
                              <Label htmlFor="subscribe" className="cursor-pointer">
                                Subscribe to our newsletter for updates and insights
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                              {/* Removed broken local darkMode switch since it's now global */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {!submitted && (
                    <CardFooter className="p-8 pt-0">
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-500">
                            <span className="font-medium">Response Time:</span> 24 hours or less
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setFormData({
                                name: '',
                                email: '',
                                phone: '',
                                company: '',
                                role: '',
                                subject: '',
                                priority: 'medium',
                                department: 'general',
                                message: '',
                                subscribe: true,
                                contactMethod: 'email',
                                preferredTime: 'any'
                              })}
                            >
                              Clear Form
                            </Button>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  Send Message
                                  <Send className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500">
                          By submitting this form, you agree to our Privacy Policy and Terms of Service. Your information is secure and encrypted.
                        </div>
                      </div>
                    </CardFooter>
                  )}
                </form>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-12">
            {/* Team Introduction */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-0">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                  Our team brings together decades of experience in education technology, AI research,
                  and student career development. We're passionate about helping students achieve their career goals.
                </p>
              </CardContent>
            </Card>

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM_MEMBERS.map(member => (
                <Card key={member.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">{member.role}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{member.department}</p>

                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {member.expertise.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                        {member.bio}
                      </p>

                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          {member.availability}
                        </div>
                        <Button
                          onClick={() => handleScheduleCall(member.id)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                        >
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-12">
            {/* Consultation Options */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 border-0">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Book a Consultation</h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Schedule a one-on-one session with our experts to discuss your specific needs
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold mb-2">Video Consultation</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">45-minute video call</p>
                      <Button variant="outline" className="w-full">Book Now</Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-bold mb-2">Phone Consultation</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">30-minute phone call</p>
                      <Button variant="outline" className="w-full">Book Now</Button>
                    </CardContent>
                  </Card>

                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-bold mb-2">Chat Consultation</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Instant messaging session</p>
                      <Button variant="outline" className="w-full">Start Chat</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-12">
            {/* FAQ Section */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <HelpCircle className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Find quick answers to common questions about NextGen
                </p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div>
                          <Badge variant="outline" className="mb-2">{faq.category}</Badge>
                          <h3 className="text-lg font-semibold">{faq.question}</h3>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {expandedFaq === index && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Office Locations */}
        <div className="mb-16">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Our Global Offices
              </CardTitle>
              <CardDescription>
                Visit us at any of our locations around the world
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <Tabs value={selectedLocation.toString()} onValueChange={(value) => setSelectedLocation(parseInt(value))}>
                <TabsList className="mb-6">
                  {OFFICE_LOCATIONS.map((_, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                      {OFFICE_LOCATIONS[index].city}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {OFFICE_LOCATIONS.map((location, index) => (
                  <TabsContent key={index} value={index.toString()}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{location.city}, {location.country}</h3>
                          <p className="text-slate-600 dark:text-slate-300">{location.address}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <span>{location.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <span>{location.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <span>{location.hours} ({location.timezone})</span>
                          </div>
                        </div>

                        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90">
                          Get Directions
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 flex items-center justify-center">
                        <div className="text-center">
                          <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-500">Interactive map would appear here</p>
                          <p className="text-sm text-slate-400 mt-2">Coordinates: {location.coordinates.lat}, {location.coordinates.lng}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Social Media & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Connect With Us
              </CardTitle>
              <CardDescription>Follow us on social media for updates and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SOCIAL_LINKS.map(social => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-4 rounded-xl border hover:shadow-lg transition-all ${social.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-medium">{social.platform}</span>
                          <p className="text-sm text-slate-500">{social.followers} followers</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Newsletter */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border-0">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Mailbox className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Get the latest updates, career tips, and platform news delivered to your inbox
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white dark:bg-slate-900"
                />
                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                    Subscribe
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Shield className="w-4 h-4" />
                  <span>Your email is secure. We never share your information.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 mb-16">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Careers?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students and institutions who trust NextGen for their career development needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                <Phone className="mr-2 h-5 w-5" />
                Schedule a Demo
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Mail className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUsPage;
