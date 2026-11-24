import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetProductByIdResponseDto } from "../../dto/product/get-product-by-id.dto.ts";
import { NotFoundError } from "../../errors/product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetProductByIdUseCase implements IUseCase<number, GetProductByIdResponseDto> {
  private readonly productRepository: IProductRepository;

  constructor(@inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number): Promise<GetProductByIdResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError();

    const { id, code, name, stock, created_at, updated_at } = product;
    return { id, code, name, stock, created_at, updated_at };
  }
}
