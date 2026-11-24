import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetUserRequestDto } from "../../application/dto/user/get-user.dto.ts";
import type { User } from "../entities/user.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(payload: Pick<User, "name" | "email" | "password">): Promise<User>;
  destroy(id: number): Promise<void>;
  update(payload: Pick<User, "id" | "name" | "email">): Promise<User>;
  datagrid(dto: GetUserRequestDto): Promise<DatagridResponseType<Omit<User, "password">>>;
  findByIds(ids: number[]): Promise<User[]>;
}
