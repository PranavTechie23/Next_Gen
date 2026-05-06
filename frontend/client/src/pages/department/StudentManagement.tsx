import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, FileSpreadsheet, UserPlus, 
  MoreVertical, Eye, Edit, ChevronLeft, ChevronRight, UploadCloud,
  GraduationCap, FileText, Linkedin, Globe, MapPin, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { deptApi } from '@/services/deptApi';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        <div className="flex flex-1 w-full gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by Roll Number or Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/40 bg-muted/30 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none focus:border-border/60 transition-all shadow-sm" 
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-[44px] rounded-xl border border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary shadow-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Placed">Placed</SelectItem>
              <SelectItem value="Unplaced">Unplaced</SelectItem>
            </SelectContent>
          </Select>
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
            <thead className="text-xs text-muted-foreground uppercase bg-gradient-to-r from-muted/60 to-muted/40 border-b border-border/30 font-semibold tracking-wider">
              <tr>
                <th className="px-8 py-5 font-bold text-foreground">Roll Number</th>
                <th className="px-8 py-5 font-bold text-foreground">Email</th>
                <th className="px-8 py-5 font-bold text-foreground">CGPA</th>
                <th className="px-8 py-5 font-bold text-foreground">Backlogs</th>
                <th className="px-8 py-5 font-bold text-center text-foreground">Status</th>
                <th className="px-8 py-5 font-bold text-right text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
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
                  <tr key={student.user_id} className="hover:bg-muted/40 transition-all border-b border-border/20 group">
                    <td className="px-8 py-5 font-bold text-foreground">{student.roll_number}</td>
                    <td className="px-8 py-5 text-muted-foreground">{student.email}</td>
                    <td className="px-8 py-5 font-semibold text-foreground">{student.current_cgpa || 'N/A'}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                        student.active_backlogs > 0
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {student.active_backlogs || 0}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                        student.is_placed 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-500'
                      }`}>
                        {student.is_placed ? '✓ Placed' : 'Searching'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="group-hover:bg-primary/10 rounded-lg hover:text-primary transition-all">
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
            className={`mt-6 border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              selectedFile ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : 'border-border/40 hover:border-primary/60 hover:bg-primary/5'
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
        <SheetContent side="right" className="w-full max-w-[min(100vw,24rem)] overflow-y-auto sm:max-w-[540px] sm:w-[540px] border-border/40 bg-background/95">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold">{isEditing ? 'Edit Academic Data' : 'Add New Student'}</SheetTitle>
            <SheetDescription>
              {isEditing 
                ? 'Modify the academic records for this student. Note: Subjective data (resume, skills) is edited by the student.' 
                : 'Fill out the initial details to create a student account.'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="roll_number" className="text-sm font-bold">Roll Number <span className="text-red-500">*</span></Label>
              <Input 
                id="roll_number" 
                placeholder="e.g., CS2026001" 
                value={formData.roll_number}
                onChange={(e) => setFormData({...formData, roll_number: e.target.value.toUpperCase()})}
                disabled={isEditing}
                className="h-11 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-bold">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                type="email"
                placeholder="student@college.edu" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={isEditing}
                className="h-11 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label htmlFor="cgpa" className="text-sm font-bold">Current CGPA</Label>
                <Input 
                  id="cgpa" 
                  type="number"
                  step="0.01"
                  max="10"
                  placeholder="e.g., 8.5" 
                  value={formData.current_cgpa}
                  onChange={(e) => setFormData({...formData, current_cgpa: e.target.value})}
                  className="h-11 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="backlogs" className="text-sm font-bold">Active Backlogs</Label>
                <Input 
                  id="backlogs" 
                  type="number"
                  min="0"
                  placeholder="e.g., 0" 
                  value={formData.active_backlogs}
                  onChange={(e) => setFormData({...formData, active_backlogs: e.target.value})}
                  className="h-11 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="mt-10 flex gap-3">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)} className="rounded-lg border-border/40 hover:bg-muted/50">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={isUploading} className="bg-primary text-white hover:shadow-lg hover:shadow-primary/30 rounded-lg font-semibold px-6 h-10">
              {isUploading ? 'Saving...' : 'Save Student Data'}
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
          ) : (
            <>
              <SheetHeader className="p-8 pb-0 border-b border-border/20">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-3xl font-bold">{detailedStudent.email?.split('@')[0] || 'Student Profile'}</SheetTitle>
                    <SheetDescription className="mt-2 flex items-center gap-3">
                       <Badge variant="outline" className="font-mono rounded-lg border-border/40">{detailedStudent.roll_number}</Badge>
                       <span className="text-muted-foreground text-sm">{detailedStudent.department_name}</span>
                    </SheetDescription>
                  </div>
                  <Badge className={`rounded-lg font-semibold ${
                    detailedStudent.is_placed ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}>
                    {detailedStudent.is_placed ? '✓ Placed' : 'Searching'}
                  </Badge>
                </div>
              </SheetHeader>

              <ScrollArea className="flex-1 p-8">
                <div className="space-y-10 pb-8">
                  
                  {/* Academic Data (Editable via the other sheet) */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-primary" />
                        Academic Records
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => {
                        setIsDetailsOpen(false);
                        openEditForm(detailedStudent);
                      }} className="rounded-lg border-border/40 hover:bg-muted/50 h-9">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5 bg-gradient-to-br from-muted/30 to-muted/10 p-6 rounded-2xl border border-border/30 shadow-sm">
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wide">Current CGPA</p>
                        <p className="font-bold text-2xl text-primary">{detailedStudent.current_cgpa || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wide">Active Backlogs</p>
                        <p className="font-bold text-2xl text-red-500 dark:text-red-400">{detailedStudent.active_backlogs || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wide">10th Marks</p>
                        <p className="font-bold text-lg text-foreground">{detailedStudent.tenth_marks ? `${detailedStudent.tenth_marks}%` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wide">12th Marks</p>
                        <p className="font-bold text-lg text-foreground">{detailedStudent.twelfth_marks ? `${detailedStudent.twelfth_marks}%` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/20" />

                  {/* Subjective Data (Read-only for Dept Head) */}
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-indigo-500" />
                      Subjective Profile
                    </h3>
                    <div className="space-y-8">
                      <div className="flex flex-wrap gap-3 pt-2">
                        {detailedStudent.resume_url ? (
                          <a href={detailedStudent.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors border border-blue-200">
                            <FileText className="w-4 h-4" /> View Resume
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 px-3 py-2 bg-muted/50 text-muted-foreground rounded-lg text-sm border border-border"><FileText className="w-4 h-4 opacity-50" /> No Resume Uploaded</span>
                        )}
                        
                        {detailedStudent.linkedin_url && (
                          <a href={detailedStudent.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-lg text-sm font-medium transition-colors border border-[#0A66C2]/20">
                            <Linkedin className="w-4 h-4" /> LinkedIn Profile
                          </a>
                        )}
                        
                        {detailedStudent.github_url && (
                          <a href={detailedStudent.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors border border-border">
                            <Globe className="w-4 h-4" /> GitHub Profile
                          </a>
                        )}
                      </div>

                      {detailedStudent.address && (
                        <div className="bg-muted/30 p-4 rounded-xl border border-border">
                          <p className="text-sm font-bold flex items-center gap-2 mb-2 text-foreground">
                             <MapPin className="w-4 h-4 text-primary" /> Registered Address
                          </p>
                          <p className="text-sm text-muted-foreground">{detailedStudent.address}</p>
                        </div>
                      )}

                      {/* Skills */}
                       <div>
                         <p className="text-sm font-bold mb-3 text-foreground border-b border-border pb-2">Technical Skills & Proficiency</p>
                         {detailedStudent.skills && detailedStudent.skills.length > 0 ? (
                           <div className="flex flex-wrap gap-2 pt-1">
                             {detailedStudent.skills.map((skill: any, idx: number) => (
                               <Badge key={idx} variant="secondary" className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 shadow-sm border border-indigo-500/10 text-sm">
                                 {skill.name} <span className="text-[10px] uppercase ml-2 opacity-60 border-l border-indigo-300 dark:border-indigo-700 pl-2">{skill.proficiency_level}</span>
                               </Badge>
                             ))}
                           </div>
                         ) : (
                           <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No skills added yet.</p>
                         )}
                       </div>

                       {/* Projects */}
                       <div>
                         <p className="text-sm font-bold mb-3 text-foreground border-b border-border pb-2">Academic & Personal Projects</p>
                         {detailedStudent.projects && detailedStudent.projects.length > 0 ? (
                           <div className="space-y-4 pt-1">
                             {detailedStudent.projects.map((project: any) => (
                               <div key={project.id} className="p-4 bg-muted/20 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-base text-foreground">{project.title}</h4>
                                    {project.project_link && (
                                       <a href={project.project_link} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-md hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                                         <ExternalLink className="w-4 h-4" />
                                       </a>
                                    )}
                                 </div>
                                 <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                               </div>
                             ))}
                           </div>
                         ) : (
                           <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border border-dashed">No projects added yet.</p>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
      {/* Filter Drawer */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="w-full max-w-[min(100vw,20rem)] sm:max-w-[400px] border-border/40 bg-background/95">
          <SheetHeader className="mb-8 border-b border-border/20 pb-6">
            <SheetTitle className="text-2xl font-bold">Filter Data</SheetTitle>
            <SheetDescription className="text-sm">Apply advanced filters to the student list.</SheetDescription>
          </SheetHeader>
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-sm font-bold">CGPA Range</Label>
              <div className="flex gap-3">
                <Input type="number" step="0.01" min="0" max="10" placeholder="Min" value={minCgpa} onChange={e => setMinCgpa(e.target.value)} className="h-10 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary" />
                <Input type="number" step="0.01" min="0" max="10" placeholder="Max" value={maxCgpa} onChange={e => setMaxCgpa(e.target.value)} className="h-10 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-bold">Active Backlogs</Label>
              <Select value={backlogsFilter} onValueChange={setBacklogsFilter}>
                <SelectTrigger className="h-10 rounded-lg border-border/40 bg-muted/30 focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Any</SelectItem>
                  <SelectItem value="0">No Backlogs</SelectItem>
                  <SelectItem value="1+">1 or More Backlogs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="mt-10 flex gap-3">
            <Button variant="outline" onClick={() => {
              setMinCgpa('');
              setMaxCgpa('');
              setBacklogsFilter('All');
              setFilterStatus('All');
              setSearchTerm('');
            }} className="rounded-lg border-border/40 hover:bg-muted/50 flex-1">
              Reset
            </Button>
            <Button onClick={() => setIsFilterOpen?.(false)} className="bg-primary text-white hover:shadow-lg hover:shadow-primary/30 rounded-lg font-semibold flex-1 h-10">
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
