// lib/schemas/student-schema.ts
import { z } from 'zod';
import { TFunction } from 'next-intl';

export const buildStudentSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('Student.student_name_required')),
    nationality: z.string().min(1, t('Student.nationality_required')),
    countryOfResidence: z.string().min(1, t('Student.country_of_residence_required')),
    gender: z.enum(['male', 'female'], {
      errorMap: (issue) => {
        if (issue.code === 'invalid_type') return { message: t('Student.gender_required') };
        return { message: t('Student.invalid_gender') };
      },
    }),
    // ... أكمل نفس الطريقة مع باقي الحقول
  }).superRefine((data, ctx) => {
    if (!data.isGrant) {
      if (!data.lastPaymentDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('Student.last_payment_date_required'),
          path: ['lastPaymentDate'],
        });
      }
      if (!data.currencyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('Student.currency_type_required'),
          path: ['currencyType'],
        });
      }
      if (data.amount === undefined || data.amount === null || data.amount === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('Student.amount_required'),
          path: ['amount'],
        });
      }
    }
  });
