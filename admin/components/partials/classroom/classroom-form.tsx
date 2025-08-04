'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, GraduationCap, Loader2, School, UserCheck, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { LoadingOverlay } from '@/components/loading-overlay';
import { MultiSelect } from '@/components/multi-select';
import { ScheduleManager } from '@/components/schedule-manager';
import { SearchableSelect } from '@/components/searchable-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { fetchPrograms, fetchSupervisors, fetchTeachers } from '@/lib/api/classroom-api';
import {
  useClassroomSchemas,
  type ClassroomCreateData,
  type ClassroomData,
  type ClassroomUpdateData,
  type Program,
  type Supervisor,
  type Teacher,
} from '@/lib/schemas/classroom';

interface ClassroomFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<ClassroomData>;
}

export function ClassroomForm({ mode, initialData }: ClassroomFormProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingSupervisors, setLoadingSupervisors] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('ClassroomForm');
  const locale = useLocale();
  const { classroomCreateSchema, classroomUpdateSchema } = useClassroomSchemas();

  const schema = mode === 'create' ? classroomCreateSchema : classroomUpdateSchema;

  const form = useForm<ClassroomCreateData | ClassroomUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: {
      classroomName: initialData?.classroomName || '',
      programId: initialData?.programId || '',
      teacherId: initialData?.teacherId || '',
      supervisorIds: initialData?.supervisorIds || [],
      schedules: initialData?.schedules || [],
    },
  });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [programsData, teachersData, supervisorsData] = await Promise.all([
          fetchPrograms(),
          fetchTeachers(),
          fetchSupervisors(),
        ]);

        setPrograms(programsData);
        setTeachers(teachersData);
        setSupervisors(supervisorsData);
      } catch (error) {
        console.error('Error loading classroom data:', error);
      } finally {
        setLoadingPrograms(false);
        setLoadingTeachers(false);
        setLoadingSupervisors(false);
      }
    };

    loadData();
  }, []);

  const isRTL = locale === 'ar';
  const isDataLoading = loadingPrograms || loadingTeachers || loadingSupervisors;

  const handleSubmit = (data: ClassroomCreateData | ClassroomUpdateData) => {};

  return (
    <Card className="w-full max-w-4xl mx-auto relative">
      <LoadingOverlay isLoading={isLoading} message={mode === 'create' ? t('creating') : t('updating')} />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-6 w-6" />
          {mode === 'create' ? t('createClassroom') : t('updateClassroom')}
        </CardTitle>
        <CardDescription>
          {mode === 'create' ? t('createClassroomDescription') : t('updateClassroomDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <School className="h-5 w-5" />
                {t('basicInformation')}
              </h3>
              <FormField
                control={form.control}
                name="classroomName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('classroomName')}</FormLabel>
                    <FormControl>
                      <Input
                        size={'lg'}
                        placeholder={t('enterClassroomName')}
                        {...field}
                        className={isRTL ? 'text-right' : ''}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Assignment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t('assignmentInformation')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('program')}</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          options={programs.map((program) => ({
                            id: program.id,
                            name: program.name,
                            description: program.description,
                            metadata:
                              program.duration && program.level ? `${program.duration} • ${program.level}` : undefined,
                          }))}
                          selected={field.value}
                          onSelectionChange={field.onChange}
                          placeholder={t('selectProgram')}
                          searchPlaceholder={t('searchPrograms')}
                          emptyText={t('noPrograms')}
                          loadingText={t('loadingPrograms')}
                          isLoading={loadingPrograms}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('teacher')}</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          options={teachers.map((teacher) => ({
                            id: teacher.id,
                            name: teacher.name,
                            subtitle: teacher.email,
                            metadata:
                              teacher.specialization && teacher.experience
                                ? `${teacher.specialization} • ${teacher.experience} years exp.`
                                : undefined,
                          }))}
                          selected={field.value}
                          onSelectionChange={field.onChange}
                          placeholder={t('selectTeacher')}
                          searchPlaceholder={t('searchTeachers')}
                          emptyText={t('noTeachers')}
                          loadingText={t('loadingTeachers')}
                          isLoading={loadingTeachers}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Supervision Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                {t('supervisionInformation')}
              </h3>
              <FormField
                control={form.control}
                name="supervisorIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('supervisors')}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={supervisors.map((supervisor) => ({
                          ...supervisor,
                          name: `${supervisor.name} (${supervisor.role.replace('_', ' ')})`,
                          email: `${supervisor.email} • ${supervisor.department}`,
                        }))}
                        selected={field.value}
                        onSelectionChange={field.onChange}
                        placeholder={t('selectSupervisors')}
                        searchPlaceholder={t('searchSupervisors')}
                        emptyText={t('noSupervisors')}
                        loadingText={t('loadingSupervisors')}
                        isLoading={loadingSupervisors}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Schedule Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('scheduleInformation')}
              </h3>
              <FormField
                control={form.control}
                name="schedules"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ScheduleManager
                        schedules={field.value}
                        onSchedulesChange={field.onChange}
                        disabled={isLoading}
                        error={form.formState.errors.schedules?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Students Section (Update Mode Only) */}
            {mode === 'update' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('students')}
                  </h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('students')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('studentsCount', { count: initialData?.studentsCount || 0 })}
                        </p>
                      </div>
                    </div>
                    <Button type="button" variant="outline" disabled={isLoading}>
                      {t('viewStudents')}
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className={`flex justify-end space-x-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" disabled={isLoading || isDataLoading}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading || isDataLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'create' ? t('creating') : t('updating')}
                  </>
                ) : mode === 'create' ? (
                  t('createClassroomButton')
                ) : (
                  t('updateClassroomButton')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
