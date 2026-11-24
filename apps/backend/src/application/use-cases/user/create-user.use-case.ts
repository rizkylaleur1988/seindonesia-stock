import { inject, injectable } from "tsyringe";
import type { User } from "../../../domain/entities/user.entity.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreateUserRequestDto, CreateUserResponseDto } from "../../dto/user/create-user.dto.ts";
import { BadRequestError } from "../../errors/user/bad-request.error.ts";
import { CodeExistsError } from "../../errors/user/code-exists.error.ts";
import type { IPasswordHasherService } from "../../interfaces/security/password-hasher.interface.ts";
import type { IUnitOfWork } from "../../interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateUserUseCase implements IUseCase<CreateUserRequestDto, CreateUserResponseDto> {
  private readonly userRepository: IUserRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly unitOfWork: IUnitOfWork;
  private readonly passwordHasherService: IPasswordHasherService;

  constructor(
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
    @inject(InjectionToken.PASSWORD_HASHER_SERVICE) passwordHasherService: IPasswordHasherService,
    @inject(InjectionToken.UNIT_OF_WORK) unitOfWork: IUnitOfWork,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.storeRepository = storeRepository;
    this.passwordHasherService = passwordHasherService;
    this.unitOfWork = unitOfWork;
  }

  async execute(input: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const { name, email, roles, stores } = input;
    const exists = await this.userRepository.findByEmail(email);
    if (exists) throw new CodeExistsError();

    const rolesExists = await this.roleRepository.findByIds(roles);
    if (roles.length !== rolesExists.length) throw new BadRequestError();

    const storesExists = await this.storeRepository.findByIds(stores);
    if (stores.length !== storesExists.length) throw new BadRequestError();

    const results = await this.unitOfWork.execute(async (repositories) => {
      const password = await this.passwordHasherService.hash("P@ssw0rd");
      const payload: Pick<User, "name" | "email" | "password"> = { name, email, password };
      const user = await repositories.users.create(payload);
      await repositories.userRoles.createMany(user.id, roles);
      await repositories.userStores.createMany(user.id, stores);
      return user;
    });

    const { id, created_at, updated_at } = results;

    return { id, name, email, created_at, updated_at };
  }
}
