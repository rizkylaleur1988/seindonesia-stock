import type { Product } from "../../../domain/entities/product.entity.ts";
import type { StoreProduct } from "../../../domain/entities/store-product.entity.ts";
import type { Store } from "../../../domain/entities/store.entity.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetStoreProductByIdResponseDto = StoreProduct & {
  store: Store | null;
  product: Product | null;
};
