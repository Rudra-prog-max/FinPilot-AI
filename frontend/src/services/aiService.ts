import api from "./api";

export interface ChatResponse {
  response: string;
}

export async function sendAIMessage(
  message: string
): Promise<string> {
  const response = await api.post<ChatResponse>(
    "/ai/chat",
    { message }
  );

  return response.data.response;
}