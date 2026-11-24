import type { Product } from "../../../domain/entities/product.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetProductRequestDto = DatagridRequestType<Product>;
export type GetProductResponseDto = DatagridResponseType<Product>;
