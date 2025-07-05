import { Skeleton } from '@/components/ui/skeleton';

interface BudgetListSkeletonProps {
  count?: number;
}

/**
 * Skeleton placeholder for the budget list while data is loading. Mimics the
 * size of individual budget cards.
 */
export const BudgetListSkeleton = ({ count = 6 }: BudgetListSkeletonProps) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} className='h-40 w-full' />
      ))}
    </div>
  );
};

export default BudgetListSkeleton;
