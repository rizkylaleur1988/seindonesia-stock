import { inject, injectable } from "tsyringe";
import type { Product } from "../../../domain/entities/product.entity.ts";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateProductRequestDto, UpdateProductResponseDto } from "../../dto/product/update-product.dto.ts";
import { CodeExistsError } from "../../errors/product/code-exists.error.ts";
import { NotFoundError } from "../../errors/product/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateProductUseCase implements IUseCase<UpdateProductRequestDto, UpdateProductResponseDto> {
  private readonly productRepository: IProductRepository;

  constructor(@inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(input: UpdateProductRequestDto): Promise<UpdateProductResponseDto> {
    const { id, code, name } = input;
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError();

    const codeExists = await this.productRepository.findByCodeUnlessId(id, code);
    if (codeExists) throw new CodeExistsError();

    const payload: Pick<Product, "id" | "code" | "name"> = { id, code, name };
    const updated = await this.productRepository.update(payload);
    const { created_at, updated_at } = updated;

    return { id, code, name, created_at, updated_at };
  }
}
