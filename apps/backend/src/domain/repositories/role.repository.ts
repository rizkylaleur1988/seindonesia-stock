import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetRoleRequestDto } from "../../application/dto/role/get-role.dto.ts";
import type { Role } from "../entities/role.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IRoleRepository {
  findByIds(roleIds: number[]): Promise<Role[]>;
  findByCode(code: string): Promise<Role | null>;
  create(payload: Pick<Role, "code" | "name">): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  destroy(id: number): Promise<void>;
  datagrid(dto: GetRoleRequestDto): Promise<DatagridResponseType<Role>>;
  findByCodeUnlessId(id: number, code: string): Promise<Role | null>;
  update(payload: Pick<Role, "id" | "code" | "name">): Promise<Role>;
}
