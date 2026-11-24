import { inject, injectable } from "tsyringe";
import type { Product } from "../../../domain/entities/product.entity.ts";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreateProductRequestDto, CreateProductResponseDto } from "../../dto/product/create-product.dto.ts";
import { CodeExistsError } from "../../errors/product/code-exists.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateProductUseCase implements IUseCase<CreateProductRequestDto, CreateProductResponseDto> {
  private readonly productRepository: IProductRepository;

  constructor(@inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(input: CreateProductRequestDto): Promise<CreateProductResponseDto> {
    const { code, name } = input;
    const exists = await this.productRepository.findByCode(code);
    if (exists) throw new CodeExistsError();

    const payload: Pick<Product, "code" | "name"> = { code, name };
    const product = await this.productRepository.create(payload);
    const { id, created_at, updated_at } = product;

    return { id, code, name, created_at, updated_at };
  }
}
