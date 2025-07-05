import { Budget, CreateBudgetRequest } from '@/types/budget';

const API_BASE_URL = '/api/budgets';

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data.data;
}

/**
 * Fetches budgets for a specific month and year.
 * @param month - The month (1-12)
 * @param year - The year
 * @returns A promise that resolves to an array of budgets.
 */
export async function fetchBudgets(month: number, year: number): Promise<Budget[]> {
  const response = await fetch(`${API_BASE_URL}?month=${month}&year=${year}`);
  return handleResponse<Budget[]>(response);
}

/**
 * Creates or updates a budget.
 * @param data - The budget data.
 * @returns A promise that resolves to the created or updated budget.
 */
export async function createOrUpdateBudget(data: CreateBudgetRequest): Promise<Budget> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Budget>(response);
}

/**
 * Deletes a budget by its ID.
 * @param id - The ID of the budget to delete.
 * @returns A promise that resolves when the budget is deleted.
 */
export async function deleteBudget(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  await handleResponse(response);
} 