'use client';

import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate, getAmountColor } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionCard = ({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) => {
  const amountColor = getAmountColor(transaction.amount);

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">{transaction.description}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className={cn('font-semibold', amountColor)}>{formatCurrency(transaction.amount)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{transaction.category || 'Other'}</Badge>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(transaction)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
            </Button>
        </CardFooter>
    </Card>
  );
}; 