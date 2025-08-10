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
        const start = data.startTime.split(':').map(Number);
        const end = data.endTime.split(':').map(Number);
        return start[0] < end[0] || (start[0] === end[0] && start[1] < end[1]);
      },
      {
        message: t('endTimeAfterStartTime'),
        path: ['endTime'],
      }
    );

  const classroomCreateSchema = z.object({
    classroomName: z.string().min(2, t('classroomNameMinLength')).min(1, t('classroomNameRequired')),
    programId: z
      .string()
      .min(1, t('programRequired'))
      .or(z.number().min(1, t('programRequired'))),
    teacherId: z
      .string()
      .min(1, t('teacherRequired'))
      .or(z.number().min(1, t('teacherRequired'))),
    supervisorIds: z
      .array(z.string())
      .min(1, t('supervisorsRequired'))
      .or(z.array(z.number()).min(1, t('supervisorsRequired'))),
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
  documentId?: string;
  program: string;
  teacher: string;
  supervisors: string[];
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
