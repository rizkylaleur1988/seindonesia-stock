import { inject, injectable } from "tsyringe";
import type { Store } from "../../../domain/entities/store.entity.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateStoreRequestDto, UpdateStoreResponseDto } from "../../dto/store/update-store.dto.ts";
import { CodeExistsError } from "../../errors/store/code-exists.error.ts";
import { NotFoundError } from "../../errors/store/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateStoreUseCase implements IUseCase<UpdateStoreRequestDto, UpdateStoreResponseDto> {
  private readonly storeRepository: IStoreRepository;

  constructor(@inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository) {
    this.storeRepository = storeRepository;
  }

  async execute(input: UpdateStoreRequestDto): Promise<UpdateStoreResponseDto> {
    const { id, code, name, address } = input;
    const store = await this.storeRepository.findById(id);
    if (!store) throw new NotFoundError();

    const codeExists = await this.storeRepository.findByCodeUnlessId(id, code);
    if (codeExists) throw new CodeExistsError();

    const payload: Pick<Store, "id" | "code" | "name" | "address"> = { id, code, name, address };
    const updated = await this.storeRepository.update(payload);
    const { created_at, updated_at } = updated;

    return { id, code, name, address, created_at, updated_at };
  }
}
