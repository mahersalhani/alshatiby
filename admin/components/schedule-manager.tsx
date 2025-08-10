'use client';

import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ScheduleData } from '@/lib/schemas/classroom';
import { DAY_NAMES } from '@/lib/schemas/classroom';
import { cn } from '@/lib/utils';

interface ScheduleManagerProps {
  schedules: ScheduleData[];
  onSchedulesChange: (schedules: ScheduleData[]) => void;
  disabled?: boolean;
  error?: string;
}

export function ScheduleManager({ schedules, onSchedulesChange, disabled = false, error }: ScheduleManagerProps) {
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduleData>>({
    day: undefined,
    startTime: '',
    endTime: '',
  });

  const t = useTranslations('ClassroomForm');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Day translations
  const dayTranslations = {
    MONDAY: locale === 'ar' ? 'الاثنين' : locale === 'es' ? 'Lunes' : locale === 'fr' ? 'Lundi' : 'Monday',
    TUESDAY: locale === 'ar' ? 'الثلاثاء' : locale === 'es' ? 'Martes' : locale === 'fr' ? 'Mardi' : 'Tuesday',
    WEDNESDAY:
      locale === 'ar' ? 'الأربعاء' : locale === 'es' ? 'Miércoles' : locale === 'fr' ? 'Mercredi' : 'Wednesday',
    THURSDAY: locale === 'ar' ? 'الخميس' : locale === 'es' ? 'Jueves' : locale === 'fr' ? 'Jeudi' : 'Thursday',
    FRIDAY: locale === 'ar' ? 'الجمعة' : locale === 'es' ? 'Viernes' : locale === 'fr' ? 'Vendredi' : 'Friday',
    SATURDAY: locale === 'ar' ? 'السبت' : locale === 'es' ? 'Sábado' : locale === 'fr' ? 'Samedi' : 'Saturday',
    SUNDAY: locale === 'ar' ? 'الأحد' : locale === 'es' ? 'Domingo' : locale === 'fr' ? 'Dimanche' : 'Sunday',
  };

  const addSchedule = () => {
    if (newSchedule.day && newSchedule.startTime && newSchedule.endTime) {
      // Check for conflicts
      const hasConflict = schedules.some(
        (schedule) =>
          schedule.day === newSchedule.day &&
          ((newSchedule.startTime! >= schedule.startTime && newSchedule.startTime! < schedule.endTime) ||
            (newSchedule.endTime! > schedule.startTime && newSchedule.endTime! <= schedule.endTime) ||
            (newSchedule.startTime! <= schedule.startTime && newSchedule.endTime! >= schedule.endTime))
      );

      if (hasConflict) {
        alert(t('scheduleConflict'));
        return;
      }

      const schedule: ScheduleData = {
        day: newSchedule.day,
        startTime: newSchedule.startTime!.padEnd(8, ':00'),
        endTime: newSchedule.endTime!.padEnd(8, ':00'),
      };

      onSchedulesChange([...schedules, schedule]);
      setNewSchedule({ day: undefined, startTime: '', endTime: '' });
    }
  };

  const removeSchedule = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    onSchedulesChange(updatedSchedules);
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: locale === 'en',
      });
    } catch {
      return time;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t('schedules')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
          <div>
            <Label>{t('day')}</Label>
            <Select
              value={newSchedule.day || ''}
              onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value as any })}
              disabled={disabled}
            >
              <SelectTrigger className={isRTL ? 'text-right' : ''}>
                <SelectValue placeholder={t('selectDay')} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DAY_NAMES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {dayTranslations[key as keyof typeof dayTranslations]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('startTime')}</Label>
            <Input
              type="time"
              value={newSchedule.startTime || ''}
              onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
              disabled={disabled}
            />
          </div>

          <div>
            <Label>{t('endTime')}</Label>
            <Input
              type="time"
              value={newSchedule.endTime || ''}
              onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
              disabled={disabled}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={addSchedule}
              disabled={disabled || !newSchedule.day || !newSchedule.startTime || !newSchedule.endTime}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addSchedule')}
            </Button>
          </div>
        </div>

        {/* Current Schedules */}
        {schedules.length > 0 && (
          <div className="space-y-2">
            <Label>{t('currentSchedules')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center justify-between p-3 border rounded-lg bg-background',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className={cn('flex flex-col', isRTL && 'text-right')}>
                      <Badge color="secondary" className="w-fit">
                        {dayTranslations[schedule.day as keyof typeof dayTranslations]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="soft"
                    size="sm"
                    onClick={() => removeSchedule(index)}
                    disabled={disabled}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Empty State */}
        {schedules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('noSchedulesAdded')}</p>
            <p className="text-sm">{t('addScheduleHint')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
