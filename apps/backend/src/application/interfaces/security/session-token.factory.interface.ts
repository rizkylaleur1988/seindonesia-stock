/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

import type { UserSession } from "../../../domain/entities/user-session.entity.ts";

export interface IToken {
  accessToken: string;
  accessTokenExpiryTime: number;
  refreshToken: string;
  refreshTokenExpiryTime: number;
}

export interface ISessionToken {
  create(userId: number): IToken;
  payload(userId: number, tokens: IToken): Omit<UserSession, "id" | "created_at" | "updated_at">;
}
