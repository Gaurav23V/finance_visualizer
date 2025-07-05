import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Finance Visualizer',
    template: '%s | Finance Visualizer',
  },
  description:
    'A comprehensive personal finance tracking and visualization application',
  keywords: [
    'finance',
    'budget',
    'tracking',
    'visualization',
    'personal finance',
    'money management',
    'expenses',
    'income',
  ],
  authors: [{ name: 'Finance Visualizer Team' }],
  creator: 'Finance Visualizer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finance-visualizer.com',
    title: 'Finance Visualizer',
    description: 'Track and visualize your personal finances with ease',
    siteName: 'Finance Visualizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Visualizer',
    description: 'Track and visualize your personal finances with ease',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='relative flex min-h-screen flex-col'>
            <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <div className='container flex h-14 items-center'>
                <div className='mr-4 hidden md:flex'>
                  <a className='mr-6 flex items-center space-x-2' href='/'>
                    <span className='hidden font-bold sm:inline-block'>
                      Finance Visualizer
                    </span>
                  </a>
                  <nav className='flex items-center space-x-6 text-sm font-medium'>
                    <a
                      className='transition-colors hover:text-foreground/80 text-foreground/60'
                      href='/dashboard'
                    >
                      Dashboard
                    </a>
                    <a
                      className='transition-colors hover:text-foreground/80 text-foreground/60'
                      href='/transactions'
                    >
                      Transactions
                    </a>
                    <a
                      className='transition-colors hover:text-foreground/80 text-foreground/60'
                      href='/analytics'
                    >
                      Analytics
                    </a>
                    <a
                      className='transition-colors hover:text-foreground/80 text-foreground/60'
                      href='/budget'
                    >
                      Budget
                    </a>
                  </nav>
                </div>
                <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
                  <div className='w-full flex-1 md:w-auto md:flex-none'>
                    {/* Search component placeholder */}
                  </div>
                  <nav className='flex items-center'>
                    <ThemeToggle />
                  </nav>
                </div>
              </div>
            </header>
            <main className='flex-1'>
              <div className='container mx-auto px-4 py-6'>{children}</div>
            </main>
            <footer className='border-t py-6 md:py-0'>
              <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
                <div className='flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0'>
                  <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
                    Built with Next.js, TypeScript, and Tailwind CSS.
                  </p>
                </div>
                <div className='flex items-center space-x-4'>
                  <p className='text-sm text-muted-foreground'>
                    © 2024 Finance Visualizer. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
