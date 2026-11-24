import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { CreateStoreProductRequestDto, CreateStoreProductResponseDto } from "../../../application/dto/store-product/create-store-product.dto.ts";
import type { DestroyStoreProductRequestDto } from "../../../application/dto/store-product/destroy-store-product.dto.ts";
import type { GetStoreProductByIdResponseDto } from "../../../application/dto/store-product/get-store-product-by-id.dto.ts";
import type { GetStoreProductRequestDto, GetStoreProductResponseDto } from "../../../application/dto/store-product/get-store-product.dto.ts";
import type { UpdateStoreProductRequestDto, UpdateStoreProductResponseDto } from "../../../application/dto/store-product/update-store-product.dto.ts";
import { BadRequestError } from "../../../application/errors/store-product/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StoreProductController extends Controller {
  private readonly getStoreProductUseCase: IUseCase<GetStoreProductRequestDto, GetStoreProductResponseDto>;
  private readonly getStoreProductByIdUseCase: IUseCase<number, GetStoreProductByIdResponseDto>;
  private readonly createStoreProductUseCase: IUseCase<CreateStoreProductRequestDto, CreateStoreProductResponseDto>;
  private readonly updateStoreProductUseCase: IUseCase<UpdateStoreProductRequestDto, UpdateStoreProductResponseDto>;
  private readonly destroyStoreProductUseCase: IUseCase<number, DestroyStoreProductRequestDto>;

  constructor(
    @inject(InjectionToken.STORE_PRODUCT_GET_USECASE) getStoreProductUseCase: IUseCase<GetStoreProductRequestDto, GetStoreProductResponseDto>,
    @inject(InjectionToken.STORE_PRODUCT_GET_BY_ID_USECASE) getStoreProductByIdUseCase: IUseCase<number, GetStoreProductByIdResponseDto>,
    @inject(InjectionToken.STORE_PRODUCT_CREATE_USECASE)
    createStoreProductUseCase: IUseCase<CreateStoreProductRequestDto, CreateStoreProductResponseDto>,
    @inject(InjectionToken.STORE_PRODUCT_UPDATE_USECASE)
    updateStoreProductUseCase: IUseCase<UpdateStoreProductRequestDto, UpdateStoreProductResponseDto>,
    @inject(InjectionToken.STORE_PRODUCT_DESTROY_USECASE) destroyStoreProductUseCase: IUseCase<number, DestroyStoreProductRequestDto>,
  ) {
    super();
    this.getStoreProductUseCase = getStoreProductUseCase;
    this.getStoreProductByIdUseCase = getStoreProductByIdUseCase;
    this.createStoreProductUseCase = createStoreProductUseCase;
    this.updateStoreProductUseCase = updateStoreProductUseCase;
    this.destroyStoreProductUseCase = destroyStoreProductUseCase;
  }

  async getStoreProduct(req: Request, res: Response): Promise<void> {
    const result: GetStoreProductResponseDto = await this.getStoreProductUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getStoreProductById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const storeProductId = Number(id);
    if (!Number.isSafeInteger(storeProductId) || storeProductId <= 0) throw new BadRequestError();
    const result: GetStoreProductByIdResponseDto = await this.getStoreProductByIdUseCase.execute(storeProductId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createStoreProduct(req: Request, res: Response): Promise<void> {
    const dto: CreateStoreProductRequestDto = { store_id: req.body.store_id, product_id: req.body.product_id, stock: req.body.stock };
    const result: CreateStoreProductResponseDto = await this.createStoreProductUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateStoreProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const storeProductId = Number(id);
    if (!Number.isSafeInteger(storeProductId) || storeProductId <= 0) throw new BadRequestError();
    const dto: UpdateStoreProductRequestDto = {
      id: storeProductId,
      store_id: req.body.store_id,
      product_id: req.body.product_id,
      stock: req.body.stock,
    };
    const result: UpdateStoreProductResponseDto = await this.updateStoreProductUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyStoreProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const storeProductId = Number(id);
    if (!Number.isSafeInteger(storeProductId) || storeProductId <= 0) throw new BadRequestError();
    const result: DestroyStoreProductRequestDto = await this.destroyStoreProductUseCase.execute(storeProductId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
