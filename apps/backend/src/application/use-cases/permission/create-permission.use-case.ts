import { inject, injectable } from "tsyringe";
import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreatePermissionRequestDto, CreatePermissionResponseDto } from "../../dto/permission/create-permission.dto.ts";
import { CodeExistsError } from "../../errors/permission/code-exists.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreatePermissionUseCase implements IUseCase<CreatePermissionRequestDto, CreatePermissionResponseDto> {
  private readonly permissionRepository: IPermissionRepository;

  constructor(@inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(input: CreatePermissionRequestDto): Promise<CreatePermissionResponseDto> {
    const { code, name } = input;
    const exists = await this.permissionRepository.findByCode(code);
    if (exists) throw new CodeExistsError();

    const payload: Pick<Permission, "code" | "name"> = { code, name };
    const permission = await this.permissionRepository.create(payload);
    const { id, created_at, updated_at } = permission;

    return { id, code, name, created_at, updated_at };
  }
}
