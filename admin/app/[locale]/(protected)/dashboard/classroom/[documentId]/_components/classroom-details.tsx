'use client';

import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, Mail, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface Student {
  id: number;
  documentId: string;
  user: {
    id: number;
    documentId: string;
    email: string;
    name: string;
    gender: 'MALE' | 'FEMALE';
    birthday: string;
  };
}

interface StudentSchedule {
  id: number;
  documentId: string;
  student: Student;
}

export interface Classroom {
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

const calculateAge = (birthday: string): number => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const StudentCard = ({ studentSchedule }: { studentSchedule: StudentSchedule }) => {
  const { student } = studentSchedule;
  const age = calculateAge(student.user.birthday);
  const t = useTranslations('classrooms');

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className={`flex items-center gap-3 `}>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              student.user.gender === 'MALE' ? 'bg-blue-100' : 'bg-pink-100'
            }`}
          >
            <User className={`w-6 h-6 ${student.user.gender === 'MALE' ? 'text-blue-600' : 'text-pink-600'}`} />
          </div>
          <div className={`flex-1`}>
            <CardTitle className="text-lg font-semibold">{student.user.name}</CardTitle>
            <div className={`flex items-center gap-2 mt-1 `}>
              <Badge color={student.user.gender === 'MALE' ? 'primary' : 'destructive'} className="text-xs">
                {t(student.user.gender.toLowerCase())}
              </Badge>
              <Badge color="secondary" className="text-xs">
                {age} {t('yearsOld')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`flex items-center gap-2 text-sm text-muted-foreground `}>
          <Mail className="w-4 h-4" />
          <span className={''}>{student.user.email}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ScheduleSelector = ({
  schedules,
  selectedSchedule,
  onScheduleChange,
  locale,
}: {
  schedules: Schedule[];
  selectedSchedule: Schedule;
  onScheduleChange: (schedule: Schedule) => void;
  locale: string;
}) => {
  const t = useTranslations('classrooms');

  if (schedules.length <= 1) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className={`text-lg`}>{t('availableSchedules')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schedules.map((schedule) => (
            <Button
              key={schedule.documentId}
              variant={selectedSchedule.documentId === schedule.documentId ? 'default' : 'outline'}
              className={`justify-between h-auto p-4 `}
              onClick={() => onScheduleChange(schedule)}
            >
              <div className={`flex items-center gap-2 `}>
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{t(`days.${schedule.day.toLowerCase()}`)}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm `}>
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(schedule.startTime, locale)} - {formatTime(schedule.endTime, locale)}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ClassroomDetailsProps {
  locale: string;
  classroom: Classroom;
  schedule?: string;
}

const ClassroomDetails = ({ locale, classroom, schedule }: ClassroomDetailsProps) => {
  const t = useTranslations('classrooms');

  const isRTL = locale === 'ar';

  const defaultSchedule = schedule
    ? classroom.schedules.find((s) => s.documentId === schedule) || classroom.schedules[0]
    : classroom.schedules[0];

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>(defaultSchedule);

  const studentCount = classroom.studentSchedules.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/${locale}/dashboard`}>
            <Button variant="outline" className={`flex items-center gap-2 `}>
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t('backToClassrooms')}
            </Button>
          </Link>
        </div>

        {/* Classroom Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className={`text-4xl font-bold text-gray-900 mb-4`}>{classroom.classroomName}</h1>
          <div className={`flex items-center gap-4 flex-wrap `}>
            <Badge color="secondary" className="text-lg px-4 py-2">
              <Users className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {studentCount} {t('student')}
            </Badge>
            <Badge color="success" className="text-lg px-4 py-2">
              {t('active')}
            </Badge>
            {selectedSchedule && (
              <Badge color="default" className="text-lg px-4 py-2">
                <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t(`days.${selectedSchedule.day.toLowerCase()}`)}
              </Badge>
            )}
          </div>
        </div>

        {/* Schedule Selector (only show if multiple schedules) */}
        {classroom.schedules.length > 1 && (
          <ScheduleSelector
            schedules={classroom.schedules}
            selectedSchedule={selectedSchedule}
            onScheduleChange={(schedule) => {
              // This would typically update the URL
              window.history.replaceState(
                null,
                '',
                `/${locale}/dashboard/classroom/${classroom.documentId}?schedule=${schedule.documentId}`
              );

              setSelectedSchedule(schedule);
            }}
            locale={locale}
          />
        )}

        {/* Classroom Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Program Information */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 `}>
                <BookOpen className="w-5 h-5" />
                {t('programInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold mb-2`}>{t('programName')}</h3>
                  <p className={`text-muted-foreground`}>{classroom.program.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold mb-2`}>{t('status')}</h3>
                  <Badge color={classroom.program.isActive ? 'default' : 'secondary'}>
                    {t(classroom.program.isActive ? 'active' : 'inactive')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 `}>
                <Calendar className="w-5 h-5" />
                {t('currentSchedule')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSchedule ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold mb-2`}>{t('classDay')}</h3>
                    <Badge color="secondary" className=" px-4 py-2">
                      {t(`days.${selectedSchedule.day.toLowerCase()}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold mb-2`}>{t('classTime')}</h3>
                    <div className={`flex items-center gap-2 text-lg `}>
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-medium">
                        {formatTime(selectedSchedule.startTime, locale)} -{' '}
                        {formatTime(selectedSchedule.endTime, locale)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className={`text-muted-foreground`}>{t('no_schedule available')}</p>
              )}
            </CardContent>
          </Card>

          {/* Class Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 `}>
                <Users className="w-5 h-5" />
                {t('classStatistics')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`flex justify-between items-center `}>
                  <span className="text-muted-foreground">{t('stats.totalStudents')}</span>
                  <span className="font-bold text-xl">{studentCount}</span>
                </div>
                <div className={`flex justify-between items-center `}>
                  <span className="text-muted-foreground">{t('availableSchedules')}</span>
                  <span className="font-bold text-xl">{classroom.schedules.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Section */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2`}>
              <Users className="w-5 h-5" />
              {t('studentsList')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classroom.studentSchedules.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_students')}</h3>
                <p className="text-gray-600">{t('no_student_yet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classroom.studentSchedules.map((studentSchedule) => (
                  <StudentCard key={studentSchedule.documentId} studentSchedule={studentSchedule} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button size="lg" className="w-full">
            {locale === 'ar' ? 'بدء الفصل' : 'Start Class'}
          </Button>
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            {locale === 'ar' ? 'إدارة الطلاب' : 'Manage Students'}
          </Button>
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            {locale === 'ar' ? 'تعديل الجدول' : 'Edit Schedule'}
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export { ClassroomDetails };
