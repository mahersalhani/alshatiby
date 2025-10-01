import { auth } from '@/lib/services';
import { checkUserRole, type UserRole } from '@/lib/services/role-checker';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

const PaymentLayout = async ({ children, params }: LayoutProps) => {
    const { user } = await auth();
    const { locale } = await params;

    // Define roles allowed to access payment section (only admins)
    const allowedRoles: UserRole[] = ['ADMIN'];

    // Check user authorization
    checkUserRole(user, allowedRoles, locale);

    return <>{children}</>;
};

export default PaymentLayout;
