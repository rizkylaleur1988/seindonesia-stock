import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetStoreProductRequestDto, GetStoreProductResponseDto } from "../../dto/store-product/get-store-product.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetStoreProductUseCase implements IUseCase<GetStoreProductRequestDto, GetStoreProductResponseDto> {
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

  async execute(input: GetStoreProductRequestDto): Promise<GetStoreProductResponseDto> {
    const results = await this.storeProductRepository.datagrid(input);
    const storeIds = results.rows.map((item) => item.store_id);
    const productIds = results.rows.map((item) => item.product_id);
    const [stores, products] = await Promise.all([
      storeIds.length > 0 ? this.storeRepository.findByIds(storeIds) : Promise.resolve([]),
      productIds.length > 0 ? this.productRepository.findByIds(productIds) : Promise.resolve([]),
    ]);
    const storeMap = new Map(stores.map((item) => [item.id, item]));
    const productMap = new Map(products.map((item) => [item.id, item]));
    results.rows = results.rows.map((item) => ({
      ...item,
      store: storeMap.get(item.store_id) ?? null,
      product: productMap.get(item.product_id) ?? null,
    }));
    return results;
  }
}
