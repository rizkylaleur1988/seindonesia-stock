import { and, eq } from "drizzle-orm";
import type { JwtTokenType } from "../../../application/interfaces/security/jwt.interface.ts";
import type { UserSession } from "../../../domain/entities/user-session.entity.ts";
import type { IUserSessionRepository } from "../../../domain/repositories/user-session.repository.ts";
import { database } from "../connection.ts";
import { userSessions } from "../schema/user-session.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class UserSessionRepository implements IUserSessionRepository {
  async findByRefreshTokenHash(refresh_token_hash: string): Promise<UserSession | null> {
    const [userSession] = await database.select().from(userSessions).where(eq(userSessions.refresh_token_hash, refresh_token_hash)).limit(1);
    return userSession ?? null;
  }

  async findByUserToken(tokenType: JwtTokenType, userId: number, token: string): Promise<UserSession | null> {
    const tokenColumn = tokenType === "access" ? userSessions.access_token_hash : userSessions.refresh_token_hash;
    const [userSession] = await database
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.user_id, userId), eq(tokenColumn, token)))
      .limit(1);
    return userSession ?? null;
  }

  async createOrUpdate(payload: Omit<UserSession, "id" | "created_at" | "updated_at">): Promise<UserSession> {
    return database.transaction(async (tx) => {
      const [currentSession] = await tx.select().from(userSessions).where(eq(userSessions.user_id, payload.user_id)).limit(1);
      if (currentSession) {
        const [userSession] = await tx
          .update(userSessions)
          .set({
            access_token_hash: payload.access_token_hash,
            refresh_token_hash: payload.refresh_token_hash,
            access_token_expires_at: payload.access_token_expires_at,
            refresh_token_expires_at: payload.refresh_token_expires_at,
            updated_at: new Date(),
          })
          .where(eq(userSessions.id, currentSession.id))
          .returning();
        return userSession;
      }

      const [userSession] = await tx.insert(userSessions).values(payload).returning();
      return userSession;
    });
  }

  async destroyUserToken(userId: number): Promise<boolean> {
    const [deleted] = await database.delete(userSessions).where(eq(userSessions.user_id, userId)).returning({ id: userSessions.id });
    return Boolean(deleted);
  }
}
