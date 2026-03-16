import type { Metadata } from 'next';
import { Anek_Bangla } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { FirebaseClientProvider } from '../src/firebase/client-provider';
import { VisitorLogger } from '../src/components/VisitorLogger';

const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Arman Ali Khan | Full Stack Developer',
  description: 'The portfolio of Arman Ali Khan, a Full Stack Developer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anekBangla.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <FirebaseClientProvider>
          <ThemeProvider />
          <VisitorLogger />
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
