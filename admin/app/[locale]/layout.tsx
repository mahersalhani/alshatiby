import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { getLangDir } from 'rtl-detect';
import './globals.css';
import './theme.css';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import MountedProvider from '@/providers/mounted.provider';
import { ThemeProvider } from '@/providers/theme-provider';
const inter = Inter({ subsets: ['latin'] });
// language

import { AuthProvider } from '@/context/auth-context';
import { auth } from '@/lib/services';
import DirectionProvider from '@/providers/direction-provider';

export const metadata: Metadata = {
  title: 'Dashcode admin Template',
  description: 'created by codeshaper',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const messages = await getMessages();
  const direction = getLangDir(locale);
  const { user, session } = await auth();

  return (
    <html lang={locale} dir={direction}>
      <body className={`${inter.className} dashcode-app`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider user={user} session={session}>
            <ThemeProvider attribute="class" defaultTheme="light">
              <MountedProvider>
                <DirectionProvider direction={direction}>{children}</DirectionProvider>
              </MountedProvider>
              <Toaster />
              <SonnerToaster />
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
