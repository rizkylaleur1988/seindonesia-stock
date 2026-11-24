import { and, asc, count, desc, eq, ilike, inArray, ne, or, SQL } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import type { DatagridResponseType } from "../../../application/dto/pagination.dto.ts";
import type { GetProductRequestDto } from "../../../application/dto/product/get-product.dto.ts";
import type { Product } from "../../../domain/entities/product.entity.ts";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { database } from "../connection.ts";
import type { DbExecutor } from "../db-executor.type.ts";
import { products } from "../schema/product.schema.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class ProductRepository implements IProductRepository {
  private readonly executor: DbExecutor;

  constructor(@inject(InjectionToken.DB_EXECUTOR) executor: DbExecutor) {
    this.executor = executor;
  }

  async datagrid(dto: GetProductRequestDto): Promise<DatagridResponseType<Product>> {
    const filters = dto.filters;
    const currentPage = Math.max(1, dto.page ?? 1);
    const perPage = Math.min(100, Math.max(1, dto.limit ?? 10));
    const offset = (currentPage - 1) * perPage;
    const sortColumn = {
      id: products.id,
      code: products.code,
      name: products.name,
      stock: products.stock,
      created_at: products.created_at,
      updated_at: products.updated_at,
    } as const;
    const column = dto.sortBy ? sortColumn[dto.sortBy as keyof typeof sortColumn] : products.created_at;
    const orderBy = dto.sortType === "ASC" ? asc(column) : desc(column);

    const conditions: SQL[] = [];
    if (dto.search) {
      const searchConditions = or(ilike(products.code, `%${dto.search}%`), ilike(products.name, `%${dto.search}%`));
      if (searchConditions) conditions.push(searchConditions);
    }

    if (filters?.id) conditions.push(eq(products.id, filters.id));
    if (filters?.code) conditions.push(eq(products.code, filters.code));
    if (filters?.name) conditions.push(ilike(products.name, `%${filters.name}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      database.select().from(products).where(where).orderBy(orderBy).limit(perPage).offset(offset),
      database.select({ total: count() }).from(products).where(where),
    ]);

    const total = totalResult[0].total;

    return { rows, pagination: { page: currentPage, limit: perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findById(id: number): Promise<Product | null> {
    const [product] = await database.select().from(products).where(eq(products.id, id)).limit(1);
    return product ?? null;
  }

  async findByCode(code: string): Promise<Product | null> {
    const [product] = await database.select().from(products).where(eq(products.code, code)).limit(1);
    return product ?? null;
  }

  async create(payload: Pick<Product, "code" | "name">): Promise<Product> {
    const [product] = await database.insert(products).values(payload).returning();
    return product;
  }

  async findByCodeUnlessId(id: number, code: string): Promise<Product | null> {
    const [product] = await database
      .select()
      .from(products)
      .where(and(eq(products.code, code), ne(products.id, id)))
      .limit(1);
    return product ?? null;
  }

  async update(payload: Pick<Product, "id" | "code" | "name">): Promise<Product> {
    const [product] = await database
      .update(products)
      .set({
        code: payload.code,
        name: payload.name,
        updated_at: new Date(),
      })
      .where(eq(products.id, payload.id))
      .returning();
    return product;
  }

  async destroy(id: number): Promise<void> {
    await database.delete(products).where(eq(products.id, id));
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return database.select().from(products).where(inArray(products.id, ids));
  }

  async updateStock(payload: Pick<Product, "id" | "stock">): Promise<Product> {
    const [product] = await this.executor
      .update(products)
      .set({ stock: payload.stock, updated_at: new Date() })
      .where(eq(products.id, payload.id))
      .returning();
    return product;
  }
}
