import { inject, injectable } from "tsyringe";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRoleRepository } from "../../../domain/repositories/user-role.repository.ts";
import type { IUserSessionRepository } from "../../../domain/repositories/user-session.repository.ts";
import type { IUserStoreRepository } from "../../../domain/repositories/user-store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InvalidBearerTokenError } from "../../../presentation/http/errors/invalid-bearer-token.error.ts";
import { UnauthorizedError } from "../../../presentation/http/errors/unautorized.error.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { AuthenticateRequestDto, AuthenticateResponseDto } from "../../dto/auth/authenticate.dto.ts";
import type { IJwtService } from "../../interfaces/security/jwt.interface.ts";
import type { ITokenHasherService } from "../../interfaces/security/token-hasher.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class AuthenticateUseCase implements IUseCase<AuthenticateRequestDto, AuthenticateResponseDto> {
  private readonly jwtService: IJwtService;
  private readonly userSessionRepository: IUserSessionRepository;
  private readonly tokenHasherService: ITokenHasherService;
  private readonly userStoreRepository: IUserStoreRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly userRepository: IUserRepository;
  private readonly userRoleRepository: IUserRoleRepository;
  private readonly roleRepository: IRoleRepository;

  constructor(
    @inject(InjectionToken.JWT_SERVICE) jwtService: IJwtService,
    @inject(InjectionToken.USER_SESSION_REPOSITORY) userSessionRepository: IUserSessionRepository,
    @inject(InjectionToken.TOKEN_HASHER) tokenHasherService: ITokenHasherService,
    @inject(InjectionToken.USER_STORE_REPOSITORY) userStoreRepository: IUserStoreRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.USER_ROLE_REPOSITORY) userRoleRepository: IUserRoleRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
  ) {
    this.jwtService = jwtService;
    this.userSessionRepository = userSessionRepository;
    this.tokenHasherService = tokenHasherService;
    this.userStoreRepository = userStoreRepository;
    this.storeRepository = storeRepository;
    this.userRepository = userRepository;
    this.userRoleRepository = userRoleRepository;
    this.roleRepository = roleRepository;
  }

  async execute(input: AuthenticateRequestDto): Promise<AuthenticateResponseDto> {
    const { tokenType, token } = input;
    const payload = tokenType === "access" ? this.jwtService.verifyAccessToken(token) : this.jwtService.verifyRefreshToken(token);

    const userId = Number(payload.sub);
    if (!Number.isSafeInteger(userId) || userId <= 0) throw new InvalidBearerTokenError();

    const tokenHash = this.tokenHasherService.hash(token);
    const session = await this.userSessionRepository.findByUserToken(tokenType, userId, tokenHash);
    if (!session) throw new InvalidBearerTokenError();

    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedError();

    const [userStores, userRoles] = await Promise.all([this.userStoreRepository.findByUser(userId), this.userRoleRepository.findByUser(userId)]);
    const storeIds = userStores.map((item) => item.store_id);
    const roleIds = userRoles.map((item) => item.role_id);

    const [stores, roles] = await Promise.all([
      storeIds.length > 0 ? this.storeRepository.findByIds(storeIds) : Promise.resolve([]),
      roleIds.length > 0 ? this.roleRepository.findByIds(roleIds) : Promise.resolve([]),
    ]);

    return { user_id: userId, email: user.email, stores, roles };
  }
}
