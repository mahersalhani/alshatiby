'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign, Edit, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import DatePicker from '@/components/shared/date-picker';
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
import { usePaymentSchemas, type PaymentUpdateData } from '@/lib/schemas/payment';
import type { Payment } from '@/lib/schemas/student';

interface PaymentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentUpdateData & { id: string }) => void;
  payment: Payment | null;
  isLoading?: boolean;
}

export function PaymentEditModal({ open, onOpenChange, onSubmit, payment, isLoading = false }: PaymentEditModalProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { paymentUpdateSchema } = usePaymentSchemas();

  const form = useForm<PaymentUpdateData>({
    resolver: zodResolver(paymentUpdateSchema),
    defaultValues: {
      paymentType: 'MONTH_1',
      title: '',
      amount: 0,
      currency: 'USD',
      startDate: new Date(),
    },
  });

  // Update form when payment changes
  useEffect(() => {
    if (payment && open) {
      form.reset({
        paymentType: payment.paymentType,
        title: payment.title || '',
        amount: payment.amount / 100, // Convert from cents to currency units
        currency: payment.currency,
        startDate: payment.startDate ? new Date(payment.startDate) : new Date(),
      });
    }
  }, [payment, open, form]);

  const handleSubmit = (data: PaymentUpdateData) => {
    if (!payment) return;

    // Multiply amount by 100 to convert to cents/smallest currency unit for API
    const apiData = {
      ...data,
      amount: data.amount * 100,
      id: payment.documentId,
    };
    onSubmit(apiData);
  };

  const isRTL = locale === 'ar';

  // Payment type translations
  const paymentTypeLabels = {
    MONTH_1: t('PaymentForm.month1'),
    MONTH_2: t('PaymentForm.month2'),
    MONTH_3: t('PaymentForm.month3'),
    MONTH_6: t('PaymentForm.month6'),
    YEAR_1: t('PaymentForm.year1'),
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t('PaymentForm.editPayment')}
          </DialogTitle>
          <DialogDescription>{t('PaymentForm.editPaymentDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('PaymentForm.paymentType')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('PaymentForm.selectPaymentType')} />
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
                    <FormLabel>{t('PaymentForm.currency')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('PaymentForm.selectCurrency')} />
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
                    {t('PaymentForm.title')} ({t('PaymentForm.optional')})
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('PaymentForm.enterTitle')} {...field} disabled={isLoading} />
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
                  <FormLabel>{t('PaymentForm.amount')}</FormLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
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
                  <p className="text-xs text-muted-foreground">{t('PaymentForm.amountHint')}</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('PaymentForm.startDate')}</FormLabel>
                  <FormControl>
                    <DatePicker onDateChange={field.onChange} value={field.value} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t('PaymentForm.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.updating')}
                  </>
                ) : (
                  t('PaymentForm.updatePayment')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
