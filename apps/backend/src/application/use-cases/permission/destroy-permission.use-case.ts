import { inject, injectable } from "tsyringe";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyPermissionRequestDto } from "../../dto/permission/destroy-permission.dto.ts";
import { NotFoundError } from "../../errors/permission/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyPermissionUseCase implements IUseCase<number, DestroyPermissionRequestDto> {
  private readonly permissionRepository: IPermissionRepository;

  constructor(@inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  async execute(permissionId: number): Promise<DestroyPermissionRequestDto> {
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) throw new NotFoundError();

    await this.permissionRepository.destroy(permissionId);

    return {};
  }
}
