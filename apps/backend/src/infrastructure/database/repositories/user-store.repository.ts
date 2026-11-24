import { eq, inArray } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { UserStore } from "../../../domain/entities/user-store.entity.ts";
import type { IUserStoreRepository } from "../../../domain/repositories/user-store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { userStores } from "../schema/user-store.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UserStoreRepository implements IUserStoreRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByUser(userId: number): Promise<UserStore[]> {
    return database.select().from(userStores).where(eq(userStores.user_id, userId));
  }

  async createMany(userId: number, storeIds: number[]): Promise<UserStore[]> {
    if (storeIds.length === 0) return [];
    const values = storeIds.map((store_id) => ({ user_id: userId, store_id }));
    return this.executor.insert(userStores).values(values).returning();
  }

  async destroyByUser(userId: number): Promise<void> {
    await this.executor.delete(userStores).where(eq(userStores.user_id, userId));
  }

  async updateMany(userId: number, storeIds: number[]): Promise<UserStore[]> {
    return [];
  }

  async findByUsers(userIds: number[]): Promise<UserStore[]> {
    return database.select().from(userStores).where(inArray(userStores.user_id, userIds));
  }
}
