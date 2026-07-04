import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/hooks/use-theme';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'InternHub - Your Gateway to Opportunities',
  description: 'Discover internships, hackathons, coding competitions, scholarships, and fellowships from top sources worldwide. AI-powered recommendations tailored to your profile.',
  keywords: ['internships', 'hackathons', 'competitions', 'scholarships', 'fellowships', 'careers', 'students', 'tech jobs'],
  authors: [{ name: 'InternHub' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://internhub.app',
    siteName: 'InternHub',
    title: 'InternHub - Your Gateway to Opportunities',
    description: 'Discover internships, hackathons, coding competitions, scholarships, and fellowships from top sources worldwide.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521737711867-e3b9733f0ab8?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'InternHub - Career Opportunities Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InternHub - Your Gateway to Opportunities',
    description: 'Discover internships, hackathons, coding competitions, scholarships, and fellowships.',
    images: ['https://images.unsplash.com/photo-1521737711867-e3b9733f0ab8?w=1200&h=630&fit=crop'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
