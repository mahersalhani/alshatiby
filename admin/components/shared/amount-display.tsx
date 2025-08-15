'use client';

import { useLocale } from 'next-intl';

import { cn } from '@/lib/utils';

interface AmountDisplayProps {
  amount: number;
  currency: string;
  className?: string;
  showCurrency?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AmountDisplay({ amount, currency, className, showCurrency = true, size = 'md' }: AmountDisplayProps) {
  const locale = useLocale();

  // Divide amount by 100 to get the actual currency value
  const actualAmount = amount / 100;

  const formatAmount = (value: number, curr: string) => {
    if (showCurrency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } else {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <span className={cn(sizeClasses[size], className)}>
      {formatAmount(actualAmount, currency)}
      {!showCurrency && <span className="ml-1 text-muted-foreground text-sm">{currency}</span>}
    </span>
  );
}
