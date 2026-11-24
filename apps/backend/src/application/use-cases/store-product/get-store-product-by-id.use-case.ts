import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetStoreProductByIdResponseDto } from "../../dto/store-product/get-store-product-by-id.dto.ts";
import { NotFoundError } from "../../errors/store-product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetStoreProductByIdUseCase implements IUseCase<number, GetStoreProductByIdResponseDto> {
  private readonly storeProductRepository: IStoreProductRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly productRepository: IProductRepository;

  constructor(
    @inject(InjectionToken.STORE_PRODUCT_REPOSITORY) storeProductRepository: IStoreProductRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
    @inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository,
  ) {
    this.storeProductRepository = storeProductRepository;
    this.storeRepository = storeRepository;
    this.productRepository = productRepository;
  }

  async execute(storeProductId: number): Promise<GetStoreProductByIdResponseDto> {
    const storeProduct = await this.storeProductRepository.findById(storeProductId);
    if (!storeProduct) throw new NotFoundError();

    const { id, store_id, product_id, previous_stock, stock, created_at, updated_at } = storeProduct;
    const [store, product] = await Promise.all([this.storeRepository.findById(store_id), this.productRepository.findById(product_id)]);

    return { id, store_id, product_id, previous_stock, stock, created_at, updated_at, store, product };
  }
}
