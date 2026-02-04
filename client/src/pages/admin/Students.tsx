import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Clock,
  Code,
  Cpu,
  Download,
  Edit,
  Eye,
  FileCode,
  Filter,
  Github,
  GraduationCap,
  Grid,
  Linkedin,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RotateCcw,
  School,
  Search,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types and Interfaces
interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  batch: string;
  semester: number;
  cgpa: number;
  attendance: number;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Graduated' | 'Dropout';
  placementStatus: 'Placed' | 'Unplaced' | 'Interviewing' | 'Internship' | 'PPO';
  placementCompany?: string;
  placementPackage?: number;
  leetcodeSolved: number;
  codeforcesRating?: number;
  githubCommits: number;
  hackerRankScore: number;
  skills: string[];
  projects: number;
  certifications: number;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  lastActive: Date;
  enrolledDate: Date;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  guardian: {
    name: string;
    phone: string;
    email?: string;
    relationship: string;
  };
  performance: {
    academic: number;
    technical: number;
    communication: number;
    leadership: number;
    overall: number;
  };
  notes?: string;
  tags: string[];
  avatar?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  totalStudents: number;
  placementRate: number;
  avgCGPA: number;
}

interface Batch {
  year: string;
  totalStudents: number;
  placed: number;
  averagePackage: number;
}

interface PlacementStats {
  totalPlaced: number;
  totalUnplaced: number;
  totalInterviewing: number;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  topCompanies: string[];
}

interface PerformanceMetric {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
}

interface FilterOptions {
  department: string[];
  batch: string[];
  status: string[];
  placementStatus: string[];
  gender: string[];
  semester: number[];
  cgpaRange: [number, number];
  skills: string[];
  searchTerm: string;
}

interface ColumnConfig {
  id: keyof Student | string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: number;
}

// Mock Data
const departments: Department[] = [
  { id: 'cse', name: 'Computer Science', code: 'CSE', totalStudents: 450, placementRate: 92, avgCGPA: 8.6 },
  { id: 'it', name: 'Information Technology', code: 'IT', totalStudents: 320, placementRate: 88, avgCGPA: 8.2 },
  { id: 'ece', name: 'Electronics & Communication', code: 'ECE', totalStudents: 380, placementRate: 85, avgCGPA: 8.1 },
  { id: 'eee', name: 'Electrical & Electronics', code: 'EEE', totalStudents: 280, placementRate: 82, avgCGPA: 8.0 },
  { id: 'mech', name: 'Mechanical', code: 'MECH', totalStudents: 350, placementRate: 78, avgCGPA: 7.8 },
  { id: 'civil', name: 'Civil', code: 'CIVIL', totalStudents: 300, placementRate: 75, avgCGPA: 7.6 },
  { id: 'ai', name: 'Artificial Intelligence', code: 'AI', totalStudents: 120, placementRate: 96, avgCGPA: 9.1 },
  { id: 'ds', name: 'Data Science', code: 'DS', totalStudents: 100, placementRate: 94, avgCGPA: 9.0 },
];

const batches: Batch[] = [
  { year: '2026', totalStudents: 1250, placed: 1050, averagePackage: 24.5 },
  { year: '2025', totalStudents: 1180, placed: 1120, averagePackage: 22.8 },
  { year: '2024', totalStudents: 1100, placed: 1080, averagePackage: 21.5 },
  { year: '2023', totalStudents: 1050, placed: 1020, averagePackage: 20.2 },
];

const studentsData: Student[] = Array.from({ length: 150 }, (_, i) => {
  const departmentsList = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI', 'DS'];
  const dept = departmentsList[Math.floor(Math.random() * departmentsList.length)];
  const batchYears = ['2026', '2025', '2024', '2023'];
  const batch = batchYears[Math.floor(Math.random() * batchYears.length)];
  const statuses: Student['status'][] = ['Active', 'Inactive', 'Suspended', 'Graduated', 'Dropout'];
  const placementStatuses: Student['placementStatus'][] = ['Placed', 'Unplaced', 'Interviewing', 'Internship', 'PPO'];
  const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Adobe', 'Goldman Sachs', 'JP Morgan', 'TCS', 'Infosys', 'Wipro'];
  
  return {
    id: `STU${String(i + 1).padStart(5, '0')}`,
    rollNumber: `22${dept}${String(Math.floor(Math.random() * 200)).padStart(3, '0')}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@college.edu`,
    phone: `+91 ${Math.floor(Math.random() * 10000000000)}`,
    dateOfBirth: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    department: dept,
    batch,
    semester: Math.floor(Math.random() * 8) + 1,
    cgpa: Number((6 + Math.random() * 4).toFixed(2)),
    attendance: Math.floor(Math.random() * 30 + 70),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    placementStatus: placementStatuses[Math.floor(Math.random() * placementStatuses.length)],
    placementCompany: Math.random() > 0.6 ? companies[Math.floor(Math.random() * companies.length)] : undefined,
    placementPackage: Math.random() > 0.6 ? Math.floor(Math.random() * 20 + 15) : undefined,
    leetcodeSolved: Math.floor(Math.random() * 500),
    codeforcesRating: Math.random() > 0.4 ? Math.floor(Math.random() * 2000 + 1000) : undefined,
    githubCommits: Math.floor(Math.random() * 1000),
    hackerRankScore: Math.floor(Math.random() * 500),
    skills: ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker'].slice(0, Math.floor(Math.random() * 5) + 1),
    projects: Math.floor(Math.random() * 10),
    certifications: Math.floor(Math.random() * 8),
    resumeUrl: `https://resume.student${i + 1}.pdf`,
    linkedinUrl: `https://linkedin.com/in/student${i + 1}`,
    githubUrl: `https://github.com/student${i + 1}`,
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    enrolledDate: new Date(2022 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    address: {
      street: `${Math.floor(Math.random() * 100)} Street`,
      city: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'][Math.floor(Math.random() * 7)],
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal'][Math.floor(Math.random() * 6)],
      country: 'India',
      pincode: `${Math.floor(Math.random() * 900000) + 100000}`,
    },
    guardian: {
      name: `Guardian ${i + 1}`,
      phone: `+91 ${Math.floor(Math.random() * 10000000000)}`,
      email: `guardian${i + 1}@email.com`,
      relationship: Math.random() > 0.5 ? 'Father' : 'Mother',
    },
    performance: {
      academic: Math.floor(Math.random() * 40 + 60),
      technical: Math.floor(Math.random() * 40 + 60),
      communication: Math.floor(Math.random() * 40 + 60),
      leadership: Math.floor(Math.random() * 40 + 60),
      overall: Math.floor(Math.random() * 40 + 60),
    },
    notes: Math.random() > 0.7 ? `Special note for student ${i + 1}` : undefined,
    tags: ['Top Performer', 'Needs Improvement', 'Leadership', 'Research'][Math.random() > 0.7 ? 0 : 1] ? ['Top Performer'] : [],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
  };
});

// Component: Student Card
const StudentCard: React.FC<{
  student: Student;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMessage: (id: string) => void;
}> = ({ student, onView, onEdit, onDelete, onMessage }) => {
  const getStatusVariant = (status: Student['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Suspended': return 'destructive';
      case 'Graduated': return 'outline';
      case 'Dropout': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPlacementVariant = (status: Student['placementStatus']) => {
    switch (status) {
      case 'Placed': return 'default';
      case 'Unplaced': return 'destructive';
      case 'Interviewing': return 'outline';
      case 'Internship': return 'secondary';
      case 'PPO': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 group border-border/50 hover:border-primary/20">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-full border-2 border-border shadow-sm"
              />
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card ${
                student.status === 'Active' ? 'bg-green-500' :
                student.status === 'Inactive' ? 'bg-muted-foreground' :
                'bg-destructive'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate mb-1">{student.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{student.rollNumber}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={getStatusVariant(student.status) as any} className="text-xs">
                  {student.status}
                </Badge>
                <Badge variant={getPlacementVariant(student.placementStatus) as any} className="text-xs">
                  {student.placementStatus}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onView(student.id)}
              title="View Details"
              className="h-8 w-8"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(student.id)}
              title="Edit"
              className="h-8 w-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics - Simplified */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">CGPA</div>
            <div className="text-lg font-bold text-foreground">{student.cgpa}</div>
          </div>
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Attendance</div>
            <div className="text-lg font-bold text-foreground">{student.attendance}%</div>
          </div>
          <div className="text-center p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Projects</div>
            <div className="text-lg font-bold text-foreground">{student.projects}</div>
          </div>
        </div>

        {/* Placement Info - Only if placed */}
        {student.placementCompany && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg border border-green-200 dark:border-green-800/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Placed at</div>
                <div className="font-semibold text-base text-green-800 dark:text-green-200">{student.placementCompany}</div>
                <div className="text-sm text-green-700 dark:text-green-300 mt-0.5">₹{student.placementPackage}L</div>
              </div>
              <Badge variant="default" className="bg-green-600 dark:bg-green-500 text-white">
                Placed
              </Badge>
            </div>
          </div>
        )}

        {/* Department & Skills - Simplified */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 mr-2 text-primary" />
            <span>{student.department} • Semester {student.semester}</span>
          </div>
          {student.skills.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-2">Top Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {student.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{student.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(student.id)}
            className="text-xs"
          >
            View Details
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" asChild className="h-7 w-7">
              <a href={`mailto:${student.email}`} title="Email">
                <Mail className="w-3.5 h-3.5" />
              </a>
            </Button>
            {student.linkedinUrl && (
              <Button variant="ghost" size="icon-sm" asChild className="h-7 w-7">
                <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component: Student Table
const StudentTable: React.FC<{
  students: Student[];
  selectedStudents: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMessage: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}> = ({ students, selectedStudents, onSelect, onSelectAll, onView, onEdit, onDelete, onMessage, sortBy, sortOrder, onSort }) => {
  const getStatusVariant = (status: Student['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Suspended': return 'destructive';
      case 'Graduated': return 'outline';
      case 'Dropout': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPlacementVariant = (status: Student['placementStatus']) => {
    switch (status) {
      case 'Placed': return 'default';
      case 'Unplaced': return 'destructive';
      case 'Interviewing': return 'outline';
      case 'Internship': return 'secondary';
      case 'PPO': return 'default';
      default: return 'secondary';
    }
  };

  const columns: ColumnConfig[] = [
    { id: 'select', label: '', visible: true, sortable: false, width: 50 },
    { id: 'name', label: 'Name', visible: true, sortable: true, width: 200 },
    { id: 'rollNumber', label: 'Roll No.', visible: true, sortable: true, width: 120 },
    { id: 'department', label: 'Department', visible: true, sortable: true, width: 150 },
    { id: 'batch', label: 'Batch', visible: true, sortable: true, width: 100 },
    { id: 'cgpa', label: 'CGPA', visible: true, sortable: true, width: 100 },
    { id: 'placementStatus', label: 'Placement', visible: true, sortable: true, width: 140 },
    { id: 'leetcodeSolved', label: 'LeetCode', visible: true, sortable: true, width: 100 },
    { id: 'githubCommits', label: 'GitHub', visible: true, sortable: true, width: 100 },
    { id: 'status', label: 'Status', visible: true, sortable: true, width: 120 },
    { id: 'actions', label: 'Actions', visible: true, sortable: false, width: 150 },
  ];

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-50 border-green-200';
      case 'Inactive': return 'text-gray-700 bg-black border-gray-200';
      case 'Suspended': return 'text-red-700 bg-red-50 border-red-200';
      case 'Graduated': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Dropout': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPlacementColor = (status: Student['placementStatus']) => {
    switch (status) {
      case 'Placed': return 'text-green-700 bg-green-50 border-green-200';
      case 'Unplaced': return 'text-red-700 bg-red-50 border-red-200';
      case 'Interviewing': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Internship': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'PPO': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const renderCell = (student: Student, column: ColumnConfig) => {
    switch (column.id) {
      case 'select':
        return (
          <input
            type="checkbox"
            checked={selectedStudents.has(student.id)}
            onChange={() => onSelect(student.id)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        );
      
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-8 h-8 rounded-full border border-border"
            />
            <div>
              <div className="font-medium text-foreground">{student.name}</div>
              <div className="text-sm text-muted-foreground">{student.email}</div>
            </div>
          </div>
        );
      
      case 'cgpa':
        return (
          <div className="flex items-center">
            <div className="w-16 bg-black rounded-full h-2 mr-2">
              <div
                className={`h-2 rounded-full ${
                  student.cgpa >= 8.5 ? 'bg-green-500' :
                  student.cgpa >= 7.5 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(student.cgpa / 10) * 100}%` }}
              />
            </div>
            <span className="font-medium">{student.cgpa}</span>
          </div>
        );
      
      case 'placementStatus':
        return (
          <div className="flex items-center gap-2">
            <Badge variant={getPlacementVariant(student.placementStatus) as any}>
              {student.placementStatus}
            </Badge>
            {student.placementCompany && (
              <span className="text-xs text-muted-foreground">• {student.placementCompany}</span>
            )}
          </div>
        );
      
      case 'status':
        return (
          <Badge variant={getStatusVariant(student.status) as any}>
            {student.status}
          </Badge>
        );
      
      case 'leetcodeSolved':
        return (
          <div className="flex items-center">
            <Code className="w-4 h-4 mr-2 text-orange-500" />
            <span className="font-medium">{student.leetcodeSolved}</span>
          </div>
        );
      
      case 'githubCommits':
        return (
          <div className="flex items-center">
            <Github className="w-4 h-4 mr-2 text-gray-800" />
            <span className="font-medium">{student.githubCommits}</span>
          </div>
        );
      
      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onView(student.id)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(student.id)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onMessage(student.id)}
              title="Send Message"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(student.id)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      
      default:
        return <span>{student[column.id as keyof Student] as string}</span>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              {columns.map(column => (
                <th
                  key={column.id}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.id === 'select' ? (
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === students.length && students.length > 0}
                      onChange={onSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  ) : column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => column.sortable && onSort(column.id)}
                      className="h-auto p-0 font-medium uppercase tracking-wider hover:bg-transparent"
                    >
                      <span>{column.label}</span>
                      {sortBy === column.id && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </Button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map(student => (
              <tr
                key={student.id}
                className={`hover:bg-muted/50 ${
                  selectedStudents.has(student.id) ? 'bg-primary/5' : ''
                }`}
              >
                {columns.map(column => (
                  <td
                    key={`${student.id}-${column.id}`}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {renderCell(student, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Component: Stats Cards
const StatsCards: React.FC<{
  totalStudents: number;
  activeStudents: number;
  placedStudents: number;
  avgCGPA: number;
  placementRate: number;
  avgAttendance: number;
}> = ({ totalStudents, activeStudents, placedStudents, avgCGPA, placementRate, avgAttendance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2%
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{totalStudents.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Students</div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-muted-foreground">
              {((activeStudents / totalStudents) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{activeStudents.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Active Students</div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <Target className="w-3 h-3 mr-1" />
              {placementRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-2xl font-bold text-primary mb-1">{placedStudents.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Placed Students</div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.2
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{avgCGPA.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Average CGPA</div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs text-muted-foreground">
              {avgAttendance > 85 ? 'Good' : 'Needs improvement'}
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">{avgAttendance.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">Avg Attendance</div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
            <div className="text-xs text-muted-foreground">8 depts</div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">8</div>
          <div className="text-sm text-muted-foreground">Departments</div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component: Department Performance
const DepartmentPerformance: React.FC<{ departments: Department[] }> = ({ departments }) => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Department Performance</CardTitle>
          <Button variant="ghost" size="sm" className="text-sm">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.slice(0, 3).map(dept => (
            <div key={dept.id} className="p-4 hover:bg-muted/30 dark:hover:bg-muted/20 rounded-lg transition-colors border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 flex items-center justify-center text-white font-bold text-sm">
                    {dept.code}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{dept.name}</div>
                    <div className="text-xs text-muted-foreground">{dept.totalStudents} students</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{dept.placementRate}%</div>
                  <div className="text-xs text-muted-foreground">Placement</div>
                </div>
              </div>
              <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600"
                  style={{ width: `${dept.placementRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component: Performance Metrics
const PerformanceMetrics: React.FC<{ student?: Student }> = ({ student }) => {
  const metrics: PerformanceMetric[] = student ? [
    { label: 'Academic', value: student.performance.academic, max: 100, color: 'text-primary', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Technical', value: student.performance.technical, max: 100, color: 'text-orange-600 dark:text-orange-400', icon: <Code className="w-4 h-4" /> },
    { label: 'Communication', value: student.performance.communication, max: 100, color: 'text-green-600 dark:text-green-400', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Leadership', value: student.performance.leadership, max: 100, color: 'text-purple-600 dark:text-purple-400', icon: <Users className="w-4 h-4" /> },
  ] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <div key={metric.label} className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={metric.color.replace('text-', 'stroke-')}
                  strokeDasharray={`${(metric.value / metric.max) * 251} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                <div className="text-xs text-gray-500">/100</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center space-x-1">
              {metric.icon}
              <span className="font-medium">{metric.label}</span>
            </div>
          </div>
        ))}
      </div>
      {student && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Overall Performance</div>
              <div className="text-2xl font-bold text-foreground">{student.performance.overall}/100</div>
            </div>
            <Badge variant={student.performance.overall >= 80 ? 'default' : student.performance.overall >= 60 ? 'secondary' : 'destructive'}>
              {student.performance.overall >= 80 ? 'Excellent' :
               student.performance.overall >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  );
};

// Component: Student Detail Modal
const StudentDetailModal: React.FC<{
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onMessage: (id: string) => void;
}> = ({ student, isOpen, onClose, onEdit, onMessage }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'placement' | 'skills' | 'activity'>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'academic', label: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'placement', label: 'Placement', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card text-foreground rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex border border-border/60 shadow-elevated">
        {/* Sidebar */}
        <div className="w-80 border-r border-border/60 bg-card/80">
          <div className="p-6 border-b border-border/60">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Student Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="text-muted-foreground">{student.rollNumber}</p>
              <p className="text-sm text-muted-foreground">{student.department} • Batch {student.batch}</p>
              
              <div className="flex items-center space-x-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  student.status === 'Active' ? 'bg-green-100 text-green-800' :
                  student.status === 'Inactive' ? 'bg-black-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {student.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  student.placementStatus === 'Placed' ? 'bg-green-100 text-green-800' :
                  student.placementStatus === 'Unplaced' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {student.placementStatus}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-4 h-4 mr-3" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-3" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-3" />
                <span>DOB: {student.dateOfBirth.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-3" />
                <span>{student.address.city}, {student.address.state}</span>
              </div>
            </div>

            <div className="mt-8">
              <div className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</div>
              <div className="space-y-2">
                <button
                  onClick={() => onEdit(student.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Edit className="w-4 h-4 text-blue-600" />
                    <span>Edit Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => onMessage(student.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span>Send Message</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="w-4 h-4 text-purple-600" />
                    <span>Download Resume</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clipboard className="w-4 h-4 text-orange-600" />
                    <span>View Reports</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-black-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <PerformanceMetrics student={student} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-xl border border-border/60 p-6">
                    <h4 className="font-semibold mb-4">Academic Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CGPA</span>
                        <span className="font-bold">{student.cgpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Semester</span>
                        <span className="font-bold">{student.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Attendance</span>
                        <span className="font-bold">{student.attendance}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certifications</span>
                        <span className="font-bold">{student.certifications}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border/60 p-6">
                    <h4 className="font-semibold mb-4">Technical Profile</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">LeetCode Solved</span>
                        <span className="font-bold">{student.leetcodeSolved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GitHub Commits</span>
                        <span className="font-bold">{student.githubCommits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HackerRank Score</span>
                        <span className="font-bold">{student.hackerRankScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Projects</span>
                        <span className="font-bold">{student.projects}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border/60 p-6">
                    <h4 className="font-semibold mb-4">Placement Details</h4>
                    {student.placementCompany ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company</span>
                          <span className="font-bold">{student.placementCompany}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Package</span>
                          <span className="font-bold">₹{student.placementPackage}L</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className={`font-bold ${
                            student.placementStatus === 'Placed' ? 'text-green-600' :
                            student.placementStatus === 'PPO' ? 'text-purple-600' :
                            'text-yellow-600'
                          }`}>
                            {student.placementStatus}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                        <div className="text-muted-foreground">No placement information</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border/60 p-6">
                  <h4 className="font-semibold mb-4">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-muted text-foreground/90 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border/60 p-6">
                  <h4 className="font-semibold mb-4">Academic Performance</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>CGPA Progress</span>
                        <span>{student.cgpa}/10.0</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${(student.cgpa / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Attendance</span>
                        <span>{student.attendance}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            student.attendance >= 85 ? 'bg-green-500' :
                            student.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl border border-border/60 p-6">
                    <h4 className="font-semibold mb-4">Semester Results</h4>
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-muted-foreground">Semester {i + 1}</span>
                          <span className="font-bold">
                            {i < student.semester ? (8 + Math.random() * 2).toFixed(2) : '--'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border/60 p-6">
                    <h4 className="font-semibold mb-4">Coding Platforms</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-500/15 text-orange-400 rounded-lg">
                            <Code className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium">LeetCode</div>
                            <div className="text-sm text-muted-foreground">{student.leetcodeSolved} problems solved</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{student.leetcodeSolved}</div>
                          <div className="text-xs text-muted-foreground">Problems</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted text-foreground rounded-lg">
                            <Github className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium">GitHub</div>
                            <div className="text-sm text-muted-foreground">{student.githubCommits} commits</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{student.githubCommits}</div>
                          <div className="text-xs text-muted-foreground">Commits</div>
                        </div>
                      </div>
                      {student.codeforcesRating && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                              <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium">Codeforces</div>
                              <div className="text-sm text-muted-foreground">Rating: {student.codeforcesRating}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{student.codeforcesRating}</div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border/60 p-6">
                  <h4 className="font-semibold mb-6">Technical Skills Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium mb-4">Programming Languages</div>
                      {['Python', 'Java', 'JavaScript', 'C++', 'Go'].map(lang => (
                        <div key={lang} className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{lang}</span>
                            <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-primary to-cyan-500"
                              style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-4">Technologies & Frameworks</div>
                      {['React', 'Node.js', 'AWS', 'Docker', 'MongoDB'].map(tech => (
                        <div key={tech} className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{tech}</span>
                            <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border/60 p-6">
                  <h4 className="font-semibold mb-4">Projects & Certifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold">{student.projects}</div>
                        <div className="text-sm text-muted-foreground">Projects Completed</div>
                      </div>
                      <div className="space-y-3">
                        {['E-commerce Platform', 'ML Model for Fraud Detection', 'Mobile App with React Native'].map(project => (
                          <div key={project} className="flex items-center p-3 bg-muted rounded-lg">
                            <FileCode className="w-5 h-5 text-primary mr-3" />
                            <span className="font-medium">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold">{student.certifications}</div>
                        <div className="text-sm text-muted-foreground">Certifications Earned</div>
                      </div>
                      <div className="space-y-3">
                        {['AWS Certified Developer', 'Google Cloud Associate', 'React Certification'].map(cert => (
                          <div key={cert} className="flex items-center p-3 bg-muted rounded-lg">
                            <Award className="w-5 h-5 text-emerald-500 mr-3" />
                            <span className="font-medium">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Add/Edit Student Modal
const StudentFormModal: React.FC<{
  student?: Student;
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
}> = ({ student, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      id: '',
      rollNumber: '',
      name: '',
      email: '',
      phone: '',
      dateOfBirth: new Date(),
      gender: 'Male',
      department: 'CSE',
      batch: '2026',
      semester: 1,
      cgpa: 0,
      attendance: 100,
      status: 'Active',
      placementStatus: 'Unplaced',
      leetcodeSolved: 0,
      githubCommits: 0,
      hackerRankScore: 0,
      skills: [],
      projects: 0,
      certifications: 0,
      lastActive: new Date(),
      enrolledDate: new Date(),
      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
      },
      guardian: {
        name: '',
        phone: '',
        relationship: 'Father',
      },
      performance: {
        academic: 0,
        technical: 0,
        communication: 0,
        leadership: 0,
        overall: 0,
      },
      tags: [],
    }
  );

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Info', 'Academic Details', 'Skills & Performance', 'Guardian Info'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Student);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card text-foreground rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border/60 shadow-elevated">
        <div className="p-6 border-b border-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {student ? 'Edit Student' : 'Add New Student'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      index === activeStep
                        ? 'bg-primary text-primary-foreground'
                        : index < activeStep
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < activeStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <div
                    className={`ml-2 text-sm font-medium ${
                      index === activeStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 w-16 h-0.5 ${
                        index < activeStep ? 'bg-emerald-500/60' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-input bg-background/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary/60 outline-none"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      className="w-full border border-input bg-background/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary/60 outline-none"
                      placeholder="Enter roll number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="student@college.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth?.toISOString().split('T')[0]}
                      onChange={(e) => handleInputChange('dateOfBirth', new Date(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Dropout">Dropout</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="CSE">Computer Science</option>
                      <option value="IT">Information Technology</option>
                      <option value="ECE">Electronics & Communication</option>
                      <option value="EEE">Electrical & Electronics</option>
                      <option value="MECH">Mechanical</option>
                      <option value="CIVIL">Civil</option>
                      <option value="AI">Artificial Intelligence</option>
                      <option value="DS">Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch *
                    </label>
                    <select
                      value={formData.batch}
                      onChange={(e) => handleInputChange('batch', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={formData.semester}
                      onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CGPA *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa}
                      onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attendance (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.attendance}
                      onChange={(e) => handleInputChange('attendance', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placement Status
                  </label>
                  <select
                    value={formData.placementStatus}
                    onChange={(e) => handleInputChange('placementStatus', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Unplaced">Unplaced</option>
                    <option value="Placed">Placed</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Internship">Internship</option>
                    <option value="PPO">PPO</option>
                  </select>
                </div>

                {formData.placementStatus === 'Placed' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.placementCompany || ''}
                        onChange={(e) => handleInputChange('placementCompany', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package (LPA)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.placementPackage || ''}
                        onChange={(e) => handleInputChange('placementPackage', parseFloat(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter package"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LeetCode Problems Solved
                    </label>
                    <input
                      type="number"
                      value={formData.leetcodeSolved}
                      onChange={(e) => handleInputChange('leetcodeSolved', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Commits
                    </label>
                    <input
                      type="number"
                      value={formData.githubCommits}
                      onChange={(e) => handleInputChange('githubCommits', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Projects Completed
                    </label>
                    <input
                      type="number"
                      value={formData.projects}
                      onChange={(e) => handleInputChange('projects', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <input
                      type="number"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange('certifications', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills?.join(', ')}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Python, Java, React, AWS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl || ''}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl || ''}
                      onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.guardian?.name}
                      onChange={(e) => handleNestedChange('guardian', 'name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter guardian name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.guardian?.phone}
                      onChange={(e) => handleNestedChange('guardian', 'phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Email
                    </label>
                    <input
                      type="email"
                      value={formData.guardian?.email || ''}
                      onChange={(e) => handleNestedChange('guardian', 'email', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="guardian@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship
                    </label>
                    <select
                      value={formData.guardian?.relationship}
                      onChange={(e) => handleNestedChange('guardian', 'relationship', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address?.street}
                    onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.address?.city}
                      onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.address?.state}
                      onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.address?.pincode}
                      onChange={(e) => handleNestedChange('address', 'pincode', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes about the student..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t">
            <div className="flex justify-between">
              <div>
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => prev + 1)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {student ? 'Update Student' : 'Create Student'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component: Batch Analysis
const BatchAnalysis: React.FC<{ batches: Batch[] }> = ({ batches }) => {
  const totalStudents = batches.reduce((sum, batch) => sum + batch.totalStudents, 0);
  const totalPlaced = batches.reduce((sum, batch) => sum + batch.placed, 0);
  const overallPlacementRate = (totalPlaced / totalStudents) * 100;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Batch Analysis</CardTitle>
          <div className="text-sm text-muted-foreground">
            Overall: <strong className="text-green-600 dark:text-green-400">{overallPlacementRate.toFixed(1)}%</strong>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {batches.slice(0, 2).map(batch => {
            const placementRate = (batch.placed / batch.totalStudents) * 100;
            return (
              <div key={batch.year} className="p-4 bg-muted/30 dark:bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-foreground">Batch {batch.year}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {batch.placed.toLocaleString()} / {batch.totalStudents.toLocaleString()} placed
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">₹{batch.averagePackage}L</div>
                    <div className="text-xs text-muted-foreground">Avg Package</div>
                  </div>
                </div>
                <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-2 mb-1">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80"
                    style={{ width: `${placementRate}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{placementRate.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Students Page Component
const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    department: [],
    batch: [],
    status: [],
    placementStatus: [],
    gender: [],
    semester: [],
    cgpaRange: [0, 10],
    skills: [],
    searchTerm: '',
  });
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [bulkAction, setBulkAction] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // Show a compact grid of 9 students per page by default
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const placedStudents = students.filter(s => s.placementStatus === 'Placed').length;
  const avgCGPA = students.reduce((sum, s) => sum + s.cgpa, 0) / students.length;
  const placementRate = (placedStudents / students.length) * 100;
  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      if (filters.department.length > 0 && !filters.department.includes(student.department)) {
        return false;
      }
      if (filters.batch.length > 0 && !filters.batch.includes(student.batch)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(student.status)) {
        return false;
      }
      if (filters.placementStatus.length > 0 && !filters.placementStatus.includes(student.placementStatus)) {
        return false;
      }
      if (filters.gender.length > 0 && !filters.gender.includes(student.gender)) {
        return false;
      }
      if (filters.semester.length > 0 && !filters.semester.includes(student.semester)) {
        return false;
      }
      if (student.cgpa < filters.cgpaRange[0] || student.cgpa > filters.cgpaRange[1]) {
        return false;
      }
      if (filters.skills.length > 0 && !filters.skills.some(skill => student.skills.includes(skill))) {
        return false;
      }
      if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !student.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Student];
      const bValue = b[sortBy as keyof Student];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Handlers
  const handleSelectStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const handleViewStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      setSelectedStudent(student);
      setShowDetailModal(true);
    }
  };

  const handleEditStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setEditingStudent(student);
    setShowFormModal(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
      const newSelected = new Set(selectedStudents);
      newSelected.delete(id);
      setSelectedStudents(newSelected);
    }
  };

  const handleMessageStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (student) {
      window.open(`mailto:${student.email}`, '_blank');
    }
  };

  const handleSaveStudent = (studentData: Student) => {
    if (editingStudent) {
      // Update existing student
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id ? studentData : student
      ));
    } else {
      // Add new student
      const newStudent = {
        ...studentData,
        id: `STU${String(students.length + 1).padStart(5, '0')}`,
        rollNumber: studentData.rollNumber || `22${studentData.department}${String(Math.floor(Math.random() * 200)).padStart(3, '0')}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${students.length + 1}`,
        lastActive: new Date(),
        enrolledDate: new Date(),
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setShowFormModal(false);
    setEditingStudent(undefined);
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedStudents.size > 0) {
      switch (bulkAction) {
        case 'export':
          setShowExportModal(true);
          break;
        case 'message':
          // Open email composer with all selected students
          const emails = Array.from(selectedStudents)
            .map(id => students.find(s => s.id === id)?.email)
            .filter(Boolean)
            .join(',');
          window.open(`mailto:${emails}`, '_blank');
          break;
        case 'status-active':
          setStudents(prev => prev.map(student => 
            selectedStudents.has(student.id) ? { ...student, status: 'Active' } : student
          ));
          break;
        case 'status-inactive':
          setStudents(prev => prev.map(student => 
            selectedStudents.has(student.id) ? { ...student, status: 'Inactive' } : student
          ));
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedStudents.size} students?`)) {
            setStudents(prev => prev.filter(student => !selectedStudents.has(student.id)));
            setSelectedStudents(new Set());
          }
          break;
      }
      setBulkAction('');
    }
  };

  const handleExport = () => {
    const data = Array.from(selectedStudents).map(id => 
      students.find(s => s.id === id)
    ).filter(Boolean);
    
    // In a real application, this would generate and download the file
    alert(`Exporting ${data.length} students in ${exportFormat.toUpperCase()} format`);
    setShowExportModal(false);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      department: [],
      batch: [],
      status: [],
      placementStatus: [],
      gender: [],
      semester: [],
      cgpaRange: [0, 10],
      skills: [],
      searchTerm: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e]">
      {/* Header */}
      <div className="border-b border-border/50 px-6 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Students Management</h1>
            <p className="text-muted-foreground text-base">Manage student profiles, track performance, and monitor placements</p>
          </div>
          <Button
            onClick={() => {
              setEditingStudent(undefined);
              setShowFormModal(true);
            }}
            size="lg"
            className="gap-2 w-full md:w-auto"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Student</span>
          </Button>
        </div>

        {/* Stats */}
        <StatsCards
          totalStudents={totalStudents}
          activeStudents={activeStudents}
          placedStudents={placedStudents}
          avgCGPA={avgCGPA}
          placementRate={placementRate}
          avgAttendance={avgAttendance}
        />

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
            <Input
              type="text"
              placeholder="Search students by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 h-12 text-base border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 h-12"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v > 0) && (
                <Badge variant="destructive" className="ml-1">
                  {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v > 0).length}
                </Badge>
              )}
            </Button>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-10 w-10"
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode('table')}
                className="h-10 w-10"
                title="Table View"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" className="gap-2 h-12">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.size > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-foreground">
                    <strong>{selectedStudents.size}</strong> students selected
                  </div>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="border border-input bg-background rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="export">Export Selected</option>
                    <option value="message">Send Message</option>
                    <option value="status-active">Mark as Active</option>
                    <option value="status-inactive">Mark as Inactive</option>
                    <option value="delete">Delete Selected</option>
                  </select>
                  <Button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudents(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-destructive"
                >
                  Clear All Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <div className="space-y-2">
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.department.includes(dept.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              department: [...prev.department, dept.code],
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              department: prev.department.filter(d => d !== dept.code),
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  {['Active', 'Inactive', 'Suspended', 'Graduated', 'Dropout'].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              status: [...prev.status, status],
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              status: prev.status.filter(s => s !== status),
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placement Status</label>
                <div className="space-y-2">
                  {['Placed', 'Unplaced', 'Interviewing', 'Internship', 'PPO'].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.placementStatus.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              placementStatus: [...prev.placementStatus, status],
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              placementStatus: prev.placementStatus.filter(s => s !== status),
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CGPA Range</label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Min: {filters.cgpaRange[0].toFixed(1)}</span>
                      <span>Max: {filters.cgpaRange[1].toFixed(1)}</span>
                    </div>
                    <div className="flex space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.cgpaRange[0]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          cgpaRange: [parseFloat(e.target.value), prev.cgpaRange[1]],
                        }))}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={filters.cgpaRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          cgpaRange: [prev.cgpaRange[0], parseFloat(e.target.value)],
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['2026', '2025', '2024', '2023'].map(year => (
                        <label key={year} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.batch.includes(year)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({
                                  ...prev,
                                  batch: [...prev.batch, year],
                                }));
                              } else {
                                setFilters(prev => ({
                                  ...prev,
                                  batch: prev.batch.filter(b => b !== year),
                                }));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          />
                          <span className="ml-2 text-sm">{year}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Student List */}
          <div className={`lg:col-span-${viewMode === 'grid' ? '3' : '4'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-foreground">
                  Students ({filteredStudents.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="hidden sm:inline">Sort:</span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      setSortOrder('asc');
                    }}
                  >
                    <SelectTrigger className="w-[140px] sm:w-[160px] h-10">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="cgpa">CGPA</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="batch">Batch</SelectItem>
                      <SelectItem value="placementStatus">Placement</SelectItem>
                      <SelectItem value="leetcodeSolved">LeetCode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[90px] h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="18">18</SelectItem>
                    <SelectItem value="27">27</SelectItem>
                    <SelectItem value="45">45</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <div className="text-foreground font-medium mb-2">No students found</div>
                  <div className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search term</div>
                  <Button
                    onClick={clearFilters}
                    variant="default"
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </Button>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedStudents.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onView={handleViewStudent}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                    onMessage={handleMessageStudent}
                  />
                ))}
              </div>
            ) : (
              <StudentTable
                students={paginatedStudents}
                selectedStudents={selectedStudents}
                onSelect={handleSelectStudent}
                onSelectAll={handleSelectAll}
                onView={handleViewStudent}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onMessage={handleMessageStudent}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
            )}

            {/* Pagination */}
            {filteredStudents.length > 0 && totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • {filteredStudents.length} total students
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Right Column - Stats and Analytics */}
          {viewMode === 'grid' && (
            <div className="space-y-6">
              <DepartmentPerformance departments={departments} />
              <BatchAnalysis batches={batches} />
              
              {/* Quick Stats */}
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-destructive/10 text-destructive rounded-lg">
                          <UserX className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Unplaced</div>
                          <div className="text-xs text-muted-foreground">Need assistance</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-destructive">
                        {students.filter(s => s.placementStatus === 'Unplaced').length}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                          <Target className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Interviewing</div>
                          <div className="text-xs text-muted-foreground">Active process</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {students.filter(s => s.placementStatus === 'Interviewing').length}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">High Performers</div>
                          <div className="text-xs text-muted-foreground">CGPA ≥ 9.0</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {students.filter(s => s.cgpa >= 9.0).length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEditStudent}
          onMessage={handleMessageStudent}
        />
      )}

      <StudentFormModal
        student={editingStudent}
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingStudent(undefined);
        }}
        onSave={handleSaveStudent}
      />

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Export Students</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`py-3 rounded-lg border ${
                      exportFormat === 'csv'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => setExportFormat('excel')}
                    className={`py-3 rounded-lg border ${
                      exportFormat === 'excel'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`py-3 rounded-lg border ${
                      exportFormat === 'pdf'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    PDF
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include Fields
                </label>
                <div className="space-y-2">
                  {['Name', 'Roll Number', 'Department', 'CGPA', 'Placement Status', 'Skills', 'Contact Info'].map(field => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-black-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Export {selectedStudents.size} Students
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;