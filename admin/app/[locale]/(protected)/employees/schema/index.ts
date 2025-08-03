import { z } from 'zod';

export const RoleEnum = z.enum(['TEACHER', 'PROGRAMS_SUPERVISOR', 'CLASSROOM_SUPERVISOR']);
export const GenderEnum = z.enum(['MALE', 'FEMALE']);

export const employeeCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: RoleEnum,
  nationality: z.string().min(2, 'Nationality is required'),
  residenceCountry: z.string().min(2, 'Residence country is required'),
  gender: GenderEnum,
  birthday: z.string().min(1, 'Birthday is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  joinedAt: z.string().min(1, 'Joined date is required'),
});

export const employeeUpdateSchema = employeeCreateSchema.omit({ password: true });

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type EmployeeCreateData = z.infer<typeof employeeCreateSchema>;
export type EmployeeUpdateData = z.infer<typeof employeeUpdateSchema>;
export type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>;
