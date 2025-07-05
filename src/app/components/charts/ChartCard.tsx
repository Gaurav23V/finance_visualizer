import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';

interface ChartCardProps {
  title: string;
  description?: string;
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  onRetry?: () => void;
}

export const ChartCard = ({
  title,
  description,
  isLoading,
  error,
  children,
  onRetry,
}: ChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={onRetry} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}; 