import type { JwtTokenType } from "../../application/interfaces/security/jwt.interface.ts";
import type { UserSession } from "../entities/user-session.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IUserSessionRepository {
  findByRefreshTokenHash(refresh_token_hash: string): Promise<UserSession | null>;
  findByUserToken(tokenType: JwtTokenType, userId: number, token: string): Promise<UserSession | null>;
  createOrUpdate(payload: Omit<UserSession, "id" | "created_at" | "updated_at">): Promise<UserSession>;
  destroyUserToken(userId: number): Promise<boolean>;
}
