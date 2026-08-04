import api from "./api";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  created_at: string;
}

export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const createTransaction = async (data: {
  title: string;
  amount: number;
  type: string;
  category: string;
}) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const deleteTransaction = async (
  id: number
) => {
  const response = await api.delete(
    `/transactions/${id}`
  );
  return response.data;
};