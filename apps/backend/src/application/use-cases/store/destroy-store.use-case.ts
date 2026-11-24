import { inject, injectable } from "tsyringe";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyStoreRequestDto } from "../../dto/store/destroy-store.dto.ts";
import { NotFoundError } from "../../errors/store/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyStoreUseCase implements IUseCase<number, DestroyStoreRequestDto> {
  private readonly storeRepository: IStoreRepository;

  constructor(@inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  async execute(storeId: number): Promise<DestroyStoreRequestDto> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) throw new NotFoundError();

    await this.storeRepository.destroy(storeId);

    return {};
  }
}
