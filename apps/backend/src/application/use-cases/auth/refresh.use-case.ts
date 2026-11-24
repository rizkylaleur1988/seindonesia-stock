import { inject, injectable } from "tsyringe";
import type { Permission } from "../../../domain/entities/permission.entity.ts";
import type { IPermissionRepository } from "../../../domain/repositories/permission.repository.ts";
import type { IRolePermissionRepository } from "../../../domain/repositories/role-permission.repository.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRoleRepository } from "../../../domain/repositories/user-role.repository.ts";
import type { IUserSessionRepository } from "../../../domain/repositories/user-session.repository.ts";
import type { IUserStoreRepository } from "../../../domain/repositories/user-store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { RefreshRequestDto, RefreshResponseDto } from "../../dto/auth/refresh.dto.ts";
import { InvalidRefreshTokenError } from "../../errors/auth/invalid-refresh-token.error.ts";
import { RefreshTokenNotFoundError } from "../../errors/auth/refresh-token-not-found.error.ts";
import { UserNotFoundError } from "../../errors/auth/user-not-found.error.ts";
import type { IJwtService } from "../../interfaces/security/jwt.interface.ts";
import type { ISessionToken } from "../../interfaces/security/session-token.factory.interface.ts";
import type { ITokenHasherService } from "../../interfaces/security/token-hasher.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class RefreshUseCase implements IUseCase<RefreshRequestDto, RefreshResponseDto> {
  private readonly userSessionRepository: IUserSessionRepository;
  private readonly userRepository: IUserRepository;
  private readonly userRoleRepository: IUserRoleRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly rolePermissionRepository: IRolePermissionRepository;
  private readonly permissionRepository: IPermissionRepository;
  private readonly tokenHasherService: ITokenHasherService;
  private readonly jwtService: IJwtService;
  private readonly sessionToken: ISessionToken;
  private readonly userStoreRepository: IUserStoreRepository;
  private readonly storeRepository: IStoreRepository;

  constructor(
    @inject(InjectionToken.USER_SESSION_REPOSITORY) userSessionRepository: IUserSessionRepository,
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.USER_ROLE_REPOSITORY) userRoleRepository: IUserRoleRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
    @inject(InjectionToken.ROLE_PERMISSION_REPOSITORY) rolePermissionRepository: IRolePermissionRepository,
    @inject(InjectionToken.PERMISSION_REPOSITORY) permissionRepository: IPermissionRepository,
    @inject(InjectionToken.TOKEN_HASHER) tokenHasherService: ITokenHasherService,
    @inject(InjectionToken.JWT_SERVICE) jwtService: IJwtService,
    @inject(InjectionToken.SESSION_TOKEN_FACTORY) sessionToken: ISessionToken,
    @inject(InjectionToken.USER_STORE_REPOSITORY) userStoreRepository: IUserStoreRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
  ) {
    this.userSessionRepository = userSessionRepository;
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
    this.roleRepository = roleRepository;
    this.rolePermissionRepository = rolePermissionRepository;
    this.permissionRepository = permissionRepository;
    this.tokenHasherService = tokenHasherService;
    this.jwtService = jwtService;
    this.sessionToken = sessionToken;
    this.userStoreRepository = userStoreRepository;
    this.storeRepository = storeRepository;
  }

  async execute(input: RefreshRequestDto): Promise<RefreshResponseDto> {
    const { refreshToken: currentRefreshToken } = input;

    const verify = this.jwtService.verifyRefreshToken(currentRefreshToken);
    if (!verify) throw new InvalidRefreshTokenError();

    const refreshTokenHash = this.tokenHasherService.hash(currentRefreshToken);
    const userSession = await this.userSessionRepository.findByRefreshTokenHash(refreshTokenHash);
    if (!userSession) throw new RefreshTokenNotFoundError();

    const { user_id } = userSession;
    const user = await this.userRepository.findById(user_id);
    if (!user) throw new UserNotFoundError();

    const tokens = this.sessionToken.create(userSession.user_id);
    const payload = this.sessionToken.payload(userSession.user_id, tokens);
    await this.userSessionRepository.createOrUpdate(payload);

    const { id, email, name } = user;
    const [userRoles, userStores] = await Promise.all([this.userRoleRepository.findByUser(id), this.userStoreRepository.findByUser(id)]);
    const roleIds = userRoles.map((item) => item.role_id);
    const storeIds = userStores.map((item) => item.store_id);
    const roles = roleIds.length > 0 ? await this.roleRepository.findByIds(roleIds) : [];
    const stores = storeIds.length > 0 ? await this.storeRepository.findByIds(storeIds) : [];

    let permissions: Permission[] = [];
    if (roleIds.length > 0) {
      const rolePermissions = await this.rolePermissionRepository.findByRoles(roleIds);
      const permissionIds = rolePermissions.map((item) => item.permission_id);
      permissions = permissionIds.length > 0 ? await this.permissionRepository.findByPermissions(permissionIds) : [];
    }

    return { ...tokens, user: { id, email, name, roles, permissions, stores } };
  }
}
