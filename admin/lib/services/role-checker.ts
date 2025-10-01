import { redirect } from '@/components/navigation';

export type UserRole = 'ADMIN' | 'TEACHER' | 'PROGRAMS_SUPERVISOR' | 'CLASSROOM_SUPERVISOR' | 'TESTER' | 'STUDENT';

export interface UserWithRole {
  id?: number;
  documentId?: string;
  email?: string;
  name?: string;
  employee?: {
    id?: number;
    role?: UserRole;
  };
  student?: {
    id?: number;
    documentId?: string;
  };
  isSuperAdmin?: boolean;
}

export function checkUserRole(
  user: UserWithRole | null,
  allowedRoles: UserRole[],
  locale: string
): void {
  if (!user) {
    redirect({ href: '/', locale });
    return;
  }

  // Check if user is super admin (bypass role check)
  if (user.isSuperAdmin) {
    return;
  }

  let userRole: UserRole | null = null;

  // Determine user role
  if (user.employee?.role) {
    userRole = user.employee.role;
  } else if (user.student) {
    userRole = 'STUDENT';
  }

  // If no role found or role not in allowed list, redirect to home
  if (!userRole || !allowedRoles.includes(userRole)) {
    redirect({ href: '/', locale });
    return;
  }
}
