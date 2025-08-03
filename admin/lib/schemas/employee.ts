'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const RoleEnum = z.enum(['TEACHER', 'PROGRAMS_SUPERVISOR', 'CLASSROOM_SUPERVISOR']);
export const GenderEnum = z.enum(['MALE', 'FEMALE']);

export function useEmployeeSchemas() {
  const t = useTranslations('Validation');

  const employeeCreateSchema = z.object({
    name: z.string().min(2, t('nameMinLength')),
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(8, t('passwordMinLength')),
    role: RoleEnum,
    nationality: z.string().min(2, t('nationalityRequired')),
    residenceCountry: z.string().min(2, t('residenceCountryRequired')),
    gender: GenderEnum,
    birthday: z.string().min(1, t('birthdayRequired')),
    phoneNumber: z.string().min(10, t('phoneMinLength')),
    joinedAt: z.string().min(1, t('joinedDateRequired')),
  });

  const employeeUpdateSchema = employeeCreateSchema.omit({ password: true });

  const passwordUpdateSchema = z
    .object({
      currentPassword: z.string().min(1, t('currentPasswordRequired')),
      newPassword: z.string().min(8, t('newPasswordMinLength')),
      confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    });

  return {
    employeeCreateSchema,
    employeeUpdateSchema,
    passwordUpdateSchema,
  };
}

export type EmployeeCreateData = z.infer<ReturnType<typeof useEmployeeSchemas>['employeeCreateSchema']>;
export type EmployeeUpdateData = z.infer<ReturnType<typeof useEmployeeSchemas>['employeeUpdateSchema']>;
export type PasswordUpdateData = z.infer<ReturnType<typeof useEmployeeSchemas>['passwordUpdateSchema']>;
