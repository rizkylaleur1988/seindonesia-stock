import { inject, injectable } from "tsyringe";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetPermissionRequestDto, GetPermissionResponseDto } from "../../dto/permission/get-permission.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetPermissionUseCase implements IUseCase<GetPermissionRequestDto, GetPermissionResponseDto> {
  private readonly permissionRepository: IPermissionRepository;

  constructor(@inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(input: GetPermissionRequestDto): Promise<GetPermissionResponseDto> {
    return await this.permissionRepository.datagrid(input);
  }
}
