import type { UserRole } from "../entities/user-role.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IUserRoleRepository {
  findByUser(userId: number): Promise<UserRole[]>;
  createMany(userId: number, roleIds: number[]): Promise<UserRole[]>;
  destroyByUser(userId: number): Promise<void>;
  updateMany(userId: number, roleIds: number[]): Promise<UserRole[]>;
  findByUsers(userIds: number[]): Promise<UserRole[]>;
}
