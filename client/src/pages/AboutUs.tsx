import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import Footer from "./Footer";
import {
  ArrowLeft, Mail, Linkedin, Twitter,
  Users,
  Target,
  Award,
  TrendingUp,
  Heart,
  Zap,
  Globe,
  Shield,
  Lightbulb,
  Rocket,
  Star,
  CheckCircle,
  Quote,
  Building2,
  GraduationCap,
  Briefcase,
  BarChart3,
  Code,
  Brain,
  Sparkles
} from "lucide-react";

export default function AboutUs() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const handleBack = () => {
    window.history.back();
  };

  const stats = [
    { icon: Building2, value: "24+", label: "Partner Colleges", color: "from-blue-500 to-cyan-500" },
    { icon: Users, value: "28,540+", label: "Students Placed", color: "from-purple-500 to-pink-500" },
    { icon: Briefcase, value: "500+", label: "Companies", color: "from-green-500 to-emerald-500" },
    { icon: Award, value: "86%", label: "Success Rate", color: "from-orange-500 to-red-500" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-First Approach",
      description: "Every decision we make puts student success and career growth at the forefront.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Lightbulb,
      title: "Innovation & Technology",
      description: "Leveraging AI and data science to revolutionize career guidance and placement.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Building relationships based on honesty, integrity, and ethical practices.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Rocket,
      title: "Excellence & Impact",
      description: "Committed to delivering exceptional results and creating lasting positive change.",
      color: "from-purple-500 to-indigo-500"
    },
  ];

  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Founder & CEO",
      image: "PS",
      bio: "Former IIT professor with 15+ years in education technology",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Rahul Mehta",
      role: "Chief Technology Officer",
      image: "RM",
      bio: "Ex-Google engineer passionate about AI and machine learning",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Anjali Patel",
      role: "Head of Partnerships",
      image: "AP",
      bio: "10+ years building relationships with top companies",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Vikram Singh",
      role: "VP of Product",
      image: "VS",
      bio: "Product leader from Microsoft with focus on student success",
      linkedin: "#",
      twitter: "#"
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Company Founded",
      description: "Campus Career was born with a vision to transform career placement",
      icon: Rocket
    },
    {
      year: "2023",
      title: "First 10 Colleges",
      description: "Partnered with leading institutions across India",
      icon: Building2
    },
    {
      year: "2024",
      title: "10,000 Students",
      description: "Reached milestone of 10,000 successful placements",
      icon: Users
    },
    {
      year: "2025",
      title: "AI Platform Launch",
      description: "Introduced AI-powered assessment and matching technology",
      icon: Brain
    },
    {
      year: "2026",
      title: "National Recognition",
      description: "Awarded 'Best EdTech Platform' by Education Ministry",
      icon: Award
    },
  ];

  const testimonials = [
    {
      name: "Prof. Ramesh Kumar",
      role: "Dean, IIT Delhi",
      image: "RK",
      quote: "Campus Career has transformed how we approach student placements. Their AI-driven platform has increased our placement rate by 23%.",
      rating: 5
    },
    {
      name: "Neha Gupta",
      role: "Student, NIT Bangalore",
      image: "NG",
      quote: "The personalized career guidance and skill assessments helped me land my dream job at Google. Forever grateful!",
      rating: 5
    },
    {
      name: "Arjun Reddy",
      role: "HR Director, Microsoft India",
      image: "AR",
      quote: "We've found exceptional talent through Campus Career. Their screening process ensures we meet only the most qualified candidates.",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={isDark ? "/NG/NextGen_dark.png" : "/NG/NextGen_light.png"} alt="NextGen Logo" className="w-full h-full object-contain scale-125" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">NextGen</span>
                <p className="text-xs text-muted-foreground">About Us</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6 mt-10">
            <Sparkles className="w-4 h-4" />
            Transforming Careers Since 2022
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Empowering Students to Achieve Their Career Dreams
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Campus Career is India's leading AI-powered career guidance and placement platform, connecting talented students with top companies through innovative technology and personalized support.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border-none">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="pt-6 text-center relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          <Card className="glass-card border-none shadow-lg">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2"></div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                To bridge the gap between academic excellence and career success by providing students with cutting-edge tools, personalized guidance, and direct access to top employers. We believe every student deserves the opportunity to reach their full potential.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-lg">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-foreground">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">
                To become the most trusted career platform in India, empowering millions of students to discover their passions, develop their skills, and secure fulfilling careers. We envision a future where every graduate enters the workforce confident and prepared.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="glass-card border-none shadow-lg hover:shadow-xl transition-all group">
                  <CardContent className="pt-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Our Story / Journey */}
        <div className="mb-16 max-w-6xl mx-auto">
          <Card className="glass-card border-none shadow-lg">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
            <CardHeader>
              <CardTitle className="text-3xl text-center text-foreground">Our Journey</CardTitle>
              <CardDescription className="text-center text-muted-foreground">Milestones that shaped Campus Career</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <div key={index} className="flex gap-6 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {index !== milestones.length - 1 && (
                          <div className="w-0.5 h-16 bg-gradient-to-b from-blue-500 to-indigo-500 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{milestone.year}</span>
                          <h3 className="text-xl font-bold text-foreground">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Makes Us Different</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Innovative features that set us apart
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card border-none shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI-Powered Matching</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our advanced AI algorithms analyze your skills, interests, and goals to match you with the perfect career opportunities.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Real-time job matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>Skill gap analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Comprehensive Analytics</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Track your progress with detailed insights and actionable feedback to continuously improve your career readiness.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Performance dashboards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Benchmarking tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Mentorship</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Connect with industry professionals and career counselors who provide personalized guidance throughout your journey.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>One-on-one sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Resume reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Interview preparation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Meet Our Team */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to your success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="border-slate-200 shadow-lg hover:shadow-xl transition-all group">
                <CardContent className="pt-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {member.image}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex items-center justify-center gap-3">
                    <a href={member.linkedin} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                    </a>
                    <a href={member.twitter} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                      <Twitter className="w-4 h-4 text-blue-600" />
                    </a>
                    <a href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@campuscareer.com`} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What People Say About Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Success stories from our community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <Quote className="w-10 h-10 text-blue-200 dark:text-blue-900 mb-4" />
                  <p className="text-foreground/80 leading-relaxed mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white max-w-4xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <Rocket className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already found their dream careers with Campus Career
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer role="public" />
    </div>
  );
}
