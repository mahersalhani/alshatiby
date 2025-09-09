'use client';

import { Award, Calendar, GraduationCap, Loader2, Mail, Phone, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { AddStudentModal } from './add-student-modal';
import { ConfirmationModal } from './shared/confirmation-modal';

import { useRouter } from '@/components/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/lib/axios';
import { StudentSchedule } from '@/lib/schemas/classroom';

interface StudentSchedulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentSchedules: StudentSchedule[];
  classroomName: string;
  classroomId: string;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function StudentSchedulesModal({
  open,
  onOpenChange,
  studentSchedules,
  classroomName,
  classroomId,
  isLoading = false,
  onRefresh,
}: StudentSchedulesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const t = useTranslations('StudentSchedules');
  const locale = useLocale();
  const router = useRouter();

  // Filter student schedules based on search term
  const filteredStudentSchedules = studentSchedules.filter((schedule) => {
    const studentName = schedule.student.user?.name || '';
    const studentEmail = schedule.student.user?.email || '';
    const programName = schedule.program.name || '';

    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleStudentClick = (studentDocumentId: string) => {
    router.push(`/students/${studentDocumentId}`);
  };

  const handleRemoveStudent = async () => {
    if (!studentToDelete) return;

    setRemovingStudentId(studentToDelete.id);
    try {
      await api.delete(`/dashboard/student-schedule/${studentToDelete.id}`);
      toast.success(t('studentRemovedSuccessfully'));
      if (onRefresh) {
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.message);
    } finally {
      setRemovingStudentId(null);
      setConfirmDeleteOpen(false);
      setStudentToDelete(null);
    }
  };

  const openDeleteConfirmation = (studentScheduleId: string, studentName: string) => {
    setStudentToDelete({ id: studentScheduleId, name: studentName });
    setConfirmDeleteOpen(true);
  };

  const handleAddStudent = async (data: { studentId: string; programId: string }) => {
    try {
      await api.post('/dashboard/student-schedule', {
        student: data.studentId,
        program: data.programId,
        classroom: classroomId,
      });
      toast.success(t('studentAddedSuccessfully'));
      setAddStudentOpen(false);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || err.message);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isRTL = locale === 'ar';

  const studentsInTheClassroom = studentSchedules.map((s) => s.student.documentId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-[1200px] max-h-[90vh]" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-7 w-7" />
              {t('studentsInClassroom')}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {t('studentsInClassroomDescription', { classroom: classroomName })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('searchStudents')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
              <Button
                onClick={() => setAddStudentOpen(true)}
                disabled={isLoading}
                className="flex items-center gap-2 h-12 px-6"
                size="lg"
              >
                <UserPlus className="h-5 w-5" />
                {t('addStudent')}
              </Button>
            </div>

            {/* Students Count */}
            <div className="flex items-center justify-between">
              <p className="text-base text-muted-foreground">
                {t('totalStudents', {
                  count: filteredStudentSchedules.length,
                  total: studentSchedules.length,
                })}
              </p>
            </div>

            {/* Students List */}
            <ScrollArea className="max-h-[600px] pr-4 overflow-y-auto">
              {filteredStudentSchedules.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="h-20 w-20 mx-auto mb-6 opacity-50" />
                  <p className="text-xl font-medium">{searchTerm ? t('noStudentsFound') : t('noStudentsEnrolled')}</p>
                  <p className="text-base mt-2">
                    {searchTerm ? t('tryDifferentSearch') : t('addStudentsToGetStarted')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudentSchedules.map((schedule) => {
                    const user = schedule.student.user;
                    const isRemoving = removingStudentId === schedule.documentId;
                    return (
                      <Card
                        key={schedule.id}
                        className="group relative overflow-hidden  transition-all duration-300 border "
                      >
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        {/* Delete button */}

                        <CardContent className="p-6">
                          {/* Header with Avatar and Status */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="relative">
                              <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                                <AvatarFallback className=" text-white font-bold text-lg">
                                  {user?.name ? getInitials(user.name) : 'ST'}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="flex justify-between flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  color={schedule.student.isActive !== false ? 'default' : 'secondary'}
                                  className={`text-xs px-2 py-1 ${
                                    schedule.student.isActive !== false
                                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {schedule.student.isActive !== false ? t('active') : t('inactive')}
                                </Badge>
                                {schedule.student.isHadScholarship && (
                                  <Badge color="secondary" className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800">
                                    <Award className="h-3 w-3 mr-1" />
                                    {t('scholarship')}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openDeleteConfirmation(
                                    schedule.documentId,
                                    schedule.student.user?.name || t('unknownStudent')
                                  )
                                }
                                disabled={isLoading || isRemoving}
                                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 shadow-sm border border-gray-200/50 group-hover:opacity-100 transition-all duration-200"
                              >
                                {isRemoving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Student Info */}
                          <div className="space-y-3">
                            <div>
                              <button
                                onClick={() => handleStudentClick(schedule.student.documentId)}
                                className="text-left w-full group/name"
                              >
                                <h3 className="font-bold text-lg text-gray-900 group-hover/name:text-blue-600 transition-colors duration-200 truncate">
                                  {user?.name || t('unknownStudent')}
                                </h3>
                              </button>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Mail className="h-3 w-3 text-blue-600" />
                                </div>
                                <button
                                  onClick={() => handleStudentClick(schedule.student.documentId)}
                                  className="truncate hover:text-blue-600 transition-colors duration-200"
                                >
                                  {user?.email || t('noEmail')}
                                </button>
                              </div>

                              {user?.phoneNumber && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                    <Phone className="h-3 w-3 text-green-600" />
                                  </div>
                                  <span className="truncate">{user.phoneNumber}</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="flex-shrink-0 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                                  <GraduationCap className="h-3 w-3 text-purple-600" />
                                </div>
                                <span className="truncate font-medium">{schedule.program.name}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Calendar className="h-3 w-3 text-gray-500" />
                                </div>
                                <span className="truncate">
                                  {t('joined')}: {formatDate(schedule.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Student Modal */}
      <AddStudentModal
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        onSubmit={handleAddStudent}
        classroomId={classroomId}
        classroomName={classroomName}
        studentsInTheClassroom={studentsInTheClassroom}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title={t('removeStudentConfirmation')}
        description={t('removeStudentConfirmationDescription', {
          student: studentToDelete?.name || '',
          classroom: classroomName,
        })}
        confirmText={t('removeStudent')}
        cancelText={t('cancel')}
        onConfirm={handleRemoveStudent}
        variant="destructive"
        isLoading={removingStudentId === studentToDelete?.id}
      />
    </>
  );
}
