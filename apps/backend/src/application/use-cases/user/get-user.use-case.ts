import { inject, injectable } from "tsyringe";
import type { Role } from "../../../domain/entities/role.entity.ts";
import type { Store } from "../../../domain/entities/store.entity.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRoleRepository } from "../../../domain/repositories/user-role.repository.ts";
import type { IUserStoreRepository } from "../../../domain/repositories/user-store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetUserRequestDto, GetUserResponseDto } from "../../dto/user/get-user.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetUserUseCase implements IUseCase<GetUserRequestDto, GetUserResponseDto> {
  private readonly userRepository: IUserRepository;
  private readonly userRoleRepository: IUserRoleRepository;
  private readonly userStoreRepository: IUserStoreRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly storeRepository: IStoreRepository;

  constructor(
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.USER_ROLE_REPOSITORY) userRoleRepository: IUserRoleRepository,
    @inject(InjectionToken.USER_STORE_REPOSITORY) userStoreRepository: IUserStoreRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
  ) {
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
    this.userStoreRepository = userStoreRepository;
    this.roleRepository = roleRepository;
    this.storeRepository = storeRepository;
  }

  async execute(input: GetUserRequestDto): Promise<GetUserResponseDto> {
    const results = await this.userRepository.datagrid(input);

    // const userIds = results.rows.map((item) => item.id);
    // const [userRoles, userStores] = await Promise.all([this.userRoleRepository.findByUsers(userIds), this.userStoreRepository.findByUsers(userIds)]);
    // const userRoleMap = new Map(userRoles.map((item) => [item.user_id, item.role_id]));
    // const userStoreMap = new Map(userStores.map((item) => [item.user_id, item.store_id]));

    // const roleIds = [...new Set(userRoles.map((item) => item.role_id))];
    // const storeIds = [...new Set(userStores.map((item) => item.store_id))];
    // const [roles, stores] = await Promise.all([
    //   roleIds.length > 0 ? this.roleRepository.findByIds(roleIds) : Promise.resolve([]),
    //   storeIds.length > 0 ? this.storeRepository.findByIds(storeIds) : Promise.resolve([]),
    // ]);
    // const roleMap = new Map(roles.map((item) => [item.id, item]));
    // const storeMap = new Map(stores.map((item) => [item.id, item]));

    // results.rows = results.rows.map((item) => ({
    //   ...item,
    //   roles: roleMap.get(userRoleMap.get(item.id) ?? 0) ?? [],
    //   stores: storeMap.get(userStoreMap.get(item.id) ?? 0) ?? [],
    // }));

    const userIds = results.rows.map((item) => item.id);

    const [userRoles, userStores] = await Promise.all([this.userRoleRepository.findByUsers(userIds), this.userStoreRepository.findByUsers(userIds)]);
    const roleIds = [...new Set(userRoles.map((item) => item.role_id))];
    const storeIds = [...new Set(userStores.map((item) => item.store_id))];

    const [roles, stores] = await Promise.all([
      roleIds.length > 0 ? this.roleRepository.findByIds(roleIds) : Promise.resolve([]),
      storeIds.length > 0 ? this.storeRepository.findByIds(storeIds) : Promise.resolve([]),
    ]);
    const roleMap = new Map(roles.map((item) => [item.id, item]));
    const storeMap = new Map(stores.map((item) => [item.id, item]));
    const userRoleMap = new Map<number, Role[]>();
    const userStoreMap = new Map<number, Store[]>();

    for (const item of userRoles) {
      const role = roleMap.get(item.role_id);
      if (!role) continue;
      const current = userRoleMap.get(item.user_id) ?? [];
      current.push(role);
      userRoleMap.set(item.user_id, current);
    }

    for (const item of userStores) {
      const store = storeMap.get(item.store_id);
      if (!store) continue;
      const current = userStoreMap.get(item.user_id) ?? [];
      current.push(store);
      userStoreMap.set(item.user_id, current);
    }

    results.rows = results.rows.map((item) => ({
      ...item,
      roles: userRoleMap.get(item.id) ?? [],
      stores: userStoreMap.get(item.id) ?? [],
    }));

    return results;
  }
}
