'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  onDateChange?: (date: Date | undefined) => void;
  label?: string;
  value?: Date;
}

export function DatePicker({ onDateChange, label, value }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);

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
          <Button variant="outline" className="w-full justify-between font-normal">
            {date ? date.toLocaleDateString() : t('selectDate')}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
              if (onDateChange) {
                onDateChange(date);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
