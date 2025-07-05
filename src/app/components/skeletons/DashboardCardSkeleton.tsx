import { Skeleton } from '@/components/ui/skeleton';

interface DashboardCardSkeletonProps {
  count?: number;
}

/**
 * Skeleton placeholder for dashboard summary cards. Shows a grid of card-sized
 * blocks so the user can anticipate the layout and content while data loads.
 */
export const DashboardCardSkeleton = ({
  count = 3,
}: DashboardCardSkeletonProps) => {
  return (
    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} className='h-32 w-full' />
      ))}
    </div>
  );
};

export default DashboardCardSkeleton;
