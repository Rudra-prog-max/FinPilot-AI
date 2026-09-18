import api from "./api";

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/auth/me");
  return response.data;
}

export async function updateCurrentUser(full_name: string): Promise<UserProfile> {
  const response = await api.put<UserProfile>("/auth/me", { full_name });
  return response.data;
}
