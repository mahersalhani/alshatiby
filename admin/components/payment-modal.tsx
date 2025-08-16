'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, DollarSign, Info, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import DatePicker from '@/components/shared/date-picker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentSchemas, type PaymentCreateData } from '@/lib/schemas/payment';
import type { Payment } from '@/lib/schemas/student';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentCreateData) => void;
  studentId: string;
  isLoading?: boolean;
  existingPayments?: Payment[]; // Add existing payments prop
}

export function PaymentModal({
  open,
  onOpenChange,
  onSubmit,
  studentId,
  isLoading = false,
  existingPayments = [],
}: PaymentModalProps) {
  const t = useTranslations('PaymentForm');
  const locale = useLocale();
  const { paymentCreateSchema } = usePaymentSchemas();

  // Calculate the minimum start date based on existing payments
  const getMinimumStartDate = () => {
    if (existingPayments.length === 0) {
      return new Date(); // If no payments, can start from today
    }

    // Find the latest payment end date
    const latestPayment = existingPayments.reduce((latest, payment) => {
      const paymentEndDate = new Date(payment.endDate);
      const latestEndDate = new Date(latest.endDate);
      return paymentEndDate > latestEndDate ? payment : latest;
    }, existingPayments[0]);

    return new Date(latestPayment.endDate);
  };

  const minimumStartDate = getMinimumStartDate();
  const hasExistingPayments = existingPayments.length > 0;

  const form = useForm<PaymentCreateData>({
    resolver: zodResolver(paymentCreateSchema),
    defaultValues: {
      paymentType: 'MONTH_1',
      title: '',
      amount: 0,
      currency: 'USD',
      startDate: minimumStartDate,
      student: studentId,
    },
  });

  // Update start date when modal opens or existing payments change
  useEffect(() => {
    if (open) {
      const newMinDate = getMinimumStartDate();
      form.setValue('startDate', newMinDate);
    }
  }, [open, existingPayments, form]);

  const handleSubmit = (data: PaymentCreateData) => {
    // Multiply amount by 100 to convert to cents/smallest currency unit for API
    const apiData = {
      ...data,
      amount: data.amount * 100,
    };
    onSubmit(apiData);
  };

  const isRTL = locale === 'ar';

  // Payment type translations
  const paymentTypeLabels = {
    MONTH_1: t('month1'),
    MONTH_2: t('month2'),
    MONTH_3: t('month3'),
    MONTH_6: t('month6'),
    YEAR_1: t('year1'),
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-[700px] w-[90%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('addPayment')}
          </DialogTitle>
          <DialogDescription>{t('addPaymentDescription')}</DialogDescription>
        </DialogHeader>

        {/* Payment Continuity Info */}
        {hasExistingPayments && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('paymentContinuityInfo', {
                date: formatDate(minimumStartDate),
              })}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('paymentType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger size="lg">
                          <SelectValue placeholder={t('selectPaymentType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(paymentTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('currency')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger size="lg">
                          <SelectValue placeholder={t('selectCurrency')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="TRY">TRY (₺)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('title')} ({t('optional')})
                  </FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder={t('enterTitle')} {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('amount')}</FormLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        size={'lg'}
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="9999.99"
                        placeholder="0.00"
                        className="pl-10"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">{t('amountHint')}</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('startDate')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      onDateChange={field.onChange}
                      value={field.value}
                      // minDate={minimumStartDate}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                  {hasExistingPayments && (
                    <p className="text-xs text-muted-foreground">
                      {t('minimumStartDateInfo', {
                        date: formatDate(minimumStartDate),
                      })}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('adding')}
                  </>
                ) : (
                  t('addPayment')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
