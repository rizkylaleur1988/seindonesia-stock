import { inject, injectable } from "tsyringe";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetRoleByIdResponseDto } from "../../dto/role/get-role-by-id.dto.ts";
import { NotFoundError } from "../../errors/role/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetRoleByIdUseCase implements IUseCase<number, GetRoleByIdResponseDto> {
  private readonly roleRepository: IRoleRepository;

  constructor(@inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(roleId: number): Promise<GetRoleByIdResponseDto> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new NotFoundError();

    const { id, code, name, created_at, updated_at } = role;
    return { id, code, name, created_at, updated_at };
  }
}
