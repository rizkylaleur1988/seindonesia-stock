import { inject, injectable } from "tsyringe";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetStoreRequestDto, GetStoreResponseDto } from "../../dto/store/get-store.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetStoreUseCase implements IUseCase<GetStoreRequestDto, GetStoreResponseDto> {
  private readonly storeRepository: IStoreRepository;

  constructor(@inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  async execute(input: GetStoreRequestDto): Promise<GetStoreResponseDto> {
    return await this.storeRepository.datagrid(input);
  }
}
