'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const paymentSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0, 'Amount must be a positive number'),
  type: z.enum(['income', 'expense'], { required_error: 'Type is required' }),
  date: z.string().min(1, 'Date is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PaymentFormData>;
}

export function PaymentForm({ mode, initialData }: PaymentFormProps) {
  const t = useTranslations();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      type: initialData?.type || 'income',
      date: initialData?.date || new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      console.log('Payment record data:', data);
      // TODO: Implement API call to create/update payment record
    } catch (error) {
      console.error('Error saving payment record:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? t('payment.add_new_record') : t('payment.edit_record')}
          </CardTitle>
          <CardDescription>
            {mode === 'create'
              ? t('payment.create_new_record_description')
              : t('payment.edit_record_description')
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment.description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('payment.description_placeholder')}
                        {...field}
                      />
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
                    <FormLabel>{t('payment.amount')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment.type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('payment.select_type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">{t('payment.income')}</SelectItem>
                        <SelectItem value="expense">{t('payment.expense')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment.date')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {mode === 'create' ? t('payment.create_record') : t('payment.update_record')}
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  {t('PaymentForm.cancel')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
