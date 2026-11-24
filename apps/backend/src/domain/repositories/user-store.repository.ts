import type { UserStore } from "../entities/user-store.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IUserStoreRepository {
  findByUser(userId: number): Promise<UserStore[]>;
  createMany(userId: number, storeIds: number[]): Promise<UserStore[]>;
  destroyByUser(userId: number): Promise<void>;
  updateMany(userId: number, storeIds: number[]): Promise<UserStore[]>;
  findByUsers(userIds: number[]): Promise<UserStore[]>;
}
