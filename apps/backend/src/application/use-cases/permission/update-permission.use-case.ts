import { inject, injectable } from "tsyringe";
import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdatePermissionRequestDto, UpdatePermissionResponseDto } from "../../dto/permission/update-permission.dto.ts";
import { CodeExistsError } from "../../errors/permission/code-exists.error.ts";
import { NotFoundError } from "../../errors/permission/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdatePermissionUseCase implements IUseCase<UpdatePermissionRequestDto, UpdatePermissionResponseDto> {
  private readonly permissionRepository: IPermissionRepository;

  constructor(@inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(input: UpdatePermissionRequestDto): Promise<UpdatePermissionResponseDto> {
    const { id, code, name } = input;
    const permission = await this.permissionRepository.findById(id);
    if (!permission) throw new NotFoundError();

    const codeExists = await this.permissionRepository.findByCodeUnlessId(id, code);
    if (codeExists) throw new CodeExistsError();

    const payload: Pick<Permission, "id" | "code" | "name"> = { id, code, name };
    const updated = await this.permissionRepository.update(payload);
    const { created_at, updated_at } = updated;

    return { id, code, name, created_at, updated_at };
  }
}
