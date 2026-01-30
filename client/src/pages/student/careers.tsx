import React, { useState } from 'react';
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
  TrendingDown,
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
  Filter
} from 'lucide-react';

export default function Careers(props: any) {
  const isDashboard = props?.isDashboard || false;
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleBack = () => {
    window.history.back();
  };

  const departments = [
    { id: 'all', name: 'All Positions', icon: Briefcase },
    { id: 'engineering', name: 'Engineering', icon: Code },
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'operations', name: 'Operations', icon: Settings },
    { id: 'sales', name: 'Sales & Marketing', icon: TrendingUp }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'remote', name: 'Remote' },
    { id: 'hybrid', name: 'Hybrid' },
    { id: 'san-francisco', name: 'San Francisco' },
    { id: 'new-york', name: 'New York' },
    { id: 'austin', name: 'Austin' }
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'full-time', name: 'Full-time' },
    { id: 'part-time', name: 'Part-time' },
    { id: 'contract', name: 'Contract' },
    { id: 'internship', name: 'Internship' }
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
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
      requirements: [
        '5+ years of full-stack development experience',
        'Expert knowledge of React and Node.js',
        'Experience with microservices architecture',
        'Strong problem-solving and communication skills'
      ],
      responsibilities: [
        'Design and implement scalable web applications',
        'Lead code reviews and architectural discussions',
        'Mentor junior and mid-level engineers',
        'Collaborate with product and design teams'
      ],
      featured: true
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
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'UI/UX'],
      requirements: [
        '4+ years of product design experience',
        'Portfolio showcasing user-centered design',
        'Experience with design systems',
        'Strong collaboration skills'
      ],
      responsibilities: [
        'Lead design projects from concept to launch',
        'Conduct user research and usability testing',
        'Create and maintain design system',
        'Present designs to stakeholders'
      ],
      featured: false
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
      skills: ['Communication', 'Problem Solving', 'CRM', 'Analytics', 'Salesforce'],
      requirements: [
        '3+ years in customer success or account management',
        'Experience with SaaS products',
        'Data-driven decision making',
        'Excellent communication skills'
      ],
      responsibilities: [
        'Manage key customer relationships',
        'Drive product adoption and engagement',
        'Identify upsell opportunities',
        'Analyze customer health metrics'
      ],
      featured: false
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
      skills: ['Content Strategy', 'SEO', 'Social Media', 'Analytics', 'Marketing Automation'],
      requirements: [
        '5+ years marketing experience',
        'Proven track record in B2B marketing',
        'Strong analytical and creative skills',
        'Experience managing marketing budgets'
      ],
      responsibilities: [
        'Develop and execute marketing strategy',
        'Lead content creation and campaigns',
        'Manage marketing team and budget',
        'Track and optimize marketing ROI'
      ],
      featured: true
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
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Monitoring'],
      requirements: [
        '4+ years DevOps experience',
        'Strong knowledge of AWS services',
        'Experience with container orchestration',
        'Automation and scripting expertise'
      ],
      responsibilities: [
        'Manage cloud infrastructure and deployments',
        'Implement CI/CD pipelines',
        'Monitor system performance and reliability',
        'Respond to incidents and outages'
      ],
      featured: false
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
      skills: ['User Testing', 'Data Analysis', 'Qualitative Research', 'Surveys', 'Statistics'],
      requirements: [
        '3+ years UX research experience',
        'Mixed methods research expertise',
        'Strong analytical skills',
        'Experience presenting to stakeholders'
      ],
      responsibilities: [
        'Plan and conduct user research studies',
        'Analyze and synthesize research findings',
        'Present insights to product teams',
        'Build research repository and guidelines'
      ],
      featured: false
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
      skills: ['React', 'TypeScript', 'CSS', 'Testing', 'Performance'],
      requirements: [
        '3+ years frontend development',
        'Deep React expertise',
        'Understanding of web performance',
        'Eye for design and UX'
      ],
      responsibilities: [
        'Build responsive web applications',
        'Optimize frontend performance',
        'Collaborate with designers',
        'Write maintainable, tested code'
      ],
      featured: false
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
      skills: ['Product Strategy', 'Roadmapping', 'Analytics', 'Agile', 'Stakeholder Management'],
      requirements: [
        '5+ years product management',
        'Technical background preferred',
        'Strong analytical skills',
        'Excellent communication'
      ],
      responsibilities: [
        'Define product roadmap and priorities',
        'Work with engineering and design teams',
        'Analyze metrics and user feedback',
        'Present to executives and stakeholders'
      ],
      featured: true
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
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
      requirements: [
        '4+ years data science experience',
        'Strong ML and statistical skills',
        'Experience with large datasets',
        'Business acumen'
      ],
      responsibilities: [
        'Build predictive models and algorithms',
        'Analyze complex datasets',
        'Create data visualizations',
        'Partner with product teams'
      ],
      featured: false
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
      skills: ['Programming', 'Computer Science', 'Problem Solving'],
      requirements: [
        'Currently pursuing CS or related degree',
        'Knowledge of at least one programming language',
        'Strong problem-solving skills',
        'Passion for learning'
      ],
      responsibilities: [
        'Work on real product features',
        'Participate in code reviews',
        'Learn from mentors',
        'Contribute to team goals'
      ],
      featured: false
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive medical, dental, and vision coverage for you and your family',
      details: ['Premium health insurance', 'Mental health support', 'Gym membership', 'Wellness stipend']
    },
    {
      icon: TrendingUp,
      title: 'Growth & Development',
      description: 'Professional development budget and learning opportunities to advance your career',
      details: ['$2,000 annual learning budget', 'Conference attendance', 'Mentorship programs', 'Career coaching']
    },
    {
      icon: Users,
      title: 'Community & Culture',
      description: 'Collaborative culture with diverse, talented teammates and regular team events',
      details: ['Team offsites', 'ERG groups', 'Social events', 'Inclusive environment']
    },
    {
      icon: Zap,
      title: 'Work-Life Balance',
      description: 'Remote-first with flexible working hours and unlimited PTO',
      details: ['Unlimited PTO', 'Flexible hours', 'Work from anywhere', 'Paid parental leave']
    },
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Market-leading salaries with equity and performance bonuses',
      details: ['Competitive base salary', 'Equity packages', 'Annual bonuses', '401k matching']
    },
    {
      icon: Coffee,
      title: 'Perks & Benefits',
      description: 'Office perks, equipment stipend, and more to make your work enjoyable',
      details: ['Home office setup', 'Free snacks & meals', 'Team lunches', 'Company swag']
    },
    {
      icon: Laptop,
      title: 'Latest Equipment',
      description: 'Top-tier hardware and software tools to help you do your best work',
      details: ['MacBook Pro', 'Multiple monitors', 'Ergonomic setup', 'Premium software']
    },
    {
      icon: Globe,
      title: 'Remote First',
      description: 'Work from anywhere in the world with async-friendly processes',
      details: ['Global team', 'Async communication', 'Flexible timezone', 'Co-working stipend']
    }
  ];

  const companyValues = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'We are passionate about connecting people and creating meaningful relationships.'
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'We push boundaries and embrace new ideas to solve complex problems.'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and accountability in everything we do.'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'We strive for excellence and continuous improvement in our work and growth.'
    }
  ];

  const hiringProcess = [
    {
      step: 1,
      title: 'Application Review',
      description: 'Submit your application and our team will review it within 3-5 business days.',
      duration: '3-5 days'
    },
    {
      step: 2,
      title: 'Initial Screening',
      description: 'A brief 30-minute call with our recruiting team to discuss your background and the role.',
      duration: '30 min'
    },
    {
      step: 3,
      title: 'Technical/Skills Assessment',
      description: 'Depending on the role, complete a take-home assignment or technical interview.',
      duration: '1-2 hours'
    },
    {
      step: 4,
      title: 'Team Interviews',
      description: 'Meet with team members and hiring managers to discuss your experience and fit.',
      duration: '2-3 hours'
    },
    {
      step: 5,
      title: 'Final Interview',
      description: 'Final conversation with leadership to align on expectations and vision.',
      duration: '45 min'
    },
    {
      step: 6,
      title: 'Offer & Onboarding',
      description: 'Receive your offer and get ready to join our amazing team!',
      duration: '1-2 days'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Engineer',
      avatar: 'SC',
      quote: 'The culture here is incredible. I have learned more in one year than my previous three years combined.',
      rating: 5
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Designer',
      avatar: 'MJ',
      quote: 'The team truly values creativity and gives us the freedom to explore innovative solutions.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      avatar: 'ER',
      quote: 'Work-life balance is not just a buzzword here. The flexibility has been life-changing.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'What is the interview process like?',
      answer: 'Our interview process typically includes an initial screening call, technical/skills assessment, team interviews, and a final conversation with leadership. The entire process usually takes 2-3 weeks from application to offer.'
    },
    {
      question: 'Do you offer remote work options?',
      answer: 'Yes! We are a remote-first company with team members across the globe. Many positions are fully remote, and some offer hybrid options for those near our office locations.'
    },
    {
      question: 'What benefits do you offer?',
      answer: 'We offer comprehensive health insurance, unlimited PTO, equity packages, 401k matching, professional development budget, home office stipend, and much more. Check out our benefits section above for full details.'
    },
    {
      question: 'Do you sponsor work visas?',
      answer: 'Yes, we sponsor H-1B visas and other work authorization for qualified candidates. Our team will work with you throughout the process.'
    },
    {
      question: 'What is the salary range for positions?',
      answer: 'We believe in transparent compensation. Each job listing includes a salary range based on market data and experience level. We are committed to paying competitive, fair salaries.'
    },
    {
      question: 'Do you hire interns or new graduates?',
      answer: 'Absolutely! We have dedicated internship programs and actively hire new graduates. We believe in investing in emerging talent and providing mentorship opportunities.'
    }
  ];

  const stats = [
    { label: 'Team Members', value: '200+', icon: Users },
    { label: 'Countries', value: '15+', icon: Globe },
    { label: 'Open Positions', value: '25+', icon: Briefcase },
    { label: 'Avg Rating', value: '4.9/5', icon: Star }
  ];

  // Filter jobs
  let filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDepartment && matchesLocation && matchesType && matchesSearch;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const regularJobs = filteredJobs.filter(job => !job.featured);

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} dark:bg-black transition-colors duration-300`}>
      <div className={`${!isDashboard ? "container mx-auto px-4 py-8 max-w-7xl" : "p-0"}`}>
        {!isDashboard && (
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        )}

        {/* Hero Section - Hide if dashboard */}
        {!isDashboard && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                We're Hiring!
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent leading-tight">
              Build Bridges With Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Join our mission to connect people, ideas, and opportunities. We're building more than software—we're creating meaningful connections that change lives.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-lg">
                    <CardContent className="pt-6 text-center">
                      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold mb-1 text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Company Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-border bg-card hover:border-primary/30 transition-all text-center group">
                  <CardContent className="pt-6">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Why Join Us?</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            We invest in our people with comprehensive benefits and perks designed to support your whole self.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-border bg-card hover:border-primary/50 transition-all hover:shadow-xl group">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{benefit.description}</p>
                    <ul className="space-y-2">
                      {benefit.details.map((detail, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search positions by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="hover:bg-muted border-border"
            >
              <Filter className="mr-2 h-4 w-4 text-primary" />
              Filters
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6 border-2 border-slate-200 dark:border-slate-700">
              {/* Department Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Department</h3>
                <div className="flex flex-wrap gap-3">
                  {departments.map(dept => {
                    const Icon = dept.icon;
                    return (
                      <Button
                        key={dept.id}
                        variant={selectedDepartment === dept.id ? "default" : "outline"}
                        onClick={() => setSelectedDepartment(dept.id)}
                        className={selectedDepartment === dept.id
                          ? "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                          : "hover:bg-muted border-border text-muted-foreground hover:text-foreground"}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {dept.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Location</h3>
                <div className="flex flex-wrap gap-3">
                  {locations.map(loc => (
                    <Button
                      key={loc.id}
                      variant={selectedLocation === loc.id ? "default" : "outline"}
                      onClick={() => setSelectedLocation(loc.id)}
                      className={selectedLocation === loc.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-white dark:hover:bg-slate-700"}
                    >
                      {loc.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <h3 className="font-semibold mb-3">Employment Type</h3>
                <div className="flex flex-wrap gap-3">
                  {jobTypes.map(type => (
                    <Button
                      key={type.id}
                      variant={selectedType === type.id ? "default" : "outline"}
                      onClick={() => setSelectedType(type.id)}
                      className={selectedType === type.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-white dark:hover:bg-slate-700"}
                    >
                      {type.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-2">
            Open Positions
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
          </p>

          {/* Featured Jobs */}
          {featuredJobs.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                Featured Positions
              </h3>
              <div className="space-y-6">
                {featuredJobs.map(job => (
                  <Card key={job.id} className="hover:shadow-2xl transition-all border-l-4 border-l-primary bg-card/50 backdrop-blur-md overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge className="bg-primary/10 text-primary border-0 font-bold px-3 py-1">
                        HIGHLITED
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                              {departments.find(d => d.id === job.department)?.name}
                            </span>
                          </div>
                          <CardTitle className="text-3xl mb-4 flex items-center gap-3 text-foreground group-hover:text-primary transition-colors">
                            <div className="p-2 bg-primary/10 rounded-xl">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            {job.title}
                          </CardTitle>
                          <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                            {job.description}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mt-6">
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
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6 mt-6">
                        <h4 className="font-bold text-sm mb-3 uppercase tracking-wider text-muted-foreground">Expertise Required:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/10">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]">
                        Apply for this position
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Jobs */}
          {regularJobs.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">All Positions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {regularJobs.map(job => (
                  <Card key={job.id} className="hover:shadow-xl transition-all border-border bg-card group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                              {departments.find(d => d.id === job.department)?.name}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{job.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {job.description}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.locationName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {jobTypes.find(t => t.id === job.type)?.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="px-2 py-1 text-slate-500 dark:text-slate-400 text-xs">
                              +{job.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredJobs.length === 0 && (
            <Card className="py-12 text-center">
              <CardContent>
                <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No positions found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment('all');
                    setSelectedLocation('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Hiring Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Our Hiring Process</h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            We've designed our process to be transparent, respectful, and efficient. Here's what to expect.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiringProcess.map((step, index) => (
              <Card key={index} className="relative border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <CardContent className="pt-6">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{step.description}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <Clock className="h-3 w-3" />
                      <span>{step.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Team Says</h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Hear from people who've built their careers with us.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Got questions? We've got answers.
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <CardHeader>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${expandedFaq === index ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="py-12 text-center">
            <Building className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Don't See a Role That Fits?</h2>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              We're always looking for talented people to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Submit General Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}           