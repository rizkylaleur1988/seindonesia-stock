import { inject, injectable } from "tsyringe";
import type { IUserSessionRepository } from "../../../domain/repositories/user-session.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { LogoutResponseDto } from "../../dto/auth/logout.dto.ts";
import { UserNotFoundError } from "../../errors/auth/user-not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class LogoutUseCase implements IUseCase<number, LogoutResponseDto> {
  private readonly userRepository: IUserRepository;
  private readonly userSessionRepository: IUserSessionRepository;

  constructor(
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.USER_SESSION_REPOSITORY) userSessionRepository: IUserSessionRepository,
  ) {
    this.userRepository = userRepository;
    this.userSessionRepository = userSessionRepository;
  }

  async execute(userId: number): Promise<LogoutResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UserNotFoundError();

    await this.userSessionRepository.destroyUserToken(user.id);
    return {};
  }
}
