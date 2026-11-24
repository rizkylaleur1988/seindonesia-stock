import { and, asc, count, desc, eq, ilike, inArray, ne, or, SQL } from "drizzle-orm";
import * as httpContext from "express-http-context";
import { inject, injectable } from "tsyringe";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetStoreProductRequestDto } from "../../../application/dto/store-product/get-store-product.dto.ts";
import type { StoreProduct } from "../../../domain/entities/store-product.entity.ts";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { storeProducts } from "../schema/store-product.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StoreProductRepository implements IStoreProductRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async findByStoreProduct(store_id: number, product_id: number): Promise<StoreProduct | null> {
    const [storeProduct] = await database
      .select()
      .from(storeProducts)
      .where(and(eq(storeProducts.store_id, store_id), eq(storeProducts.product_id, product_id)))
      .limit(1);
    return storeProduct ?? null;
  }

  async create(payload: Pick<StoreProduct, "store_id" | "product_id" | "stock" | "previous_stock">): Promise<StoreProduct> {
    const [storeProduct] = await this.executor.insert(storeProducts).values(payload).returning();
    return storeProduct;
  }

  async findById(id: number): Promise<StoreProduct | null> {
    const [storeProduct] = await database.select().from(storeProducts).where(eq(storeProducts.id, id)).limit(1);
    return storeProduct ?? null;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(storeProducts).where(eq(storeProducts.id, id));
  }

  async datagrid(dto: GetStoreProductRequestDto): Promise<DatagridResponseType<StoreProduct>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: storeProducts.id,
      store_id: storeProducts.store_id,
      product_id: storeProducts.product_id,
      stock: storeProducts.stock,
      created_at: storeProducts.created_at,
      updated_at: storeProducts.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : storeProducts.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(
        ilike(storeProducts.store_id, `%${dto.search}%`),
        ilike(storeProducts.product_id, `%${dto.search}%`),
        ilike(storeProducts.stock, `%${dto.search}%`),
      );
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(storeProducts.id, filters.id));
    if (filters?.store_id) conditions.push(eq(storeProducts.store_id, filters.store_id));
    if (filters?.product_id) conditions.push(ilike(storeProducts.product_id, `%${filters.product_id}%`));
    if (filters?.stock) conditions.push(ilike(storeProducts.stock, `%${filters.stock}%`));

    const ctx = httpContext.get("user");
    const storeIds = ctx.stores.map((item: { id: number }) => item.id);
    if (storeIds.length) conditions.push(inArray(storeProducts.store_id, storeIds));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(storeProducts).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(storeProducts).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findByStoreProductUnlessId(id: number, store_id: number, product_id: number): Promise<StoreProduct | null> {
    const [storeProduct] = await database
      .select()
      .from(storeProducts)
      .where(and(eq(storeProducts.store_id, store_id), eq(storeProducts.product_id, product_id), ne(storeProducts.id, id)))
      .limit(1);
    return storeProduct ?? null;
  }

  async update(payload: Pick<StoreProduct, "id" | "store_id" | "product_id" | "stock">): Promise<StoreProduct> {
    const [storeProduct] = await database
      .update(storeProducts)
      .set({
        store_id: payload.store_id,
        product_id: payload.product_id,
        stock: payload.stock,
        updated_at: new Date(),
      })
      .where(eq(storeProducts.id, payload.id))
      .returning();
    return storeProduct;
  }

  async findByStoreProducts(store_id: number, productIds: number[]): Promise<StoreProduct[]> {
    return await database
      .select()
      .from(storeProducts)
      .where(and(eq(storeProducts.store_id, store_id), inArray(storeProducts.product_id, productIds)));
  }
}
