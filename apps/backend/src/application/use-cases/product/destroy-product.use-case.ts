import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyProductRequestDto } from "../../dto/product/destroy-product.dto.ts";
import { NotFoundError } from "../../errors/product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyProductUseCase implements IUseCase<number, DestroyProductRequestDto> {
  private readonly productRepository: IProductRepository;

  constructor(@inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number): Promise<DestroyProductRequestDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError();

    await this.productRepository.destroy(productId);

    return {};
  }
}
