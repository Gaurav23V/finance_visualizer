'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Simple fade-in transition for page navigations. The component is keyed by
 * the current pathname so it re-mounts on route change, allowing the fade
 * animation to run on every navigation event.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount / pathname change.
    setIsVisible(false);
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={cn(
        'transition-opacity duration-300 ease-in',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {children}
    </div>
  );
};

export default PageTransition; 