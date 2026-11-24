import { inject, injectable } from "tsyringe";
import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRoleRepository } from "../../../domain/repositories/user-role.repository.ts";
import type { IUserStoreRepository } from "../../../domain/repositories/user-store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { MeResponseDto } from "../../dto/auth/me.dto.ts";
import { UserNotFoundError } from "../../errors/auth/user-not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class MeUseCase implements IUseCase<number, MeResponseDto> {
  private readonly userRepository: IUserRepository;
  private readonly userRoleRepository: IUserRoleRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly rolePermissionRepository: IRolePermissionRepository;
  private readonly permissionRepository: IPermissionRepository;
  private readonly userStoreRepository: IUserStoreRepository;
  private readonly storeRepository: IStoreRepository;

  constructor(
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.USER_ROLE_REPOSITORY) userRoleRepository: IUserRoleRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
    @inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository,
    @inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository,
    @inject(InjectionToken.USER_STORE_REPOSITORY) userStoreRepository: IUserStoreRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
  ) {
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
    this.roleRepository = roleRepository;
    this.rolePermissionRepository = rolePermissionRepository;
    this.permissionRepository = permissionRepository;
    this.userStoreRepository = userStoreRepository;
    this.storeRepository = storeRepository;
  }

  async execute(userId: number): Promise<MeResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundError();

    const [userRoles, userStores] = await Promise.all([this.userRoleRepository.findByUser(userId), this.userStoreRepository.findByUser(userId)]);
    const roleIds = userRoles.map((item) => item.role_id);
    const storeIds = userStores.map((item) => item.store_id);
    const roles = roleIds.length > 0 ? await this.roleRepository.findByIds(roleIds) : [];
    const stores = storeIds.length > 0 ? await this.storeRepository.findByIds(storeIds) : [];

    let permissions: Permission[] = [];
    if (roleIds.length > 0) {
      const rolePermissions = await this.rolePermissionRepository.findByRoles(roleIds);
      const permissionIds = rolePermissions.map((item) => item.permission_id);
      permissions = rolePermissions.length > 0 ? await this.permissionRepository.findByPermissions(permissionIds) : [];
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles,
      permissions: [...new Set(permissions)],
      stores,
    };
  }
}
