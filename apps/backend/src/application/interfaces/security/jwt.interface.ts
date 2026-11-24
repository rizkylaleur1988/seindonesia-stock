import type { JwtPayload } from "jsonwebtoken";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type JwtTokenType = "access" | "refresh";

export interface JwtPayloadType extends JwtPayload {
  sub: string;
  tokenType: JwtTokenType;
}

export interface SetupJTWType {
  accessToken: string;
  accessTokenExpiryTime: number | null;
  refreshToken: string;
  refreshTokenExpiryTime: number | null;
}

export interface IJwtService {
  generateAccessToken(userId: number): string;
  generateRefreshToken(userId: number): string;
  verifyAccessToken(token: string): JwtPayloadType;
  verifyRefreshToken(token: string): JwtPayloadType;
  getExpiryTime(token: string): number | null;
  setup(userId: number): SetupJTWType;
}
