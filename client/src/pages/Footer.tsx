/**
 * Footer Component - Reusable Footer for All Pages
 * 
 * This is a centralized footer component that can be used across all pages.
 * All links, social media URLs, and contact information are managed in one place.
 * 
 * USAGE:
 * ```tsx
 * // For public pages (Home, About, etc.)
 * <Footer role="public" />
 * 
 * // For student dashboard/pages
 * <Footer role="student" />
 * 
 * // For college dashboard/pages
 * <Footer role="college" />
 * 
 * // For admin dashboard/pages
 * <Footer role="admin" />
 * 
 * // With custom className
 * <Footer role="public" className="mt-20" />
 * ```
 * 
 * TO UPDATE LINKS:
 * - All links are in the `footerConfig` object at the top of this file
 * - Update social media URLs in `footerConfig.social`
 * - Update contact info in `footerConfig.contact`
 * - Add/remove role-specific links in `footerConfig.roleLinks`
 * - Changes will automatically apply to all pages using this component
 * 
 * FEATURES:
 * - Automatic theme support (light/dark mode)
 * - Role-based link customization
 * - Centralized link management
 * - Responsive design
 * - External link handling
 */

import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Linkedin,
  Twitter,
  Mail,
  Facebook,
  Instagram,
  Github,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";

export type UserRole = "public" | "student" | "college" | "admin";

interface FooterProps {
  role?: UserRole;
  className?: string;
}

// Centralized configuration for all footer links and content
const footerConfig = {
  // Company Information
  company: {
    name: "NextGen",
    tagline: "Empowering students to achieve their career dreams through innovation and technology.",
    logo: "C",
  },

  // Contact Information
  contact: {
    email: "contact@campuscareer.com",
    phone: "+91 98765 43210",
    address: "123 College Avenue, City, State 12345",
    collegeWebsite: "https://pict.edu",
  },

  // Social Media Links - Update these URLs as needed
  social: {
    linkedin: "https://linkedin.com/company/campuscareer",
    twitter: "https://twitter.com/campuscareer",
    facebook: "https://facebook.com/campuscareer",
    instagram: "https://instagram.com/campuscareer",
    github: "https://github.com/campuscareer",
  },

  // Common Links (available to all users)
  commonLinks: {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
    resources: [
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie" },
    ],
  },

  // Role-specific links
  roleLinks: {
    student: {
      quickLinks: [
        { label: "Dashboard", href: "/student/dashboard" },
        { label: "Jobs & Opportunities", href: "/student/dashboard" },
        { label: "Learning Paths", href: "/student/dashboard" },
        { label: "Webinars", href: "/webinars" },
        { label: "Wellbeing", href: "/wellbeing" },
      ],
      resources: [
        { label: "Feedback", href: "/student/feedbackForm" },
        { label: "Settings", href: "/student/setting" },
        { label: "Case Studies", href: "/case_studies" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    college: {
      quickLinks: [
        { label: "Dashboard Overview", href: "/college/dashboard" },
        { label: "Student Analytics", href: "/college/dashboard" },
        { label: "Placement Reports", href: "https://pict.edu/placement/index.php#statistics", external: true },
        { label: "Company Directory", href: "/college/dashboard" },
        { label: "Training Programs", href: "/college/dashboard" },
      ],
      resources: [
        { label: "Help Center", href: "/help" },
        { label: "Feedback", href: "/college/feedbackForm" },
        { label: "Security Guidelines", href: "/security-guidelines" },
        { label: "Settings", href: "/college/setting" },
      ],
    },
    admin: {
      quickLinks: [
        { label: "Admin Dashboard", href: "/admin/dashboard" },
        { label: "User Management", href: "/admin/dashboard" },
        { label: "System Settings", href: "/admin/setting" },
        { label: "Analytics", href: "/admin/dashboard" },
      ],
      resources: [
        { label: "Feedback", href: "/admin/feedback" },
        { label: "Help Center", href: "/help" },
        { label: "API Reference", href: "/admin/dashboard" },
      ],
    },
  },
};

export default function Footer({ role = "public", className = "" }: FooterProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Get role-specific links or use common links
  const roleSpecificLinks = role !== "public" ? footerConfig.roleLinks[role] : null;
  const quickLinks = roleSpecificLinks?.quickLinks || footerConfig.commonLinks.company;
  const resources = roleSpecificLinks?.resources || footerConfig.commonLinks.resources;

  // Determine footer styling based on theme
  const footerBg = isDark ? "bg-slate-900" : "bg-white";
  const footerBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const textMuted = isDark ? "text-slate-500" : "text-gray-500";
  const hoverText = isDark ? "hover:text-white" : "hover:text-gray-900";
  const socialBg = isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200";

  return (
    <footer className={`${isDark ? 'bg-background' : 'bg-white'} ${footerBorder} border-t py-12 mt-16 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-0 group cursor-pointer" onClick={() => window.location.href = "/"}>
              <img
                src="/NG/NextGen_light.png"
                alt="NextGen Logo"
                className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="flex flex-col justify-center leading-tight">
                <span className="font-black text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">NextGen</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">AI-Driven</p>
              </div>
            </div>
            {role !== "public" && (
              <p className={`text-xs ${textMuted} font-bold uppercase tracking-widest mb-2`}>
                {role === "student" && "Student Portal"}
                {role === "college" && "College Portal"}
                {role === "admin" && "Admin Portal"}
              </p>
            )}
            <p className={`${textSecondary} text-sm leading-relaxed`}>
              {footerConfig.company.tagline}
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3 mt-6">
              <a
                href={footerConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${socialBg} rounded-lg flex items-center justify-center transition-colors`}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={footerConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${socialBg} rounded-lg flex items-center justify-center transition-colors`}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={footerConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${socialBg} rounded-lg flex items-center justify-center transition-colors`}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={footerConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 ${socialBg} rounded-lg flex items-center justify-center transition-colors`}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {role === "admin" && (
                <a
                  href={footerConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 ${socialBg} rounded-lg flex items-center justify-center transition-colors`}
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>
              {role === "public" ? "Company" : "Quick Links"}
            </h3>
            <ul className="space-y-2.5 text-base">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {('external' in link && link.external) ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${textSecondary} ${hoverText} transition-colors flex items-center gap-1`}
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <span className={`${textSecondary} ${hoverText} transition-colors cursor-pointer`}>
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Resources</h3>
            <ul className="space-y-2.5 text-base">
              {resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    <span className={`${textSecondary} ${hoverText} transition-colors cursor-pointer`}>
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>Contact Us</h3>
            <ul className={`space-y-3 text-base ${textSecondary}`}>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{footerConfig.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${footerConfig.contact.phone.replace(/\s/g, "")}`} className={`${hoverText} transition-colors`}>
                  {footerConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${footerConfig.contact.email}`} className={`${hoverText} transition-colors`}>
                  {footerConfig.contact.email}
                </a>
              </li>
              {role === "college" && (
                <li className="flex items-center gap-3 pt-2">
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <a
                    href={footerConfig.contact.collegeWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${hoverText} transition-colors flex items-center gap-1`}
                  >
                    Visit College Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${footerBorder} mt-8 pt-8 text-center`}>
          <p className={`${textMuted} text-sm`}>
            &copy; {new Date().getFullYear()} {footerConfig.company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Export configuration for easy updates
export { footerConfig };

