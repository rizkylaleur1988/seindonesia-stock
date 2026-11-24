import { inject, injectable } from "tsyringe";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import type { IUserRoleRepository } from "../../../domain/repositories/user-role.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { AuthorizeRequestDto } from "../../dto/auth/authorize.dto.ts";
import { ForbiddenError } from "../../errors/auth/forbidden.error.ts";
import { UserNotFoundError } from "../../errors/auth/user-not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class AuthorizeUseCase implements IUseCase<AuthorizeRequestDto, boolean> {
  private readonly userRepository: IUserRepository;
  private readonly userRoleRepository: IUserRoleRepository;
  private readonly permissionRepository: IPermissionRepository;
  private readonly rolePermissionRepository: IRolePermissionRepository;

  constructor(
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.USER_ROLE_REPOSITORY) userRoleRepository: IUserRoleRepository,
    @inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository,
    @inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository,
  ) {
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
    this.permissionRepository = permissionRepository;
    this.rolePermissionRepository = rolePermissionRepository;
  }

  async execute(input: AuthorizeRequestDto): Promise<boolean> {
    const { userId, permissionCode } = input;
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundError();

    // if (user.email === "system@seindonesia.com") return true;

    const userRoles = await this.userRoleRepository.findByUser(userId);
    const roleIds = userRoles.map((item) => item.role_id);

    if (roleIds.length === 0) throw new ForbiddenError();

    const permission = await this.permissionRepository.findByCode(permissionCode);
    if (!permission) throw new ForbiddenError();

    const rolesPermission = await this.rolePermissionRepository.findByRolesPermission(roleIds, permission.id);
    if (rolesPermission.length === 0) throw new ForbiddenError();

    return true;
  }
}
