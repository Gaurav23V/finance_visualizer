import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage = ({
  message,
  onRetry,
  className,
}: ErrorMessageProps) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive',
        className
      )}
    >
      <AlertCircle className="h-6 w-6 mb-2" />
      <p className="mb-4 font-semibold">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="destructive" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}; 