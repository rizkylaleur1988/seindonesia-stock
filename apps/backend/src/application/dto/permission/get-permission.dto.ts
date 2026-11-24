import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { DatagridRequestType, DatagridResponseType } from "../pagination.dto.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type GetPermissionRequestDto = DatagridRequestType<Permission>;
export type GetPermissionResponseDto = DatagridResponseType<Permission>;
