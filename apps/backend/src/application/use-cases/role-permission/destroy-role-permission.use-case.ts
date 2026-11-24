import { inject, injectable } from "tsyringe";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyRolePermissionRequestDto, DestroyRolePermissionResponseDto } from "../../dto/role-permission/destroy-role-permission.dto.ts";
import { NotFoundError } from "../../errors/product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyRolePermissionUseCase implements IUseCase<DestroyRolePermissionRequestDto, DestroyRolePermissionResponseDto> {
  private readonly rolePermissionRepository: IRolePermissionRepository;

  constructor(@inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository) {
    this.rolePermissionRepository = rolePermissionRepository;
  }

  async execute(input: DestroyRolePermissionRequestDto): Promise<DestroyRolePermissionResponseDto> {
    const { role_id, permission_id } = input;
    const product = await this.rolePermissionRepository.findByRolePermission(role_id, permission_id);
    if (!product) throw new NotFoundError();

    await this.rolePermissionRepository.destroy(role_id, permission_id);

    return {};
  }
}
