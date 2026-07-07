import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Plus, FileSpreadsheet, UserPlus,
  MoreVertical, Eye, Edit, ChevronLeft, ChevronRight, UploadCloud,
  GraduationCap, FileText, Linkedin, Globe, MapPin, ExternalLink,
  Award, Trophy, Code2, Activity, Mail, User, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deptApi } from '@/services/deptApi';
import { resolveUploadUrl } from '@/lib/authSession';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EducationProfileList } from "@/features/shared/EducationProfileList";

export function StudentManagement({
  isFilterOpen,
  setIsFilterOpen,
  externalSearch = '',
}: {
  isFilterOpen?: boolean;
  setIsFilterOpen?: (v: boolean) => void;
  externalSearch?: string;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [minCgpa, setMinCgpa] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');
  const [backlogsFilter, setBacklogsFilter] = useState('All');

  // Bulk Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single Entry / Edit State
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    roll_number: '',
    email: '',
    current_cgpa: '',
    active_backlogs: ''
  });

  // Details View State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailedStudent, setDetailedStudent] = useState<any>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (externalSearch) {
      setSearchTerm(externalSearch);
    }
  }, [externalSearch]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await deptApi.getDepartmentStudents();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' ? true :
        filterStatus === 'Placed' ? student.is_placed === 1 :
          filterStatus === 'Unplaced' ? student.is_placed === 0 : true;

    const matchesMinCgpa = minCgpa ? (student.current_cgpa >= parseFloat(minCgpa)) : true;
    const matchesMaxCgpa = maxCgpa ? (student.current_cgpa <= parseFloat(maxCgpa)) : true;

    const matchesBacklogs =
      backlogsFilter === 'All' ? true :
        backlogsFilter === '0' ? (!student.active_backlogs || student.active_backlogs === 0) :
          backlogsFilter === '1+' ? (student.active_backlogs && student.active_backlogs > 0) : true;

    return matchesSearch && matchesStatus && matchesMinCgpa && matchesMaxCgpa && matchesBacklogs;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, minCgpa, maxCgpa, backlogsFilter]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
    } else {
      toast.error('Please upload a valid Excel or CSV file.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const res = await deptApi.uploadStudentsExcel(selectedFile);
      toast.success(`Successfully uploaded! Created: ${res.created}, Updated: ${res.updated}, Emails Sent: ${res.emails_sent}`);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      fetchStudents(); // Refresh the table
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload students. Check file format.');
    } finally {
      setIsUploading(false);
    }
  };

  const openAddForm = () => {
    setIsEditing(false);
    setFormData({ user_id: '', roll_number: '', email: '', current_cgpa: '', active_backlogs: '' });
    setIsSheetOpen(true);
  };

  const openEditForm = (student: any) => {
    setIsEditing(true);
    setFormData({
      user_id: student.user_id,
      roll_number: student.roll_number,
      email: student.email,
      current_cgpa: student.current_cgpa?.toString() || '',
      active_backlogs: student.active_backlogs?.toString() || '0'
    });
    setIsSheetOpen(true);
  };

  const openStudentDetails = async (studentId: string | number) => {
    setIsDetailsOpen(true);
    setIsFetchingDetails(true);
    try {
      const data = await deptApi.getStudentDetails(studentId);
      setDetailedStudent(data);
    } catch (error) {
      console.error('Failed to fetch details:', error);
      toast.error('Failed to load student details');
      setIsDetailsOpen(false);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const handleFormSubmit = async () => {
    try {
      setIsUploading(true);
      if (isEditing) {
        // Edit flow
        await deptApi.updateStudentAcademicData(formData.user_id, {
          current_cgpa: formData.current_cgpa ? parseFloat(formData.current_cgpa) : null,
          active_backlogs: formData.active_backlogs ? parseInt(formData.active_backlogs) : 0,
        });
        toast.success("Student updated successfully");
      } else {
        // Add flow
        if (!formData.roll_number || !formData.email) {
          toast.error("Roll Number and Email are required");
          return;
        }
        await deptApi.createStudentsManually([{
          roll_number: formData.roll_number,
          email: formData.email,
          current_cgpa: formData.current_cgpa ? parseFloat(formData.current_cgpa) : undefined,
          active_backlogs: formData.active_backlogs ? parseInt(formData.active_backlogs) : undefined,
        }]);
        toast.success("Student added successfully");
      }
      setIsSheetOpen(false);
      fetchStudents();
    } catch (error: any) {
      console.error('Form submit failed:', error);
      toast.error(error.response?.data?.message || 'Failed to save student data.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="flex flex-wrap flex-1 w-full gap-4 items-center">
          <div className="relative flex-1 max-w-md min-w-[240px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Roll Number or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/40 bg-muted/30 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none focus:border-border/60 transition-all shadow-sm"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl border border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary shadow-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Placed">Placed</SelectItem>
              <SelectItem value="Unplaced">Unplaced</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 h-11 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/50 text-foreground shadow-sm px-4" onClick={() => setIsFilterOpen?.(true)}>
            <Filter className="w-4 h-4" />
            Filter Data
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 h-11 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 text-white border-0 shadow-lg shadow-purple-500/20 transition-all active:scale-95 font-semibold">
              <Plus className="w-5 h-5" />
              Add Student
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border/40 shadow-xl">
            <DropdownMenuItem className="cursor-pointer font-medium" onClick={openAddForm}>
              <UserPlus className="w-4 h-4 mr-2" />
              Single Entry
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => setIsUploadModalOpen(true)}>
              <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-500" />
              Upload Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
      <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/25 border-b border-border/20">
              <tr>
                <th className="px-8 py-4.5 font-bold">Roll Number</th>
                <th className="px-8 py-4.5 font-bold">Email</th>
                <th className="px-8 py-4.5 font-bold">CGPA</th>
                <th className="px-8 py-4.5 font-bold">Backlogs</th>
                <th className="px-8 py-4.5 font-bold text-center">Status</th>
                <th className="px-8 py-4.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student.user_id} className="hover:bg-muted/30 transition-all border-b border-border/10 group">
                    <td className="px-8 py-4">
                      <span className="font-mono text-xs font-bold bg-muted/60 text-foreground border border-border/40 px-2 py-1 rounded-md shadow-sm">
                        {student.roll_number}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-muted-foreground font-medium">{student.email}</td>
                    <td className="px-8 py-4">
                      <span className="font-extrabold text-xs text-foreground bg-primary/5 dark:bg-primary/10 border border-primary/10 px-2 py-1 rounded-lg">
                        {student.current_cgpa && !isNaN(Number(student.current_cgpa)) ? Number(student.current_cgpa).toFixed(2) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border ${student.active_backlogs > 0
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}>
                        {student.active_backlogs || 0}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border ${student.is_placed
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20'
                        }`}>
                        {student.is_placed ? '✓ Placed' : 'Unplaced'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="group-hover:bg-primary/10 rounded-lg hover:text-primary transition-all h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-border/40 shadow-xl">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openStudentDetails(student.user_id)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openEditForm(student)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit Academic Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Basic Pagination Header */}
        <div className="p-6 border-t border-border/20 flex items-center justify-between bg-gradient-to-r from-muted/20 to-muted/10">
          <span className="text-sm text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of <span className="font-bold text-foreground">{filteredStudents.length}</span> students
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg border-border/40 hover:bg-muted/50" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg border-border/40 hover:bg-muted/50" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={(open) => {
        setIsUploadModalOpen(open);
        if (!open) setSelectedFile(null);
      }}>
        <DialogContent className="sm:max-w-md border-border/40 bg-background/95 backdrop-blur-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Bulk Upload Students</DialogTitle>
            <DialogDescription>
              Upload an Excel (.xlsx, .xls) or CSV file containing student details.
              Required columns: <b>roll_number, email</b>.
            </DialogDescription>
          </DialogHeader>

          <div
            className={`mt-6 border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${selectedFile ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : 'border-border/40 hover:border-primary/60 hover:bg-primary/5'
              }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-emerald-500/25 text-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <p className="font-bold text-base text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">Click or drag to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-primary/15 rounded-full flex items-center justify-center">
                  <UploadCloud className="w-7 h-7 text-primary" />
                </div>
                <p className="font-bold text-base text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Excel or CSV (max. 5MB)</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-lg border-border/40 hover:bg-muted/50">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 rounded-lg font-semibold px-6 h-10"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Uploading...
                </>
              ) : (
                'Upload Students'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Single Entry / Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="flex w-full max-w-[min(100vw,24rem)] flex-col p-0 sm:max-w-[540px] sm:w-[540px] border-border/40 bg-background/95 backdrop-blur-2xl shadow-2xl">
          <SheetHeader className="relative p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                {isEditing ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div className="flex-1 text-left">
                <SheetTitle className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {isEditing ? 'Edit Academic Data' : 'Add New Student'}
                </SheetTitle>
                <SheetDescription className="text-xs mt-1">
                  {isEditing
                    ? 'Modify academic records. Subjective data is managed by the student.'
                    : 'Fill out the initial details to create a student account.'}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="roll_number" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  Roll Number <span className="text-red-500/80">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    id="roll_number"
                    placeholder="e.g., CS2026001"
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value.toUpperCase() })}
                    disabled={isEditing}
                    className="h-11 pl-10 rounded-xl border-border/40 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm disabled:opacity-60 disabled:bg-muted/40"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  Email Address <span className="text-red-500/80">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isEditing}
                    className="h-11 pl-10 rounded-xl border-border/40 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm disabled:opacity-60 disabled:bg-muted/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label htmlFor="cgpa" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current CGPA</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500/60" />
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      max="10"
                      placeholder="e.g., 8.5"
                      value={formData.current_cgpa}
                      onChange={(e) => setFormData({ ...formData, current_cgpa: e.target.value })}
                      className="h-11 pl-10 rounded-xl border-border/40 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="backlogs" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Backlogs</Label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60" />
                    <Input
                      id="backlogs"
                      type="number"
                      min="0"
                      placeholder="e.g., 0"
                      value={formData.active_backlogs}
                      onChange={(e) => setFormData({ ...formData, active_backlogs: e.target.value })}
                      className="h-11 pl-10 rounded-xl border-border/40 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-4 border-t border-border/20 bg-muted/20 flex gap-3 sm:justify-end">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="rounded-xl border-border/40 hover:bg-muted/50 h-11 px-6 font-semibold">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={isUploading} className="bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/30 rounded-xl font-bold px-8 h-11 transition-all active:scale-95">
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Student Details Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={(open) => {
        setIsDetailsOpen(open);
        if (!open) setDetailedStudent(null);
      }}>
        <SheetContent side="right" className="flex w-full max-w-[min(100vw,24rem)] flex-col p-0 sm:max-w-[540px] sm:w-[540px] border-border/40 bg-background/95">
          {isFetchingDetails || !detailedStudent ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="flex flex-col items-center gap-4">
                <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                <p className="text-muted-foreground font-medium">Loading student profile...</p>
              </div>
            </div>
          ) : (<>
            {/* Profile Hero Header */}
            <div className="relative p-6 pb-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-b border-border/20">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {(detailedStudent.email?.split('@')[0] || 'S').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-xl font-black text-foreground truncate">
                      {(detailedStudent.email?.split('@')[0] || 'Student Profile').replace('.', ' ')}
                    </SheetTitle>
                    <Badge className={`rounded-full font-bold text-[9px] uppercase tracking-wider ${detailedStudent.is_placed
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                      {detailedStudent.is_placed ? 'Placed' : 'Unplaced'}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      {detailedStudent.roll_number}
                    </span>
                    <span className="h-3 w-px bg-border/40" />
                    <span>{detailedStudent.department_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="space-y-6 pb-6">
                {/* Academic Scorecard */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Academic Scorecard
                  </h3>
                  <div className="grid grid-cols-4 gap-2.5 bg-muted/20 p-3.5 rounded-xl border border-border/30">
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">CGPA</p>
                      <p className="font-black text-base text-primary">{detailedStudent.current_cgpa && !isNaN(Number(detailedStudent.current_cgpa)) ? Number(detailedStudent.current_cgpa).toFixed(2) : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">Backlogs</p>
                      <p className={`font-black text-base ${detailedStudent.active_backlogs > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{detailedStudent.active_backlogs || 0}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">10th</p>
                      <p className="font-black text-base text-foreground">{detailedStudent.tenth_marks ? `${detailedStudent.tenth_marks}%` : 'N/A'}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-card/45 border border-border/20 shadow-sm">
                      <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mb-1">
                        {detailedStudent.twelfth_marks != null ? '12th' : (detailedStudent.diploma_marks != null ? 'Diploma' : '12th/Diploma')}
                      </p>
                      <p className="font-black text-base text-foreground">
                        {detailedStudent.twelfth_marks != null ? `${detailedStudent.twelfth_marks}%` : (detailedStudent.diploma_marks != null ? `${detailedStudent.diploma_marks}%` : 'N/A')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education Background */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    Education Background
                  </h3>
                  <EducationProfileList entries={detailedStudent.education_entries} />
                </div>

                {/* Assessment Analytics (Unstop Style) */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Assessment Analytics
                  </h3>
                  {detailedStudent.performance ? (
                    <div className="space-y-4 bg-muted/15 p-4 rounded-xl border border-border/30 shadow-inner">
                      {/* AMCAT Cognitive Suite */}
                      <div className="space-y-3">
                        <p className="text-[9px] font-black tracking-wider uppercase text-muted-foreground/60 border-b border-border/15 pb-1">Cognitive & Aptitude (AMCAT)</p>

                        {/* Quant */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Quantitative Ability</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{detailedStudent.performance.amcat_quant || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" style={{ width: `${detailedStudent.performance.amcat_quant || 0}%` }} />
                          </div>
                        </div>

                        {/* Logical */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Logical Reasoning</span>
                            <span className="text-purple-600 dark:text-purple-400">{detailedStudent.performance.amcat_logical || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: `${detailedStudent.performance.amcat_logical || 0}%` }} />
                          </div>
                        </div>

                        {/* Verbal */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Verbal Ability</span>
                            <span className="text-pink-600 dark:text-pink-400">{detailedStudent.performance.amcat_verbal || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{ width: `${detailedStudent.performance.amcat_verbal || 0}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Practical Suite */}
                      <div className="space-y-3 pt-1">
                        <p className="text-[9px] font-black tracking-wider uppercase text-muted-foreground/60 border-b border-border/15 pb-1">Practical & Communication</p>

                        {/* Coding */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Coding Test Score</span>
                            <span className="text-blue-600 dark:text-blue-400">{detailedStudent.performance.coding_test_score || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${detailedStudent.performance.coding_test_score || 0}%` }} />
                          </div>
                        </div>

                        {/* Mock Interview */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-foreground">Mock Interview Performance</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{detailedStudent.performance.mock_interview_score || 0}/100</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: `${detailedStudent.performance.mock_interview_score || 0}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/10 p-4 rounded-xl border border-dashed border-border/40 text-center">
                      <Activity className="w-6 h-6 text-muted-foreground/45 mx-auto mb-1.5" />
                      <p className="text-xs text-muted-foreground">No assessment reports linked yet for this student.</p>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    Skills & Competencies
                  </h3>
                  {detailedStudent.skills && detailedStudent.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {detailedStudent.skills.map((skill: any, idx: number) => {
                        return (
                          <Badge key={idx} variant="secondary" className={`px-2.5 py-1 text-xs font-bold rounded-lg border bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20`}>
                            {skill.name}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No skills added yet.</p>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-pink-500" />
                    Featured Projects
                  </h3>
                  {detailedStudent.projects && detailedStudent.projects.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      {detailedStudent.projects.map((project: any) => (
                        <div key={project.id} className="p-4 bg-muted/20 rounded-xl border border-border/30 hover:border-border/60 shadow-sm transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-extrabold text-sm text-foreground">{project.title}</h4>
                            {project.project_link && (
                              <a href={project.project_link} target="_blank" rel="noopener noreferrer" className="p-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No projects added yet.</p>
                  )}
                </div>

                {/* Professional Footprint */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    Professional Footprint
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {detailedStudent.resume_url ? (
                        <a href={resolveUploadUrl(detailedStudent.resume_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-all border border-blue-500/20 hover:bg-blue-500/15">
                          <FileText className="w-3.5 h-3.5" /> View Resume
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 px-3 py-2 bg-muted/40 text-muted-foreground/60 rounded-xl text-xs border border-border/30 border-dashed">
                          <FileText className="w-3.5 h-3.5 opacity-50" /> No Resume Uploaded
                        </span>
                      )}

                      {detailedStudent.linkedin_url && (
                        <a href={detailedStudent.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/15 text-[#0A66C2] rounded-xl text-xs font-bold transition-all border border-[#0A66C2]/20 hover:bg-[#0A66C2]/20">
                          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                        </a>
                      )}

                      {detailedStudent.github_url && (
                        <a href={detailedStudent.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-500/10 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-500/20 hover:bg-slate-500/20">
                          <Globe className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                    </div>

                    {detailedStudent.address && (
                      <div className="bg-muted/10 p-3.5 rounded-xl border border-border/20 flex gap-2.5 items-start">
                        <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">Address</p>
                          <p className="text-xs text-foreground leading-relaxed">{detailedStudent.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Sticky Action Footer */}
            <SheetFooter className="p-4 border-t border-border/20 bg-muted/20">
              <Button variant="outline" className="w-full rounded-xl border-border/40 hover:bg-muted/50 h-10 font-bold" onClick={() => {
                setIsDetailsOpen(false);
                openEditForm(detailedStudent);
              }}>
                <Edit className="w-4 h-4 mr-2" /> Edit Academic Records
              </Button>
            </SheetFooter>
          </>
          )}
        </SheetContent>
      </Sheet>

      {/* Filter Drawer */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="flex w-full max-w-[min(100vw,22rem)] flex-col p-0 sm:max-w-[420px] sm:w-[420px] border-border/40 bg-background/95 shadow-2xl">
          {/* Header Area */}
          <div className="relative p-6 pb-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-lg font-black text-foreground">Filter Data</SheetTitle>
                <SheetDescription className="text-xs">Apply advanced filters to the student list.</SheetDescription>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="space-y-6 pb-6">

              {/* CGPA Range Card */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-border/30 shadow-sm">
                <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  CGPA Range
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Min</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="0.00"
                      value={minCgpa}
                      onChange={e => setMinCgpa(e.target.value)}
                      className="w-full h-10 pl-11 pr-3 rounded-lg border border-border/40 bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none focus:border-border/60 transition-all shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">Max</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="10.00"
                      value={maxCgpa}
                      onChange={e => setMaxCgpa(e.target.value)}
                      className="w-full h-10 pl-11 pr-3 rounded-lg border border-border/40 bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary focus:outline-none focus:border-border/60 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Active Backlogs Card */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-border/30 shadow-sm">
                <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  Active Backlogs
                </Label>

                {/* Modern Segmented Control */}
                <div className="grid grid-cols-3 gap-2 mt-2 bg-muted/50 p-1.5 rounded-xl border border-border/45">
                  {[
                    { value: 'All', label: 'Any' },
                    { value: '0', label: 'No Backlogs' },
                    { value: '1+', label: '1 or More' }
                  ].map((opt) => {
                    const isActive = backlogsFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBacklogsFilter(opt.value)}
                        className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${isActive
                            ? 'bg-background text-foreground shadow border border-border/10'
                            : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Sticky Footer Actions */}
          <SheetFooter className="p-4 border-t border-border/20 bg-muted/20 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setMinCgpa('');
                setMaxCgpa('');
                setBacklogsFilter('All');
                setFilterStatus('All');
                setSearchTerm('');
              }}
              className="rounded-xl border-border/40 hover:bg-muted/50 flex-1 h-10 font-bold"
            >
              Reset Filters
            </Button>
            <Button
              onClick={() => setIsFilterOpen?.(false)}
              className="bg-primary text-white hover:shadow-lg hover:shadow-primary/30 rounded-xl font-bold flex-1 h-10"
            >
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}