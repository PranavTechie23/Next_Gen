import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, FileText, Linkedin, User,
  AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { deptApi } from '@/services/deptApi';
import { toast } from 'sonner';

export function ApprovalsHub() {
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(pendingApprovals.length / itemsPerPage);
  const currentApprovals = pendingApprovals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentApprovals.length === 0 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentApprovals.length, currentPage]);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await deptApi.getRecentlyUpdatedProfiles();
      setPendingApprovals(data.students || []);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (studentId: string | number, action: 'APPROVE' | 'REJECT') => {
    try {
      setProcessingId(studentId);
      // We assume they're approving/rejecting all subjective fields at once for this basic flow
      await deptApi.reviewStudentProfile(studentId, action, ['resume_url', 'skills', 'projects']);
      
      toast.success(`Profile update ${action === 'APPROVE' ? 'approved' : 'rejected'}`);
      
      // Remove from list or refresh
      fetchApprovals();
    } catch (error: any) {
      console.error(`Failed to ${action} profile:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action.toLowerCase()} profile`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          <p className="text-muted-foreground font-medium">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Approvals Hub</h2>
          <p className="text-muted-foreground mt-1">Review recently updated student resumes and profiles.</p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium bg-muted/50">
          {pendingApprovals.length} Pending
        </Badge>
      </div>

      {pendingApprovals.length === 0 ? (
        <Card className="border-dashed shadow-none bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-bold mb-1">All Caught Up!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              There are no pending profile or resume updates to review at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentApprovals.map((student) => (
              <Card key={student.user_id} className="group overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 relative">
              
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground leading-tight">
                        {student.email ? student.email.split('@')[0] : 'Unknown Student'}
                      </h4>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{student.roll_number}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 mb-5 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> UPDATED ITEMS
                  </p>
                  <div className="flex flex-col gap-2">
                    {student.resume_url && (
                       <a href={student.resume_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                         <FileText className="w-4 h-4" /> Resume Document
                       </a>
                    )}
                    {student.linkedin_url && (
                       <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0A66C2] hover:underline flex items-center gap-2">
                         <Linkedin className="w-4 h-4" /> LinkedIn Profile
                       </a>
                    )}
                    {/* Backend query says "students who have a resume or skills". 
                        We don't get the exact list of updated skills, so we generalize. */}
                    <span className="text-sm text-foreground flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-emerald-500" /> Skills / Projects
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                    disabled={processingId === student.user_id}
                    onClick={() => handleAction(student.user_id, 'REJECT')}
                  >
                    {processingId === student.user_id ? (
                      <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                    disabled={processingId === student.user_id}
                    onClick={() => handleAction(student.user_id, 'APPROVE')}
                  >
                    {processingId === student.user_id ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
          
          <div className="flex items-center justify-between border-t border-border pt-4 mt-8">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{pendingApprovals.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * itemsPerPage, pendingApprovals.length)}</span> of <span className="font-bold text-foreground">{pendingApprovals.length}</span> approvals
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
