'use client';

import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PaymentAlert } from '@/lib/schemas/payment';
import { color } from '@/lib/type';

interface PaymentAlertProps {
  alert: PaymentAlert;
}

export function PaymentAlertComponent({ alert }: PaymentAlertProps) {
  const t = useTranslations('PaymentAlert');

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertColor = (): color => {
    switch (alert.type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Alert
      color={getAlertColor()}
      className={`border-l-4 ${
        alert.type === 'success'
          ? 'border-l-green-500'
          : alert.type === 'warning'
          ? 'border-l-yellow-500'
          : alert.type === 'error'
          ? 'border-l-red-500'
          : 'border-l-blue-500'
      }`}
    >
      {getAlertIcon()}
      <AlertDescription className="text-base">
        {alert.message}
        {alert.nextPaymentDate && (
          <div className="mt-1  font-medium">
            {t('nextPaymentDue')}: {new Date(alert.nextPaymentDate).toLocaleDateString()}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
