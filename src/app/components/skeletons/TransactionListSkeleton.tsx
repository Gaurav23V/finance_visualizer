import { Skeleton } from '@/components/ui/skeleton';

export const TransactionListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className='space-y-4'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='flex items-center space-x-4 p-4 border rounded-lg'
        >
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
          <Skeleton className='h-8 w-24' />
        </div>
      ))}
    </div>
  );
};
