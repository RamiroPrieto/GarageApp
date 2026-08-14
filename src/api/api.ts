import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.0.111:3000";

const TOKEN_KEY = "auth_token";

let authToken: string | null = null;

export async function setAuthToken(token: string) {
  authToken = token;

  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token,
  );
}

export async function loadAuthToken() {
  const token =
    await SecureStore.getItemAsync(TOKEN_KEY);

  authToken = token;

  return token;
}

export async function clearAuthToken() {
  authToken = null;

  await SecureStore.deleteItemAsync(
    TOKEN_KEY,
  );
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Error en la solicitud",
    );
  }

  return data;
}