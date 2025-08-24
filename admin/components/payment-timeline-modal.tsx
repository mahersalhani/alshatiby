'use client';

import { Calendar, Clock, CreditCard, Edit, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { AmountDisplay } from './shared/amount-display';
import { ConfirmationModal } from './shared/confirmation-modal';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Payment } from '@/lib/schemas/student';

interface PaymentTimelineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: Payment[];
  isLoading?: boolean;
  onEditPayment?: (payment: Payment) => void; // Added edit callback
  onDeletePayment?: (payment: Payment) => void; // Added delete callback
}

export function PaymentTimelineModal({
  open,
  onOpenChange,
  payments,
  isLoading = false,
  onEditPayment,
  onDeletePayment,
}: PaymentTimelineModalProps) {
  const t = useTranslations('PaymentTimeline');
  const locale = useLocale();
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    payment: Payment | null;
  }>({
    open: false,
    payment: null,
  });

  const handleDeleteClick = (payment: Payment) => {
    setConfirmationModal({
      open: true,
      payment,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmationModal.payment && onDeletePayment) {
      onDeletePayment(confirmationModal.payment);
      setConfirmationModal({ open: false, payment: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels = {
      MONTH_1: t('month1'),
      MONTH_2: t('month2'),
      MONTH_3: t('month3'),
      MONTH_6: t('month6'),
      YEAR_1: t('year1'),
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPaymentStatus = (payment: Payment) => {
    const now = new Date();
    const endDate = new Date(payment.endDate);

    if (endDate < now) {
      return { status: 'expired', variant: 'destructive' as const };
    } else {
      return { status: 'active', variant: 'default' as const };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[85vh] flex flex-col md:max-w-[700px] w-[90%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-6 w-6" />
            {t('paymentHistory')}
          </DialogTitle>
          <DialogDescription className="text-base">{t('paymentHistoryDescription')}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[700px] pr-4 mt-5">
          {payments.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CreditCard className="h-20 w-20 mx-auto mb-6 opacity-50" />
              <p className="text-xl font-medium">{t('noPayments')}</p>
              <p className="text-base mt-2">{t('noPaymentsDescription')}</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

              <div className="space-y-12">
                {payments.map((payment, index) => {
                  const { status, variant } = getPaymentStatus(payment);
                  const isLatest = index === 0;

                  return (
                    <div key={payment.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-4 w-4 h-4 bg-primary rounded-full border-4 border-background z-10"></div>

                      <div className="ml-16 space-y-4">
                        {/* Header with amount and badges */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-7 w-7 text-primary" />
                            <div>
                              <AmountDisplay
                                amount={payment.amount}
                                currency={payment.currency}
                                className="text-2xl font-bold text-primary"
                              />
                              <p className="text-lg font-medium text-foreground">
                                {payment.title || getPaymentTypeLabel(payment.paymentType)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isLatest && (
                              <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
                                {t('latest')}
                              </Badge>
                            )}
                            <Badge color={variant} className="px-3 py-1">
                              {t(status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Date range */}
                        <p className="text-muted-foreground text-base">
                          {t('startDate')}: {formatDate(payment.startDate || payment.createdAt)} - {t('endDate')}:{' '}
                          {formatDate(payment.endDate)}
                        </p>

                        {/* Payment details */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {t('duration')}: {getPaymentTypeLabel(payment.paymentType)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {t('status')}: {t(status)}
                          </span>
                        </div>
                        {(onEditPayment || onDeletePayment) && (
                          <div className="flex items-center gap-2 pt-2">
                            {onEditPayment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditPayment(payment)}
                                disabled={isLoading}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                {t('common.edit')}
                              </Button>
                            )}
                            {onDeletePayment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(payment)}
                                disabled={isLoading}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {t('common.delete')}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </ScrollArea>
        <ConfirmationModal
          open={confirmationModal.open}
          onOpenChange={(open) => setConfirmationModal({ open, payment: null })}
          onConfirm={handleConfirmDelete}
          title={t('deletePaymentTitle')}
          description={t('deletePaymentDescription')}
          variant="destructive"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
