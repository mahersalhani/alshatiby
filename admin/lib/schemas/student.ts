'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const GenderEnum = z.enum(['MALE', 'FEMALE']);

// Payment interface to match your API structure
export interface Payment {
  id: number;
  documentId: string;
  paymentType: 'MONTH_1' | 'MONTH_2' | 'MONTH_3' | 'MONTH_6' | 'YEAR_1';
  title?: string | null;
  amount: number;
  currency: 'USD' | 'TRY' | 'EUR';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string | null;
}

// User interface for nested user data
export interface User {
  id: number;
  documentId: string;
  email: string;
  name: string;
  nationality: string;
  residenceCountry: string;
  gender: 'MALE' | 'FEMALE';
  birthday: string;
  phoneNumber: string;
  joinedAt?: string | null;
}

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
export type StudentUpdateData = z.infer<ReturnType<typeof useStudentSchemas>['studentUpdateSchema']> & {
  // Add optional fields that might come from API
  id?: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string | null;
  user?: User;
  payments?: Payment[];
};
export type StudentPasswordUpdateData = z.infer<ReturnType<typeof useStudentSchemas>['passwordUpdateSchema']>;
