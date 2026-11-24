import type { Store } from "../../../domain/entities/store.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetStoreRequestDto = DatagridRequestType<Store>;
export type GetStoreResponseDto = DatagridResponseType<Store>;
