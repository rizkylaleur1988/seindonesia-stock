import Cookies from "js-cookie";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const NAME = "name";
const EMAIL = "email";
const PERMISSIONS = "permissions";
const ROLES = "roles";
const STORES = "stores";

export type permission = {
  id: number;
  code: string;
  name: string;
};

export type role = {
  id: number;
  code: string;
  name: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiryTime: number;
  refreshTokenExpiryTime: number;
  user: { id: number; email: string; name: string; permissions: permission[]; roles: role[]; stores: string[] };
};

export const getAccessToken = () => Cookies.get(ACCESS);
export const getRefreshToken = () => Cookies.get(REFRESH);
export const getName = () => Cookies.get(NAME) ?? "";
export const getEmail = () => Cookies.get(EMAIL) ?? "";
export const getPermissions = () => Cookies.get(PERMISSIONS) ?? "";
export const getRoles = () => Cookies.get(ROLES) ?? "";
export const getStores = () => Cookies.get(STORES) ?? "";

export function clearTokens() {
  [ACCESS, REFRESH, NAME, EMAIL, PERMISSIONS, ROLES, STORES].forEach((n) => Cookies.remove(n, { path: "/" }));
}

function toDate(v: string | number): Date {
  if (typeof v === "number") return new Date(v < 1e12 ? v * 1000 : v);
  return new Date(v);
}

export function saveTokens(data: TokenResponse) {
  const opts = {
    sameSite: "lax" as const,
    secure: location.protocol === "https:",
    path: "/",
  };
  Cookies.set(ACCESS, data.accessToken, {
    ...opts,
    expires: toDate(data.accessTokenExpiryTime),
  });
  Cookies.set(REFRESH, data.refreshToken, {
    ...opts,
    expires: toDate(data.refreshTokenExpiryTime),
  });
  Cookies.set(NAME, data.user.name, {
    ...opts,
    expires: toDate(data.refreshTokenExpiryTime),
  });
  Cookies.set(EMAIL, data.user.email, {
    ...opts,
    expires: toDate(data.refreshTokenExpiryTime),
  });
  Cookies.set(PERMISSIONS, JSON.stringify(data.user.permissions.map((item: { code: string }) => ({ code: item.code }))), {
    ...opts,
    expires: toDate(data.refreshTokenExpiryTime),
  });
  Cookies.set(ROLES, JSON.stringify(data.user.roles), {
    ...opts,
    expires: toDate(data.refreshTokenExpiryTime),
  });
  Cookies.set(STORES, JSON.stringify(data.user.stores), {
    ...opts,
    expires: toDate(data.refreshTokenExpiryTime),
  });
}

export const isLoggedIn = () => !!getRefreshToken();
