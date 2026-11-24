import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetProductRequestDto } from "../../application/dto/product/get-product.dto.ts";
import type { Product } from "../entities/product.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IProductRepository {
  datagrid(dto: GetProductRequestDto): Promise<DatagridResponseType<Product>>;
  findById(id: number): Promise<Product | null>;
  findByCode(code: string): Promise<Product | null>;
  create(payload: Pick<Product, "code" | "name">): Promise<Product>;
  findByCodeUnlessId(id: number, code: string): Promise<Product | null>;
  update(payload: Pick<Product, "id" | "code" | "name">): Promise<Product>;
  destroy(id: number): Promise<void>;
  findByIds(ids: number[]): Promise<Product[]>;
  updateStock(payload: Pick<Product, "id" | "stock">): Promise<Product>;
}
