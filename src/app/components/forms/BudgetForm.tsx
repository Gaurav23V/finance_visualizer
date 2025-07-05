'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { Budget, CreateBudgetRequest } from '@/types/budget';
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
    .positive({ message: 'Amount must be a positive number.' }),
  category: z.custom<TransactionCategory>(
    val => TRANSACTION_CATEGORIES.includes(val as TransactionCategory),
    {
      message: 'Please select a valid category.',
    }
  ),
});

export type BudgetFormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  onSubmit: (values: CreateBudgetRequest) => Promise<void>;
  initialData?: Budget;
  isSubmitting?: boolean;
  month: number;
  year: number;
  existingCategories: TransactionCategory[];
}

export function BudgetForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  month,
  year,
  existingCategories,
}: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData?.amount || '',
      category: initialData?.category,
    },
  });

  React.useEffect(() => {
    form.reset({
        amount: initialData?.amount || '',
        category: initialData?.category,
    })
  }, [initialData, form]);

  const handleSubmit = (values: BudgetFormValues) => {
    onSubmit({
      ...values,
      month,
      year,
    });
  };

  const availableCategories = TRANSACTION_CATEGORIES.filter(
    c => c !== 'Income/Salary' && (initialData?.category === c || !existingCategories.includes(c))
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
          {initialData ? 'Update Budget' : 'Create Budget'}
        </Button>
      </form>
    </Form>
  );
} 