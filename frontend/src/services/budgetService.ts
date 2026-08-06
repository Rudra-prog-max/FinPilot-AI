import api from "./api";


export interface Budget {
  id: number;
  category: string;
  monthly_limit: number;
  user_id: number;
}


export interface BudgetAnalysis {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}


export const getBudgets = async () => {
  const response = await api.get("/budget/");
  return response.data;
};


export const createBudget = async (data: {
  category: string;
  monthly_limit: number;
}) => {
  const response = await api.post(
    "/budget/",
    data
  );

  return response.data;
};


export const deleteBudget = async (
  id: number
) => {
  const response = await api.delete(
    `/budget/${id}`
  );

  return response.data;
};


export const getBudgetAnalysis = async () => {
  const response = await api.get(
    "/budget/analysis"
  );

  return response.data;
};