'use client';

import { GraduationCap, Loader2, Mail, Phone, User, UserPlus, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import qs from 'qs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AsyncSelectComponent } from './async-select';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import api from '@/lib/axios';

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { studentId: string; programId: string }) => void;
  classroomId: string;
  classroomName: string;
  studentsInTheClassroom?: string[];
}

export function AddStudentModal({
  open,
  onOpenChange,
  onSubmit,
  classroomId,
  classroomName,
  studentsInTheClassroom,
}: AddStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('AddStudent');
  const locale = useLocale();

  const form = useForm({
    defaultValues: {
      student: '',
      program: '',
    },
  });

  // Load students with search and pagination
  const loadStudentOptions = async (inputValue: string, page: number) => {
    const reqQuery: any = {};

    reqQuery.pagination = {
      page: page,
      pageSize: 10,
    };

    reqQuery.filters = {
      documentId: { $notIn: studentsInTheClassroom || [] },
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

    const { data } = await api.get(`/dashboard/student?${queryString}`);
    const options = data.results.map((student: any) => ({
      value: student.id,
      label: student?.name || student?.email || 'Unknown',
      data: student,
    }));

    return { options, hasMore: data.pagination?.pageCount !== page };
  };

  // Load programs with search and pagination
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

  // Format student option display
  const formatStudentOption = (option: any) => {
    const student = option.data;
    const user = student.user || student;
    return (
      <div className="py-2">
        <div className="font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          {user.name || 'Unknown Student'}
        </div>
        {user.email && (
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        )}
        {user.phoneNumber && (
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <Phone className="h-3 w-3" />
            {user.phoneNumber}
          </div>
        )}
      </div>
    );
  };

  // Format program option display
  const formatProgramOption = (option: any) => (
    <div className="py-2">
      <div className="font-medium flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        {option.data.name}
      </div>
      {option.data.description && <div className="text-sm text-muted-foreground mt-1">{option.data.description}</div>}
      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
        {option.data.duration && <span>Duration: {option.data.duration}</span>}
        {option.data.level && <span>Level: {option.data.level}</span>}
      </div>
    </div>
  );

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit({
        studentId: data.student,
        programId: data.program,
      });
      form.reset();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = locale === 'ar';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-6 w-6" />
            {t('addStudentToClassroom')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('addStudentToClassroomDescription', { classroom: classroomName })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="student"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {t('selectStudent')}
                    </FormLabel>
                    <FormControl>
                      <AsyncSelectComponent
                        loadOptions={loadStudentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('searchAndSelectStudent')}
                        isDisabled={isLoading}
                        formatOptionLabel={formatStudentOption}
                        className="min-h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {t('selectProgram')}
                    </FormLabel>
                    <FormControl>
                      <AsyncSelectComponent
                        loadOptions={loadProgramOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('searchAndSelectProgram')}
                        isDisabled={isLoading}
                        formatOptionLabel={formatProgramOption}
                        className="min-h-[50px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className={`gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('adding')}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('addStudent')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
