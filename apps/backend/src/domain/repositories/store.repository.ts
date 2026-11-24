import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetStoreRequestDto } from "../../application/dto/store/get-store.dto.ts";
import type { Store } from "../entities/store.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IStoreRepository {
  findByCode(code: string): Promise<Store | null>;
  create(payload: Pick<Store, "code" | "name" | "address">): Promise<Store>;
  findById(id: number): Promise<Store | null>;
  destroy(id: number): Promise<void>;
  datagrid(dto: GetStoreRequestDto): Promise<DatagridResponseType<Store>>;
  findByCodeUnlessId(id: number, code: string): Promise<Store | null>;
  update(payload: Pick<Store, "id" | "code" | "name" | "address">): Promise<Store>;
  findByIds(ids: number[]): Promise<Store[]>;
}
