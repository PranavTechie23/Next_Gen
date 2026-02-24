import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, FileText, Users, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Search, BookOpen, Globe, Mail, Phone, MapPin, ArrowLeft, Home } from 'lucide-react';
import { useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Security() {
  const [, navigate] = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'overview', name: 'Overview', icon: Shield },
    { id: 'data-security', name: 'Data Security', icon: Lock },
    { id: 'privacy', name: 'Privacy Policy', icon: Eye },
    { id: 'acceptable-use', name: 'Acceptable Use', icon: CheckCircle },
    { id: 'Guidelines', name: 'Guidelines', icon: Users },
    { id: 'Reporting', name: 'Reporting', icon: AlertTriangle },
    { id: 'compliance', name: 'Compliance', icon: FileText },
    { id: 'faq', name: 'FAQ', icon: Info },
  ];

  const faqs = [
    {
      q: "How is my personal data protected?",
      a: "We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit. All personal information is stored in secure, access-controlled databases with regular security audits."
    },
    {
      q: "Can I access my data?",
      a: "Yes, you have the right to access, modify, or delete your personal data at any time through your student portal or by contacting the IT Help Desk."
    },
    {
      q: "What should I do if I suspect a security breach?",
      a: "Immediately report any suspected security incidents to security@college.edu or call our 24/7 security hotline at +1-800-SEC-HELP. Do not attempt to investigate the breach yourself."
    },
    {
      q: "Are my exam submissions secure?",
      a: "Yes, all exam submissions are encrypted end-to-end and stored in tamper-proof systems with audit trails. Access is restricted to authorized faculty only."
    },
    {
      q: "How long is my data retained?",
      a: "Student academic records are retained for 7 years after graduation as per educational regulations. Personal data is deleted within 30 days of account closure upon request."
    },
    {
      q: "Can I use VPN on campus network?",
      a: "Yes, VPN usage is permitted. However, you must use approved VPN services and ensure they don't violate our acceptable use policy. Torrenting and illegal downloads are prohibited."
    },
    {
      q: "What happens if I violate the acceptable use policy?",
      a: "Violations may result in temporary account suspension, permanent expulsion from the network, academic disciplinary action, or legal consequences depending on severity."
    },
    {
      q: "Is two-factor authentication mandatory?",
      a: "2FA is mandatory for all student portal accounts, email access, and any system containing sensitive academic or personal information."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <header className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 transition-all duration-500">
        <div className="max-w-[1700px] mx-auto px-10 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div className="h-12 w-px bg-slate-200 dark:bg-white/10"></div>
              <div className="flex items-center gap-0 group cursor-pointer" onClick={() => window.location.href = "/"}>
                <img
                  src="/NG/NextGen_light.png"
                  alt="NextGen Logo"
                  className="h-14 w-14 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                />
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</h1>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1 opacity-80">Security & Guidelines</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <ThemeToggle className="!h-14 !w-14 bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-blue-500/30 !rounded-2xl transition-all flex items-center justify-center shadow-xl hover:scale-110 cursor-pointer text-slate-600 dark:text-white" />
              <div className="flex flex-col gap-2">
                <span className="bg-slate-100 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-blue-200">Jan 2026</span>
                <span className="bg-green-600/10 dark:bg-green-600/20 backdrop-blur-md px-4 py-2 rounded-xl border border-green-500/30 text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-300">v3.2 PRO</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto px-10 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
          {/* Sidebar Navigation */}
          <aside className="xl:col-span-3">
            <nav className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] p-10 sticky top-40 border border-white/20 dark:border-white/5">
              <div className="flex items-center gap-4 mb-12 px-2">
                <div className="w-3 h-12 bg-gradient-to-b from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.4)]"></div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Navigation</h2>
              </div>
              <ul className="space-y-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-5 px-6 py-5 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${activeSection === section.id
                          ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] scale-[1.03]'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'
                          }`}
                      >
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeSection === section.id
                          ? 'bg-white/20 rotate-6 shadow-xl'
                          : 'bg-slate-100 dark:bg-white/5 group-hover:bg-blue-500/10'}`}>
                          <Icon className={`w-7 h-7 transition-transform group-hover:scale-125 ${activeSection === section.id ? 'text-white' : 'group-hover:text-blue-500'}`} />
                        </div>
                        <div className="flex flex-col items-start flex-grow">
                          <span className={`text-lg font-black leading-[1.1] ${activeSection === section.id ? 'text-white' : 'dark:text-slate-300 group-hover:text-blue-600'} transition-colors`}>
                            {section.name}
                          </span>
                        </div>
                        {activeSection === section.id && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-16 p-10 bg-gradient-to-br from-pink-600 to-white-200 dark:from-slate-950 dark:to-slate-950 rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden group border border-white/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000 blur-3xl"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="font-black text-2xl mb-4 tracking-tight leading-none text-white">Security Crisis?</h3>
                  <p className="text-base text-white dark:text-blue-200 mb-8 leading-relaxed font-bold opacity-80">Our emergency desk is active 24/7. Don't wait for the next cycle.</p>
                  <Button className="w-full py-8 bg-white text-blue-900 hover:bg-blue-50 rounded-[1.5rem] font-black text-lg transition-all shadow-2xl active:scale-95 border-0">
                    Report Incident
                  </Button>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="xl:col-span-9">
            <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-3xl rounded-[4rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.1)] p-16 border border-white/30 dark:border-white/5 min-h-[1000px] relative overflow-hidden">
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white dark:text-white mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    Security Overview
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-slate-300 mb-6">
                      Welcome to our comprehensive Security and Guidelines portal. This document outlines our commitment to protecting your data, ensuring a safe digital environment, and maintaining the highest standards of privacy and security across all college systems.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                      <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200">
                        <Lock className="w-10 h-10 text-blue-600 mb-3" />
                        <h3 className="font-bold text-lg mb-2">256-bit Encryption</h3>
                        <p className="text-gray-600 dark:text-slate-400">Military-grade encryption protects all your data</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200">
                        <CheckCircle className="w-10 h-10 text-green-600 mb-3" />
                        <h3 className="font-bold text-lg mb-2">99.9% Uptime</h3>
                        <p className="text-gray-600 dark:text-slate-400">Reliable systems you can depend on</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg border border-purple-200">
                        <Users className="w-10 h-10 text-purple-600 mb-3" />
                        <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                        <p className="text-gray-600 dark:text-slate-400">Always here when you need us</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Our Security Commitment</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      At our institution, security is not just a feature—it's a fundamental right. We employ a multi-layered security approach that encompasses physical security, network security, application security, and data security. Our dedicated security team works around the clock to monitor, detect, and respond to potential threats.
                    </p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Key Security Principles</h3>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Defense in Depth:</strong> Multiple layers of security controls throughout our IT infrastructure to protect against various attack vectors.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Least Privilege:</strong> Users and systems are granted only the minimum access necessary to perform their functions.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Zero Trust Architecture:</strong> We verify every access request regardless of where it originates, never assuming trust.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Continuous Monitoring:</strong> Real-time monitoring and logging of all system activities to detect anomalies.
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <strong>Regular Audits:</strong> Third-party security audits conducted quarterly to ensure compliance and identify vulnerabilities.
                        </div>
                      </li>
                    </ul>

                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 p-6 my-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">Important Notice</h4>
                          <p className="text-yellow-800 dark:text-yellow-400">
                            All users are required to complete mandatory security awareness training within the first week of enrollment. Failure to complete this training may result in restricted access to college systems.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'data-security' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Lock className="w-8 h-8 text-blue-600" />
                    Data Security Measures
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-2xl font-bold mt-6 mb-4">Encryption Standards</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      We employ industry-leading encryption standards to protect your data at every stage:
                    </p>

                    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg mb-6">
                      <h4 className="font-bold text-lg mb-3">Data at Rest</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>AES-256 encryption for all stored data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Encrypted database fields for sensitive information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Secure key management using HSM (Hardware Security Modules)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Encrypted backups stored in geographically diverse locations</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg mb-6">
                      <h4 className="font-bold text-lg mb-3">Data in Transit</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>TLS 1.3 encryption for all network communications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Perfect Forward Secrecy (PFS) enabled</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Certificate pinning for mobile applications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>VPN encryption for remote access</span>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Access Control</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      Our comprehensive access control system ensures that only authorized individuals can access specific resources:
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-bold mb-2">Multi-Factor Authentication (MFA)</h4>
                        <p className="text-gray-700 dark:text-slate-300">
                          Required for all accounts. Supported methods include authenticator apps (Google Authenticator, Microsoft Authenticator), SMS codes, hardware tokens (YubiKey), and biometric authentication.
                        </p>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-bold mb-2">Role-Based Access Control (RBAC)</h4>
                        <p className="text-gray-700 dark:text-slate-300">
                          Permissions are assigned based on user roles (student, faculty, staff, admin). Access is automatically provisioned and de-provisioned based on enrollment or employment status.
                        </p>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-bold mb-2">Session Management</h4>
                        <p className="text-gray-700 dark:text-slate-300">
                          Sessions expire after 30 minutes of inactivity. Concurrent sessions are limited to 3 devices. Suspicious login attempts trigger immediate alerts and temporary account locks.
                        </p>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-bold mb-2">Password Policies</h4>
                        <p className="text-gray-700 dark:text-slate-300">
                          Minimum 12 characters, must include uppercase, lowercase, numbers, and special characters. Passwords expire every 90 days. Cannot reuse last 10 passwords. Common passwords are blocked.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Network Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Firewall Protection</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Next-generation firewalls with deep packet inspection and intrusion prevention</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Network Segmentation</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Separate networks for academic, administrative, guest, and IoT devices</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">DDoS Protection</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Cloud-based DDoS mitigation with automatic traffic filtering</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Intrusion Detection</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">24/7 monitoring with AI-powered threat detection and response</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Data Backup & Recovery</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      We maintain comprehensive backup systems to ensure data availability and business continuity:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Daily incremental backups with weekly full backups</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>30-day retention for standard backups, 7-year retention for academic records</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Off-site backup storage in multiple geographic locations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Quarterly disaster recovery drills to ensure RTO of 4 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Immutable backups protected against ransomware</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Eye className="w-8 h-8 text-blue-600" />
                    Privacy Policy
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 p-10 rounded-[2.5rem] border border-blue-100 dark:border-white/5 mb-12 flex items-center justify-between group overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125"></div>
                      <div className="relative z-10">
                        <div className="flex gap-10">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Effective Date</span>
                            <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">January 1, 2026</span>
                          </div>
                          <div className="w-px h-12 bg-slate-200 dark:bg-white/10 mt-2"></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Last Reviewed</span>
                            <span className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">January 24, 2026</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-6 py-2 rounded-full text-sm font-black uppercase tracking-tighter">Active Policy</Badge>
                    </div>

                    <h3 className="text-4xl font-black mt-16 mb-8 tracking-tighter flex items-center gap-4">
                      <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white text-2xl shadow-xl">1</span>
                      Information We Collect
                    </h3>

                    <h4 className="text-2xl font-black mt-10 mb-6 text-slate-800 dark:text-white flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                      1.1 Personal Information
                    </h4>
                    <p className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                      We collect the following personal information necessary for academic administration and student services:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      {[
                        { title: "Identification Data", items: ["Full name & DOB", "Student ID number", "Gov-issued ID", "Photographs"], icon: Users, color: "blue" },
                        { title: "Contact Info", items: ["College Email", "Personal Phone", "Physical Address", "Emergency Contacts"], icon: Mail, color: "indigo" },
                        { title: "Academic Records", items: ["Course Enrollments", "GPA & Grades", "Transcripts", "Attendance"], icon: BookOpen, color: "purple" },
                        { title: "Financial Data", items: ["Tuition Payments", "Scholarship Status", "Financial Aid", "Receipts"], icon: FileText, color: "emerald" },
                        { title: "Health Records", items: ["Accommodation Requests", "Immunization Records", "Medical Reports"], icon: Shield, color: "rose" }
                      ].map((cat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group">
                          <div className="flex items-center gap-6 mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-500/10 flex items-center justify-center`}>
                              <cat.icon className={`w-7 h-7 text-${cat.color}-500`} />
                            </div>
                            <h5 className="text-xl font-black tracking-tight">{cat.title}</h5>
                          </div>
                          <ul className="space-y-3">
                            {cat.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-3">
                                <CheckCircle className={`w-5 h-5 text-${cat.color}-500/40`} />
                                <span className="text-lg font-bold text-slate-700 dark:text-slate-400">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-2xl font-black mt-16 mb-6 text-slate-800 dark:text-white flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                      1.2 Technical Information
                    </h4>
                    <p className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                      When you access our systems, we automatically collect:
                    </p>

                    <div className="bg-slate-900 dark:bg-black rounded-[3rem] p-12 text-white relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-8">
                          {[
                            { label: "Network Log", value: "IP addresses & device identifiers" },
                            { label: "Browser Data", value: "Types, versions & engine headers" }
                          ].map((stat, i) => (
                            <div key={i}>
                              <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">{stat.label}</p>
                              <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-8">
                          {[
                            { label: "System Config", value: "OS versions & screen resolution" },
                            { label: "Session Logs", value: "Login timestamps & durations" }
                          ].map((stat, i) => (
                            <div key={i}>
                              <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">{stat.label}</p>
                              <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      Your information is used exclusively for legitimate educational purposes:
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Academic Administration</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Enrollment management, grade recording, degree verification, transcript generation, course scheduling</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Communication</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Academic announcements, emergency notifications, administrative updates, event invitations</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Support Services</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">IT helpdesk, library services, counseling services, career guidance, disability accommodations</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Security & Compliance</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Fraud prevention, security monitoring, regulatory compliance, audit requirements</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Research & Analytics</h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Anonymized data for institutional research, program improvement, accreditation reporting</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">3. Information Sharing</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      We do not sell your personal information. We share your information only in the following circumstances:
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>With Your Consent:</strong> When you explicitly authorize us to share your information with third parties
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Academic Partners:</strong> Other educational institutions for transfer credits or joint programs (with your permission)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Service Providers:</strong> Vetted third-party vendors who provide services on our behalf (e.g., payment processors, cloud storage)
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Legal Obligations:</strong> When required by law, court order, or government regulations
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Emergency Situations:</strong> To protect the safety of students, staff, or the public
                        </div>
                      </li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-8 mb-4">4. Your Privacy Rights</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      You have the following rights regarding your personal data:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Right to Portability
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Receive your data in a structured, machine-readable format</p>
                      </div>
                      <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Right to Object
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Object to processing of your data for specific purposes</p>
                      </div>
                      <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Right to Withdraw Consent
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Withdraw consent at any time where processing is based on consent</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">5. Cookies and Tracking</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      We use cookies and similar technologies to enhance your experience:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Essential Cookies:</strong> Required for authentication and basic site functionality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Functional Cookies:</strong> Remember your preferences and settings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span><strong>Analytics Cookies:</strong> Help us understand how you use our services (anonymized)</span>
                      </li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-8 mb-4">6. Data Retention</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      We retain your information for the following periods:
                    </p>
                    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg mb-6">
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-800">
                          <span className="font-medium">Academic Records</span>
                          <span className="text-gray-600 dark:text-slate-400">7 years after graduation</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-800">
                          <span className="font-medium">Financial Records</span>
                          <span className="text-gray-600 dark:text-slate-400">7 years after transaction</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-800">
                          <span className="font-medium">Personal Data</span>
                          <span className="text-gray-600 dark:text-slate-400">Until account closure + 30 days</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-800">
                          <span className="font-medium">Security Logs</span>
                          <span className="text-gray-600 dark:text-slate-400">1 year</span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                          <span className="font-medium">Email Communications</span>
                          <span className="text-gray-600 dark:text-slate-400">3 years</span>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">7. Contact Information</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      For privacy-related inquiries or to exercise your rights, contact:
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-bold mb-3">Data Protection Officer</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>privacy@college.edu</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span>+1-800-PRIVACY (774-8229)</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>Privacy Office, Administration Building, Room 301</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'acceptable-use' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                    Acceptable Use Policy
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-slate-300 mb-6">
                      This policy defines acceptable use of college IT resources including networks, computers, software, and online services.
                    </p>

                    <h3 className="text-2xl font-bold mt-6 mb-4">Permitted Uses</h3>
                    <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-6 mb-6">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Academic research, coursework, and educational activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Official college business and administrative tasks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Communication for educational or professional purposes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Participation in approved student organizations and activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Personal use that does not interfere with academic or business purposes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Accessing library resources and online databases</span>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Prohibited Activities</h3>
                    <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-6 mb-6">
                      <p className="font-bold text-red-900 dark:text-red-300 mb-3">The following activities are strictly prohibited:</p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Illegal Activities:</strong> Downloading or distributing copyrighted materials, hacking, unauthorized access, identity theft, fraud, or any activity violating local, state, or federal laws
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Malicious Activities:</strong> Distributing viruses, malware, ransomware, or engaging in phishing, spoofing, or denial-of-service attacks
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Harassment:</strong> Cyberbullying, stalking, threatening, or sending abusive messages to any individual or group
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Unauthorized Access:</strong> Attempting to access accounts, files, or systems without proper authorization; sharing credentials
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Network Abuse:</strong> Excessive bandwidth consumption, cryptocurrency mining, running unauthorized servers, or interfering with network performance
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Commercial Activities:</strong> Using college resources for personal profit, advertising, or running commercial businesses (except authorized student enterprises)
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Inappropriate Content:</strong> Accessing, storing, or distributing obscene, offensive, or harmful material
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Privacy Violations:</strong> Intercepting communications, monitoring others' activity, or disclosing private information without consent
                          </div>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Network Usage Guidelines</h3>
                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Bandwidth Management</h4>
                        <ul className="text-sm space-y-1 text-gray-700 dark:text-slate-300">
                          <li>• Streaming limited to 1080p during peak hours (8 AM - 6 PM)</li>
                          <li>• Large downloads ( more than 10GB) should be scheduled during off-peak hours</li>
                          <li>• P2P file sharing is prohibited on the academic network</li>
                          <li>• Network gaming is allowed on designated gaming VLAN only</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Wi-Fi Usage</h4>
                        <ul className="text-sm space-y-1 text-gray-700 dark:text-slate-300">
                          <li>• Maximum 3 devices per student on the network simultaneously</li>
                          <li>• Guest network available for visitors (24-hour access codes)</li>
                          <li>• IoT devices must be registered with IT Services</li>
                          <li>• Creating personal hotspots is not permitted</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2">Email Guidelines</h4>
                        <ul className="text-sm space-y-1 text-gray-700 dark:text-slate-300">
                          <li>• Mailbox quota: 50GB per account</li>
                          <li>• Bulk emails require prior approval from Communications Office</li>
                          <li>• Forwarding to external addresses is permitted but not recommended</li>
                          <li>• Email retention: 3 years, then automatically archived</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Software and Licensing</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      All software used on college systems must be properly licensed:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Use only software approved and licensed by the college</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Student licenses available for Microsoft Office, Adobe Creative Cloud, MATLAB, and more</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Do not install cracked, pirated, or unlicensed software</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>Do not share license keys or install software on unauthorized devices</span>
                      </li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Consequences of Violations</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      Violations of this policy may result in:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded">
                        <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">Minor Violations</h4>
                        <ul className="text-sm space-y-1 text-yellow-800 dark:text-yellow-400">
                          <li>• Written warning</li>
                          <li>• Mandatory security training</li>
                          <li>• Temporary access restriction (24-72 hours)</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-2">Moderate Violations</h4>
                        <ul className="text-sm space-y-1 text-orange-800 dark:text-orange-400">
                          <li>• Account suspension (1-4 weeks)</li>
                          <li>• Meeting with Dean of Students</li>
                          <li>• Academic probation</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20 p-4 rounded">
                        <h4 className="font-bold text-red-900 dark:text-red-300 mb-2">Severe Violations</h4>
                        <ul className="text-sm space-y-1 text-red-800 dark:text-red-400">
                          <li>• Permanent account termination</li>
                          <li>• Expulsion from college</li>
                          <li>• Legal prosecution</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950/20 p-4 rounded">
                        <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">Criminal Violations</h4>
                        <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-300">
                          <li>• Immediate law enforcement referral</li>
                          <li>• Civil liability</li>
                          <li>• Criminal charges</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 border border-blue-200 p-6 rounded-lg mt-6">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        Important Reminder
                      </h4>
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        By using college IT resources, you agree to comply with this Acceptable Use Policy. The college reserves the right to monitor network activity and investigate suspected violations. Users have no expectation of privacy when using college systems.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'Guidelines' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    Student Guidelines
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-slate-300 mb-6">
                      These guidelines help students maintain security and make the most of college IT resources.
                    </p>

                    <h3 className="text-3xl font-black mt-12 mb-8 tracking-tight">Account Security Best Practices</h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-3xl border border-blue-200 dark:border-blue-800/50 shadow-xl group hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:rotate-6 transition-transform">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-black mb-4 text-blue-900 dark:text-blue-200">Password Management</h4>
                        <ul className="space-y-4">
                          {[
                            "Use a unique password for your student account",
                            "Enable password manager (1Password, LastPass, Bitwarden)",
                            "Create passwords with 12+ characters including symbols",
                            "Never share your password with anyone",
                            "Change password immediately if compromised"
                          ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-8 rounded-3xl border border-green-200 dark:border-green-800/50 shadow-xl group hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:rotate-6 transition-transform">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-black mb-4 text-green-900 dark:text-green-200">Two-Factor Authentication</h4>
                        <ul className="space-y-4">
                          {[
                            "Set up 2FA within first 48 hours of enrollment",
                            "Use authenticator app instead of SMS when possible",
                            "Save backup codes in secure location",
                            "Register multiple authentication methods",
                            "Update phone number if it changes"
                          ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-3xl border border-purple-200 dark:border-purple-800/50 shadow-xl group hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:rotate-6 transition-transform">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-black mb-4 text-purple-900 dark:text-purple-200">Privacy Protection</h4>
                        <ul className="space-y-4">
                          {[
                            "Lock your computer when stepping away",
                            "Don't access sensitive info on public computers",
                            "Use privacy screens in public areas",
                            "Log out completely after each session",
                            "Be cautious sharing personal info online"
                          ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-8 rounded-3xl border border-orange-200 dark:border-orange-800/50 shadow-xl group hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:rotate-6 transition-transform">
                          <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-2xl font-black mb-4 text-orange-900 dark:text-orange-200">Device Security</h4>
                        <ul className="space-y-4">
                          {[
                            "Install antivirus software on all devices",
                            "Keep operating system and apps updated",
                            "Enable device encryption (BitLocker, FileVault)",
                            "Use device locks (PIN, fingerprint, face ID)",
                            "Enable remote wipe capability"
                          ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4">
                              <div className="w-6 h-6 bg-orange-600/20 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-orange-600" />
                              </div>
                              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Safe Browsing Practices</h3>
                    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-3 text-green-700 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            DO
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>✓ Verify URLs before clicking links</li>
                            <li>✓ Look for HTTPS in the address bar</li>
                            <li>✓ Use college VPN for remote access</li>
                            <li>✓ Download files only from trusted sources</li>
                            <li>✓ Clear browser cache regularly</li>
                            <li>✓ Use ad blockers and anti-tracking extensions</li>
                            <li>✓ Verify sender before opening email attachments</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold mb-3 text-red-700 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            DON'T
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>✗ Click on suspicious links or pop-ups</li>
                            <li>✗ Download from unknown websites</li>
                            <li>✗ Use public Wi-Fi for sensitive transactions</li>
                            <li>✗ Ignore browser security warnings</li>
                            <li>✗ Save passwords in browser</li>
                            <li>✗ Disable security software</li>
                            <li>✗ Share personal info on unsecured sites</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Academic Integrity</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      Technology usage must align with academic honesty principles:
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded">
                        <h4 className="font-bold mb-2">Exam Security</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Close all unnecessary applications during online exams</li>
                          <li>• Do not use unauthorized resources or communication tools</li>
                          <li>• Keep your webcam on if proctoring is required</li>
                          <li>• Report technical issues immediately to instructors</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded">
                        <h4 className="font-bold mb-2">Assignment Submissions</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Submit only your original work</li>
                          <li>• Properly cite all sources and references</li>
                          <li>• Use plagiarism detection tools before submission</li>
                          <li>• Keep backup copies of all assignments</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded">
                        <h4 className="font-bold mb-2">Collaboration</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Collaborate only when explicitly permitted</li>
                          <li>• Use approved collaboration platforms (Teams, Slack)</li>
                          <li>• Credit group members appropriately</li>
                          <li>• Don't share solutions or code without permission</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Email & Communication</h3>
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 p-6 rounded-lg mb-6">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-yellow-600" />
                        Professional Email Guidelines
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Best Practices:</p>
                          <ul className="space-y-1">
                            <li>• Use official college email for academic matters</li>
                            <li>• Include clear subject lines</li>
                            <li>• Maintain professional tone</li>
                            <li>• Check email daily during academic term</li>
                            <li>• Respond within 24-48 hours</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Warning Signs of Phishing:</p>
                          <ul className="space-y-1">
                            <li>• Urgent requests for personal information</li>
                            <li>• Suspicious sender addresses</li>
                            <li>• Poor grammar and spelling errors</li>
                            <li>• Unexpected attachments</li>
                            <li>• Requests to click links immediately</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Social Media Responsibility</h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4">
                      Be mindful of your digital footprint:
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>Think before posting - content can be permanent even if deleted</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>Don't share exam content or assignment answers publicly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>Respect others' privacy - don't post photos without consent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>Understand that posts may affect future opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span>Report cyberbullying or harassment immediately</span>
                      </li>
                    </ul>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Resources for Students</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow dark:hover:bg-slate-800/80">
                        <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                        <h4 className="font-bold mb-2">IT Help Desk</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">24/7 technical support for all students</p>
                        <p className="text-xs text-blue-600">helpdesk@college.edu</p>
                        <p className="text-xs text-blue-600">+1-800-HELP-247</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow dark:hover:bg-slate-800/80">
                        <Globe className="w-8 h-8 text-green-600 mb-2" />
                        <h4 className="font-bold mb-2">Security Training</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Free online courses and workshops</p>
                        <p className="text-xs text-green-600">training.college.edu</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow dark:hover:bg-slate-800/80">
                        <Users className="w-8 h-8 text-purple-600 mb-2" />
                        <h4 className="font-bold mb-2">Student Forums</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">Connect with peers and get advice</p>
                        <p className="text-xs text-purple-600">forum.college.edu</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'Reporting' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    Reporting
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-6 mb-6">
                      <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">🚨 Emergency Contact</h3>
                      <p className="text-red-800 dark:text-red-400 mb-3">
                        For immediate security emergencies, contact our 24/7 Security Operations Center:
                      </p>
                      <div className="bg-white dark:bg-slate-800/80">
                        <p className="font-bold text-lg">📞 +1-800-SEC-HELP (732-4357)</p>
                        <p className="font-bold text-lg">📧 security@college.edu</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">Average response time: &lt; 15 minutes</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Types of Security Incidents</h3>

                    <div className="space-y-4 mb-6">
                      <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-l-4 border-red-600 p-5 rounded-lg">
                        <h4 className="font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Critical (Report Immediately)
                        </h4>
                        <ul className="text-sm space-y-1 text-red-800 dark:text-red-400">
                          <li>• Data breach or unauthorized access to sensitive information</li>
                          <li>• Ransomware or malware infection</li>
                          <li>• Account compromise or identity theft</li>
                          <li>• Denial of service attacks</li>
                          <li>• Loss or theft of device containing sensitive data</li>
                          <li>• Suspected hacking or network intrusion</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-l-4 border-orange-600 p-5 rounded-lg">
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          High Priority (Report Within 24 Hours)
                        </h4>
                        <ul className="text-sm space-y-1 text-orange-800 dark:text-orange-400">
                          <li>• Phishing attempts or suspicious emails</li>
                          <li>• Unauthorized software installations</li>
                          <li>• Privacy violations or data leaks</li>
                          <li>• Suspicious network activity</li>
                          <li>• Lost or stolen access credentials</li>
                          <li>• Policy violations by users</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-l-4 border-yellow-600 p-5 rounded-lg">
                        <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Medium Priority (Report Within 48 Hours)
                        </h4>
                        <ul className="text-sm space-y-1 text-yellow-800 dark:text-yellow-400">
                          <li>• Software vulnerabilities</li>
                          <li>• Security misconfigurations</li>
                          <li>• Expired certificates</li>
                          <li>• Unusual system behavior</li>
                          <li>• Minor policy violations</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">How to Report an Incident</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-900/50 shadow-md">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                        <h4 className="font-bold mb-2">Identify the Issue</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Determine the type and severity of the security incident</p>
                      </div>
                      <div className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-900/50 shadow-md">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                        <h4 className="font-bold mb-2">Gather Information</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Collect relevant details: time, systems affected, screenshots</p>
                      </div>
                      <div className="text-center p-6 bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-900/50 shadow-md">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                        <h4 className="font-bold mb-2">Submit Report</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Use appropriate channel based on urgency level</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Reporting Channels</h3>

                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-lg border border-gray-200 dark:border-slate-800">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-blue-600" />
                          Phone (24/7 Hotline)
                        </h4>
                        <p className="text-sm mb-2">Best for: Critical and high-priority incidents requiring immediate response</p>
                        <p className="font-mono bg-white dark:bg-slate-800/80 p-2 rounded border border-slate-200 dark:border-slate-700">+1-800-SEC-HELP (732-4357)</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-lg border border-gray-200 dark:border-slate-800">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-600" />
                          Email
                        </h4>
                        <p className="text-sm mb-2">Best for: Detailed reports with attachments and evidence</p>
                        <p className="font-mono bg-white dark:bg-slate-800/80 p-2 rounded border border-slate-200 dark:border-slate-700">security@college.edu</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-lg border border-gray-200 dark:border-slate-800">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-600" />
                          Online Portal
                        </h4>
                        <p className="text-sm mb-2">Best for: Non-urgent incidents with structured reporting</p>
                        <p className="font-mono bg-white dark:bg-slate-800/80 p-2 rounded border border-slate-200 dark:border-slate-700">https://security.college.edu/report</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-lg border border-gray-200 dark:border-slate-800">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          In-Person
                        </h4>
                        <p className="text-sm mb-2">Best for: Sensitive matters requiring face-to-face discussion</p>
                        <p className="bg-white dark:bg-slate-800/80 p-2 rounded border border-slate-200 dark:border-slate-700">IT Security Office, Building C, Room 205<br />Hours: Mon-Fri 9AM-5PM</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">What to Include in Your Report</h3>

                    <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 mb-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Your Contact Information:</strong> Name, student ID, phone, email
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Date and Time:</strong> When did the incident occur? Be as specific as possible
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Affected Systems:</strong> Which devices, accounts, or services were involved?
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Description:</strong> Detailed account of what happened, in chronological order
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Evidence:</strong> Screenshots, error messages, suspicious emails (forward, don't click links)
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Impact:</strong> What data or systems may have been compromised?
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Actions Taken:</strong> What steps have you already taken in response?
                          </div>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Incident Response Timeline</h3>

                    <div className="relative border-l-4 border-blue-600 pl-8 space-y-6 mb-6 ml-4">
                      <div>
                        <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <h4 className="font-bold">Within 15 Minutes</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Initial acknowledgment of critical incidents</p>
                      </div>
                      <div>
                        <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <h4 className="font-bold">Within 1 Hour</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Security team begins investigation</p>
                      </div>
                      <div>
                        <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <h4 className="font-bold">Within 4 Hours</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Containment measures implemented</p>
                      </div>
                      <div>
                        <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <h4 className="font-bold">Within 24 Hours</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Initial assessment and status update provided</p>
                      </div>
                      <div>
                        <div className="absolute -left-3 w-6 h-6 bg-blue-600 rounded-full"></div>
                        <h4 className="font-bold">Within 7 Days</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Full investigation completed and remediation plan executed</p>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">After Reporting</h3>

                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 p-6 rounded-lg">
                      <h4 className="font-bold mb-3 text-green-900 dark:text-green-200">What Happens Next?</h4>
                      <ol className="space-y-2 text-sm text-green-800 dark:text-green-300">
                        <li className="flex gap-2">
                          <span className="font-bold">1.</span>
                          <span>You'll receive a ticket number for tracking your incident</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold">2.</span>
                          <span>Security team will assess the severity and begin investigation</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold">3.</span>
                          <span>You may be contacted for additional information</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold">4.</span>
                          <span>Regular updates will be provided on the investigation status</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold">5.</span>
                          <span>You'll be notified when the incident is resolved</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="font-bold">6.</span>
                          <span>Post-incident report may be shared (anonymized if requested)</span>
                        </li>
                      </ol>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 p-6 rounded-lg mt-6">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        Anonymous Reporting
                      </h4>
                      <p className="text-sm text-purple-900 dark:text-purple-200">
                        You can report incidents anonymously through our secure web portal or by calling our hotline. However, providing contact information helps us investigate more effectively and keep you updated. All reports are treated confidentially.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'compliance' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    Compliance & Regulations
                  </h2>

                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-slate-300 mb-6">
                      Our institution complies with all applicable laws, regulations, and industry standards to protect your data and privacy.
                    </p>

                    <h3 className="text-2xl font-bold mt-6 mb-4">Regulatory Framework</h3>

                    <h3 className="text-3xl font-black mt-12 mb-8 tracking-tight">Regulatory Framework</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 mb-12">
                      {[
                        { title: "FERPA", label: "Family Educational Rights and Privacy Act", desc: "Protects the privacy of student education records. Students have the right to inspect their records, request amendments, and control disclosure of personally identifiable information.", status: "Certified", gradient: "from-blue-600 to-indigo-600" },
                        { title: "GDPR", label: "General Data Protection Regulation", desc: "Applies to international students from EU/EEA. Ensures lawful processing, data minimization, accuracy, storage limitation, and integrity/confidentiality of personal data.", status: "Certified", gradient: "from-green-600 to-emerald-600" },
                        { title: "HIPAA", label: "Health Insurance Portability and Accountability Act", desc: "Protects health information collected by campus health services. Medical records are kept separate from education records and require explicit consent for disclosure.", status: "Certified", gradient: "from-purple-600 to-fuchsia-600" },
                        { title: "CCPA", label: "California Consumer Privacy Act", desc: "Applies to California residents. Provides rights to know what personal information is collected, delete personal information, and opt-out of sale of personal information.", status: "Certified", gradient: "from-orange-600 to-amber-600" },
                        { title: "PCI DSS", label: "Payment Card Industry Data Security Standard", desc: "Ensures secure handling of credit card information for tuition payments and campus purchases. All payment data is encrypted and never stored locally.", status: "Level 1 Certified", gradient: "from-red-600 to-rose-600" },
                        { title: "SOC 2", label: "Service Organization Control 2", desc: "Independent audit of our security controls, availability, processing integrity, confidentiality, and privacy practices.", status: "Type II Certified", gradient: "from-indigo-600 to-blue-600" }
                      ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 rounded-full -mr-16 -mt-16 transition-all duration-500`}></div>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className={`text-2xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>{card.title}</h4>
                            <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-black rounded-full border border-green-500/20">{card.status}</div>
                          </div>
                          <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">{card.label}</p>
                          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Industry Standards</h3>

                    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-gray-200 dark:border-slate-700">
                          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-8 h-8" />
                          </div>
                          <h4 className="font-bold mb-2">ISO 27001</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Information Security Management</p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-gray-200 dark:border-slate-700">
                          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-8 h-8" />
                          </div>
                          <h4 className="font-bold mb-2">NIST CSF</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Cybersecurity Framework</p>
                        </div>
                        <div className="text-center p-4 bg-white dark:bg-slate-800/80 rounded-lg border border-gray-200 dark:border-slate-700">
                          <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-8 h-8" />
                          </div>
                          <h4 className="font-bold mb-2">CIS Controls</h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">Critical Security Controls</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Right to Access
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-slate-300">Request a copy of all personal data we hold about you</p>
                        </div>
                        <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Right to Rectification
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-slate-300">Correct inaccurate or incomplete information</p>
                        </div>
                        <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Right to Erasure
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-slate-300">Request deletion of your data (subject to legal retention requirements)</p>
                        </div>
                        <div className="border border-gray-200 dark:border-slate-800 p-4 rounded-lg">
                          <h4 className="font-bold mb-2 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Right to Restrict Processing
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-slate-300">Request restriction of processing under certain conditions</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4" > Audit & Certification </h3>

                    <div className="space-y-4 mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-l-4 border-blue-600 p-5 rounded-lg">
                        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Internal Audits</h4>
                        <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-300">
                          <li>• Quarterly security assessments of all systems</li>
                          <li>• Monthly vulnerability scans and penetration tests</li>
                          <li>• Annual risk assessment and management review</li>
                          <li>• Continuous compliance monitoring</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-l-4 border-green-600 p-5 rounded-lg">
                        <h4 className="font-bold text-green-900 dark:text-green-200 mb-2">External Audits</h4>
                        <ul className="text-sm space-y-1 text-green-800 dark:text-green-300">
                          <li>• Annual SOC 2 Type II audit by Big 4 accounting firm</li>
                          <li>• Biannual PCI DSS assessment by QSA</li>
                          <li>• Quarterly third-party penetration testing</li>
                          <li>• Annual ISO 27001 surveillance audit</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Documentation & Records</h3>

                    <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg border border-gray-200 dark:border-slate-800 mb-6">
                      <p className="text-sm mb-4">The following documents are available upon request (subject to confidentiality):</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold mb-2">Policy Documents:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Information Security Policy</li>
                            <li>• Data Classification Policy</li>
                            <li>• Incident Response Plan</li>
                            <li>• Business Continuity Plan</li>
                            <li>• Disaster Recovery Plan</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Compliance Records:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Audit reports (last 3 years)</li>
                            <li>• Penetration test results</li>
                            <li>• Risk assessment reports</li>
                            <li>• Data Processing Agreements</li>
                            <li>• Vendor security assessments</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-8 mb-4">Contact Information</h3>

                    <div className="bg-blue-50 dark:bg-blue-950/20 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-bold mb-3">Compliance Office</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>compliance@college.edu</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span>+1-800-COMPLY (266-759)</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>Compliance Office, Administration Building, Room 405</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'faq' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Info className="w-8 h-8 text-blue-600" />
                    Frequently Asked Questions
                  </h2>

                  <div className="mb-8">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {filteredFaqs.length} of {faqs.length} questions found
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {filteredFaqs.map((faq, index) => (
                      <div
                        key={index}
                        className="group bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/30"
                      >
                        <button
                          className="w-full flex items-center justify-between p-8 text-left transition-colors"
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${expandedFaq === index ? 'bg-blue-600 text-white rotate-6 shadow-xl' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'}`}>
                              <Info className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="font-black text-xl text-slate-800 dark:text-white mb-1">{faq.q}</h3>
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{expandedFaq === index ? 'Click to hide details' : 'Click to see answer'}</p>
                            </div>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${expandedFaq === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                            <ChevronDown className="w-6 h-6" />
                          </div>
                        </button>

                        {expandedFaq === index && (
                          <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-4 duration-500">
                            <div className="p-8 bg-blue-50/50 dark:bg-blue-900/20 rounded-[1.5rem] border border-blue-100 dark:border-blue-800/30">
                              <p className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-20 bg-slate-100/50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-300 dark:border-white/10">
                      <Search className="w-20 h-20 text-slate-300 dark:text-white/10 mx-auto mb-6" />
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">No matching questions found</h3>
                      <p className="text-lg text-slate-500 font-medium">Try different keywords or browse common categories.</p>
                    </div>
                  )}

                  <div className="mt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                        <Mail className="w-10 h-10" />
                      </div>
                      <h3 className="text-4xl font-black mb-6 tracking-tight text-white">Still have questions?</h3>
                      <p className="text-xl text-blue-100 dark:text-blue-200 mb-10 max-w-2xl leading-relaxed">Our dedicated security team is ready to assist you with any privacy or technical concerns.</p>
                      <div className="flex flex-wrap justify-center gap-6">
                        <Button
                          size="lg"
                          className="bg-white text-blue-600 hover:bg-blue-50 font-black text-lg px-10 py-8 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 border-0"
                          onClick={() => window.location.href = 'mailto:support@college.edu'}
                        >
                          Email Support
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-white/30 text-white hover:bg-white/10 font-black text-lg px-10 py-8 rounded-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
                          onClick={() => window.location.href = 'tel:+1800HELP247'}
                        >
                          Call +1-800-HELP-247
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="mt-8 text-center text-gray-600 text-sm">
              <p>© {new Date().getFullYear()} College University. All rights reserved. This document is updated quarterly.</p>
              <p className="mt-1">For official documentation, please refer to the Student Handbook and IT Policy Manual.</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}