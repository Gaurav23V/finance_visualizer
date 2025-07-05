'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  // Optional props for year range
  startYear?: number;
  endYear?: number;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthYearSelector({
  month,
  year,
  onMonthChange,
  onYearChange,
  startYear,
  endYear,
}: MonthYearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = [];
  const sYear = startYear || currentYear - 5;
  const eYear = endYear || currentYear + 2;

  for (let y = sYear; y <= eYear; y++) {
    years.push(y);
  }

  const handleMonthChange = (value: string) => {
    onMonthChange(parseInt(value, 10));
  };

  const handleYearChange = (value: string) => {
    onYearChange(parseInt(value, 10));
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={month.toString()}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((name, index) => (
            <SelectItem key={name} value={(index + 1).toString()}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year.toString()}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map(y => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 