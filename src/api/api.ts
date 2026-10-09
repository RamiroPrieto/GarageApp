import * as SecureStore from "expo-secure-store";

import { t } from "../i18n/translate";

const API_URL = "https://garageappbackend-production.up.railway.app";

// const API_URL = "http://192.168.0.111:3000";

const TOKEN_KEY = "auth_token";

let authToken: string | null = null;
let tokenVersion = 0;

export async function setAuthToken(token: string) {
  tokenVersion += 1;
  authToken = token;

  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token,
  );
}

export async function loadAuthToken() {
  const versionWhenLoading = tokenVersion;
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  // A logout or a newer login may have happened while SecureStore was read.
  // Never restore a token that was invalidated in the meantime.
  if (versionWhenLoading !== tokenVersion) {
    return null;
  }

  authToken = token;

  return token;
}

export async function clearAuthToken() {
  tokenVersion += 1;
  authToken = null;

  await SecureStore.deleteItemAsync(
    TOKEN_KEY,
  );
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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

  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();
  const hasBody = body.trim().length > 0;
  console.log("[api] Response received", { endpoint, status: response.status, contentType, hasBody });

  let data: unknown = null;
  if (hasBody) {
    try {
      data = JSON.parse(body);
    } catch {
      const error = new Error(t("common.requestError"));
      Object.assign(error, { statusCode: response.status, code: "INVALID_JSON_RESPONSE" });
      throw error;
    }
  }

  if (!response.ok) {
    const responseData = data as { message?: string; code?: string } | null;
    const error = new Error(responseData?.message || t("common.requestError"));
    Object.assign(error, { statusCode: response.status, code: responseData?.code });
    throw error;
  }

  return data as T;
}
