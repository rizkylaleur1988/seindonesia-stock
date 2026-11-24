import { inject, injectable } from "tsyringe";
import type { User } from "../../../domain/entities/user.entity.ts";
import type { IRoleRepository } from "../../../domain/repositories/role.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateUserRequestDto, UpdateUserResponseDto } from "../../dto/user/update-user.dto.ts";
import { BadRequestError } from "../../errors/user/bad-request.error.ts";
import { NotFoundError } from "../../errors/user/not-found.error.ts";
import type { IUnitOfWork } from "../../interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateUserUseCase implements IUseCase<UpdateUserRequestDto, UpdateUserResponseDto> {
  private readonly userRepository: IUserRepository;
  private readonly roleRepository: IRoleRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly unitOfWork: IUnitOfWork;

  constructor(
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.ROLE_REPOSITORY) roleRepository: IRoleRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
    @inject(InjectionToken.UNIT_OF_WORK) unitOfWork: IUnitOfWork,
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.storeRepository = storeRepository;
    this.unitOfWork = unitOfWork;
  }

  async execute(input: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    const { id, name, email, roles, stores } = input;
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError();

    const rolesExists = await this.roleRepository.findByIds(roles);
    if (roles.length !== rolesExists.length) throw new BadRequestError();

    const storesExists = await this.storeRepository.findByIds(stores);
    if (stores.length !== storesExists.length) throw new BadRequestError();

    const results = await this.unitOfWork.execute(async (repositories) => {
      const payload: Pick<User, "id" | "name" | "email"> = { id, name, email };
      const user = await repositories.users.update(payload);
      await repositories.userRoles.destroyByUser(id);
      await repositories.userRoles.createMany(id, roles);
      await repositories.userStores.destroyByUser(id);
      await repositories.userStores.createMany(id, stores);
      return user;
    });

    const { created_at, updated_at } = results;

    return { id, name, email, created_at, updated_at };
  }
}
