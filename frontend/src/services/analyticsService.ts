import api from "./api";

export interface MonthlyAnalytics {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryAnalytics {
  category: string;
  amount: number;
}

export async function getMonthlyAnalytics() {
  const response = await api.get<MonthlyAnalytics[]>(
    "/analytics/monthly"
  );

  return response.data;
}

export async function getCategoryAnalytics() {
  const response = await api.get<CategoryAnalytics[]>(
    "/analytics/categories"
  );

  return response.data;
}