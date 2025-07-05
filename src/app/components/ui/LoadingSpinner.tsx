import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const LoadingSpinner = ({
  className,
  size = 24,
  ...props
}: LoadingSpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      className={cn('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}; 