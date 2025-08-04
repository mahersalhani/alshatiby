'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';

// Day enum for schedules
export const DayEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

export function useClassroomSchemas() {
  const t = useTranslations('Validation');

  // Schedule schema
  const scheduleSchema = z
    .object({
      day: DayEnum,
      startTime: z.string().min(1, t('startTimeRequired')),
      endTime: z.string().min(1, t('endTimeRequired')),
    })
    .refine(
      (data) => {
        // Validate that end time is after start time
        const start = new Date(`2000-01-01T${data.startTime}:00`);
        const end = new Date(`2000-01-01T${data.endTime}:00`);
        return end > start;
      },
      {
        message: t('endTimeAfterStartTime'),
        path: ['endTime'],
      }
    );

  const classroomCreateSchema = z.object({
    classroomName: z.string().min(2, t('classroomNameMinLength')).min(1, t('classroomNameRequired')),
    programId: z.string().min(1, t('programRequired')),
    teacherId: z.string().min(1, t('teacherRequired')),
    supervisorIds: z.array(z.string()).min(1, t('supervisorsRequired')),
    schedules: z.array(scheduleSchema).min(1, t('schedulesRequired')),
  });

  const classroomUpdateSchema = classroomCreateSchema;

  return {
    classroomCreateSchema,
    classroomUpdateSchema,
    scheduleSchema,
  };
}

export type ClassroomCreateData = z.infer<ReturnType<typeof useClassroomSchemas>['classroomCreateSchema']>;
export type ClassroomUpdateData = z.infer<ReturnType<typeof useClassroomSchemas>['classroomUpdateSchema']>;
export type ScheduleData = z.infer<ReturnType<typeof useClassroomSchemas>['scheduleSchema']>;

// Types for database entities
export interface Program {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  level?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  experience?: number;
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  role: 'PROGRAMS_SUPERVISOR' | 'CLASSROOM_SUPERVISOR';
  department?: string;
}

export interface Schedule {
  id?: string;
  day: z.infer<typeof DayEnum>;
  startTime: string;
  endTime: string;
}

export interface ClassroomData extends ClassroomCreateData {
  id?: string;
  program?: Program;
  teacher?: Teacher;
  supervisors?: Supervisor[];
  studentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Day display names for UI
export const DAY_NAMES = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
} as const;
