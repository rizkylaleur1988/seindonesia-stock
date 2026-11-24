import { clearTokens, getAccessToken, getRefreshToken, saveTokens, TokenResponse } from "./auth";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshing: Promise<boolean> | null = null;

function refreshOnce() {
  refreshing ??= doRefresh().finally(() => (refreshing = null));
  return refreshing;
}

function forceLogout(): never {
  clearTokens();
  window.location.href = "/login";
  throw new Error("Sesi berakhir, silakan login ulang");
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/backend/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    saveTokens((await res.json()) as TokenResponse);
    return true;
  } catch {
    return false;
  }
}

function send(path: string, init: RequestInit) {
  const token = getAccessToken();
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  if (!getAccessToken() && !(await refreshOnce())) forceLogout();
  let res = await send(path, init);
  if (res.status === 401) {
    if (!(await refreshOnce())) forceLogout();
    res = await send(path, init);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message ?? `Error ${res.status}`);
  return body as T;
}
