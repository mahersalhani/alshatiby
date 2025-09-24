import { auth } from '@/lib/services';
import { checkUserRole, type UserRole } from '@/lib/services/role-checker';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

const ProgramsLayout = async ({ children, params }: LayoutProps) => {
    const { user } = await auth();
    const { locale } = await params;

    // Define roles allowed to access programs section
    const allowedRoles: UserRole[] = ['ADMIN', 'PROGRAMS_SUPERVISOR'];

    // Check user authorization
    checkUserRole(user, allowedRoles, locale);

    return <>{children}</>;
};

export default ProgramsLayout;
