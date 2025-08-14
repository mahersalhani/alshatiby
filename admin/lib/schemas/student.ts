'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const GenderEnum = z.enum(['MALE', 'FEMALE']);

export function useStudentSchemas() {
  const t = useTranslations('Validation');

  const studentCreateSchema = z.object({
    documentId: z.string().optional(),
    name: z.string().min(2, t('nameMinLength')),
    email: z.string().optional(),
    password: z.string().optional(),
    nationality: z.string().min(2, t('nationalityRequired')),
    residenceCountry: z.string().min(2, t('residenceCountryRequired')),
    gender: GenderEnum,
    birthday: z.date().min(new Date(1900, 0, 1), t('birthdayRequired')),
    phoneNumber: z.string().min(10, t('phoneMinLength')),
    joinedAt: z.date().min(new Date(1900, 0, 1), t('joinedDateRequired')),
    generalNotes: z.string().max(500, t('generalNotesMaxLength')).optional(),
    isHadScholarship: z.boolean().default(false),
  });

  const studentUpdateSchema = studentCreateSchema.omit({ password: true });

  const passwordUpdateSchema = z
    .object({
      newPassword: z.string().min(8, t('newPasswordMinLength')),
      confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('passwordsDontMatch'),
      path: ['confirmPassword'],
    });

  return {
    studentCreateSchema,
    studentUpdateSchema,
    passwordUpdateSchema,
  };
}

export type StudentCreateData = z.infer<ReturnType<typeof useStudentSchemas>['studentCreateSchema']>;
export type StudentUpdateData = z.infer<ReturnType<typeof useStudentSchemas>['studentUpdateSchema']>;
export type StudentPasswordUpdateData = z.infer<ReturnType<typeof useStudentSchemas>['passwordUpdateSchema']>;
