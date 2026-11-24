import { inject, injectable } from "tsyringe";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetRolePermissionRequestDto, GetRolePermissionResponseDto } from "../../dto/role-permission/get-role-permission.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetRolePermissionUseCase implements IUseCase<GetRolePermissionRequestDto, GetRolePermissionResponseDto> {
  private readonly rolePermissionRepository: IRolePermissionRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly permissionRepository: IPermissionRepository;

  constructor(
    @inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
    @inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository,
  ) {
    this.rolePermissionRepository = rolePermissionRepository;
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
  }

  async execute(input: GetRolePermissionRequestDto): Promise<GetRolePermissionResponseDto> {
    const results = await this.rolePermissionRepository.datagrid(input);
    const roleIds = [...new Set(results.rows.map((item) => item.role_id))];
    const permissionIds = [...new Set(results.rows.map((item) => item.permission_id))];

    const [roles, permissions] = await Promise.all([this.roleRepository.findByIds(roleIds), this.permissionRepository.findByIds(permissionIds)]);
    const roleMap = new Map(roles.map((item) => [item.id, item]));
    const permissionMap = new Map(permissions.map((item) => [item.id, item]));

    return {
      ...results,
      rows: results.rows.map((item) => ({
        ...item,
        role: roleMap.get(item.role_id) ?? null,
        permission: permissionMap.get(item.permission_id) ?? null,
      })),
    };
  }
}
