import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { CreateProductRequestDto, CreateProductResponseDto } from "../../../application/dto/product/create-product.dto.ts";
import type { DestroyProductRequestDto } from "../../../application/dto/product/destroy-product.dto.ts";
import type { GetProductByIdResponseDto } from "../../../application/dto/product/get-product-by-id.dto.ts";
import type { GetProductRequestDto, GetProductResponseDto } from "../../../application/dto/product/get-product.dto.ts";
import type { UpdateProductRequestDto, UpdateProductResponseDto } from "../../../application/dto/product/update-product.dto.ts";
import { BadRequestError } from "../../../application/errors/product/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class ProductController extends Controller {
  private readonly getProductUseCase: IUseCase<GetProductRequestDto, GetProductResponseDto>;
  private readonly getProductByIdUseCase: IUseCase<number, GetProductByIdResponseDto>;
  private readonly createProductUseCase: IUseCase<CreateProductRequestDto, CreateProductResponseDto>;
  private readonly updateProductUseCase: IUseCase<UpdateProductRequestDto, UpdateProductResponseDto>;
  private readonly destroyProductUseCase: IUseCase<number, DestroyProductRequestDto>;

  constructor(
    @inject(InjectionToken.PRODUCT_GET_USECASE) getProductUseCase: IUseCase<GetProductRequestDto, GetProductResponseDto>,
    @inject(InjectionToken.PRODUCT_GET_BY_ID_USECASE) getProductByIdUseCase: IUseCase<number, GetProductByIdResponseDto>,
    @inject(InjectionToken.PRODUCT_CREATE_USECASE) createProductUseCase: IUseCase<CreateProductRequestDto, CreateProductResponseDto>,
    @inject(InjectionToken.PRODUCT_UPDATE_USECASE) updateProductUseCase: IUseCase<UpdateProductRequestDto, UpdateProductResponseDto>,
    @inject(InjectionToken.PRODUCT_DESTROY_USECASE) destroyProductUseCase: IUseCase<number, DestroyProductRequestDto>,
  ) {
    super();
    this.getProductUseCase = getProductUseCase;
    this.getProductByIdUseCase = getProductByIdUseCase;
    this.createProductUseCase = createProductUseCase;
    this.updateProductUseCase = updateProductUseCase;
    this.destroyProductUseCase = destroyProductUseCase;
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    const result: GetProductResponseDto = await this.getProductUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId <= 0) throw new BadRequestError();
    const result: GetProductByIdResponseDto = await this.getProductByIdUseCase.execute(productId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const dto: CreateProductRequestDto = { code: req.body.code, name: req.body.name };
    const result: CreateProductResponseDto = await this.createProductUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId <= 0) throw new BadRequestError();
    const dto: UpdateProductRequestDto = { id: productId, code: req.body.code, name: req.body.name };
    const result: UpdateProductResponseDto = await this.updateProductUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId <= 0) throw new BadRequestError();
    const result: DestroyProductRequestDto = await this.destroyProductUseCase.execute(productId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
