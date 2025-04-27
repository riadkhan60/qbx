import type { Metadata } from 'next';
import { Outfit, Akaya_Kanadaka } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import UserContextProvoder from '@/contexts/UserContext/UserContextProvoder';

// Fonts
const outfit = Outfit({ subsets: ['latin'] });
const robotoFlex = Akaya_Kanadaka({
  variable: '--font-akaya-kanadaka',
  subsets: ['latin'],
  weight: '400',
});

// Metadata
export const metadata: Metadata = {
  title: 'Qbx — Qbexel',
  description: 'Hire us for your next project,',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${outfit.className} ${robotoFlex.variable}
         bg-background text-foreground`}
        >
          <UserContextProvoder>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </UserContextProvoder>
        </body>
      </html>
    </ClerkProvider>
  );
}
