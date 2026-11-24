import { inject, injectable } from "tsyringe";
import type { StoreProduct } from "../../../domain/entities/store-product.entity.ts";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateStoreProductRequestDto, UpdateStoreProductResponseDto } from "../../dto/store-product/update-store-product.dto.ts";
import { CodeExistsError } from "../../errors/store-product/code-exists.error.ts";
import { NotFoundError } from "../../errors/store-product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateStoreProductUseCase implements IUseCase<UpdateStoreProductRequestDto, UpdateStoreProductResponseDto> {
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

  async execute(input: UpdateStoreProductRequestDto): Promise<UpdateStoreProductResponseDto> {
    const { id, store_id, product_id, stock } = input;
    const storeProduct = await this.storeProductRepository.findById(id);
    if (!storeProduct) throw new NotFoundError();

    const store = await this.storeRepository.findById(store_id);
    if (!store) throw new NotFoundError("Store");

    const product = await this.productRepository.findById(product_id);
    if (!product) throw new NotFoundError("Product");

    const codeExists = await this.storeProductRepository.findByStoreProductUnlessId(id, store_id, product_id);
    if (codeExists) throw new CodeExistsError();

    const payload: Pick<StoreProduct, "id" | "store_id" | "product_id" | "stock" | "previous_stock"> = {
      id,
      store_id,
      product_id,
      stock: stock ?? 0,
      previous_stock: storeProduct.previous_stock,
    };
    const updated = await this.storeProductRepository.update(payload);
    const { stock: newStock, created_at, updated_at } = updated;

    return { id, store_id, product_id, stock: newStock, created_at, updated_at };
  }
}
