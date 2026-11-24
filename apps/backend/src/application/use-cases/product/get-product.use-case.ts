import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetProductRequestDto, GetProductResponseDto } from "../../dto/product/get-product.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetProductUseCase implements IUseCase<GetProductRequestDto, GetProductResponseDto> {
  private readonly productRepository: IProductRepository;

  constructor(@inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(input: GetProductRequestDto): Promise<GetProductResponseDto> {
    return await this.productRepository.datagrid(input);
  }
}
