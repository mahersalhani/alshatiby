import { auth } from '@/lib/services';
import { checkUserRole, type UserRole } from '@/lib/services/role-checker';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

const ClassroomsLayout = async ({ children, params }: LayoutProps) => {
    const { user } = await auth();
    const { locale } = await params;

    // Define roles allowed to access classrooms section
    const allowedRoles: UserRole[] = ['ADMIN', 'TEACHER', 'CLASSROOM_SUPERVISOR'];

    // Check user authorization
    checkUserRole(user, allowedRoles, locale);

    return <>{children}</>;
};

export default ClassroomsLayout;
