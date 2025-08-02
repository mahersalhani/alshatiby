'use client';

import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type React from 'react';
import { useMemo, useState } from 'react';

import { useRouter } from '@/components/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeacherClassroomsQuery } from '@/hooks/react-query/classroom';

interface Schedule {
  id: number;
  documentId: string;
  day: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
}

interface Program {
  id: number;
  documentId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
}

interface StudentSchedule {
  id: number;
  documentId: string;
  student: {
    id: number;
    documentId: string;
  };
}

interface Classroom {
  id: number;
  documentId: string;
  classroomName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
  program: Program;
  schedules: Schedule[];
  studentSchedules: StudentSchedule[];
}

const formatTime = (time: string, locale: string) => {
  const [hours, minutes] = time.split(':');
  const hour = Number.parseInt(hours);

  if (locale === 'ar') {
    const ampm = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  } else {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  }
};

const ScheduleSelectionModal = ({
  classroom,
  onScheduleSelect,
  children,
}: {
  classroom: Classroom;
  onScheduleSelect: (scheduleId: string) => void;
  children: React.ReactNode;
}) => {
  const t = useTranslations('classrooms');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [open, setOpen] = useState(false);

  const handleScheduleSelect = (scheduleId: string) => {
    onScheduleSelect(scheduleId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('selectSchedule')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('selectScheduleDescription')}
          </p>
          <div className="space-y-2">
            {classroom.schedules.map((schedule) => (
              <Button
                key={schedule.documentId}
                variant="outline"
                className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                onClick={() => handleScheduleSelect(schedule.documentId)}
              >
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-4 h-4" />
                  <span>{t(`days.${schedule.day.toLowerCase()}`)}</span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {formatTime(schedule.startTime, locale)} - {formatTime(schedule.endTime, locale)}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ScheduleAccordion = ({ schedules }: { schedules: Schedule[] }) => {
  const t = useTranslations('classrooms');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  if (schedules.length === 0) return null;

  if (schedules.length === 1) {
    const schedule = schedules[0];
    return (
      <div
        key={schedule.documentId}
        className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Badge color="secondary" className="font-medium">
            {t(`days.${schedule.day.toLowerCase()}`)}
          </Badge>
        </div>
        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="w-4 h-4 text-green-600" />
          <span className="font-medium">
            {formatTime(schedule.startTime, locale)} - {formatTime(schedule.endTime, locale)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{t('multipleSchedules', { count: schedules.length })}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-3 ">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.documentId}
              className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge color="secondary" className="font-medium">
                  {t(`days.${schedule.day.toLowerCase()}`)}
                </Badge>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium">
                  {formatTime(schedule.startTime, locale)} - {formatTime(schedule.endTime, locale)}
                </span>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const ClassroomCard = ({ classroom }: { classroom: Classroom }) => {
  const t = useTranslations('classrooms');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();

  const studentCount = classroom.studentSchedules.length;

  const handleNavigateToClass = (scheduleId?: string) => {
    const url = scheduleId
      ? `/dashboard/classroom/${classroom.documentId}?schedule=${scheduleId}`
      : `/dashboard/classroom/${classroom.documentId}`;
    router.push(url);
  };

  const handleDirectNavigation = () => {
    if (classroom.schedules.length > 1) {
      // Modal will handle the navigation
      return;
    } else if (classroom.schedules.length === 1) {
      handleNavigateToClass(classroom.schedules[0].documentId);
    } else {
      handleNavigateToClass();
    }
  };

  const NavigationButton = () => {
    const buttonContent = (
      <Button className="w-full" variant="soft" color="primary">
        <span className="flex-1">{t('enterClass')}</span>
        {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
      </Button>
    );

    if (classroom.schedules.length > 1) {
      return (
        <ScheduleSelectionModal classroom={classroom} onScheduleSelect={handleNavigateToClass}>
          {buttonContent}
        </ScheduleSelectionModal>
      );
    }

    return <div onClick={handleDirectNavigation}>{buttonContent}</div>;
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500 ${
        isRTL ? 'border-r-4 border-r-blue-500 border-l-0' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CardTitle
            className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {classroom.classroomName}
          </CardTitle>
          <Badge color="secondary" className={isRTL ? 'mr-2' : 'ml-2'}>
            <Users className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {studentCount} {t('student')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`flex items-center gap-2 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
          <BookOpen className="w-4 h-4" />
          <span className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {classroom.program.name}
          </span>
        </div>

        <ScheduleAccordion schedules={classroom.schedules} />

        <div className={`flex items-center justify-between pt-2 border-t`}>
          <div className={`flex items-center gap-2`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-muted-foreground">{t('active')}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {t('createdAt')}: {new Date(classroom.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
        </div>

        <div className="pt-4">
          <NavigationButton />
        </div>
      </CardContent>
    </Card>
  );
};

const Classrooms = () => {
  const t = useTranslations('classrooms');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { data, isLoading, error } = useTeacherClassroomsQuery();

  const classrooms: Classroom[] = useMemo(() => {
    return data?.results || [];
  }, [data]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ClassroomSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-800 font-medium">{error.message}</p>
            <p className="text-red-600 text-sm mt-1">{t('errorMessage')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStudentCount = (): number => {
    const students = new Set();
    classrooms.forEach((classroom) => {
      classroom.studentSchedules.forEach((studentSchedule) => {
        students.add(studentSchedule.student.documentId);
      });
    });
    return students.size;
  };

  return (
    <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('title')}</h1>
        <p className={`text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>{t('subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className={`flex items-center gap-3`}>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-muted-foreground">{t('stats.totalClassrooms')}</p>
                <p className="text-2xl font-bold">{classrooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className={`flex items-center gap-3`}>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-muted-foreground">{t('stats.totalStudents')}</p>
                <p className="text-2xl font-bold">{getStudentCount()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className={`flex items-center gap-3`}>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm text-muted-foreground">{t('stats.activeClassrooms')}</p>
                <p className="text-2xl font-bold">{classrooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classrooms Grid */}
      {classrooms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
            <p className="text-gray-600">{t('empty.description')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </div>
      )}
    </div>
  );
};

const ClassroomSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </CardContent>
  </Card>
);

export default Classrooms;
