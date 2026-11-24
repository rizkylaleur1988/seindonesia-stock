import { inject, injectable } from "tsyringe";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetRoleRequestDto, GetRoleResponseDto } from "../../dto/role/get-role.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetRoleUseCase implements IUseCase<GetRoleRequestDto, GetRoleResponseDto> {
  private readonly roleRepository: IRoleRepository;

  constructor(@inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(input: GetRoleRequestDto): Promise<GetRoleResponseDto> {
    return await this.roleRepository.datagrid(input);
  }
}
