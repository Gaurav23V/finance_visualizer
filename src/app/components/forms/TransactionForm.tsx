'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '@/types/transaction';
import {
  TRANSACTION_CATEGORIES,
  TransactionCategory,
} from '@/lib/constants/categories';

const formSchema = z.object({
  amount: z.coerce
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.',
    })
    .min(0.01, 'Amount must be greater than 0.'),
  date: z.date({
    required_error: 'A date is required.',
  }),
  description: z.string().min(3, {
    message: 'Description must be at least 3 characters.',
  }),
  category: z.custom<TransactionCategory>(
    val => TRANSACTION_CATEGORIES.includes(val as TransactionCategory),
    {
      message: 'Please select a valid category.',
    }
  ),
  type: z.enum(['income', 'expense']),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  onSubmit: (
    values: CreateTransactionRequest | UpdateTransactionRequest
  ) => Promise<void>;
  initialData?: Transaction;
  isSubmitting?: boolean;
}

export function TransactionForm({
  onSubmit,
  initialData,
  isSubmitting = false,
}: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData ? Math.abs(initialData.amount) : undefined,
      date: initialData ? new Date(initialData.date) : new Date(),
      description: initialData ? initialData.description : '',
      type: initialData
        ? initialData.amount > 0
          ? 'income'
          : 'expense'
        : 'expense',
      category: initialData ? initialData.category : undefined,
    },
  });

  const transactionType = form.watch('type');

  React.useEffect(() => {
    if (initialData) return; // Don't reset category if editing

    if (transactionType === 'income') {
      form.setValue('category', 'Income/Salary');
    } else {
      if (form.getValues('category') === 'Income/Salary') {
        form.setValue('category', 'Other'); // Or reset to undefined
      }
    }
  }, [transactionType, form, initialData]);

  const handleSubmit = (values: TransactionFormValues) => {
    const amount =
      values.type === 'expense'
        ? -Math.abs(values.amount)
        : Math.abs(values.amount);
    onSubmit({
      ...values,
      amount,
    });
  };

  const availableCategories =
    transactionType === 'income'
      ? TRANSACTION_CATEGORIES.filter(c => c === 'Income/Salary')
      : TRANSACTION_CATEGORIES.filter(c => c !== 'Income/Salary');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='e.g., Groceries' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type='number' placeholder='0.00' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <div className='flex items-center space-x-4'>
                  <Button
                    type='button'
                    variant={
                      field.value === 'expense' ? 'destructive' : 'outline'
                    }
                    onClick={() => field.onChange('expense')}
                  >
                    Expense
                  </Button>
                  <Button
                    type='button'
                    variant={field.value === 'income' ? 'default' : 'outline'}
                    onClick={() => field.onChange('income')}
                  >
                    Income
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size={16} className='mr-2' /> : null}
          {initialData ? 'Update Transaction' : 'Create Transaction'}
        </Button>
      </form>
    </Form>
  );
}
