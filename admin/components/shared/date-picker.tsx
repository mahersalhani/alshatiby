'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Label } from '../ui/label';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'md' | 'lg' | 'icon' | undefined;
  label?: string;
}

export default function DatePicker({
  value,
  onDateChange,
  placeholder = 'Pick a date',
  minDate,
  maxDate,
  disabled = false,
  className,
  size = 'lg',
  label,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Form');

  return (
    <div className="flex flex-col justify-between">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size={size}
            variant="outline"
            className={cn('w-full justify-between font-normal border-default-200', className)}
            id="date"
          >
            {value ? value.toLocaleDateString() : t('selectDate')}
            <ChevronDownIcon className="ml-2 h-4 w-4 text-default-500" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onDateChange(date);
              setOpen(false);
            }}
            disabled={(date) => {
              if (disabled) return true;
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
