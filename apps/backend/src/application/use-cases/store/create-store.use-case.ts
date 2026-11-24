import { inject, injectable } from "tsyringe";
import type { Store } from "../../../domain/entities/store.entity.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreateStoreRequestDto, CreateStoreResponseDto } from "../../dto/store/create-store.dto.ts";
import { CodeExistsError } from "../../errors/store/code-exists.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateStoreUseCase implements IUseCase<CreateStoreRequestDto, CreateStoreResponseDto> {
  private readonly storeRepository: IStoreRepository;

  constructor(@inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  async execute(input: CreateStoreRequestDto): Promise<CreateStoreResponseDto> {
    const { code, name, address } = input;
    const exists = await this.storeRepository.findByCode(code);
    if (exists) throw new CodeExistsError();

    const payload: Pick<Store, "code" | "name" | "address"> = { code, name, address };
    const store = await this.storeRepository.create(payload);
    const { id, created_at, updated_at } = store;

    return { id, code, name, address, created_at, updated_at };
  }
}
