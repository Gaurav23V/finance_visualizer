'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React Error Boundary to catch runtime errors in the component tree
 * and display a graceful fallback UI instead of a white screen.
 *
 * In development, the original error and stack trace are logged to
 * the console for easier debugging. In production, we only show the
 * fallback UI to the user.
 */
class ErrorBoundaryInner extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error details in development for easier debugging.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Uncaught application error:', error, errorInfo);
    }
  }

  handleReload = () => {
    // Reload the page to try again
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Friendly fallback UI
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-4 text-2xl font-semibold">Something went wrong.</h1>
          <p className="mb-6 max-w-md text-muted-foreground">
            An unexpected error occurred. Please try reloading the page. If the
            problem persists, contact support.
          </p>
          <Button onClick={this.handleReload}>Reload Page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Memoize to avoid unnecessary re-renders when used in `layout`
export const ErrorBoundary = React.memo(ErrorBoundaryInner);

export default ErrorBoundary; 