import api from "./api";


export interface Insight {
  message: string;
}


export const getInsights = async () => {
  const response = await api.get<Insight[]>(
    "/insights/"
  );

  return response.data;
};