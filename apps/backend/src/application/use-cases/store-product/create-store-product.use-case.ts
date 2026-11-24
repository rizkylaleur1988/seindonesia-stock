import { inject, injectable } from "tsyringe";
import type { StoreProduct } from "../../../domain/entities/store-product.entity.ts";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreateStoreProductRequestDto, CreateStoreProductResponseDto } from "../../dto/store-product/create-store-product.dto.ts";
import { CodeExistsError } from "../../errors/store-product/code-exists.error.ts";
import { NotFoundError } from "../../errors/store-product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateStoreProductUseCase implements IUseCase<CreateStoreProductRequestDto, CreateStoreProductResponseDto> {
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

  async execute(input: CreateStoreProductRequestDto): Promise<CreateStoreProductResponseDto> {
    const { store_id, product_id, stock } = input;
    const exists = await this.storeProductRepository.findByStoreProduct(store_id, product_id);
    if (exists) throw new CodeExistsError();

    const store = await this.storeRepository.findById(store_id);
    if (!store) throw new NotFoundError("Store");

    const product = await this.productRepository.findById(product_id);
    if (!product) throw new NotFoundError("Product");

    const payload: Pick<StoreProduct, "store_id" | "product_id" | "stock" | "previous_stock"> = {
      store_id,
      product_id,
      stock: stock ?? 0,
      previous_stock: 0,
    };
    const stored = await this.storeProductRepository.create(payload);
    const { id, created_at, updated_at, stock: newStock } = stored;

    return { id, store_id, product_id, stock: newStock, created_at, updated_at };
  }
}
