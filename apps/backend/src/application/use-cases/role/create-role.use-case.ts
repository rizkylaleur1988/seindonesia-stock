import { inject, injectable } from "tsyringe";
import type { Role } from "../../../domain/entities/role.entity.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreateRoleRequestDto, CreateRoleResponseDto } from "../../dto/role/create-role.dto.ts";
import { CodeExistsError } from "../../errors/role/code-exists.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateRoleUseCase implements IUseCase<CreateRoleRequestDto, CreateRoleResponseDto> {
  private readonly roleRepository: IRoleRepository;

  constructor(@inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(input: CreateRoleRequestDto): Promise<CreateRoleResponseDto> {
    const { code, name } = input;
    const exists = await this.roleRepository.findByCode(code);
    if (exists) throw new CodeExistsError();

    const payload: Pick<Role, "code" | "name"> = { code, name };
    const role = await this.roleRepository.create(payload);
    const { id, created_at, updated_at } = role;

    return { id, code, name, created_at, updated_at };
  }
}
