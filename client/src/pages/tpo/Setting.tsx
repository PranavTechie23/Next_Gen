import React, { useState } from 'react';
import {
  GraduationCap,
  MapPin,
  Globe,
  Phone,
  Mail,
  Building,
  Award,
  Camera,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Info,
  AlertCircle,
  Settings,
  Users,
  Briefcase,
  FileText,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  TrendingUp,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Download,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Edit2,
  Lock,
  Unlock,
  Star,
  Flag,
  Hash,
  AtSign,
  Smartphone,
  Laptop,
  BookOpen,
  Target,
  Zap,
  Heart,
  Share2,
  MessageSquare,
  HelpCircle,
  LogOut,
  Home,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Package,
  Cpu,
  Database,
  Server,
  Code,
  Terminal,
  GitBranch,
  Folder,
  FilePlus,
  FileCheck,
  ArrowLeft
} from 'lucide-react';
import { useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function CollegeSettings() {
  const [, navigate] = useLocation();
  const [activeSection, setActiveSection] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    contact: false,
    social: false,
    placement: false,
    branding: false,
    notifications: false
  });

  // College Basic Information
  const [basicInfo, setBasicInfo] = useState({
    collegeName: 'Tech University',
    shortName: 'TechU',
    tagline: 'Leading Innovation in Technology Education',
    type: 'Private University',
    established: '1995',
    affiliatedTo: 'State Technical Board',
    accreditation: 'ABET',
    ranking: '#12',
    naacGrade: 'A++',
    totalStudents: '15420',
    facultyCount: '850',
    campusArea: '250 acres'
  });

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    address: '123 Tech Street, Innovation Park',
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    pincode: '94105',
    phone: '+1 (555) 987-6543',
    alternatePhone: '+1 (555) 987-6544',
    email: 'info@techuniversity.edu',
    admissionEmail: 'admissions@techuniversity.edu',
    placementEmail: 'placements@techuniversity.edu',
    website: 'www.techuniversity.edu'
  });

  // Social Media Links
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/techuniversity',
    twitter: 'https://twitter.com/techuniversity',
    linkedin: 'https://linkedin.com/company/techuniversity',
    instagram: 'https://instagram.com/techuniversity',
    youtube: 'https://youtube.com/techuniversity'
  });

  // Placement Settings
  const [placementSettings, setPlacementSettings] = useState({
    placementCell: 'Tech University Career Services',
    tpoName: 'Dr. Sarah Johnson',
    tpoEmail: 'tpo@techuniversity.edu',
    tpoPhone: '+1 (555) 987-6545',
    minCGPA: '7.0',
    allowBacklogs: true,
    maxBacklogs: '3',
    placementStartDate: '2024-08-01',
    enableOnCampusDrives: true,
    enableOffCampusApplications: true,
    autoApproveApplications: false
  });

  // Branding Settings
  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    logoUrl: '',
    coverImageUrl: '',
    faviconUrl: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    placementUpdates: true,
    driveReminders: true,
    applicationStatus: true,
    weeklyReports: true,
    monthlyAnalytics: true
  });

  const [copied, setCopied] = useState('');

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSave = () => {
    setHasChanges(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleReset = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const updateBasicInfo = (field: keyof typeof basicInfo, value: string) => {
    setBasicInfo({ ...basicInfo, [field]: value });
    setHasChanges(true);
  };

  const updateContactInfo = (field: keyof typeof contactInfo, value: string) => {
    setContactInfo({ ...contactInfo, [field]: value });
    setHasChanges(true);
  };

  const updateSocialLinks = (field: keyof typeof socialLinks, value: string) => {
    setSocialLinks({ ...socialLinks, [field]: value });
    setHasChanges(true);
  };

  const updatePlacementSettings = (field: keyof typeof placementSettings, value: string | boolean) => {
    setPlacementSettings({ ...placementSettings, [field]: value });
    setHasChanges(true);
  };

  const updateBrandingSettings = (field: keyof typeof brandingSettings, value: string) => {
    setBrandingSettings({ ...brandingSettings, [field]: value });
    setHasChanges(true);
  };

  const updateNotificationSettings = (field: keyof typeof notificationSettings, value: boolean) => {
    setNotificationSettings({ ...notificationSettings, [field]: value });
    setHasChanges(true);
  };

  type IconComponent = React.ComponentType<{ className?: string }>;

  const renderInputField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    type: string = 'text',
    placeholder: string = '',
    icon: IconComponent | null = null,
    helper: string = ''
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
          {label}
        </label>
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>
        {helper && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {helper}
          </p>
        )}
      </div>
    );
  };

  const renderTextArea = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    rows: number = 4,
    placeholder: string = '',
    helper: string = ''
  ) => {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all resize-none font-medium"
        />
        {helper && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {helper}
          </p>
        )}
      </div>
    );
  };

  const renderToggle = (
    label: string,
    checked: boolean,
    onChange: (value: boolean) => void,
    description: string = ''
  ) => {
    return (
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all">
        <div className="flex-1">
          <p className="font-bold text-slate-900 dark:text-white">{label}</p>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={() => onChange(!checked)}
          className={`relative w-14 h-8 rounded-full transition-all ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${checked ? 'left-7' : 'left-1'
              }`}
          />
        </button>
      </div>
    );
  };

  interface SelectOption {
    value: string;
    label: string;
  }

  const renderSelectField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: SelectOption[],
    icon: IconComponent | null = null
  ) => {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
        >
          {options.map((option: SelectOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderSectionHeader = (
    title: string,
    description: string,
    icon: IconComponent,
    sectionKey: keyof typeof expandedSections
  ) => {
    const Icon = icon;
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg text-white group relative overflow-hidden">
        <div
          className="flex items-center gap-4 cursor-pointer flex-1"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="text-blue-100 text-sm mt-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 transition-all font-bold text-sm shadow-lg hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) toggleSection(sectionKey);
            }}
          >
            <Edit2 className="w-4 h-4" />
            EDIT
          </button>
          <button
            onClick={() => toggleSection(sectionKey)}
            className={`w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-all ${isExpanded ? 'rotate-180' : ''}`}
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderFileUpload = (
    label: string,
    currentUrl: string,
    onChange: (value: string) => void,
    acceptedFormats: string = 'image/*'
  ) => {
    return (
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          {label}
        </label>
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 hover:border-blue-500 transition-all bg-slate-50 dark:bg-slate-800/50">
          {currentUrl ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                  <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Current Image</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click to change</p>
                </div>
              </div>
              <button
                onClick={() => onChange('')}
                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="font-bold text-slate-900 dark:text-white mb-2">Upload Image</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Drag and drop or click to browse
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 transition-all duration-500">
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/college/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-0">
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-14 w-14 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                <div className="flex flex-col -gap-1">
                  <span className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">NextGen</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">College Settings</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="!h-12 !w-12 bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-blue-500/30 !rounded-xl transition-all flex items-center justify-center shadow-lg hover:scale-110 text-slate-600 dark:text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">Settings Saved Successfully!</p>
              <p className="text-sm text-green-100">Your changes have been applied</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">95%</p>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Profile Complete</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-green-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">Active</p>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Account Status</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">15.4K</p>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Students</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-orange-200 dark:border-orange-900 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">2 min</p>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Last Updated</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            {renderSectionHeader(
              'Basic Information',
              'Essential details about your institution',
              Building,
              'basic'
            )}

            {expandedSections.basic && (
              <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInputField(
                    'College Name',
                    basicInfo.collegeName,
                    (value) => updateBasicInfo('collegeName', value),
                    'text',
                    'Enter official college name',
                    Building,
                    'This will be displayed on certificates and official documents'
                  )}
                  {renderInputField(
                    'Short Name',
                    basicInfo.shortName,
                    (value) => updateBasicInfo('shortName', value),
                    'text',
                    'e.g., MIT, UCLA',
                    Hash,
                    'Used for quick identification'
                  )}
                  <div className="md:col-span-2">
                    {renderInputField(
                      'Tagline',
                      basicInfo.tagline,
                      (value) => updateBasicInfo('tagline', value),
                      'text',
                      'A short description of your institution',
                      Target,
                      'Appears below college name on public profiles'
                    )}
                  </div>
                  {renderSelectField(
                    'Institution Type',
                    basicInfo.type,
                    (value) => updateBasicInfo('type', value),
                    [
                      { value: 'Private University', label: 'Private University' },
                      { value: 'Public University', label: 'Public University' },
                      { value: 'Autonomous College', label: 'Autonomous College' },
                      { value: 'Deemed University', label: 'Deemed University' },
                      { value: 'Technical Institute', label: 'Technical Institute' }
                    ],
                    Building
                  )}
                  {renderInputField(
                    'Year Established',
                    basicInfo.established,
                    (value) => updateBasicInfo('established', value),
                    'text',
                    'YYYY',
                    Calendar
                  )}
                  {renderInputField(
                    'Affiliated To',
                    basicInfo.affiliatedTo,
                    (value) => updateBasicInfo('affiliatedTo', value),
                    'text',
                    'University/Board name',
                    Award
                  )}
                  {renderInputField(
                    'Accreditation',
                    basicInfo.accreditation,
                    (value) => updateBasicInfo('accreditation', value),
                    'text',
                    'e.g., ABET, NAAC',
                    Shield
                  )}
                  {renderInputField(
                    'National Ranking',
                    basicInfo.ranking,
                    (value) => updateBasicInfo('ranking', value),
                    'text',
                    'e.g., #12',
                    Star
                  )}
                  {renderSelectField(
                    'NAAC Grade',
                    basicInfo.naacGrade,
                    (value) => updateBasicInfo('naacGrade', value),
                    [
                      { value: 'A++', label: 'A++' },
                      { value: 'A+', label: 'A+' },
                      { value: 'A', label: 'A' },
                      { value: 'B++', label: 'B++' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B', label: 'B' }
                    ],
                    Award
                  )}
                  {renderInputField(
                    'Total Students',
                    basicInfo.totalStudents,
                    (value) => updateBasicInfo('totalStudents', value),
                    'number',
                    '0',
                    Users
                  )}
                  {renderInputField(
                    'Faculty Count',
                    basicInfo.facultyCount,
                    (value) => updateBasicInfo('facultyCount', value),
                    'number',
                    '0',
                    Users
                  )}
                  {renderInputField(
                    'Campus Area',
                    basicInfo.campusArea,
                    (value) => updateBasicInfo('campusArea', value),
                    'text',
                    'e.g., 250 acres',
                    MapPin
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div>
            {renderSectionHeader(
              'Contact Information',
              'How people can reach your institution',
              Phone,
              'contact'
            )}

            {expandedSections.contact && (
              <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                  <div>
                    {renderTextArea(
                      'Complete Address',
                      contactInfo.address,
                      (value) => updateContactInfo('address', value),
                      3,
                      'Street address, Building name, Landmark',
                      'This appears on official correspondence'
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderInputField(
                      'City',
                      contactInfo.city,
                      (value) => updateContactInfo('city', value),
                      'text',
                      'City name',
                      MapPin
                    )}
                    {renderInputField(
                      'State/Province',
                      contactInfo.state,
                      (value) => updateContactInfo('state', value),
                      'text',
                      'State name',
                      Flag
                    )}
                    {renderInputField(
                      'Country',
                      contactInfo.country,
                      (value) => updateContactInfo('country', value),
                      'text',
                      'Country name',
                      Globe
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInputField(
                      'Postal/ZIP Code',
                      contactInfo.pincode,
                      (value) => updateContactInfo('pincode', value),
                      'text',
                      'Enter postal code',
                      Hash
                    )}
                    {renderInputField(
                      'Primary Phone',
                      contactInfo.phone,
                      (value) => updateContactInfo('phone', value),
                      'tel',
                      '+1 (xxx) xxx-xxxx',
                      Phone
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInputField(
                      'Alternate Phone',
                      contactInfo.alternatePhone,
                      (value) => updateContactInfo('alternatePhone', value),
                      'tel',
                      '+1 (xxx) xxx-xxxx',
                      Phone
                    )}
                    {renderInputField(
                      'General Email',
                      contactInfo.email,
                      (value) => updateContactInfo('email', value),
                      'email',
                      'info@college.edu',
                      Mail
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInputField(
                      'Admissions Email',
                      contactInfo.admissionEmail,
                      (value) => updateContactInfo('admissionEmail', value),
                      'email',
                      'admissions@college.edu',
                      Mail
                    )}
                    {renderInputField(
                      'Placements Email',
                      contactInfo.placementEmail,
                      (value) => updateContactInfo('placementEmail', value),
                      'email',
                      'placements@college.edu',
                      Briefcase
                    )}
                  </div>

                  {renderInputField(
                    'Website URL',
                    contactInfo.website,
                    (value) => updateContactInfo('website', value),
                    'url',
                    'www.college.edu',
                    Globe,
                    'Your official website address'
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Media Section */}
          <div>
            {renderSectionHeader(
              'Social Media Links',
              'Connect with students on social platforms',
              Share2,
              'social'
            )}

            {expandedSections.social && (
              <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInputField(
                    'Facebook Page',
                    socialLinks.facebook,
                    (value) => updateSocialLinks('facebook', value),
                    'url',
                    'https://facebook.com/yourpage',
                    Facebook
                  )}
                  {renderInputField(
                    'Twitter Profile',
                    socialLinks.twitter,
                    (value) => updateSocialLinks('twitter', value),
                    'url',
                    'https://twitter.com/yourprofile',
                    Twitter
                  )}
                  {renderInputField(
                    'LinkedIn Company Page',
                    socialLinks.linkedin,
                    (value) => updateSocialLinks('linkedin', value),
                    'url',
                    'https://linkedin.com/company/yourcompany',
                    Linkedin
                  )}
                  {renderInputField(
                    'Instagram Profile',
                    socialLinks.instagram,
                    (value) => updateSocialLinks('instagram', value),
                    'url',
                    'https://instagram.com/yourprofile',
                    Instagram
                  )}
                  <div className="md:col-span-2">
                    {renderInputField(
                      'YouTube Channel',
                      socialLinks.youtube,
                      (value) => updateSocialLinks('youtube', value),
                      'url',
                      'https://youtube.com/yourchannel',
                      Youtube
                    )}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-blue-900 dark:text-blue-100 mb-2">Social Media Tips</p>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Use complete URLs including https://</li>
                        <li>• Ensure all profiles are public and active</li>
                        <li>• These links will appear on your public profile</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Placement Settings Section */}
          <div>
            {renderSectionHeader(
              'Placement Settings',
              'Configure placement and recruitment preferences',
              Briefcase,
              'placement'
            )}

            {expandedSections.placement && (
              <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                  {/* TPO Information */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Training & Placement Officer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderInputField(
                        'Placement Cell Name',
                        placementSettings.placementCell,
                        (value) => updatePlacementSettings('placementCell', value),
                        'text',
                        'Career Services Department',
                        Building
                      )}
                      {renderInputField(
                        'TPO Name',
                        placementSettings.tpoName,
                        (value) => updatePlacementSettings('tpoName', value),
                        'text',
                        'Dr. John Doe',
                        Users
                      )}
                      {renderInputField(
                        'TPO Email',
                        placementSettings.tpoEmail,
                        (value) => updatePlacementSettings('tpoEmail', value),
                        'email',
                        'tpo@college.edu',
                        Mail
                      )}
                      {renderInputField(
                        'TPO Phone',
                        placementSettings.tpoPhone,
                        (value) => updatePlacementSettings('tpoPhone', value),
                        'tel',
                        '+1 (xxx) xxx-xxxx',
                        Phone
                      )}
                    </div>
                  </div>

                  {/* Eligibility Criteria */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Student Eligibility Criteria
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderInputField(
                        'Minimum CGPA Required',
                        placementSettings.minCGPA,
                        (value) => updatePlacementSettings('minCGPA', value),
                        'number',
                        '7.0',
                        Percent,
                        'Students below this CGPA cannot apply for placements'
                      )}
                      {renderInputField(
                        'Maximum Backlogs Allowed',
                        placementSettings.maxBacklogs,
                        (value) => updatePlacementSettings('maxBacklogs', value),
                        'number',
                        '3',
                        AlertCircle,
                        'Maximum number of pending backlogs'
                      )}
                    </div>

                    <div className="mt-6">
                      {renderToggle(
                        'Allow Students with Backlogs',
                        placementSettings.allowBacklogs,
                        (value) => updatePlacementSettings('allowBacklogs', value),
                        'Students with active backlogs can apply for placements'
                      )}
                    </div>
                  </div>

                  {/* Placement Configuration */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      Placement Drive Configuration
                    </h3>

                    <div className="space-y-4">
                      {renderInputField(
                        'Placement Season Start Date',
                        placementSettings.placementStartDate,
                        (value) => updatePlacementSettings('placementStartDate', value),
                        'date',
                        '',
                        Calendar,
                        'When does your placement season typically begin?'
                      )}

                      {renderToggle(
                        'Enable On-Campus Drives',
                        placementSettings.enableOnCampusDrives,
                        (value) => updatePlacementSettings('enableOnCampusDrives', value),
                        'Allow companies to schedule on-campus recruitment drives'
                      )}

                      {renderToggle(
                        'Enable Off-Campus Applications',
                        placementSettings.enableOffCampusApplications,
                        (value) => updatePlacementSettings('enableOffCampusApplications', value),
                        'Students can apply to off-campus opportunities'
                      )}

                      {renderToggle(
                        'Auto-Approve Student Applications',
                        placementSettings.autoApproveApplications,
                        (value) => updatePlacementSettings('autoApproveApplications', value),
                        'Applications are automatically approved if eligibility criteria is met'
                      )}
                    </div>
                  </div>

                  {/* Helpful Info Box */}
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-100 mb-2">Placement Settings Guide</p>
                        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                          <li>• TPO details are visible to recruiters on the platform</li>
                          <li>• Eligibility criteria applies to all placement drives</li>
                          <li>• Auto-approval speeds up the application process</li>
                          <li>• You can always manually review and approve applications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Branding Section */}
          <div>
            {renderSectionHeader(
              'Branding & Theme',
              'Customize colors and upload institution logos',
              ImageIcon,
              'branding'
            )}

            {expandedSections.branding && (
              <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="space-y-8">
                  {/* Color Scheme */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/50 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      Color Scheme
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={brandingSettings.primaryColor}
                            onChange={(e) => updateBrandingSettings('primaryColor', e.target.value)}
                            className="w-20 h-20 rounded-xl cursor-pointer border-4 border-slate-200 dark:border-slate-700"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandingSettings.primaryColor}
                              onChange={(e) => updateBrandingSettings('primaryColor', e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Main brand color</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={brandingSettings.secondaryColor}
                            onChange={(e) => updateBrandingSettings('secondaryColor', e.target.value)}
                            className="w-20 h-20 rounded-xl cursor-pointer border-4 border-slate-200 dark:border-slate-700"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandingSettings.secondaryColor}
                              onChange={(e) => updateBrandingSettings('secondaryColor', e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Complementary color</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="color"
                            value={brandingSettings.accentColor}
                            onChange={(e) => updateBrandingSettings('accentColor', e.target.value)}
                            className="w-20 h-20 rounded-xl cursor-pointer border-4 border-slate-200 dark:border-slate-700"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={brandingSettings.accentColor}
                              onChange={(e) => updateBrandingSettings('accentColor', e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Highlight color</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color Preview */}
                    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Preview</p>
                      <div className="flex items-center gap-4">
                        <button
                          style={{ backgroundColor: brandingSettings.primaryColor }}
                          className="px-6 py-3 text-white rounded-xl font-bold shadow-lg"
                        >
                          Primary Button
                        </button>
                        <button
                          style={{ backgroundColor: brandingSettings.secondaryColor }}
                          className="px-6 py-3 text-white rounded-xl font-bold shadow-lg"
                        >
                          Secondary Button
                        </button>
                        <button
                          style={{ backgroundColor: brandingSettings.accentColor }}
                          className="px-6 py-3 text-white rounded-xl font-bold shadow-lg"
                        >
                          Accent Button
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Uploads */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      Institution Images
                    </h3>

                    <div className="space-y-6">
                      {renderFileUpload(
                        'College Logo',
                        brandingSettings.logoUrl,
                        (value) => updateBrandingSettings('logoUrl', value)
                      )}

                      {renderFileUpload(
                        'Cover Image',
                        brandingSettings.coverImageUrl,
                        (value) => updateBrandingSettings('coverImageUrl', value)
                      )}

                      {renderFileUpload(
                        'Favicon',
                        brandingSettings.faviconUrl,
                        (value) => updateBrandingSettings('faviconUrl', value)
                      )}
                    </div>

                    {/* Image Guidelines */}
                    <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Image Requirements</p>
                          <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                            <li>• <strong>Logo:</strong> Square format, 500x500px minimum, PNG with transparent background</li>
                            <li>• <strong>Cover Image:</strong> 1920x600px recommended, JPG or PNG</li>
                            <li>• <strong>Favicon:</strong> 32x32px or 64x64px, ICO or PNG format</li>
                            <li>• Maximum file size: 5MB per image</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Settings Section */}
          <div>
            {renderSectionHeader(
              'Notification Preferences',
              'Control how and when you receive updates',
              Bell,
              'notifications'
            )}

            {expandedSections.notifications && (
              <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border-2 border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                  {/* Communication Channels */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      Communication Channels
                    </h3>

                    <div className="space-y-4">
                      {renderToggle(
                        'Email Notifications',
                        notificationSettings.emailNotifications,
                        (value) => updateNotificationSettings('emailNotifications', value),
                        'Receive updates via email'
                      )}

                      {renderToggle(
                        'SMS Notifications',
                        notificationSettings.smsNotifications,
                        (value) => updateNotificationSettings('smsNotifications', value),
                        'Receive urgent updates via text message'
                      )}

                      {renderToggle(
                        'Push Notifications',
                        notificationSettings.pushNotifications,
                        (value) => updateNotificationSettings('pushNotifications', value),
                        'Browser and mobile app notifications'
                      )}
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/50 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      What You'll Receive
                    </h3>

                    <div className="space-y-4">
                      {renderToggle(
                        'Placement Updates',
                        notificationSettings.placementUpdates,
                        (value) => updateNotificationSettings('placementUpdates', value),
                        'New placements, offers, and recruitment updates'
                      )}

                      {renderToggle(
                        'Drive Reminders',
                        notificationSettings.driveReminders,
                        (value) => updateNotificationSettings('driveReminders', value),
                        'Upcoming placement drives and deadlines'
                      )}

                      {renderToggle(
                        'Application Status',
                        notificationSettings.applicationStatus,
                        (value) => updateNotificationSettings('applicationStatus', value),
                        'Student application approvals and updates'
                      )}

                      {renderToggle(
                        'Weekly Reports',
                        notificationSettings.weeklyReports,
                        (value) => updateNotificationSettings('weeklyReports', value),
                        'Summary of weekly placement activities'
                      )}

                      {renderToggle(
                        'Monthly Analytics',
                        notificationSettings.monthlyAnalytics,
                        (value) => updateNotificationSettings('monthlyAnalytics', value),
                        'Detailed monthly performance reports'
                      )}
                    </div>
                  </div>

                  {/* Notification Info */}
                  <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-800">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-teal-900 dark:text-teal-100 mb-2">Notification Management</p>
                        <ul className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
                          <li>• Critical system alerts cannot be disabled</li>
                          <li>• You can change these preferences anytime</li>
                          <li>• Email digests are sent based on your timezone</li>
                          <li>• SMS charges may apply based on your region</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed Bottom Bar */}
        {hasChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700 shadow-2xl z-50">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">You have unsaved changes</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Save your changes or discard them</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <X className="w-5 h-5" />
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-green-500/30"
                  >
                    <Save className="w-5 h-5" />
                    Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-2">Export Settings</h3>
            <p className="text-blue-100 text-sm">Download your configuration as backup</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-2">Preview Profile</h3>
            <p className="text-purple-100 text-sm">See how your profile looks to students</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black mb-2">Get Help</h3>
            <p className="text-green-100 text-sm">Contact support for assistance</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Data Privacy & Security</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                All information you provide is encrypted and stored securely. Your contact details are only visible to verified recruiters
                and placement partners. We comply with data protection regulations and never share your information with third parties
                without explicit consent.
              </p>
              <div className="flex items-center gap-4">
                <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2" onClick={() => navigate('/PrivacyPage')}>
                  <FileText className="w-4 h-4" />
                  Privacy Policy
                </button>
                <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2" onClick={() => navigate('/SecurityGuidelines')}>
                  <Shield className="w-4 h-4" />
                  Security Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Last updated: <span className="font-bold">2 minutes ago</span> by <span className="font-bold">Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}