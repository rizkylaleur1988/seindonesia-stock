import { inject, injectable } from "tsyringe";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyStoreProductRequestDto } from "../../dto/store-product/destroy-store-product.dto.ts";
import { NotFoundError } from "../../errors/store-product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyStoreProductUseCase implements IUseCase<number, DestroyStoreProductRequestDto> {
  private readonly storeProductRepository: IStoreProductRepository;

  constructor(@inject(InjectionToken.STORE_PRODUCT_REPOSITORY) storeProductRepository: IStoreProductRepository) {
    this.storeProductRepository = storeProductRepository;
  }

  async execute(storeProductId: number): Promise<DestroyStoreProductRequestDto> {
    const store = await this.storeProductRepository.findById(storeProductId);
    if (!store) throw new NotFoundError();

    await this.storeProductRepository.destroy(storeProductId);

    return {};
  }
}
