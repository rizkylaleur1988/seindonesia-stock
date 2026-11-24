import { inject, injectable } from "tsyringe";
import type { Role } from "../../../domain/entities/role.entity.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateRoleRequestDto, UpdateRoleResponseDto } from "../../dto/role/update-role.dto.ts";
import { CodeExistsError } from "../../errors/role/code-exists.error.ts";
import { NotFoundError } from "../../errors/role/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateRoleUseCase implements IUseCase<UpdateRoleRequestDto, UpdateRoleResponseDto> {
  private readonly roleRepository: IRoleRepository;

  constructor(@inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(input: UpdateRoleRequestDto): Promise<UpdateRoleResponseDto> {
    const { id, code, name } = input;
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundError();

    const codeExists = await this.roleRepository.findByCodeUnlessId(id, code);
    if (codeExists) throw new CodeExistsError();

    const payload: Pick<Role, "id" | "code" | "name"> = { id, code, name };
    const updated = await this.roleRepository.update(payload);
    const { created_at, updated_at } = updated;

    return { id, code, name, created_at, updated_at };
  }
}
