'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useRouter } from '@/components/navigation';
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
import api from '@/lib/axios';
import { cn } from '@/lib/utils';

enum Role {
  PROGRAMS_SUPERVISOR = 'PROGRAMS_SUPERVISOR',
  TEACHER = 'TEACHER',
  CLASSROOM_SUPERVISOR = 'CLASSROOM_SUPERVISOR',
}

interface EmployeeFormProps {
  isEdit?: boolean;
  employeeData?: {
    documentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: Role;
    password?: null;
  };
}

const schema = z.object({
  firstName: z.string().min(1, 'first_name_required'),
  lastName: z.string().min(1, 'last_name_required'),
  email: z.string().email('invalid_email_address'),
  phoneNumber: z.string().optional(),
  role: z.enum([Role.PROGRAMS_SUPERVISOR, Role.TEACHER, Role.CLASSROOM_SUPERVISOR], {
    errorMap: (issue, _ctx) => {
      if (issue.code === 'invalid_type') {
        return { message: 'role_required' };
      }
      return { message: 'Invalid role' };
    },
  }),
  password: z.string().min(6, 'password_required').optional(),
});
const EmployeeForm = ({ isEdit = false, employeeData }: EmployeeFormProps) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();

  const [passwordType, setPasswordType] = useState('password');

  const togglePasswordType = () => {
    if (passwordType === 'text') {
      setPasswordType('password');
    } else if (passwordType === 'password') {
      setPasswordType('text');
    }
  };
  const router = useRouter();

  const employeeDataDefault = _.omit(employeeData, ['documentId']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: employeeDataDefault || {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: Role.TEACHER,
      password: '',
    },
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        if (!isEdit) {
          await api.post('/admin/employee', data);
          toast.success(t('Form.employee_created_successfully'));
        } else {
          if (!employeeData?.documentId) {
            return;
          }
          await api.put(`/admin/employee/${employeeData.documentId}`, data);
          toast.success(t('Form.employee_updated_successfully'));
        }
        router.push('/employees');
      } catch (err: any) {
        toast.error(t(err.response?.data?.error?.message) || err.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? t('Form.edit_employee') : t('Form.add_new_employee')}</h1>
        <p className="text-muted-foreground">
          {isEdit ? t('Form.you_can_update_employee_info') : t('Form.create_new_employee_record')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12  gap-4  rounded-lg">
          <div className="col-span-12 space-y-4">
            <Card>
              <CardHeader className="border-b border-solid border-default-200 mb-6">
                <CardTitle>{t('Form.employee_information')}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-12 gap-4">
                <div className="space-y-2 col-span-12 sm:col-span-6">
                  <Label htmlFor="firstName" className=" font-medium text-default-600">
                    {t('Form.first_name')} *
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
                    {t('Form.last_name')} *
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
                    {t('Form.email')} *
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
                    {t('Form.phone_number')}
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

                {!isEdit && (
                  <div className="space-y-2 col-span-12 sm:col-span-6">
                    <Label htmlFor="role" className=" font-medium text-default-600">
                      {t('Form.role')} *
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
                            <SelectValue placeholder={t('Form.select_role')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{t('Form.roles')}</SelectLabel>
                              <SelectItem value={Role.TEACHER}>{t('Form.teacher')}</SelectItem>
                              <SelectItem value={Role.PROGRAMS_SUPERVISOR}>{t('Form.programs_supervisor')}</SelectItem>
                              <SelectItem value={Role.CLASSROOM_SUPERVISOR}>
                                {t('Form.classroom_supervisor')}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
                {!isEdit && (
                  <div className="space-y-2 col-span-12 sm:col-span-6">
                    <Label htmlFor="password" className="mb-2 font-medium text-default-600">
                      {t('Form.password')} *
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
                )}

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

          <div className="col-span-12 flex justify-end gap-4">
            <Button>{isEdit ? t('Form.update_employee') : t('Form.save_employee')}</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
