'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, GraduationCap, Loader2, School, UserCheck, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import qs from 'qs';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { AsyncMultiSelectComponent } from '@/components/async-multi-select';
import { AsyncSelectComponent } from '@/components/async-select';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useRouter } from '@/components/navigation';
import { ScheduleManager } from '@/components/schedule-manager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/axios';
import {
  useClassroomSchemas,
  type ClassroomCreateData,
  type ClassroomData,
  type ClassroomUpdateData,
} from '@/lib/schemas/classroom';
import { EmployeeRoleEnum } from '@/lib/schemas/employee';

interface ClassroomFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<ClassroomData>;
}

interface ClassroomFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<ClassroomData>;
  // onSubmit: (data: ClassroomCreateData | ClassroomUpdateData) => void;
}

export function ClassroomForm({ mode, initialData }: ClassroomFormProps) {
  const scopT = useTranslations();
  const t = useTranslations('ClassroomForm');
  const locale = useLocale();
  const { classroomCreateSchema, classroomUpdateSchema } = useClassroomSchemas();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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

  const loadProgramOptions = async (inputValue: string, page: number) => {
    const reqQuery: any = {};
    reqQuery.pagination = {
      page: page,
      pageSize: 10,
    };

    reqQuery.filters = {
      isActive: {
        $eq: true,
      },
    };

    if (inputValue) {
      reqQuery.filters = {
        name: {
          $containsi: inputValue,
        },
      };
    }

    const queryString = qs.stringify(reqQuery, {
      skipNulls: true,
    });

    const { data } = await api.get(`/dashboard/program?${queryString}`);

    const options = data.results.map((program: any) => ({
      value: program.id,
      label: program.name,
      data: program,
    }));

    return { options, hasMore: data.pagination?.pageCount !== page };
  };

  const loadTeacherOptions = async (inputValue: string, page: number) => {
    const reqQuery: any = {};

    reqQuery.pagination = {
      page: page,
      pageSize: 10,
    };

    reqQuery.filters = {
      role: {
        $eq: EmployeeRoleEnum.Enum.TEACHER,
      },
    };

    if (inputValue) {
      reqQuery.filters = {
        ...reqQuery.filters,
        user: {
          $or: [
            { name: { $containsi: inputValue } },
            { phoneNumber: { $containsi: inputValue } },
            { email: { $containsi: inputValue } },
          ],
        },
      };
    }
    const queryString = qs.stringify(reqQuery, {
      skipNulls: true,
    });

    const { data } = await api.get(`/dashboard/employee?${queryString}`);
    const options = data.results.map((teacher: any) => ({
      value: teacher.id,
      label: teacher?.name || teacher?.email || 'Unknown',
      data: teacher,
    }));

    return { options, hasMore: data.pagination?.pageCount !== page };
  };

  const loadSupervisorOptions = async (inputValue: string, page: number) => {
    const reqQuery: any = {};

    reqQuery.pagination = {
      page: page,
      pageSize: 10,
    };

    reqQuery.filters = {
      role: {
        $eq: EmployeeRoleEnum.Enum.CLASSROOM_SUPERVISOR,
      },
    };

    if (inputValue) {
      reqQuery.filters = {
        ...reqQuery.filters,
        user: {
          $or: [
            { name: { $containsi: inputValue } },
            { phoneNumber: { $containsi: inputValue } },
            { email: { $containsi: inputValue } },
          ],
        },
      };
    }
    const queryString = qs.stringify(reqQuery, {
      skipNulls: true,
    });

    const { data } = await api.get(`/dashboard/employee?${queryString}`);
    const options = data.results.map((teacher: any) => ({
      value: teacher.id,
      label: teacher?.name || teacher?.email || 'Unknown',
      data: teacher,
    }));

    return { options, hasMore: data.pagination?.pageCount !== page };
  };

  const formatProgramOption = (option: any) => (
    <div className="py-1">
      <div className="font-medium">{option.data.name}</div>
    </div>
  );

  const formatTeacherOption = (option: any) => {
    return (
      <div className="py-1">
        <div className="font-medium">{option.data?.name}</div>
        <div className="text-sm ">{option.data?.email}</div>
      </div>
    );
  };

  const formatSupervisorOption = (option: any) => (
    <div className="py-1">
      <div className="font-medium">{option.data?.name}</div>
      <div className="text-sm ">{option.data?.email}</div>
    </div>
  );

  const formatSelectedSupervisor = (option: any) => (
    <div>
      <div className="font-medium text-xs">{option.data.name}</div>
      <div className="text-xs text-muted-foreground">{scopT(`Form.${option.data?.role?.toLowerCase()}`)}</div>
    </div>
  );

  const isRTL = locale === 'ar';
  const isEdit = mode === 'update';

  const handleSubmit = (data: ClassroomCreateData | ClassroomUpdateData) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const formattedData = {
          ...data,
          program: data.programId,
          teacher: data.teacherId,
          supervisors: data.supervisorIds,
        };

        if (!isEdit) {
          const res = await api.post('/dashboard/classroom', formattedData);
          toast.success(t('classroom_created_successfully'));

          const classroom = res.data;

          router.push(`/classrooms/${classroom.documentId}`);
        } else {
          if (!initialData?.documentId) {
            return;
          }
          await api.put(`/dashboard/classroom/${initialData.documentId}`, formattedData);
          toast.success(t('classroom_updated_successfully'));
        }
      } catch (err: any) {
        toast.error(scopT(err.response?.data?.error?.message) || err.message || 'error.unknown_error');
      } finally {
        setIsLoading(false);
      }
    });
  };

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
                        size={'large'}
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
                        <AsyncSelectComponent
                          loadOptions={loadProgramOptions}
                          value={field.value as any}
                          onChange={field.onChange}
                          placeholder={t('selectProgram')}
                          isDisabled={isLoading}
                          formatOptionLabel={formatProgramOption}
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
                        <AsyncSelectComponent
                          loadOptions={loadTeacherOptions}
                          value={field.value as any}
                          onChange={field.onChange}
                          placeholder={t('selectTeacher')}
                          isDisabled={isLoading}
                          formatOptionLabel={formatTeacherOption}
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
                      <AsyncMultiSelectComponent
                        loadOptions={loadSupervisorOptions}
                        value={field.value as any}
                        onChange={field.onChange}
                        placeholder={t('selectSupervisors')}
                        isDisabled={isLoading}
                        formatOptionLabel={formatSupervisorOption}
                        formatSelectedLabel={formatSelectedSupervisor}
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
                        error={
                          form.formState.errors.schedules?.message ||
                          form.formState.errors?.schedules?.[0]?.endTime?.message ||
                          form.formState.errors?.schedules?.[0]?.startTime?.message
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Students Section (Update Mode Only) */}
            {isEdit && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('students')}
                  </h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-muted-foreground ml-2 ltr:mr-2" />
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
              <Button type="button" variant="outline" disabled={isLoading}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
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
