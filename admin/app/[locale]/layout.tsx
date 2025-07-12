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
import { configureAxios } from '@/lib/axios';
import { auth } from '@/lib/services';
import DirectionProvider from '@/providers/direction-provider';

export const metadata: Metadata = {
  title: 'Dashcode admin Template',
  description: 'created by codeshaper',
};

// {
//     "results": [
//         {
//             "id": 9,
//             "documentId": "zb1qaxwlgrwwfdounyyv0dgk",
//             "firstName": "ماهر",
//             "createdAt": "2025-07-01T22:49:53.825Z",
//             "updatedAt": "2025-07-01T22:49:53.825Z",
//             "publishedAt": "2025-07-01T22:49:53.822Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "TEACHER",
//             "phoneNumber": ""
//         },
//         {
//             "id": 10,
//             "documentId": "u6udva2z90xp9dyx5fst3jom",
//             "firstName": "ماهر",
//             "createdAt": "2025-07-01T23:45:48.911Z",
//             "updatedAt": "2025-07-01T23:45:48.911Z",
//             "publishedAt": "2025-07-01T23:45:48.905Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "05380788021"
//         },
//         {
//             "id": 11,
//             "documentId": "mqp1mugtd3qianxp6fpuogns",
//             "firstName": "غيث",
//             "createdAt": "2025-07-12T14:57:18.360Z",
//             "updatedAt": "2025-07-12T14:57:18.360Z",
//             "publishedAt": "2025-07-12T14:57:18.356Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "011111111"
//         },
//         {
//             "id": 12,
//             "documentId": "bwygqfbu9zb37ewybkz2ahzp",
//             "firstName": "غيث",
//             "createdAt": "2025-07-12T14:57:28.072Z",
//             "updatedAt": "2025-07-12T14:57:28.072Z",
//             "publishedAt": "2025-07-12T14:57:28.069Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "011111111"
//         },
//         {
//             "id": 13,
//             "documentId": "iyr6vs80idwe2nkk2v0zctn7",
//             "firstName": "غيث",
//             "createdAt": "2025-07-12T14:58:31.501Z",
//             "updatedAt": "2025-07-12T14:58:31.501Z",
//             "publishedAt": "2025-07-12T14:58:31.498Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "011111111"
//         }
//     ],
//     "pagination": {
//         "page": 1,
//         "pageSize": 5,
//         "pageCount": 2,
//         "total": 6
//     }
// }

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
  configureAxios();

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
