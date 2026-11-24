import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { IJwtService, JwtPayloadType, JwtTokenType, SetupJTWType } from "../../application/interfaces/security/jwt.interface.ts";
import { JWT_SECRET_KEY } from "../config/env.config.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class JwtService implements IJwtService {
  private readonly secretKey: string = JWT_SECRET_KEY;
  private readonly algorithm = "HS512" as const;
  private readonly accessTokenExpiresIn: SignOptions["expiresIn"] = "1d";
  private readonly refreshTokenExpiresIn: SignOptions["expiresIn"] = "2d";

  constructor() {
    if (!this.secretKey || this.secretKey.length < 32) throw new Error("JWT_SECRET_KEY must contain at least 32 characters");
  }

  private sign(userId: number, tokenType: JwtTokenType, expiresIn: SignOptions["expiresIn"]): string {
    return jwt.sign({ sub: String(userId), tokenType }, this.secretKey, { algorithm: this.algorithm, expiresIn });
  }

  generateAccessToken(userId: number): string {
    return this.sign(userId, "access", this.accessTokenExpiresIn);
  }

  generateRefreshToken(userId: number): string {
    return this.sign(userId, "refresh", this.refreshTokenExpiresIn);
  }

  private verify(token: string, expectedType: JwtTokenType): JwtPayloadType {
    const decoded = jwt.verify(token, this.secretKey, { algorithms: [this.algorithm] });

    if (typeof decoded === "string") throw new jwt.JsonWebTokenError("Invalid token payload");
    const payload = decoded as JwtPayload;
    if (typeof payload.sub !== "string" || !/^[1-9]\d*$/.test(payload.sub) || payload.tokenType !== expectedType) {
      throw new jwt.JsonWebTokenError("Invalid token payload");
    }
    return payload as JwtPayloadType;
  }

  verifyAccessToken(token: string): JwtPayloadType {
    return this.verify(token, "access");
  }

  verifyRefreshToken(token: string): JwtPayloadType {
    return this.verify(token, "refresh");
  }

  getExpiryTime(token: string): number | null {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    return decoded.exp ?? null;
  }

  setup(userId: number): SetupJTWType {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    return {
      accessToken,
      accessTokenExpiryTime: this.getExpiryTime(accessToken),
      refreshToken,
      refreshTokenExpiryTime: this.getExpiryTime(refreshToken),
    };
  }
}
