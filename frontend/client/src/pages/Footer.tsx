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
 * // Authenticated app shells: use AppShellFooter instead (see @/components/AppShellFooter)
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
import { useBranding } from "@/contexts/BrandingContext";
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
  ArrowRight,
  Youtube,
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
      ],
      resources: [
        { label: "Feedback", href: "/student/feedbackForm" },
        { label: "Settings", href: "/student/setting" },
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
  const { config: branding } = useBranding();
  const isDark = theme === "dark";

  const footerBg = "bg-transparent";
  const footerBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textLinks = isDark ? "text-slate-300" : "text-slate-600";
  const textHover = isDark ? "hover:text-white" : "hover:text-slate-900";
  const textDivider = isDark ? "text-slate-700" : "text-slate-300";
  const textMuted = isDark ? "text-slate-500" : "text-slate-400";

  return (
    <footer className={`${footerBg} py-10 w-full ${className}`}>
      <div className="container mx-auto px-4 lg:px-8 max-w-[90rem]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 w-full">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer justify-center lg:justify-start" onClick={() => window.location.href = "/"}>
            <img
              src={branding.APP_LOGO_URL || "/NG/NextGen_light.png"}
              alt={`${branding.APP_NAME} Logo`}
              className="h-7 w-7 object-contain"
            />
            <span className={`font-semibold text-lg tracking-tight ${textPrimary}`}>{branding.APP_NAME?.replace(/\s*AI\s*$/i, '')}</span>
          </div>

          {/* Middle: Links & Copyright */}
          <div className={`flex flex-col items-center justify-center text-sm ${textLinks}`}>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-2.5">
              <Link href="/about"><span className={`${textHover} transition-colors cursor-pointer`}>About</span></Link>
              <span className={textDivider}>|</span>
              <Link href="/contact"><span className={`${textHover} transition-colors cursor-pointer`}>Contact us</span></Link>
              <span className={textDivider}>|</span>
              <Link href="/pricing"><span className={`${textHover} transition-colors cursor-pointer`}>Pricing</span></Link>
              <span className={textDivider}>|</span>
              <Link href="/privacy"><span className={`${textHover} transition-colors cursor-pointer`}>Privacy Policy</span></Link>
              <span className={textDivider}>|</span>
              <Link href="/terms"><span className={`${textHover} transition-colors cursor-pointer`}>Terms and Conditions</span></Link>
              <span className={textDivider}>|</span>
            </div>
            
            <div className="mb-4">
              <Link href="/refund"><span className={`${textHover} transition-colors cursor-pointer ${textMuted}`}>Cancellation and Refund Policy</span></Link>
            </div>
            
            <div className={`${textMuted} italic text-[13px]`}>
              Copyright &copy; {new Date().getFullYear()} {branding.APP_NAME?.replace(/\s*AI\s*$/i, '')} Private Limited | All rights reserved
            </div>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-3 justify-center lg:justify-end">
            {/* Instagram */}
            <a href={footerConfig.social.instagram} target="_blank" rel="noopener noreferrer" 
               className="w-7 h-7 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
              <Instagram className="w-4 h-4" />
            </a>
            {/* X (Twitter) */}
            <a href={footerConfig.social.twitter} target="_blank" rel="noopener noreferrer" 
               className="w-7 h-7 rounded bg-black flex items-center justify-center text-white hover:bg-slate-800 transition-colors">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3 h-3 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.96H5.078z"></path></svg>
            </a>
            {/* LinkedIn */}
            <a href={footerConfig.social.linkedin} target="_blank" rel="noopener noreferrer" 
               className="w-7 h-7 rounded bg-[#0077b5] flex items-center justify-center text-white hover:bg-[#005e93] transition-colors">
               <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" target="_blank" rel="noopener noreferrer" 
               className="w-7 h-7 rounded bg-[#ff0000] flex items-center justify-center text-white hover:bg-[#cc0000] transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current pl-[2px]"><path d="M8 5v14l11-7z"/></svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

// Export configuration for easy updates
export { footerConfig };


