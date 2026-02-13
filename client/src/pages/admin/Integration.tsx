import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  Code,
  Database,
  GitBranch,
  Users,
  Shield,
  Zap,
  RefreshCw,
  Plus,
  MoreVertical,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Eye,
  EyeOff,
  Settings,
  TestTube,
  Cpu,
  Cloud,
  Key,
  Link,
  Lock,
  Unlock,
  Server,
  Terminal,
  FileCode,
  Globe,
  Activity,
  TrendingUp,
  UserCheck,
  Calendar,
  Bell,
  HelpCircle,
  ChevronRight,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  PieChart,
  Globe as GlobeIcon,
  Layers,
  Cpu as CpuIcon
} from 'lucide-react';

// Types and Interfaces
interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  category: 'coding' | 'version-control' | 'assessment' | 'communication' | 'analytics' | 'infrastructure';
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'pending' | 'error';
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  lastSync: Date;
  nextSync: Date;
  usage: {
    requests: number;
    limit: number;
    bandwidth: number;
  };
  health: {
    uptime: number;
    latency: number;
    errors: number;
  };
  settings: {
    autoSync: boolean;
    webhookEnabled: boolean;
    notifications: boolean;
    dataRetention: number;
  };
  metadata: {
    version: string;
    provider: string;
    documentation: string;
    rateLimit: string;
  };
}

interface IntegrationStats {
  total: number;
  active: number;
  pending: number;
  error: number;
  totalRequests: number;
  totalBandwidth: number;
  averageLatency: number;
}

interface WebhookEvent {
  id: string;
  integrationId: string;
  event: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  payload: any;
  response: any;
}

interface SyncLog {
  id: string;
  integrationId: string;
  type: 'full' | 'partial' | 'manual';
  status: 'completed' | 'failed' | 'in-progress';
  itemsSynced: number;
  duration: number;
  timestamp: Date;
  error?: string;
}

// Mock Data
const integrationsData: IntegrationConfig[] = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    description: 'Sync coding challenges, submissions, and progress',
    category: 'coding',
    icon: <FileCode className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    secretKey: '••••••••••••••••',
    webhookUrl: 'https://api.nextgen.edu/webhooks/leetcode',
    lastSync: new Date('2026-02-02T14:30:00'),
    nextSync: new Date('2026-02-03T02:00:00'),
    usage: {
      requests: 12500,
      limit: 50000,
      bandwidth: 45.2
    },
    health: {
      uptime: 99.8,
      latency: 120,
      errors: 2
    },
    settings: {
      autoSync: true,
      webhookEnabled: true,
      notifications: true,
      dataRetention: 90
    },
    metadata: {
      version: 'v2.1',
      provider: 'LeetCode Inc.',
      documentation: 'https://docs.leetcode.com/api',
      rateLimit: '1000/hour'
    }
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    description: 'Competitive programming contests and rankings',
    category: 'coding',
    icon: <Cpu className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    webhookUrl: 'https://api.nextgen.edu/webhooks/codeforces',
    lastSync: new Date('2026-02-02T23:45:00'),
    nextSync: new Date('2026-02-03T01:00:00'),
    usage: {
      requests: 8900,
      limit: 10000,
      bandwidth: 32.1
    },
    health: {
      uptime: 99.5,
      latency: 180,
      errors: 5
    },
    settings: {
      autoSync: true,
      webhookEnabled: false,
      notifications: true,
      dataRetention: 180
    },
    metadata: {
      version: 'v1.0',
      provider: 'Codeforces',
      documentation: 'https://codeforces.com/apiHelp',
      rateLimit: '5000/day'
    }
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    description: 'Practice problems and contest participation',
    category: 'coding',
    icon: <Terminal className="w-5 h-5" />,
    status: 'pending',
    lastSync: new Date('2026-01-30T10:15:00'),
    nextSync: new Date('2026-02-03T03:00:00'),
    usage: {
      requests: 0,
      limit: 10000,
      bandwidth: 0
    },
    health: {
      uptime: 0,
      latency: 0,
      errors: 0
    },
    settings: {
      autoSync: false,
      webhookEnabled: false,
      notifications: false,
      dataRetention: 30
    },
    metadata: {
      version: 'v1.2',
      provider: 'Directi',
      documentation: 'https://www.codechef.com/api',
      rateLimit: '1000/hour'
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repository access and commit tracking',
    category: 'version-control',
    icon: <GitBranch className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    lastSync: new Date('2026-02-03T09:30:00'),
    nextSync: new Date('2026-02-03T12:00:00'),
    usage: {
      requests: 45200,
      limit: 50000,
      bandwidth: 125.8
    },
    health: {
      uptime: 99.9,
      latency: 85,
      errors: 1
    },
    settings: {
      autoSync: true,
      webhookEnabled: true,
      notifications: true,
      dataRetention: 365
    },
    metadata: {
      version: 'v3',
      provider: 'GitHub Inc.',
      documentation: 'https://docs.github.com/en/rest',
      rateLimit: '5000/hour'
    }
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Enterprise version control and CI/CD',
    category: 'version-control',
    icon: <Server className="w-5 h-5" />,
    status: 'inactive',
    lastSync: new Date('2025-12-15T16:20:00'),
    nextSync: new Date('2026-02-03T04:00:00'),
    usage: {
      requests: 1500,
      limit: 10000,
      bandwidth: 8.5
    },
    health: {
      uptime: 98.5,
      latency: 200,
      errors: 12
    },
    settings: {
      autoSync: false,
      webhookEnabled: false,
      notifications: false,
      dataRetention: 90
    },
    metadata: {
      version: 'v4',
      provider: 'GitLab Inc.',
      documentation: 'https://docs.gitlab.com/ee/api',
      rateLimit: '600/hour'
    }
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    description: 'Technical assessments and interviews',
    category: 'assessment',
    icon: <Code className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    secretKey: '••••••••••••••••',
    lastSync: new Date('2026-02-02T22:10:00'),
    nextSync: new Date('2026-02-03T05:00:00'),
    usage: {
      requests: 3200,
      limit: 10000,
      bandwidth: 18.9
    },
    health: {
      uptime: 99.2,
      latency: 150,
      errors: 3
    },
    settings: {
      autoSync: true,
      webhookEnabled: true,
      notifications: true,
      dataRetention: 180
    },
    metadata: {
      version: 'v2.0',
      provider: 'HackerRank',
      documentation: 'https://www.hackerrank.com/api/docs',
      rateLimit: '100/minute'
    }
  },
  {
    id: 'atcoder',
    name: 'AtCoder',
    description: 'Japanese programming contests',
    category: 'coding',
    icon: <Globe className="w-5 h-5" />,
    status: 'error',
    lastSync: new Date('2026-02-01T08:45:00'),
    nextSync: new Date('2026-02-03T06:00:00'),
    usage: {
      requests: 450,
      limit: 1000,
      bandwidth: 2.1
    },
    health: {
      uptime: 85.5,
      latency: 350,
      errors: 45
    },
    settings: {
      autoSync: false,
      webhookEnabled: false,
      notifications: true,
      dataRetention: 90
    },
    metadata: {
      version: 'v1.0',
      provider: 'AtCoder',
      documentation: 'https://atcoder.jp/contests/',
      rateLimit: '100/hour'
    }
  },
  {
    id: 'mongo',
    name: 'MongoDB Atlas',
    description: 'Database connection and analytics',
    category: 'infrastructure',
    icon: <Database className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    lastSync: new Date('2026-02-03T10:00:00'),
    nextSync: new Date('2026-02-03T11:00:00'),
    usage: {
      requests: 125000,
      limit: 1000000,
      bandwidth: 450.3
    },
    health: {
      uptime: 99.95,
      latency: 25,
      errors: 0
    },
    settings: {
      autoSync: true,
      webhookEnabled: true,
      notifications: true,
      dataRetention: 30
    },
    metadata: {
      version: 'v4.2',
      provider: 'MongoDB Inc.',
      documentation: 'https://docs.atlas.mongodb.com',
      rateLimit: '10000/minute'
    }
  },
  {
    id: 'aws',
    name: 'AWS Educate',
    description: 'Cloud computing resources for students',
    category: 'infrastructure',
    icon: <Cloud className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    secretKey: '••••••••••••••••',
    lastSync: new Date('2026-02-03T08:15:00'),
    nextSync: new Date('2026-02-03T14:00:00'),
    usage: {
      requests: 89000,
      limit: 500000,
      bandwidth: 890.5
    },
    health: {
      uptime: 99.99,
      latency: 45,
      errors: 0
    },
    settings: {
      autoSync: true,
      webhookEnabled: true,
      notifications: true,
      dataRetention: 60
    },
    metadata: {
      version: 'v3',
      provider: 'Amazon Web Services',
      documentation: 'https://docs.aws.amazon.com',
      rateLimit: '5000/second'
    }
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    category: 'communication',
    icon: <Users className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    webhookUrl: 'https://hooks.slack.com/services/xxx',
    lastSync: new Date('2026-02-03T11:15:00'),
    nextSync: new Date('2026-02-03T12:00:00'),
    usage: {
      requests: 12500,
      limit: 100000,
      bandwidth: 15.2
    },
    health: {
      uptime: 99.8,
      latency: 95,
      errors: 1
    },
    settings: {
      autoSync: true,
      webhookEnabled: true,
      notifications: true,
      dataRetention: 30
    },
    metadata: {
      version: 'v1',
      provider: 'Slack Technologies',
      documentation: 'https://api.slack.com',
      rateLimit: '100/minute'
    }
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    description: 'Course management and assignments',
    category: 'assessment',
    icon: <Activity className="w-5 h-5" />,
    status: 'pending',
    lastSync: new Date('2026-01-28T14:20:00'),
    nextSync: new Date('2026-02-03T15:00:00'),
    usage: {
      requests: 0,
      limit: 10000,
      bandwidth: 0
    },
    health: {
      uptime: 0,
      latency: 0,
      errors: 0
    },
    settings: {
      autoSync: false,
      webhookEnabled: false,
      notifications: false,
      dataRetention: 90
    },
    metadata: {
      version: 'v1',
      provider: 'Google',
      documentation: 'https://developers.google.com/classroom',
      rateLimit: '600/minute'
    }
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    description: 'Advanced analytics and reporting',
    category: 'analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    status: 'active',
    apiKey: '••••••••••••••••',
    lastSync: new Date('2026-02-03T07:30:00'),
    nextSync: new Date('2026-02-03T19:00:00'),
    usage: {
      requests: 5600,
      limit: 10000,
      bandwidth: 45.8
    },
    health: {
      uptime: 99.6,
      latency: 120,
      errors: 2
    },
    settings: {
      autoSync: true,
      webhookEnabled: false,
      notifications: true,
      dataRetention: 365
    },
    metadata: {
      version: 'v2.0',
      provider: 'Microsoft',
      documentation: 'https://docs.microsoft.com/power-bi',
      rateLimit: '200/minute'
    }
  }
];

const availableIntegrations = [
  {
    id: 'topcoder',
    name: 'TopCoder',
    category: 'coding',
    description: 'Crowdsourcing competitions',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'spoj',
    name: 'SPOJ',
    category: 'coding',
    description: 'Sphere Online Judge',
    icon: <UserCheck className="w-5 h-5" />
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    category: 'analytics',
    description: 'Data science competitions',
    icon: <Database className="w-5 h-5" />
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'assessment',
    description: 'Project management',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: 'zoom',
    name: 'Zoom',
    category: 'communication',
    description: 'Video conferencing',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'infrastructure',
    description: 'Error tracking',
    icon: <AlertCircle className="w-5 h-5" />
  }
];

// Enhanced Integration Card Component
const IntegrationCard: React.FC<{
  integration: IntegrationConfig;
  onConfigure: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onSync: (id: string) => void;
  isDark: boolean;
}> = ({ integration, onConfigure, onToggle, onSync, isDark }) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const statusConfig = {
    active: {
      color: isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-green-500/10 text-green-700 border-green-500/20',
      icon: <CheckCircle className="w-3 h-3" />,
      glow: 'shadow-green-500/10'
    },
    inactive: {
      color: isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-gray-500/10 text-gray-700 border-gray-500/20',
      icon: <X className="w-3 h-3" />,
      glow: ''
    },
    pending: {
      color: isDark ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      icon: <Clock className="w-3 h-3" />,
      glow: 'shadow-yellow-500/10'
    },
    error: {
      color: isDark ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20',
      icon: <AlertCircle className="w-3 h-3" />,
      glow: 'shadow-red-500/10'
    }
  };

  const categoryConfig = {
    coding: { color: 'from-blue-500 to-cyan-500', iconColor: 'text-blue-600', bg: 'bg-blue-500/10' },
    'version-control': { color: 'from-purple-500 to-pink-500', iconColor: 'text-purple-600', bg: 'bg-purple-500/10' },
    assessment: { color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-600', bg: 'bg-amber-500/10' },
    communication: { color: 'from-cyan-500 to-teal-500', iconColor: 'text-cyan-600', bg: 'bg-cyan-500/10' },
    analytics: { color: 'from-pink-500 to-rose-500', iconColor: 'text-pink-600', bg: 'bg-pink-500/10' },
    infrastructure: { color: 'from-indigo-500 to-violet-500', iconColor: 'text-indigo-600', bg: 'bg-indigo-500/10' }
  };

  const usagePercentage = (integration.usage.requests / integration.usage.limit) * 100;
  const isNearLimit = usagePercentage > 80;

  return (
    <div className={`group rounded-2xl border p-6 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/30' : 'bg-white/50 border-gray-200/50 hover:border-blue-300/50'
      } ${statusConfig[integration.status].glow}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${categoryConfig[integration.category].bg} ${integration.status === 'active' ? 'shadow-lg' : ''}`}>
            <div className={`${categoryConfig[integration.category].iconColor}`}>
              {integration.icon}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{integration.name}</h3>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[integration.status].color}`}>
                {statusConfig[integration.status].icon}
                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
              </span>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{integration.description}</p>
            <div className={`flex items-center gap-3 mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              <span className="flex items-center gap-1">
                <GlobeIcon className="w-3 h-3" />
                {integration.metadata.provider}
              </span>
              <span>v{integration.metadata.version}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onConfigure(integration.id)}
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100/50'}`}
        >
          <MoreVertical className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${integration.health.uptime > 99 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Uptime</div>
          </div>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{integration.health.uptime}%</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ZapIcon className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
            <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Latency</div>
          </div>
          <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {integration.health.latency}
            <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>ms</span>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldIcon className={`w-3 h-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
            <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Errors</div>
          </div>
          <div className={`text-xl font-bold ${integration.health.errors > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {integration.health.errors}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>API Usage</span>
          <span className={`font-semibold ${isNearLimit ? 'text-red-600' : 'text-blue-600'}`}>
            {integration.usage.requests.toLocaleString()} / {integration.usage.limit.toLocaleString()}
          </span>
        </div>
        <div className="relative">
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${isNearLimit
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {isNearLimit && (
            <div className="absolute -top-6 right-0 text-xs text-red-600 font-medium animate-pulse">
              Near Limit!
            </div>
          )}
        </div>
      </div>

      {integration.apiKey && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>API Credentials</span>
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              {showApiKey ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  Show
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <div className={`p-3 rounded-lg border font-mono text-sm ${isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-gradient-to-r from-gray-50 to-white border-gray-200 text-gray-800'
              }`}>
              {showApiKey ? integration.apiKey : '••••••••••••••••••••••••'}
            </div>
            <Key className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
          </div>
        </div>
      )}

      <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          <Clock className="w-4 h-4" />
          <span>Synced {integration.lastSync.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSync(integration.id)}
            disabled={integration.status === 'error'}
            className={`p-2 rounded-lg transition-all ${integration.status === 'error'
              ? 'text-gray-400 cursor-not-allowed'
              : isDark ? 'text-blue-400 hover:bg-white/10 hover:scale-105' : 'text-blue-600 hover:bg-blue-50 hover:scale-105'
              }`}
            title="Sync Now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggle(integration.id, integration.status === 'inactive')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${integration.status === 'active'
              ? (isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-lg shadow-red-500/5' : 'bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-md')
              : (isDark ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-md')
              }`}
          >
            {integration.status === 'active' ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Integration Stats Component
const IntegrationStats: React.FC<{ stats: IntegrationStats; isDark: boolean }> = ({ stats, isDark }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className={`p-6 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</div>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/15' : 'bg-blue-100'}`}>
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Total Integrations</div>
        <div className="flex items-center text-xs text-blue-600 mt-2">
          <TrendingUp className="w-3 h-3 mr-1" />
          +2 this month
        </div>
      </div>

      <div className={`p-6 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-green-50 to-white border-green-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`text-3xl font-bold ${isDark ? 'text-emerald-400' : 'text-green-600'}`}>{stats.active}</div>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/15' : 'bg-green-100'}`}>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Active</div>
        <div className="flex items-center text-xs text-green-600 mt-2">
          <Activity className="w-3 h-3 mr-1" />
          {((stats.active / stats.total) * 100).toFixed(1)}% operational
        </div>
      </div>

      <div className={`p-6 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-purple-50 to-white border-purple-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {(stats.totalRequests / 1000).toFixed(1)}K
          </div>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-violet-500/15' : 'bg-purple-100'}`}>
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>API Requests Today</div>
        <div className="flex items-center text-xs text-purple-600 mt-2">
          <PieChart className="w-3 h-3 mr-1" />
          {((stats.totalRequests / 100000) * 100).toFixed(1)}% capacity
        </div>
      </div>

      <div className={`p-6 rounded-2xl border backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-gradient-to-br from-amber-50 to-white border-amber-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.averageLatency}ms</div>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-amber-500/15' : 'bg-amber-100'}`}>
            <CpuIcon className="w-6 h-6 text-amber-600" />
          </div>
        </div>
        <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Avg Latency</div>
        <div className="flex items-center text-xs text-amber-600 mt-2">
          <Zap className="w-3 h-3 mr-1" />
          {stats.averageLatency < 100 ? 'Excellent' : 'Good'} performance
        </div>
      </div>
    </div>
  );
};

// Enhanced Webhook Events Component
const WebhookEvents: React.FC<{ events: WebhookEvent[]; isDark: boolean }> = ({ events, isDark }) => {
  const mockEvents: WebhookEvent[] = [
    { id: '1', integrationId: 'leetcode', event: 'submission.created', status: 'success', timestamp: new Date(), payload: {}, response: {} },
    { id: '2', integrationId: 'github', event: 'push', status: 'success', timestamp: new Date(), payload: {}, response: {} },
    { id: '3', integrationId: 'codeforces', event: 'contest.update', status: 'failed', timestamp: new Date(), payload: {}, response: {} },
    { id: '4', integrationId: 'slack', event: 'message.posted', status: 'success', timestamp: new Date(), payload: {}, response: {} },
    { id: '5', integrationId: 'hackerrank', event: 'test.completed', status: 'pending', timestamp: new Date(), payload: {}, response: {} }
  ];

  return (
    <div className={`backdrop-blur-sm rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200/50'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Webhook Events</h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Real-time integration events</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {mockEvents.slice(0, 5).map(event => (
          <div
            key={event.id}
            className={`group p-3 rounded-xl border transition-all ${isDark
              ? 'bg-white/5 border-white/5 hover:border-blue-500/30'
              : 'bg-gradient-to-r from-gray-50/50 to-white border-gray-200/30 hover:border-blue-200 hover:shadow-sm'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${event.status === 'success' ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-100 text-green-600') :
                  event.status === 'failed' ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600') :
                    (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-100 text-yellow-600')
                  }`}>
                  {event.status === 'success' ? <Check className="w-4 h-4" /> :
                    event.status === 'failed' ? <X className="w-4 h-4" /> :
                      <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{event.event}</div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded ${isDark ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-700'}`}>
                {event.integrationId}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Sync Logs Component
const SyncLogs: React.FC<{ logs: SyncLog[]; isDark: boolean }> = ({ logs, isDark }) => {
  const mockLogs: SyncLog[] = [
    { id: '1', integrationId: 'leetcode', type: 'full', status: 'completed', itemsSynced: 1250, duration: 45, timestamp: new Date() },
    { id: '2', integrationId: 'github', type: 'partial', status: 'completed', itemsSynced: 320, duration: 12, timestamp: new Date() },
    { id: '3', integrationId: 'codeforces', type: 'full', status: 'failed', itemsSynced: 0, duration: 0, timestamp: new Date(), error: 'API Limit Exceeded' },
    { id: '4', integrationId: 'aws', type: 'partial', status: 'completed', itemsSynced: 8900, duration: 180, timestamp: new Date() },
    { id: '5', integrationId: 'mongo', type: 'manual', status: 'in-progress', itemsSynced: 450, duration: 30, timestamp: new Date() }
  ];

  return (
    <div className={`backdrop-blur-sm rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200/50'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sync History</h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Recent synchronization activities</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>
      <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDark ? 'bg-white/10' : 'bg-gray-50'}`}>
                <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Integration</th>
                <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Status</th>
                <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Items</th>
                <th className={`py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Duration</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-200'}`}>
              {mockLogs.slice(0, 5).map(log => (
                <tr key={log.id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{log.integrationId}</div>
                    <div className="text-xs">
                      <span className={`inline-block px-2 py-0.5 rounded ${log.type === 'full' ? (isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800') :
                        log.type === 'partial' ? (isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-green-100 text-green-800') :
                          (isDark ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-800')
                        }`}>
                        {log.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'completed' ? 'bg-green-500' :
                        log.status === 'failed' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                      <span className={`font-medium capitalize ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{log.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{log.itemsSynced.toLocaleString()}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{log.duration}s</div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      {log.timestamp.toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Enhanced Quick Actions Component
const QuickActions: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const actions = [
    { icon: Download, label: 'Export Configuration', color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50' },
    { icon: Settings, label: 'Global Settings', color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-500/20' : 'bg-purple-50' },
    { icon: TestTube, label: 'Run Health Check', color: isDark ? 'text-green-400' : 'text-green-600', bg: isDark ? 'bg-green-500/20' : 'bg-green-50' },
    { icon: HelpCircle, label: 'Integration Docs', color: isDark ? 'text-amber-400' : 'text-amber-600', bg: isDark ? 'bg-amber-500/20' : 'bg-amber-50' },
  ];

  return (
    <div className={`backdrop-blur-sm rounded-2xl border p-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200/50'}`}>
      <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`group p-4 rounded-xl border transition-all duration-200 ${isDark
              ? 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-white/10'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-200 hover:shadow-md'
              }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`p-2 rounded-lg ${action.bg} group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{action.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced System Status Component
const SystemStatus: React.FC = () => {
  const systems = [
    { name: 'API Gateway', status: 'operational', color: 'bg-green-500' },
    { name: 'Webhook Service', status: 'operational', color: 'bg-green-500' },
    { name: 'Sync Engine', status: 'degraded', color: 'bg-yellow-500' },
    { name: 'Data Pipeline', status: 'operational', color: 'bg-green-500' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="dark:absolute inset-0 bg-gradient-to-br from-black-600 via-black-700 to-black-800" />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.1%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10" />

      <div className="relative p-6 dark:text-white text-black">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="dark:text-white font-bold text-xl mb-1">System Status</h3>
            <p className="dark:text-white/80 text-black/80">All services dashboard</p>
          </div>
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        <div className="space-y-4">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${system.color} animate-pulse`} />
                <span className="font-medium">{system.name}</span>
              </div>
              <span className="dark:text-white/80 text-black/80 capitalize">{system.status}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-black/30">
          <div className="dark:text-white/60 text-black/60">Last updated: Just now</div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Category Filter Component
const CategoryFilter: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}> = ({ selectedCategory, onCategoryChange, isDark }) => {
  const categories = [
    { id: 'all', label: 'All', icon: Layers, color: isDark ? 'bg-white/5 text-slate-300 border border-white/10' : 'bg-gray-100 text-gray-700' },
    { id: 'coding', label: 'Coding', icon: Code, color: isDark ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-blue-100 text-blue-700' },
    { id: 'version-control', label: 'Version Control', icon: GitBranch, color: isDark ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-purple-100 text-purple-700' },
    { id: 'assessment', label: 'Assessments', icon: FileCode, color: isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-amber-100 text-amber-700' },
    { id: 'communication', label: 'Communication', icon: Users, color: isDark ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-3">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${selectedCategory === category.id
            ? (isDark ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25')
            : `${category.color} hover:shadow-md hover:scale-[1.02]`
            }`}
        >
          <category.icon className="w-4 h-4" />
          {category.label}
        </button>
      ))}
    </div>
  );
};

// Enhanced Search Bar Component
const SearchBar: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDark: boolean;
}> = ({ value, onChange, placeholder = "Search integrations...", isDark }) => {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`h-5 w-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`block w-full pl-10 pr-4 py-3 border rounded-2xl backdrop-blur-sm focus:ring-2 focus:outline-none transition-all ${isDark
          ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:ring-blue-500/20 focus:border-blue-500/60'
          : 'bg-white/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className={`h-4 w-4 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`} />
        </button>
      )}
    </div>
  );
};

// Add Integration Modal
const AddIntegrationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (integrationId: string) => void;
  isDark: boolean;
}> = ({ isOpen, onClose, onAdd, isDark }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'coding', name: 'Coding Platforms' },
    { id: 'version-control', name: 'Version Control' },
    { id: 'assessment', name: 'Assessments' },
    { id: 'communication', name: 'Communication' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'infrastructure', name: 'Infrastructure' }
  ];

  const filteredIntegrations = availableIntegrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl ${isDark ? 'bg-[#0f1117] border border-white/10' : 'bg-white'}`}>
        <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Integration</h2>
              <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Connect with platforms to enhance student learning and placement tracking</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white/50 border-gray-300'
                  }`}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map(integration => (
              <div key={integration.id} className={`rounded-xl p-4 border transition-all ${isDark
                ? 'bg-white/5 border-white/5 hover:border-blue-500/50 hover:bg-white/10'
                : 'bg-white/50 border-gray-200 hover:border-blue-500 hover:shadow-xl'
                }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${integration.category === 'coding' ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800') :
                    integration.category === 'version-control' ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-800') :
                      integration.category === 'assessment' ? (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-800') :
                        integration.category === 'communication' ? (isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-800') :
                          integration.category === 'analytics' ? (isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-800') :
                            (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-800')
                    }`}>
                    {integration.icon}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${isDark ? 'bg-white/10 text-slate-300' : 'bg-gray-100 text-gray-800'}`}>
                    {integration.category}
                  </span>
                </div>
                <h4 className={`font-semibold text-lg mb-1 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{integration.name}</h4>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{integration.description}</p>
                <button
                  onClick={() => onAdd(integration.id)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium transition-all"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No integrations found</div>
              <div className="text-sm text-gray-500">Try a different search term or category</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Integrations Page Component
const IntegrationsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(integrationsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const stats: IntegrationStats = {
    total: integrations.length,
    active: integrations.filter(i => i.status === 'active').length,
    pending: integrations.filter(i => i.status === 'pending').length,
    error: integrations.filter(i => i.status === 'error').length,
    totalRequests: integrations.reduce((sum, i) => sum + i.usage.requests, 0),
    totalBandwidth: integrations.reduce((sum, i) => sum + i.usage.bandwidth, 0),
    averageLatency: Math.round(
      integrations.filter(i => i.health.latency > 0)
        .reduce((sum, i) => sum + i.health.latency, 0) /
      integrations.filter(i => i.health.latency > 0).length
    )
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleIntegration = (id: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id
        ? {
          ...integration,
          status: enabled ? 'active' : 'inactive',
          settings: { ...integration.settings, autoSync: enabled }
        }
        : integration
    ));
  };

  const handleSyncIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id
        ? {
          ...integration,
          lastSync: new Date(),
          nextSync: new Date(Date.now() + 3600000)
        }
        : integration
    ));
  };

  const handleAddIntegration = (integrationId: string) => {
    const newIntegration: IntegrationConfig = {
      id: integrationId,
      name: integrationId.charAt(0).toUpperCase() + integrationId.slice(1),
      description: 'New integration - configuration required',
      category: 'coding',
      icon: <Plus className="w-5 h-5" />,
      status: 'pending',
      lastSync: new Date(),
      nextSync: new Date(Date.now() + 86400000),
      usage: {
        requests: 0,
        limit: 10000,
        bandwidth: 0
      },
      health: {
        uptime: 0,
        latency: 0,
        errors: 0
      },
      settings: {
        autoSync: false,
        webhookEnabled: false,
        notifications: false,
        dataRetention: 30
      },
      metadata: {
        version: 'v1.0',
        provider: 'Third Party',
        documentation: '#',
        rateLimit: '100/hour'
      }
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setShowAddModal(false);
    setSelectedIntegration(newIntegration);
    setShowConfigModal(true);
  };

  const handleConfigureIntegration = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      setSelectedIntegration(integration);
      setShowConfigModal(true);
    }
  };

  const ConfigModal: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const [formData, setFormData] = useState(selectedIntegration!);
    const [testResults, setTestResults] = useState<{ success: boolean; message: string } | null>(null);

    if (!selectedIntegration || !showConfigModal) return null;

    const handleInputChange = (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [field]: value
        }
      }));
    };

    const handleTestConnection = () => {
      setTestResults(null);
      setTimeout(() => {
        const success = Math.random() > 0.3;
        setTestResults({
          success,
          message: success
            ? 'Connection successful! All endpoints are responding.'
            : 'Connection failed. Please check your credentials.'
        });
      }, 1500);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className={`rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl ${isDark ? 'bg-[#0f1117] border border-white/10' : 'bg-white'
          }`}>
          <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Configure {selectedIntegration.name}</h2>
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Set up API credentials and sync settings</p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-slate-200' : 'text-black'}`}>API Credentials</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    API Key
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={formData.apiKey || ''}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      className={`flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white/50 border-gray-300'
                        }`}
                      placeholder="Enter API key"
                    />
                    <button className={`px-4 py-2 rounded-lg transition-colors font-medium ${isDark ? 'bg-white/10 text-slate-200 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                      Regenerate
                    </button>
                  </div>
                </div>

                {selectedIntegration.secretKey !== undefined && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      Secret Key
                    </label>
                    <input
                      type="password"
                      value={formData.secretKey || ''}
                      onChange={(e) => handleInputChange('secretKey', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white/50 border-gray-300'
                        }`}
                      placeholder="Enter secret key"
                    />
                  </div>
                )}

                {selectedIntegration.webhookUrl !== undefined && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      value={formData.webhookUrl || ''}
                      onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white/50 border-gray-300'
                        }`}
                      placeholder="https://api.example.com/webhooks"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-slate-200' : 'text-black'}`}>Sync Settings</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50/50'}`}>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Auto Sync</div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Automatically sync data at scheduled intervals</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.autoSync}
                      onChange={(e) => handleNestedChange('settings', 'autoSync', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDark ? 'bg-slate-700 peer-checked:bg-blue-600' : 'peer-checked:bg-blue-600'
                      }`}></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50/50'}`}>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Webhook Notifications</div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Receive real-time updates via webhooks</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.webhookEnabled}
                      onChange={(e) => handleNestedChange('settings', 'webhookEnabled', e.target.checked)}
                      className="sr-only peer"
                      disabled={!formData.webhookUrl}
                    />
                    <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${formData.settings.webhookEnabled ? 'bg-blue-600' : (isDark ? 'bg-slate-700' : 'bg-gray-200')
                      } ${!formData.webhookUrl ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50/50'}`}>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Email Notifications</div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Receive email alerts for sync failures</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.notifications}
                      onChange={(e) => handleNestedChange('settings', 'notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDark ? 'bg-slate-700 peer-checked:bg-blue-600' : 'peer-checked:bg-blue-600'
                      }`}></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-slate-200' : 'text-black'}`}>Data Retention</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Keep data for</span>
                  <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{formData.settings.dataRetention} days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="730"
                  step="1"
                  value={formData.settings.dataRetention}
                  onChange={(e) => handleNestedChange('settings', 'dataRetention', parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
                />
                <div className={`flex justify-between text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                  <span>1 week</span>
                  <span>6 months</span>
                  <span>2 years</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg backdrop-blur-sm ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-50/50'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>Test Connection</div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Verify your credentials and connectivity</div>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={!formData.apiKey}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  {testResults ? 'Test Again' : 'Test Connection'}
                </button>
              </div>

              {testResults && (
                <div className={`p-3 rounded-lg ${testResults.success
                  ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-50 text-green-800')
                  : (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-800')
                  }`}>
                  <div className="flex items-center">
                    {testResults.success ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    <span>{testResults.message}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={`flex space-x-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowConfigModal(false)}
                className={`flex-1 py-3 px-4 border rounded-lg font-medium transition-colors ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIntegrations(prev => prev.map(integration =>
                    integration.id === formData.id ? formData : integration
                  ));
                  setShowConfigModal(false);
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-background text-slate-100' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900'} relative overflow-hidden`}>
      {/* Premium Background Glows */}
      {isDark && (
        <div className="premium-glow-bg">
          <div className="premium-glow-1" />
          <div className="premium-glow-2" />
          <div className="premium-glow-3" />
        </div>
      )}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Integrations</h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-lg`}>Connect with external platforms and services</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Integration</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 blur transition-opacity -z-10" />
          </button>
        </div>

        <IntegrationStats stats={stats} isDark={isDark} />

        <div className="space-y-4 mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search integrations by name, description, or category..."
            isDark={isDark}
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isDark={isDark}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Connected Platforms</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Showing {filteredIntegrations.length} of {integrations.length} integrations
                </p>
              </div>
              <div className={`text-sm font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm ${isDark ? 'bg-white/10 text-slate-300' : 'bg-white/50 text-gray-700'}`}>
                {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              </div>
            </div>

            {filteredIntegrations.length === 0 ? (
              <div className={`backdrop-blur-sm rounded-2xl border p-12 text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-gray-200/50'}`}>
                <div className={`inline-flex p-4 rounded-2xl mb-4 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                  <Search className={`w-8 h-8 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No integrations found</h3>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Try a different search term or category</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add New Integration
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConfigure={handleConfigureIntegration}
                    onToggle={handleToggleIntegration}
                    onSync={handleSyncIntegration}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <WebhookEvents events={[]} isDark={isDark} />
            <SyncLogs logs={[]} isDark={isDark} />
            <QuickActions isDark={isDark} />
            <SystemStatus />
          </div>
        </div>
      </div>

      <AddIntegrationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddIntegration}
        isDark={isDark}
      />

      {showConfigModal && selectedIntegration && <ConfigModal isDark={isDark} />}
    </div>
  );
};

export default IntegrationsPage;