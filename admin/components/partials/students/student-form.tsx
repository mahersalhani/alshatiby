'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, CreditCard, Eye, EyeOff, FileText, History, Key, Loader2, Plus, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { startTransition, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { LoadingOverlay } from '@/components/loading-overlay';
import { useRouter } from '@/components/navigation';
import { PasswordUpdateModal } from '@/components/password-update-modal';
import { PaymentAlertComponent } from '@/components/payment-alert';
import { PaymentEditModal } from '@/components/payment-edit-modal';
import { PaymentModal } from '@/components/payment-modal';
import { PaymentTimelineModal } from '@/components/payment-timeline-modal';
import DatePicker from '@/components/shared/date-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/axios';
import type { Payment, PaymentAlert } from '@/lib/schemas/payment';
import {
  useStudentSchemas,
  type StudentCreateData,
  type StudentPasswordUpdateData,
  type StudentUpdateData,
} from '@/lib/schemas/student';

interface StudentFormProps {
  mode: 'create' | 'update';
  initialData?: Partial<StudentUpdateData>;
  queryKey?: (string | number)[];
}

export function StudentForm({ mode, initialData, queryKey }: StudentFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentTimelineOpen, setPaymentTimelineOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(initialData?.payments || []);
  const [paymentAlert, setPaymentAlert] = useState<PaymentAlert | null>(null);
  const [canAddPayment, setCanAddPayment] = useState(true);
  const [paymentEditModalOpen, setPaymentEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const scopT = useTranslations();
  const t = useTranslations('StudentForm');
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { studentCreateSchema, studentUpdateSchema } = useStudentSchemas();

  const schema = mode === 'create' ? studentCreateSchema : studentUpdateSchema;

  const form = useForm<StudentCreateData | StudentUpdateData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || initialData?.name || '',
      email: initialData?.email || initialData?.email || '',
      nationality: initialData?.nationality || initialData?.nationality || '',
      residenceCountry: initialData?.residenceCountry || initialData?.residenceCountry || '',
      gender: initialData?.gender || initialData?.gender || 'MALE',
      birthday:
        (initialData?.birthday || initialData?.birthday) && new Date(initialData?.birthday || initialData?.birthday),
      phoneNumber: initialData?.phoneNumber || initialData?.phoneNumber || '',
      joinedAt:
        (initialData?.joinedAt || initialData?.joinedAt) && new Date(initialData?.joinedAt || initialData?.joinedAt),
      generalNotes: initialData?.generalNotes || '',
      isHadScholarship: initialData?.isHadScholarship || false,
      isActive: initialData?.isActive ?? true,
      ...(mode === 'create' && { password: '' }),
    },
  });

  const isEdit = mode === 'update';

  // Update the useEffect to only run when initialData changes and has payments
  useEffect(() => {
    if (isEdit && initialData?.payments && initialData.payments.length > 0) {
      setPayments(initialData.payments);
      const lastPayment = initialData.payments[0];
      checkPaymentStatus(lastPayment);
    }
    if (isEdit && !initialData?.payments?.length) {
      setPayments([]);

      if (initialData?.isHadScholarship) {
        setPaymentAlert({
          type: 'info',
          message: t('studentHadScholarship'),
        });

        return;
      }

      setPaymentAlert({
        type: 'info',
        message: t('noPaymentsFound'),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initialData?.payments, initialData?.isHadScholarship]);

  const checkPaymentStatus = (lastPayment: Payment) => {
    const now = new Date();
    const endDate = new Date(lastPayment.endDate);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (initialData?.isHadScholarship) {
      setPaymentAlert({
        type: 'info',
        message: t('studentHadScholarship'),
      });

      return;
    }

    if (daysUntilExpiry < 0) {
      setPaymentAlert({
        type: 'error',
        message: t('paymentExpired'),
        nextPaymentDate: lastPayment.endDate,
      });
      setCanAddPayment(true);
    } else if (daysUntilExpiry <= 5) {
      setPaymentAlert({
        type: 'warning',
        message: t('paymentExpiringSoon', { days: daysUntilExpiry }),
        nextPaymentDate: lastPayment.endDate,
      });
      setCanAddPayment(true);
    } else {
      // Payment is active
      setPaymentAlert({
        type: 'success',
        message: t('paymentActive'),
        nextPaymentDate: lastPayment.endDate,
      });
      setCanAddPayment(false);
    }
  };

  const handlePasswordUpdate = (data: StudentPasswordUpdateData) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        await api.put(`/dashboard/student/${initialData?.documentId}/password`, {
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

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentEditModalOpen(true);
  };

  const handlePaymentDelete = async (payment: Payment) => {
    setIsLoading(true);
    try {
      await api.delete(`/dashboard/student-payments/${payment.documentId}`);
      toast.success(t('paymentDeletedSuccessfully'));

      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey });
      }
    } catch (err: any) {
      toast.error(scopT(err.response?.data?.error?.message) || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentUpdate = async (data: any) => {
    setIsLoading(true);
    try {
      await api.put(`/dashboard/student-payments/${data.id}`, {
        paymentType: data.paymentType,
        title: data.title,
        amount: data.amount,
        currency: data.currency,
        startDate: data.startDate,
      });
      toast.success(t('paymentUpdatedSuccessfully'));
      setPaymentEditModalOpen(false);
      setSelectedPayment(null);

      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey });
      }
    } catch (err: any) {
      toast.error(scopT(err.response?.data?.error?.message) || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await api.post('/dashboard/student-payments', data);
      toast.success(t('paymentAddedSuccessfully'));
      setPaymentModalOpen(false);

      // Refetch student data to get updated payments
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey });
        // Also refetch the data to update the UI immediately
        const updatedData = queryClient.getQueryData(queryKey);
        if (updatedData) {
          // The data will be automatically updated by React Query
        }
      }
    } catch (err: any) {
      toast.error(scopT(err.response?.data?.error?.message) || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (data: StudentCreateData | StudentUpdateData) => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        if (!isEdit) {
          const res = await api.post('/dashboard/student', data);
          toast.success(t('student_created_successfully'));

          const student: any = res.data;
          router.push(`/students/${student.documentId}`);
        } else {
          if (!initialData?.documentId) {
            return;
          }
          await api.put(`/dashboard/student/${initialData.documentId}`, data);
          toast.success(t('student_updated_successfully'));

          // Refetch student data if queryKey is provided
          if (queryKey) {
            queryClient.invalidateQueries({ queryKey });
          }
        }
      } catch (err: any) {
        toast.error(scopT(err.response?.data?.error?.message) || err.message);
      } finally {
        setIsLoading(false);
      }
    });
  };

  const isRTL = locale === 'ar';
  const isActiveValue = form.watch('isActive');

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto relative">
        <LoadingOverlay isLoading={isLoading} message={mode === 'create' ? t('creating') : t('updating')} />
        <CardHeader>
          <CardTitle>{mode === 'create' ? t('createStudent') : t('updateStudent')}</CardTitle>
          <CardDescription>
            {mode === 'create' ? t('createStudentDescription') : t('updateStudentDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Payment Alert */}
          {isEdit && paymentAlert && (
            <div className="mb-6">
              <PaymentAlertComponent alert={paymentAlert} />
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('personalInformation')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fullName')}</FormLabel>
                        <FormControl>
                          <Input size="lg" placeholder={t('enterFullName')} {...field} disabled={isLoading} />
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
                            disabled={isLoading}
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
                          <Input size="lg" placeholder={t('enterPhoneNumber')} {...field} disabled={isLoading} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                          <FormControl>
                            <SelectTrigger size="lg">
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
                        <FormControl>
                          <DatePicker onDateChange={field.onChange} value={field.value} />
                        </FormControl>
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
                          <Input size="lg" placeholder={t('enterNationality')} {...field} disabled={isLoading} />
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
                          <Input size="lg" placeholder={t('enterResidenceCountry')} {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('academicInformation')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="joinedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('joinedDate')}</FormLabel>
                        <FormControl>
                          <DatePicker onDateChange={field.onChange} value={field.value} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isHadScholarship"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{t('isHadScholarship')}</FormLabel>
                          <p className="text-sm text-muted-foreground">{t('grantAccessDescription')}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 gap-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t('isActive')}</FormLabel>
                        <p className="text-sm text-muted-foreground">{t('isActiveDescription')}</p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Future sections for attendances and classroom */}
                {mode === 'update' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{t('attendances')}</p>
                          <p className="text-sm text-muted-foreground">{t('attendanceHistory')}</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" disabled={isLoading}>
                        {t('viewAttendances')}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{t('classroom')}</p>
                          <p className="text-sm text-muted-foreground">{t('classroomManagement')}</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" disabled={isLoading}>
                        {t('manageClassroom')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Payment Information (Update Mode Only) */}
              {mode === 'update' && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {t('paymentInformation')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 gap-2">
                          <Plus className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{t('addPayment')}</p>
                            <p className="text-sm text-muted-foreground">{t('addNewPaymentDescription')}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPaymentModalOpen(true)}
                          disabled={isLoading || !canAddPayment || initialData?.isHadScholarship || !isActiveValue}
                        >
                          <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                          {t('addPayment')}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 gap-2">
                          <History className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{t('paymentHistory')}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('totalPayments', { count: payments.length })}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setPaymentTimelineOpen(true)}
                          disabled={isLoading}
                        >
                          <History className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                          {t('viewHistory')}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('additionalInformation')}
                </h3>
                <FormField
                  control={form.control}
                  name="generalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('generalNotes')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('enterGeneralNotes')}
                          className="resize-none"
                          rows={4}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                              size="lg"
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={t('enterPassword')}
                              className="pr-10"
                              disabled={isLoading}
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
                            disabled={isLoading}
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPasswordModalOpen(true)}
                      disabled={isLoading}
                    >
                      {t('updatePassword')}
                    </Button>
                  </div>
                )}
              </div>

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
                    t('addStudentButton')
                  ) : (
                    t('updateStudentButton')
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

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        onSubmit={handlePaymentSubmit}
        studentId={initialData?.documentId || ''}
        isLoading={isLoading}
        existingPayments={payments}
      />

      <PaymentTimelineModal
        open={paymentTimelineOpen}
        onOpenChange={setPaymentTimelineOpen}
        payments={payments}
        isLoading={isLoading}
        onEditPayment={handleEditPayment}
        onDeletePayment={handlePaymentDelete}
      />

      <PaymentEditModal
        open={paymentEditModalOpen}
        onOpenChange={setPaymentEditModalOpen}
        onSubmit={handlePaymentUpdate}
        payment={selectedPayment}
        isLoading={isLoading}
      />
    </>
  );
}
