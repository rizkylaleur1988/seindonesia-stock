import { eq, inArray } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { UserRole } from "../../../domain/entities/user-role.entity.ts";
import type { IUserRoleRepository } from "../../../domain/repositories/user-role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { userRoles } from "../schema/user-role.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UserRoleRepository implements IUserRoleRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByUser(userId: number): Promise<UserRole[]> {
    return database.select().from(userRoles).where(eq(userRoles.user_id, userId));
  }

  async createMany(userId: number, roleIds: number[]): Promise<UserRole[]> {
    if (roleIds.length === 0) return [];
    const values = roleIds.map((role_id) => ({ user_id: userId, role_id }));
    return this.executor.insert(userRoles).values(values).returning();
  }

  async destroyByUser(userId: number): Promise<void> {
    await this.executor.delete(userRoles).where(eq(userRoles.user_id, userId));
  }

  async updateMany(userId: number, roleIds: number[]): Promise<UserRole[]> {
    return [];
  }

  async findByUsers(userIds: number[]): Promise<UserRole[]> {
    return database.select().from(userRoles).where(inArray(userRoles.user_id, userIds));
  }
}
