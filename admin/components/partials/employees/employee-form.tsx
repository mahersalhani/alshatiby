'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createEmployee } from '@/action/employee';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
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
import { cn } from '@/lib/utils';

enum Role {
  SUPERVISOR = 'SUPERVISOR',
  TEACHER = 'TEACHER',
}

const schema = z.object({
  firstName: z.string().min(1, 'first_name_required'),
  lastName: z.string().min(1, 'last_name_required'),
  email: z.string().email('invalid_email_address'),
  phoneNumber: z.string().optional(),
  role: z.enum([Role.SUPERVISOR, Role.TEACHER], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'role_required' };
      }
      return { message: 'Invalid role' };
    },
  }),
  password: z.string().min(6, 'password_required'),
});
const EmployeeForm = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Form');
  const [passwordType, setPasswordType] = useState('password');

  const togglePasswordType = () => {
    if (passwordType === 'text') {
      setPasswordType('password');
    } else if (passwordType === 'password') {
      setPasswordType('text');
    }
  };
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: Role.TEACHER,
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        // await api.post('/admin/employee', data);
        await createEmployee(data);
        toast.success(t('employee_created_successfully'));
        router.push('/employees');
      } catch (err: any) {
        toast.error(err.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('add_new_employee')}</h1>
        <p className="text-muted-foreground">{t('create_new_employee_record')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12  gap-4  rounded-lg">
          <div className="col-span-12 space-y-4">
            <Card>
              <CardHeader className="border-b border-solid border-default-200 mb-6">
                <CardTitle>{t('employee_information')}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-12 gap-4">
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="firstName" className=" font-medium text-default-600">
                    {t('first_name')} *
                  </Label>
                  <Input
                    size="lg"
                    disabled={isPending}
                    {...register('firstName')}
                    type="text"
                    id="firstName"
                    className={cn('', {
                      'border-destructive ': errors.firstName,
                    })}
                  />
                </div>

                
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="lastName" className=" font-medium text-default-600">
                    {t('last_name')} *
                  </Label>
                  <Input
                    size="lg"
                    disabled={isPending}
                    {...register('lastName')}
                    type="text"
                    id="lastName"
                    className={cn('', {
                      'border-destructive ': errors.lastName,
                    })}
                  />
                </div>
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="email" className=" font-medium text-default-600">
                    {t('email')} *
                  </Label>
                  <Input
                    size="lg"
                    disabled={isPending}
                    {...register('email')}
                    type="email"
                    id="email"
                    className={cn('', {
                      'border-destructive ': errors.email,
                    })}
                  />
                </div>
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="phoneNumber" className=" font-medium text-default-600">
                    {t('phone_number')}
                  </Label>
                  <Input
                    size="lg"
                    disabled={isPending}
                    {...register('phoneNumber')}
                    type="tel"
                    id="phoneNumber"
                    className={cn('', {
                      'border-destructive ': errors.phoneNumber,
                    })}
                  />
                </div>
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="role" className=" font-medium text-default-600">
                    {t('role')} *
                  </Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          field.onChange(value as Role);
                        }}
                      >
                        <SelectTrigger size="lg">
                          <SelectValue placeholder={t('select_role')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t('roles')}</SelectLabel>
                            <SelectItem value={Role.SUPERVISOR}>{t('supervisor')}</SelectItem>
                            <SelectItem value={Role.TEACHER}>{t('teacher')}</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="password" className="mb-2 font-medium text-default-600">
                    {t('password')} *
                  </Label>
                  <div className="relative">
                    <Input
                      size="lg"
                      disabled={isPending}
                      {...register('password')}
                      type={passwordType}
                      id="password"
                      placeholder=" "
                      autoComplete={'new-password'}
                      className={cn('peer', {
                        'border-destructive ': errors.password,
                      })}
                    />

                    <div
                      className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                      onClick={togglePasswordType}
                    >
                      {passwordType === 'password' ? (
                        <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
                      ) : (
                        <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
                      )}
                    </div>
                  </div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <ul className="col-span-12 space-y-2 mt-4">
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key} className="text-destructive text-sm">
                        {t(error.message)}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-12 flex justify-end">
            <Button>{t('save_employee')}</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
