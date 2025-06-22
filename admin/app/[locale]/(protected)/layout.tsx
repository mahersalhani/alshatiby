import { redirect } from '@/components/navigation';
import DashCodeFooter from '@/components/partials/footer';
import DashCodeHeader from '@/components/partials/header';
import DashCodeSidebar from '@/components/partials/sidebar';
import { auth } from '@/lib/services';
import LayoutContentProvider from '@/providers/content.provider';
import LayoutProvider from '@/providers/layout.provider';

const layout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) => {
  const { user } = await auth();
  const { locale } = await params;

  if (!user) redirect({ href: '/auth/login', locale });

  return (
    <LayoutProvider>
      <DashCodeHeader />
      <DashCodeSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <DashCodeFooter />
    </LayoutProvider>
  );
};

export default layout;
