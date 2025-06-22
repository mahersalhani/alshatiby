import { Metadata } from 'next';

import { redirect } from '@/components/navigation';
import { auth } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to your admin panel',
};
const Layout = async ({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) => {
  const { user } = await auth();
  const { locale } = await params;

  if (user) redirect({ href: '/', locale });

  return <>{children}</>;
};

export default Layout;
