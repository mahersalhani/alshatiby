// components/partials/students/student-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // قد تحتاج لاستيراد Textarea
import { Checkbox } from '@/components/ui/checkbox'; // قد تحتاج لاستيراد Checkbox

import api from '@/lib/axios';
import { cn } from '@/lib/utils';

// 1. تحديد الـ Enum (إذا كانت هناك قيم ثابتة)
// هذه القيم يجب أن تتطابق مع قيم الـ Enumeration التي قمت بتعريفها في Strapi
enum ProgramType {
  HIFZ = 'Hifz',
  DABT = 'Dabt',
  IJAZAH = 'Ijazah',
  // أضف أي أنواع برامج أخرى لديك في Strapi
}

enum SessionType {
  FIRST = 'first',
  SECOND = 'second',
  // أضف أي أنواع حلقات أخرى لديك في Strapi
}

enum SubscriptionType {
  MONTHLY = 'monthly',
  BIMONTHLY = 'bi-monthly',
  THREE_MONTHS = '3-months',
  SIX_MONTHS = '6-months',
  YEARLY = 'yearly',
}

enum CurrencyType {
  TRY = 'TRY',
  USD = 'USD',
}

// 2. تعريف الـ Schema لـ Zod (للتحقق من صحة البيانات)
// تأكد من أن أسماء الحقول هنا (مثل name, nationality) تتطابق تمامًا مع أسماء الـ API ID في Strapi
const schema = z.object({
  name: z.string().min(1, 'student_name_required'),
  nationality: z.string().min(1, 'nationality_required'),
  countryOfResidence: z.string().min(1, 'country_of_residence_required'),
  gender: z.enum(['male', 'female'], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'gender_required' };
      }
      return { message: 'Invalid gender' };
    },
  }),
  dateOfBirth: z.string().min(1, 'date_of_birth_required'), // يمكن استخدام z.date() إذا كنت تحولها لـ Date object
  contactNumber: z.string().optional(),
  generalNotes: z.string().optional(),
  dateOfJoining: z.string().min(1, 'date_of_joining_required'),
  workingDays: z.string().optional(), // إذا كان نصًا واحدًا، وإلا استخدم z.array(z.string())
  teacherName: z.string().optional(),
  programType: z.enum([ProgramType.HIFZ, ProgramType.DABT, ProgramType.IJAZAH], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'program_type_required' };
      }
      return { message: 'Invalid program type' };
    },
  }),
  session: z.enum([SessionType.FIRST, SessionType.SECOND], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'session_required' };
      }
      return { message: 'Invalid session' };
    },
  }),
  subscriptionType: z.enum([
    SubscriptionType.MONTHLY,
    SubscriptionType.BIMONTHLY,
    SubscriptionType.THREE_MONTHS,
    SubscriptionType.SIX_MONTHS,
    SubscriptionType.YEARLY,
  ], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'subscription_type_required' };
      }
      return { message: 'Invalid subscription type' };
    },
  }),
  isGrant: z.boolean(),
  lastPaymentDate: z.string().optional(), // سيكون مطلوبًا بشكل شرطي في الواجهة الأمامية
  currencyType: z.enum([CurrencyType.TRY, CurrencyType.USD]).optional(), // سيكون مطلوبًا بشكل شرطي
  amount: z.union([z.number().min(0, 'amount_must_be_positive'), z.literal('')]).optional(), // يمكن أن يكون رقمًا أو فارغًا
}).superRefine((data, ctx) => {
  // التحقق الشرطي: إذا لم تكن منحة، يجب أن تكون حقول الدفع موجودة
  if (!data.isGrant) {
    if (!data.lastPaymentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'last_payment_date_required',
        path: ['lastPaymentDate'],
      });
    }
    if (!data.currencyType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'currency_type_required',
        path: ['currencyType'],
      });
    }
    if (data.amount === undefined || data.amount === null || data.amount === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'amount_required',
        path: ['amount'],
      });
    }
  }
});


const StudentForm = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Form'); // تأكد من وجود ترجمات لـ 'Form' في ملفات i18n الخاصة بك

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch, // لـ watch قيمة isGrant
    setValue, // لضبط قيمة amount عند التبديل بين المنحة/غير المنحة
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      nationality: '',
      countryOfResidence: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      generalNotes: '',
      dateOfJoining: '',
      workingDays: '',
      teacherName: '',
      programType: ProgramType.HIFZ, // قيمة افتراضية
      session: SessionType.FIRST, // قيمة افتراضية
      subscriptionType: SubscriptionType.MONTHLY, // قيمة افتراضية
      isGrant: false,
      lastPaymentDate: '',
      currencyType: CurrencyType.TRY, // قيمة افتراضية
      amount: 0, // قيمة افتراضية
    },
  });

  const isGrant = watch('isGrant'); // مراقبة قيمة isGrant

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        // إذا كانت منحة، قم بتصفير حقول الدفع قبل الإرسال
        if (data.isGrant) {
          data.lastPaymentDate = '';
          data.currencyType = undefined; // أو null
          data.amount = undefined; // أو null
        }
        
        // ****** تأكد من أن هذا الرابط هو endpoint الصحيح لـ Strapi Student API ******
        // عادة ما يكون Strapi على http://localhost:1337
        await api.post('/students', { data }); // Strapi يتوقع البيانات تحت مفتاح 'data'
        toast.success(t('Student.student_created_successfully'));
        router.push('/students'); // التوجيه إلى صفحة قائمة الطلاب بعد النجاح
      } catch (err: any) {
        console.error('Failed to create student:', err);
        // عرض رسالة خطأ أكثر تفصيلاً إذا كانت متاحة من Strapi
        toast.error(err.response?.data?.error?.message || t('Student.failed_to_create_student'));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('Student.add_new_student')}</h1>
        <p className="text-muted-foreground">{t('Student.create_new_student_record')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4 rounded-lg">
          <div className="col-span-12 space-y-4">
            <Card>
              <CardHeader className="border-b border-solid border-default-200 mb-6">
                <CardTitle>{t('Student.student_information')}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-12 gap-4">
                {/* اسم الطالب */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="name" className="font-medium text-default-600">
                    {t('Student.student_name')} *
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('name')}
                    type="text"
                    id="name"
                    className={cn('', { 'border-destructive ': errors.name })}
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{t(errors.name.message as string)}</p>}
                </div>

                {/* الجنسية */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="nationality" className="font-medium text-default-600">
                    {t('Student.nationality')} *
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('nationality')}
                    type="text"
                    id="nationality"
                    className={cn('', { 'border-destructive ': errors.nationality })}
                  />
                  {errors.nationality && <p className="text-destructive text-sm mt-1">{t(errors.nationality.message as string)}</p>}
                </div>

                {/* بلد الإقامة */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="countryOfResidence" className="font-medium text-default-600">
                    {t('Student.country_of_residence')} *
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('countryOfResidence')}
                    type="text"
                    id="countryOfResidence"
                    className={cn('', { 'border-destructive ': errors.countryOfResidence })}
                  />
                  {errors.countryOfResidence && <p className="text-destructive text-sm mt-1">{t(errors.countryOfResidence.message as string)}</p>}
                </div>

                {/* الجنس */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="gender" className="font-medium text-default-600">
                    {t('Student.gender')} *
                  </Label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger className={cn('', { 'border-destructive ': errors.gender })}>
                          <SelectValue placeholder={t('Student.select_gender')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('Student.gender')}</SelectLabel>
                            <SelectItem value="male">{t('Student.male')}</SelectItem>
                            <SelectItem value="female">{t('Student.female')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && <p className="text-destructive text-sm mt-1">{t(errors.gender.message as string)}</p>}
                </div>

                {/* تاريخ الميلاد */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="dateOfBirth" className="font-medium text-default-600">
                    {t('Student.date_of_birth')} *
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('dateOfBirth')}
                    type="date"
                    id="dateOfBirth"
                    className={cn('', { 'border-destructive ': errors.dateOfBirth })}
                  />
                  {errors.dateOfBirth && <p className="text-destructive text-sm mt-1">{t(errors.dateOfBirth.message as string)}</p>}
                </div>

                {/* رقم التواصل */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="contactNumber" className="font-medium text-default-600">
                    {t('Student.contact_number')}
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('contactNumber')}
                    type="tel"
                    id="contactNumber"
                    className={cn('', { 'border-destructive ': errors.contactNumber })}
                  />
                  {errors.contactNumber && <p className="text-destructive text-sm mt-1">{t(errors.contactNumber.message as string)}</p>}
                </div>

                {/* ملاحظات عامة */}
                <div className="space-y-2 col-span-12">
                  <Label htmlFor="generalNotes" className="font-medium text-default-600">
                    {t('Student.general_notes')}
                  </Label>
                  <Textarea
                    disabled={isPending}
                    {...register('generalNotes')}
                    id="generalNotes"
                    className={cn('', { 'border-destructive ': errors.generalNotes })}
                  />
                  {errors.generalNotes && <p className="text-destructive text-sm mt-1">{t(errors.generalNotes.message as string)}</p>}
                </div>

                {/* تاريخ الانضمام للمقرأة */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="dateOfJoining" className="font-medium text-default-600">
                    {t('Student.date_of_joining')} *
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('dateOfJoining')}
                    type="date"
                    id="dateOfJoining"
                    className={cn('', { 'border-destructive ': errors.dateOfJoining })}
                  />
                  {errors.dateOfJoining && <p className="text-destructive text-sm mt-1">{t(errors.dateOfJoining.message as string)}</p>}
                </div>

                {/* أيام الدوام (اختياري) */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="workingDays" className="font-medium text-default-600">
                    {t('Student.working_days')}
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('workingDays')}
                    type="text"
                    id="workingDays"
                    placeholder={t('Student.example_working_days')}
                    className={cn('', { 'border-destructive ': errors.workingDays })}
                  />
                  {errors.workingDays && <p className="text-destructive text-sm mt-1">{t(errors.workingDays.message as string)}</p>}
                </div>

                {/* اسم المعلم (اختياري) */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="teacherName" className="font-medium text-default-600">
                    {t('Student.teacher_name')}
                  </Label>
                  <Input
                    disabled={isPending}
                    {...register('teacherName')}
                    type="text"
                    id="teacherName"
                    className={cn('', { 'border-destructive ': errors.teacherName })}
                  />
                  {errors.teacherName && <p className="text-destructive text-sm mt-1">{t(errors.teacherName.message as string)}</p>}
                </div>

                {/* نوع البرنامج */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="programType" className="font-medium text-default-600">
                    {t('Student.program_type')} *
                  </Label>
                  <Controller
                    control={control}
                    name="programType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger className={cn('', { 'border-destructive ': errors.programType })}>
                          <SelectValue placeholder={t('Student.select_program_type')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('program_types')}</SelectLabel>
                            <SelectItem value={ProgramType.HIFZ}>{t('Student.hifz')}</SelectItem>
                            <SelectItem value={ProgramType.DABT}>{t('Student.dabt')}</SelectItem>
                            <SelectItem value={ProgramType.IJAZAH}>{t('Student.ijazah')}</SelectItem>
                            {/* أضف المزيد من SelectItem هنا إذا كان لديك أنواع برامج أخرى */}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.programType && <p className="text-destructive text-sm mt-1">{t(errors.programType.message as string)}</p>}
                </div>

                {/* الحلقة */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="session" className="font-medium text-default-600">
                    {t('Student.session')} *
                  </Label>
                  <Controller
                    control={control}
                    name="session"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger className={cn('', { 'border-destructive ': errors.session })}>
                          <SelectValue placeholder={t('Student.select_session')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('Student.sessions')}</SelectLabel>
                            <SelectItem value={SessionType.FIRST}>{t('Student.first_session')}</SelectItem>
                            <SelectItem value={SessionType.SECOND}>{t('Student.second_session')}</SelectItem>
                            {/* أضف المزيد من SelectItem هنا إذا كان لديك حلقات أخرى */}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.session && <p className="text-destructive text-sm mt-1">{t(errors.session.message as string)}</p>}
                </div>

                {/* نوع الاشتراك */}
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="subscriptionType" className="font-medium text-default-600">
                    {t('Student.subscription_type')} *
                  </Label>
                  <Controller
                    control={control}
                    name="subscriptionType"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger className={cn('', { 'border-destructive ': errors.subscriptionType })}>
                          <SelectValue placeholder={t('Student.select_subscription_type')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('Student.subscription_types')}</SelectLabel>
                            <SelectItem value={SubscriptionType.MONTHLY}>{t('Student.monthly')}</SelectItem>
                            <SelectItem value={SubscriptionType.BIMONTHLY}>{t('Student.bi_monthly')}</SelectItem>
                            <SelectItem value={SubscriptionType.THREE_MONTHS}>{t('Student.three_months')}</SelectItem>
                            <SelectItem value={SubscriptionType.SIX_MONTHS}>{t('Student.six_months')}</SelectItem>
                            <SelectItem value={SubscriptionType.YEARLY}>{t('Student.yearly')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subscriptionType && <p className="text-destructive text-sm mt-1">{t(errors.subscriptionType.message as string)}</p>}
                </div>

                {/* منحة (Checkbox) */}
                <div className="space-y-2 col-span-12 sm:col-span-6 flex items-center gap-2">
                  <Controller
                    control={control}
                    name="isGrant"
                    render={({ field }) => (
                      <Checkbox
                        id="isGrant"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // إذا تم تحديد منحة، قم بتصفير حقول الدفع
                          if (checked) {
                            setValue('lastPaymentDate', '');
                            setValue('currencyType', undefined);
                            setValue('amount', '');
                          }
                        }}
                        disabled={isPending}
                      />
                    )}
                  />
                  <Label htmlFor="isGrant" className="font-medium text-default-600">
                    {t('Student.is_grant')}
                  </Label>
                </div>

                {/* حقول الدفع - تظهر فقط إذا لم تكن منحة */}
                {!isGrant && (
                  <>
                    {/* تاريخ آخر دفعة */}
                    <div className="space-y-2 col-span-12 sm:col-span-6">
                      <Label htmlFor="lastPaymentDate" className="font-medium text-default-600">
                        {t('Student.last_payment_date')} *
                      </Label>
                      <Input
                        disabled={isPending}
                        {...register('lastPaymentDate')}
                        type="date"
                        id="lastPaymentDate"
                        className={cn('', { 'border-destructive ': errors.lastPaymentDate })}
                      />
                      {errors.lastPaymentDate && <p className="text-destructive text-sm mt-1">{t(errors.lastPaymentDate.message as string)}</p>}
                    </div>

                    {/* نوع العملة */}
                    <div className="space-y-2 col-span-12 sm:col-span-6">
                      <Label htmlFor="currencyType" className="font-medium text-default-600">
                        {t('Student.currency_types')} *
                      </Label>
                      <Controller
                        control={control}
                        name="currencyType"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isPending}
                          >
                            <SelectTrigger className={cn('', { 'border-destructive ': errors.currencyType })}>
                              <SelectValue placeholder={t('Student.select_currency_type')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>{t('Student.currency_types')}</SelectLabel>
                                <SelectItem value={CurrencyType.TRY}>{t('Student.turkish_lira')}</SelectItem>
                                <SelectItem value={CurrencyType.USD}>{t('Student.us_dollar')}</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.currencyType && <p className="text-destructive text-sm mt-1">{t(errors.currencyType.message as string)}</p>}
                    </div>

                    {/* المبلغ */}
                    <div className="space-y-2 col-span-12 sm:col-span-6">
                      <Label htmlFor="amount" className="font-medium text-default-600">
                        {t('Student.amount')} *
                      </Label>
                      <Input
                        disabled={isPending}
                        {...register('amount', { valueAsNumber: true })} // مهم لتحويل القيمة إلى رقم
                        type="number"
                        id="amount"
                        className={cn('', { 'border-destructive ': errors.amount })}
                      />
                      {errors.amount && <p className="text-destructive text-sm mt-1">{t(errors.amount.message as string)}</p>}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 flex justify-end">
            <Button disabled={isPending} type="submit">
              {isPending ? t('Student.saving') : t('Student.save_student')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;