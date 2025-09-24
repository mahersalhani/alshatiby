import { auth } from '@/lib/services';
import { checkUserRole, type UserRole } from '@/lib/services/role-checker';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

const StudentsLayout = async ({ children, params }: LayoutProps) => {
    const { user } = await auth();
    const { locale } = await params;

    // Define roles allowed to access students section
    const allowedRoles: UserRole[] = ['ADMIN', 'TEACHER', 'PROGRAMS_SUPERVISOR', 'CLASSROOM_SUPERVISOR'];

    // Check user authorization
    checkUserRole(user, allowedRoles, locale);

    return <>{children}</>;
};

export default StudentsLayout;
