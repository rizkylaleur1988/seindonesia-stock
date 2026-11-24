import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetUserByIdResponseDto } from "../../dto/user/get-user-by-id.dto.ts";
import { NotFoundError } from "../../errors/user/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetUserByIdUseCase implements IUseCase<number, GetUserByIdResponseDto> {
  private readonly userRepository: IUserRepository;

  constructor(@inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId: number): Promise<GetUserByIdResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError();

    const { id, name, email, created_at, updated_at } = user;
    return { id, name, email, created_at, updated_at };
  }
}
