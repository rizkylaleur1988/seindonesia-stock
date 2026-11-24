import { inject, injectable } from "tsyringe";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateRolePermissionRequestDto, UpdateRolePermissionResponseDto } from "../../dto/role-permission/update-role-permission.dto.ts";
import { NotFoundError } from "../../errors/role-permission/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateRolePermissionUseCase implements IUseCase<UpdateRolePermissionRequestDto, UpdateRolePermissionResponseDto> {
  private readonly rolePermissionRepository: IRolePermissionRepository;
  private readonly rolePermission: IRoleRepository;
  private readonly permissionRepository: IPermissionRepository;

  constructor(
    @inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) rolePermission: IRoleRepository,
    @inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository,
  ) {
    this.rolePermissionRepository = rolePermissionRepository;
    this.rolePermission = rolePermission;
    this.permissionRepository = permissionRepository;
  }

  async execute(input: UpdateRolePermissionRequestDto): Promise<UpdateRolePermissionResponseDto> {
    const { role_id, permission_id } = input;

    const role = await this.rolePermission.findById(role_id);
    if (!role) throw new NotFoundError();

    const permission = await this.permissionRepository.findById(role_id);
    if (!permission) throw new NotFoundError();

    const rolePermission = await this.rolePermissionRepository.findByRolePermission(role_id, permission_id);
    if (!rolePermission) throw new NotFoundError();

    return { role_id, permission_id };
  }
}
