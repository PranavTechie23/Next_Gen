import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Shield, AlertCircle, Lock, Eye, Users, Target, TrendingUp, Mail, Phone, MessageSquare, CheckCircle, Database, Brain, Scale, Heart, Sparkles, FileText, UserCheck, Clock } from "lucide-react";
import { useState } from "react";

export default function PrivacyPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState("privacy");

  const sections = [
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "ai", label: "AI Transparency", icon: Brain },
    { id: "fairness", label: "Bias & Fairness", icon: Scale },
    { id: "limitations", label: "Limitations", icon: AlertCircle },
    { id: "ethics", label: "Ethics", icon: Heart },
    { id: "contact", label: "Contact", icon: MessageSquare },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-300">
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
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                <div className="flex flex-col">
                  <span className="font-black text-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tighter leading-none">NextGen</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Legal Portal</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="!h-12 !w-12 bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-blue-500/30 !rounded-xl transition-all flex items-center justify-center shadow-lg hover:scale-110 text-slate-600 dark:text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-6 sm:px-10 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] mb-8 shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <Shield className="w-12 h-12 text-white relative z-10 animate-pulse" />
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent mb-6 tracking-tighter">
              Privacy, Ethics & AI Disclosure
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 font-medium leading-relaxed">
              Our commitment to radical transparency and data sovereignty for every member of the institutional ecosystem.
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              Last updated: January 2026
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="mb-12 sticky top-24 z-40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl p-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-500">
            <div className="flex flex-wrap gap-2 justify-center">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 font-bold text-sm tracking-tight ${isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? "scale-110" : ""}`} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            {/* Data Privacy */}
            <div id="privacy">
              <Card className="shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow glass-card">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Shield className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Data Privacy & Security</CardTitle>
                      <CardDescription className="text-base">Your data is protected with industry-leading security</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    The NextGen Platform takes data privacy seriously. All student information, academic records, and assessment data are encrypted and stored securely in compliance with educational data protection standards.
                  </p>

                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
                      <Lock className="w-5 h-5 text-primary" />
                      Data Protection Measures
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: Lock, text: "End-to-end encryption for all data transmission" },
                        { icon: Eye, text: "Role-based access control for data visibility" },
                        { icon: Shield, text: "Regular security audits and compliance checks" },
                        { icon: FileText, text: "GDPR and Indian data protection law compliance" },
                        { icon: Database, text: "Secure data deletion upon account termination" },
                        { icon: UserCheck, text: "Multi-factor authentication support" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-card p-3 rounded-lg shadow-sm border border-border">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm text-foreground font-medium">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-green-500">Full Control:</span> Students retain complete control over their data and can request access, modification, or deletion at any time through account settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI & Algorithmic Transparency */}
            <div id="ai">
              <Card className="shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow glass-card">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Brain className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">AI & Algorithmic Transparency</CardTitle>
                      <CardDescription className="text-base">Understanding how our intelligent systems work</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Our platform uses artificial intelligence to analyze student skills and provide placement guidance. We believe in complete transparency about how these systems work and their limitations.
                  </p>

                  <div className="bg-purple-500/5 p-6 rounded-xl border border-purple-500/20">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      How Our AI Works
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Analyzes student skills across six dimensions: DSA, Core CS, Development, Projects, Internships, and Certifications",
                        "Compares profiles against industry benchmarks for various roles",
                        "Generates personalized recommendations based on skill gaps",
                        "Provides placement probability estimates for different company types",
                        "Uses machine learning models trained on historical placement data",
                        "Continuously updates predictions based on latest market trends"
                      ].map((text, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-card p-3 rounded-lg shadow-sm border border-border">
                          <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-purple-500 font-bold text-xs">{idx + 1}</span>
                          </div>
                          <p className="text-sm text-foreground">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-amber-500">Important:</span> Our AI models are trained on historical placement data and industry requirements. Predictions are indicative and based on available information. Actual placement outcomes depend on interview performance, market conditions, and company-specific requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bias & Fairness */}
            <div id="fairness">
              <Card className="shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow glass-card">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                      <Scale className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Bias & Fairness Commitment</CardTitle>
                      <CardDescription className="text-base">Building equitable systems for all students</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    We are deeply committed to building fair and unbiased AI systems. Our models are regularly audited for potential biases related to gender, caste, religion, socioeconomic status, or other protected characteristics.
                  </p>

                  <div className="bg-green-500/5 p-6 rounded-xl border border-green-500/20">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5 text-green-500" />
                      Our Fairness Practices
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: Target, text: "Regular bias audits of AI models and predictions" },
                        { icon: Users, text: "Diverse training data representing all demographics" },
                        { icon: TrendingUp, text: "Transparent reporting of model performance" },
                        { icon: Eye, text: "Human review process for edge cases" },
                        { icon: MessageSquare, text: "Feedback mechanisms to report biases" },
                        { icon: Shield, text: "Independent ethics board oversight" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-card p-3 rounded-lg shadow-sm border border-border">
                          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-green-500" />
                          </div>
                          <p className="text-sm text-foreground font-medium">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                    <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-primary">Report Concerns:</span> If you believe our system has made a biased or unfair assessment, please contact our support team immediately. We take all fairness concerns seriously and will investigate thoroughly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Limitations */}
            <div id="limitations">
              <Card className="shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow border-l-4 border-l-amber-500 glass-card">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center shadow-sm">
                      <AlertCircle className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Important Limitations & Disclaimers</CardTitle>
                      <CardDescription className="text-base">What you need to know about our platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/20">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-500 text-lg mb-2">⚠️ Not a Guarantee</p>
                        <p className="text-muted-foreground">
                          The NextGen Platform provides guidance and insights, not guarantees. Placement outcomes depend on numerous factors beyond our analysis, including interview performance, market conditions, company policies, and individual effort.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Skill Assessment Limitations",
                        desc: "Based on self-reported data and available academic records. May not capture all relevant skills or real-world experience."
                      },
                      {
                        title: "Industry Benchmarks",
                        desc: "Based on historical data and may not reflect current market demands or emerging technologies."
                      },
                      {
                        title: "Placement Predictions",
                        desc: "Statistical models with inherent uncertainty. Individual outcomes may vary significantly."
                      },
                      {
                        title: "AI Recommendations",
                        desc: "Suggestions only. Students and faculty should exercise independent judgment."
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-card p-4 rounded-xl shadow-sm border border-border">
                        <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ethical Guidelines */}
            <div id="ethics">
              <Card className="shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow glass-card">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-0 group cursor-pointer" onClick={() => window.location.href = "/"}>
                    <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                    <div className="hidden sm:block">
                      <h1 className="text-foreground font-black text-xl tracking-tight leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">NextGen</h1>
                      <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1 opacity-80">Legal Portal</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We operate under a strict ethical framework designed to benefit students, colleges, and society:
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        icon: Heart,
                        title: "Student-Centric",
                        desc: "All decisions prioritize student welfare and educational outcomes.",
                        color: "rose"
                      },
                      {
                        icon: Eye,
                        title: "Transparency",
                        desc: "We clearly communicate how our systems work, their limitations, and how data is used.",
                        color: "blue"
                      },
                      {
                        icon: Shield,
                        title: "Accountability",
                        desc: "We take responsibility for our recommendations and actively work to improve accuracy.",
                        color: "green"
                      },
                      {
                        icon: Users,
                        title: "Inclusivity",
                        desc: "We ensure our platform serves all students equitably, regardless of background.",
                        color: "purple"
                      },
                      {
                        icon: TrendingUp,
                        title: "Continuous Improvement",
                        desc: "We regularly audit, test, and improve our systems based on feedback and research.",
                        color: "indigo"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border-l-4 border-${item.color}-500 shadow-sm bg-card border border-border`}>
                        <div className={`w-10 h-10 bg-${item.color}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact */}
            <div id="contact">
              <Card className="shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-shadow glass-card">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Questions or Concerns?</CardTitle>
                      <CardDescription className="text-base">We're here to help and welcome your feedback</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about our privacy practices, AI systems, or ethical guidelines, please reach out:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: Mail, label: "Privacy Inquiries", value: "privacy@campuscareer.com", color: "blue" },
                      { icon: MessageSquare, label: "General Support", value: "support@campuscareer.com", color: "green" },
                      { icon: Heart, label: "Ethics Concerns", value: "ethics@campuscareer.com", color: "rose" }
                    ].map((contact, idx) => (
                      <div key={idx} className={`bg-card p-5 rounded-xl border border-border hover:shadow-lg transition-shadow`}>
                        <div className={`w-10 h-10 bg-${contact.color}-500 rounded-lg flex items-center justify-center mb-3`}>
                          <contact.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-foreground mb-2">{contact.label}</h4>
                        <p className="text-sm text-muted-foreground break-all">{contact.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-green-500">Quick Response:</span> We aim to respond to all inquiries within 48 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center gap-0 justify-center mb-4">
              <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain" />
              <span className="font-bold text-foreground">NextGen Platform</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">© 2025 NextGen Platform. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/TermsAndCondition" className="text-primary hover:opacity-80 font-medium transition-colors">Terms of Service</a>
              <a href="/privacy" className="text-primary hover:opacity-80 font-medium transition-colors">Privacy Policy</a>
              <a href="/contact" className="text-primary hover:opacity-80 font-medium transition-colors">Contact Us</a>
              <a href="/help_center" className="text-primary hover:opacity-80 font-medium transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
