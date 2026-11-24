import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyUserRequestDto } from "../../dto/user/destroy-user.dto.ts";
import { NotFoundError } from "../../errors/user/not-found.error.ts";
import type { IUnitOfWork } from "../../interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyUserUseCase implements IUseCase<number, DestroyUserRequestDto> {
  private readonly userRepository: IUserRepository;
  private readonly unitOfWork: IUnitOfWork;

  constructor(@inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository, @inject(InjectionToken.UNIT_OF_WORK) unitOfWork: IUnitOfWork) {
    this.userRepository = userRepository;
    this.unitOfWork = unitOfWork;
  }

  async execute(userId: number): Promise<DestroyUserRequestDto> {
    const store = await this.userRepository.findById(userId);
    if (!store) throw new NotFoundError();

    await this.unitOfWork.execute(async (repositories) => {
      await repositories.userRoles.destroyByUser(userId);
      await repositories.userStores.destroyByUser(userId);
      await repositories.users.destroy(userId);
    });

    return {};
  }
}
