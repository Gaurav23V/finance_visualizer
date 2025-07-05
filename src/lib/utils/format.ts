/**
 * Formats a number as a currency string.
 * @param amount - The number to format.
 * @param currency - The currency code (e.g., 'USD').
 * @param locale - The locale to use for formatting.
 * @returns The formatted currency string.
 */
export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date object or string into a more readable format.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting.
 * @returns The formatted date string.
 */
export const formatDate = (
  date: Date | string,
  locale = 'en-US'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Formats a date for use in an input[type="date"].
 * @param date - The date to format.
 * @returns The date string in 'yyyy-MM-dd' format.
 */
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

/**
 * Returns a color class based on the amount.
 * Positive amounts are green, negative are red.
 * @param amount - The amount.
 * @returns A Tailwind CSS color class.
 */
export const getAmountColor = (amount: number): string => {
  if (amount > 0) {
    return 'text-green-600 dark:text-green-400';
  }
  if (amount < 0) {
    return 'text-red-600 dark:text-red-400';
  }
  return 'text-gray-500 dark:text-gray-400';
}; 