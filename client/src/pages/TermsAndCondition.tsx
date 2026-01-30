import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
  Shield,
  AlertCircle,
  Clock,
  Globe,
  Scale,
  Lock,
  UserCheck,
  BookOpen,
  Download,
  Printer,
  Share2,
  ChevronRight,
  Eye,
  Search,
  Star,
  Award,
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function TermsAndConditions() {
  const handleBack = () => {
    window.history.back();
  };
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('terms');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadProgress(progress);
      setScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'acceptance',
      icon: UserCheck,
      title: 'Acceptance of Terms',
      badge: 'Essential',
      color: 'from-blue-500 to-cyan-500',
      content: `By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. Your continued use of the platform constitutes acceptance of any modifications to these terms.`,
      highlights: ['Binding agreement', 'Service access', 'User obligations']
    },
    {
      id: 'use',
      icon: BookOpen,
      title: 'Use License',
      badge: 'Important',
      color: 'from-purple-500 to-pink-500',
      content: `Permission is granted to temporarily download one copy of the materials on our service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on our service; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror" the materials on any other server.`,
      highlights: ['Personal use only', 'No commercial use', 'Copyright protection']
    },
    {
      id: 'disclaimer',
      icon: AlertCircle,
      title: 'Disclaimer',
      badge: 'Notice',
      color: 'from-orange-500 to-red-500',
      content: `The materials on our service are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our service or otherwise relating to such materials or on any sites linked to this service.`,
      highlights: ['As-is service', 'No warranties', 'Limited liability']
    },
    {
      id: 'limitations',
      icon: Shield,
      title: 'Limitations',
      badge: 'Legal',
      color: 'from-red-500 to-pink-500',
      content: `In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our service, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.`,
      highlights: ['Liability limits', 'Damage exclusions', 'Legal protection']
    },
    {
      id: 'privacy',
      icon: Lock,
      title: 'Privacy & Data Protection',
      badge: 'GDPR',
      color: 'from-green-500 to-emerald-500',
      content: `We are committed to protecting your privacy and personal data. We collect, process, and store your information in accordance with applicable data protection laws including GDPR and CCPA. Your data will never be sold to third parties. We implement industry-standard security measures to protect your information.`,
      highlights: ['GDPR compliant', 'Data encryption', 'No data selling']
    },
    {
      id: 'revisions',
      icon: Clock,
      title: 'Revisions and Errata',
      badge: 'Updates',
      color: 'from-yellow-500 to-orange-500',
      content: `The materials appearing on our service could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our service are accurate, complete, or current. We may make changes to the materials contained on our service at any time without notice. We do not, however, make any commitment to update the materials.`,
      highlights: ['Content updates', 'Error corrections', 'No guarantees']
    },
    {
      id: 'links',
      icon: Globe,
      title: 'Third-Party Links',
      badge: 'External',
      color: 'from-indigo-500 to-purple-500',
      content: `We have not reviewed all of the sites linked to our service and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk. Third-party sites have their own privacy policies and terms.`,
      highlights: ['External links', 'No endorsement', 'User discretion']
    },
    {
      id: 'modifications',
      icon: FileText,
      title: 'Service Terms Modifications',
      badge: 'Changes',
      color: 'from-cyan-500 to-blue-500',
      content: `We may revise these terms of service for our service at any time without notice. By using this service you are agreeing to be bound by the then current version of these Terms and Conditions of Use. We recommend checking this page regularly for updates. Material changes will be communicated via email.`,
      highlights: ['Terms updates', 'User notification', 'Regular reviews']
    },
    {
      id: 'governing',
      icon: Scale,
      title: 'Governing Law & Jurisdiction',
      badge: 'Legal',
      color: 'from-pink-500 to-rose-500',
      content: `Any claim relating to our service shall be governed by the laws of the jurisdiction in which our company is registered without regard to its conflict of law provisions. Any disputes will be resolved through binding arbitration. You agree to submit to the jurisdiction of courts in our registered location.`,
      highlights: ['Legal jurisdiction', 'Arbitration', 'Dispute resolution']
    },
    {
      id: 'termination',
      icon: Zap,
      title: 'Account Termination',
      badge: 'Policy',
      color: 'from-violet-500 to-purple-500',
      content: `We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. Upon termination, your right to use the service will immediately cease.`,
      highlights: ['Service termination', 'Account suspension', 'Violation policy']
    }
  ];

  const stats = [
    { icon: Eye, label: 'Last Updated', value: 'Jan 23, 2026' },
    { icon: FileText, label: 'Sections', value: '10' },
    { icon: Clock, label: 'Read Time', value: '8 min' },
    { icon: Shield, label: 'Version', value: '2.1' }
  ];

  const features = [
    { icon: Award, title: 'GDPR Compliant', description: 'Full EU data protection' },
    { icon: Lock, title: 'Secure', description: 'Industry-standard encryption' },
    { icon: Star, title: 'Transparent', description: 'Clear and honest terms' }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Floating Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-foreground hover:bg-muted mr-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-foreground font-bold text-lg">Terms & Conditions</h1>
              <p className="text-primary text-xs">Version 2.1</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Download className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Printer className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-primary/20 rounded-full border border-primary/30 mb-6">
            <span className="text-primary text-sm font-medium">Legal Agreement</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Please read these terms carefully. They govern your use of our services and protect both your rights and ours.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="glass-card rounded-xl p-4">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-foreground font-semibold">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-card rounded-xl p-6 hover:bg-muted transition-all">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-foreground font-semibold mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search terms and conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-muted/50 backdrop-blur-md border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'terms'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
          >
            All Terms
          </button>
          <button
            onClick={() => setActiveTab('important')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'important'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
          >
            Important Only
          </button>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredSections.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                className="glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-start justify-between text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${section.color} text-white`}>
                          {section.badge}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {section.highlights.map((highlight, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 rounded-md text-xs text-primary">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="pl-16 pr-4">
                      <div className="border-l-2 border-primary/30 pl-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Questions About These Terms?</h2>
          <p className="text-muted-foreground mb-6">
            If you have any questions about these Terms and Conditions, please don't hesitate to contact us through any of the following channels:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-primary text-sm font-medium mb-1">Email</p>
              <p className="text-foreground">legal@example.com</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-primary text-sm font-medium mb-1">Website</p>
              <p className="text-foreground">www.example.com/contact</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-primary text-sm font-medium mb-1">Phone</p>
              <p className="text-foreground">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="glass-card rounded-2xl p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Ready to Continue?</h2>

            <label className="flex items-start cursor-pointer group mb-6 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-all">
              <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 border-2 rounded-md transition-all ${accepted
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500'
                      : 'border-gray-500 group-hover:border-purple-400'
                    }`}
                >
                  {accepted && (
                    <CheckCircle2 className="w-5 h-5 text-white absolute top-0 left-0" />
                  )}
                </div>
              </div>
              <span className="ml-3 text-muted-foreground leading-relaxed">
                I have read, understood, and agree to be bound by these Terms and Conditions. I acknowledge that by clicking "Accept & Continue" below, I am entering into a legally binding agreement.
              </span>
            </label>

            <button
              onClick={() => accepted && alert('Terms accepted! Proceeding...')}
              disabled={!accepted}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${accepted
                  ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white shadow-lg shadow-primary/50 hover:shadow-xl hover:scale-105'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
              <span>Accept & Continue</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            {!accepted && (
              <p className="text-center text-gray-500 text-sm mt-4">
                Please review and accept the terms to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2026 Your Company. All rights reserved. These terms are effective as of January 23, 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
