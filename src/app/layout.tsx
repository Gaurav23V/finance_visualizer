'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Geist_Mono } from 'next/font/google';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/transactions', label: 'Transactions' },
  ];

  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className='relative flex min-h-screen flex-col'>
          <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-14 items-center'>
              <div className='mr-4 hidden md:flex'>
                <Link className='mr-6 flex items-center space-x-2' href='/'>
                  <span className='hidden font-bold sm:inline-block'>
                    Finance Visualizer
                  </span>
                </Link>
                <nav className='flex items-center space-x-6 text-sm font-medium'>
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'transition-colors hover:text-foreground/80',
                        pathname === link.href
                          ? 'text-foreground'
                          : 'text-foreground/60'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className='flex flex-1 items-center justify-end space-x-2 md:hidden'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                  <span className='sr-only'>Toggle Menu</span>
                </Button>
              </div>

              <div className='hidden flex-1 items-center justify-end space-x-2 md:flex'></div>

              {isMenuOpen && (
                <div className='absolute top-14 left-0 w-full bg-background/95 backdrop-blur md:hidden'>
                  <nav className='flex flex-col items-center space-y-4 py-4'>
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'w-full text-center transition-colors hover:text-foreground/80',
                          pathname === link.href
                            ? 'text-foreground'
                            : 'text-foreground/60'
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </header>
          <main className='flex-1'>
            <div className='container mx-auto px-4 py-6'>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
