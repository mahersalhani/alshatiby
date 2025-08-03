'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Key, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { PasswordUpdateModal } from './password-update-modal';

import { useRouter } from '@/components/navigation';
import DatePicker from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/axios';
import {
  useEmployeeSchemas,
  type EmployeeCreateData,
  type EmployeeUpdateData,
  type PasswordUpdateData,
} from '@/lib/schemas/employee';

interface EmployeeFormProps {
  mode?: 'create' | 'update';
  initialData?: Partial<EmployeeUpdateData>;
  // onSubmit: (data: EmployeeCreateData | EmployeeUpdateData) => void;
  // onPasswordUpdate?: (data: PasswordUpdateData) => void;
}

export function EmployeeForm({ mode = 'create', initialData }: EmployeeFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const router = useRouter();
  const scopT = useTranslations();
  const t = useTranslations('EmployeeForm');
  const locale = useLocale();
  const { employeeCreateSchema, employeeUpdateSchema } = useEmployeeSchemas();
  const [isLoading, setIsLoading] = useState(false);

  const schema = mode === 'create' ? employeeCreateSchema : employeeUpdateSchema;

  const form = useForm<EmployeeCreateData | EmployeeUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'TEACHER',
      nationality: initialData?.nationality || '',
      residenceCountry: initialData?.residenceCountry || '',
      gender: initialData?.gender || 'MALE',
      birthday: initialData?.birthday ? new Date(initialData?.birthday) : undefined,
      phoneNumber: initialData?.phoneNumber || '',
      joinedAt: initialData?.joinedAt ? new Date(initialData?.joinedAt) : undefined,
      ...(mode === 'create' && { password: '' }),
    },
  });

  const isEdit = mode === 'update';

  const handlePasswordUpdate = (data: PasswordUpdateData) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        await api.put(`/dashboard/employee/${initialData?.documentId}/password`, {
          password: data.newPassword,
        });
        toast.success(t('password_updated_successfully'));
        setPasswordModalOpen(false);
      } catch (err: any) {
        toast.error(scopT(err.response?.data?.error?.message) || err.message);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleSubmit = (data: EmployeeCreateData | EmployeeUpdateData) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        if (!isEdit) {
          const res = await api.post('/dashboard/employee', data);
          toast.success(t('employee_created_successfully'));

          const employee = res.data;

          router.push(`/employees/${employee.documentId}`);
        } else {
          if (!initialData?.documentId) {
            return;
          }
          await api.put(`/dashboard/employee/${initialData.documentId}`, data);
          toast.success(t('employee_updated_successfully'));
        }
      } catch (err: any) {
        toast.error(scopT(err.response?.data?.error?.message) || err.message);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const isRTL = locale === 'ar';

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <CardHeader>
          <CardTitle>{mode === 'create' ? t('createEmployee') : t('updateEmployee')}</CardTitle>
          <CardDescription>
            {mode === 'create' ? t('createEmployeeDescription') : t('updateEmployeeDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('personalInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fullName')}</FormLabel>
                        <FormControl>
                          <Input size="lg" {...field} className={isRTL ? 'text-right' : ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input
                            size="lg"
                            type="email"
                            placeholder={t('enterEmailAddress')}
                            {...field}
                            className={isRTL ? 'text-right' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            size="lg"
                            placeholder={t('enterPhoneNumber')}
                            {...field}
                            className={isRTL ? 'text-right' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('gender')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger size="lg" className={isRTL ? 'text-right' : ''}>
                              <SelectValue placeholder={t('selectGender')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">{t('male')}</SelectItem>
                            <SelectItem value="FEMALE">{t('female')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('birthday')}</FormLabel>
                        <DatePicker onDateChange={field.onChange} value={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('nationality')}</FormLabel>
                        <FormControl>
                          <Input size="lg" {...field} className={isRTL ? 'text-right' : ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="residenceCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('residenceCountry')}</FormLabel>
                        <FormControl>
                          <Input
                            size="lg"
                            placeholder={t('enterResidenceCountry')}
                            {...field}
                            className={isRTL ? 'text-right' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Work Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('workInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('role')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger size="lg" className={isRTL ? 'text-right' : ''}>
                              <SelectValue placeholder={t('selectRole')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TEACHER">{t('teacher')}</SelectItem>
                            <SelectItem value="PROGRAMS_SUPERVISOR">{t('programsSupervisor')}</SelectItem>
                            <SelectItem value="CLASSROOM_SUPERVISOR">{t('classroomSupervisor')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="joinedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('joinedDate')}</FormLabel>
                        <DatePicker onDateChange={field.onChange} value={field.value} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{mode === 'create' ? t('security') : t('passwordManagement')}</h3>
                {mode === 'create' ? (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={t('enterPassword')}
                              className={isRTL ? 'pr-10 text-right' : 'pr-10'}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`absolute ${
                              isRTL ? 'left-0' : 'right-0'
                            } top-0 h-full px-3 py-2 hover:bg-transparent`}
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('password')}</p>
                        <p className="text-sm text-muted-foreground">{t('passwordUpdateDescription')}</p>
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={() => setPasswordModalOpen(true)}>
                      {t('updatePassword')}
                    </Button>
                  </div>
                )}
              </div>

              <div className={`flex justify-end gap-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Button type="button" variant="outline">
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === 'create' ? t('creating') : t('updating')}
                    </>
                  ) : mode === 'create' ? (
                    t('createEmployeeButton')
                  ) : (
                    t('updateEmployeeButton')
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <PasswordUpdateModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        onSubmit={handlePasswordUpdate}
        isLoading={isLoading}
      />
    </>
  );
}
