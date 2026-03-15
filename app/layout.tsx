import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { FirebaseClientProvider } from '../src/firebase/client-provider';
import { VisitorLogger } from '../src/components/VisitorLogger';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
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

    