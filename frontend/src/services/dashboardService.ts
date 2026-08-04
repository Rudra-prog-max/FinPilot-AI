import api from "./api";

export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
  transactions: number;
}

export async function getDashboardSummary() {
  const response = await api.get<DashboardSummary>(
    "/dashboard/summary"
  );

  return response.data;
}
export interface ExpenseCategory {
  name: string;
  value: number;
}

export async function getExpenseCategories() {
  const response = await api.get<ExpenseCategory[]>(
    "/dashboard/expense-categories"
  );

  return response.data;
}