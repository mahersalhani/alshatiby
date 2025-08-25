'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';

export const PaymentTypeEnum = z.enum(['MONTH_1', 'MONTH_2', 'MONTH_3', 'MONTH_6', 'YEAR_1']);
export const CurrencyEnum = z.enum(['USD', 'TRY', 'EUR']);

export function usePaymentSchemas() {
  const t = useTranslations('Validation');

  const paymentCreateSchema = z.object({
    paymentType: PaymentTypeEnum,
    title: z.string().optional(),
    amount: z.number().min(0.01, t('amountRequired')).max(999999.99, t('amountTooLarge')),
    currency: CurrencyEnum,
    startDate: z.date().min(new Date(1900, 0, 1), t('startDateRequired')),
    student: z.string().min(1, t('studentRequired')),
  });

  const paymentUpdateSchema = paymentCreateSchema.omit({ student: true });

  return {
    paymentCreateSchema,
    paymentUpdateSchema,
  };
}

export type PaymentCreateData = z.infer<ReturnType<typeof usePaymentSchemas>['paymentCreateSchema']>;
export type PaymentUpdateData = Omit<PaymentCreateData, 'student'>;

export interface Payment {
  id: number;
  documentId: string;
  paymentType: z.infer<typeof PaymentTypeEnum>;
  title?: string | null;
  amount: number;
  currency: z.infer<typeof CurrencyEnum>;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale?: string | null;
}

export interface PaymentAlert {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  nextPaymentDate?: string;
}
