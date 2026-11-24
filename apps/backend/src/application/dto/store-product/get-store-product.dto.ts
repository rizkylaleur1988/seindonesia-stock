import type { StoreProduct } from "../../../domain/entities/store-product.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetStoreProductRequestDto = DatagridRequestType<StoreProduct>;
export type GetStoreProductResponseDto = DatagridResponseType<StoreProduct>;
