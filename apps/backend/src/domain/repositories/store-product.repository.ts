import type { DatagridResponseType } from "../../application/dto/pagination.dto.ts";
import type { GetStoreProductRequestDto } from "../../application/dto/store-product/get-store-product.dto.ts";
import type { StoreProduct } from "../entities/store-product.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IStoreProductRepository {
  findByStoreProduct(store_id: number, product_id: number): Promise<StoreProduct | null>;
  create(payload: Pick<StoreProduct, "store_id" | "product_id" | "stock" | "previous_stock">): Promise<StoreProduct>;
  findById(id: number): Promise<StoreProduct | null>;
  destroy(id: number): Promise<void>;
  datagrid(dto: GetStoreProductRequestDto): Promise<DatagridResponseType<StoreProduct>>;
  findByStoreProductUnlessId(id: number, store_id: number, product_id: number): Promise<StoreProduct | null>;
  update(payload: Pick<StoreProduct, "id" | "store_id" | "product_id" | "stock" | "previous_stock">): Promise<StoreProduct>;
  findByStoreProducts(store_id: number, productIds: number[]): Promise<StoreProduct[]>;
}
