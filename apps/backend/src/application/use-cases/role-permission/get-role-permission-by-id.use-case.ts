import { inject, injectable } from "tsyringe";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetRolePermissionByIdRequestDto, GetRolePermissionByIdResponseDto } from "../../dto/role-permission/get-role-permission-by-id.dto.ts";
import { NotFoundError } from "../../errors/role-permission/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetRolePermissionByIdUseCase implements IUseCase<GetRolePermissionByIdRequestDto, GetRolePermissionByIdResponseDto> {
  private readonly rolePermissionRepository: IRolePermissionRepository;

  constructor(@inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository) {
    this.rolePermissionRepository = rolePermissionRepository;
  }

  async execute(input: GetRolePermissionByIdRequestDto): Promise<GetRolePermissionByIdResponseDto> {
    const { role_id, permission_id } = input;

    const product = await this.rolePermissionRepository.findByRolePermission(role_id, permission_id);
    if (!product) throw new NotFoundError();

    return { role_id, permission_id };
  }
}
