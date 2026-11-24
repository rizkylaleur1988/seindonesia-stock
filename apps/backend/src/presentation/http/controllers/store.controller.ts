import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { CreateStoreRequestDto, CreateStoreResponseDto } from "../../../application/dto/store/create-store.dto.ts";
import type { DestroyStoreRequestDto } from "../../../application/dto/store/destroy-store.dto.ts";
import type { GetStoreByIdResponseDto } from "../../../application/dto/store/get-store-by-id.dto.ts";
import type { GetStoreRequestDto, GetStoreResponseDto } from "../../../application/dto/store/get-store.dto.ts";
import type { UpdateStoreRequestDto, UpdateStoreResponseDto } from "../../../application/dto/store/update-store.dto.ts";
import { BadRequestError } from "../../../application/errors/store/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StoreController extends Controller {
  private readonly getStoreUseCase: IUseCase<GetStoreRequestDto, GetStoreResponseDto>;
  private readonly getStoreByIdUseCase: IUseCase<number, GetStoreByIdResponseDto>;
  private readonly createStoreUseCase: IUseCase<CreateStoreRequestDto, CreateStoreResponseDto>;
  private readonly updateStoreUseCase: IUseCase<UpdateStoreRequestDto, UpdateStoreResponseDto>;
  private readonly destroyStoreUseCase: IUseCase<number, DestroyStoreRequestDto>;

  constructor(
    @inject(InjectionToken.STORE_GET_USECASE) getStoreUseCase: IUseCase<GetStoreRequestDto, GetStoreResponseDto>,
    @inject(InjectionToken.STORE_GET_BY_ID_USECASE) getStoreByIdUseCase: IUseCase<number, GetStoreByIdResponseDto>,
    @inject(InjectionToken.STORE_CREATE_USECASE) createStoreUseCase: IUseCase<CreateStoreRequestDto, CreateStoreResponseDto>,
    @inject(InjectionToken.STORE_UPDATE_USECASE) updateStoreUseCase: IUseCase<UpdateStoreRequestDto, UpdateStoreResponseDto>,
    @inject(InjectionToken.STORE_DESTROY_USECASE) destroyStoreUseCase: IUseCase<number, DestroyStoreRequestDto>,
  ) {
    super();
    this.getStoreUseCase = getStoreUseCase;
    this.getStoreByIdUseCase = getStoreByIdUseCase;
    this.createStoreUseCase = createStoreUseCase;
    this.updateStoreUseCase = updateStoreUseCase;
    this.destroyStoreUseCase = destroyStoreUseCase;
  }

  async getStore(req: Request, res: Response): Promise<void> {
    const result: GetStoreResponseDto = await this.getStoreUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getStoreById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const storeId = Number(id);
    if (!Number.isSafeInteger(storeId) || storeId <= 0) throw new BadRequestError();
    const result: GetStoreByIdResponseDto = await this.getStoreByIdUseCase.execute(storeId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createStore(req: Request, res: Response): Promise<void> {
    const dto: CreateStoreRequestDto = { code: req.body.code, name: req.body.name, address: req.body.address };
    const result: CreateStoreResponseDto = await this.createStoreUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateStore(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const storeId = Number(id);
    if (!Number.isSafeInteger(storeId) || storeId <= 0) throw new BadRequestError();
    const dto: UpdateStoreRequestDto = { id: storeId, code: req.body.code, name: req.body.name, address: req.body.address };
    const result: UpdateStoreResponseDto = await this.updateStoreUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyStore(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const storeId = Number(id);
    if (!Number.isSafeInteger(storeId) || storeId <= 0) throw new BadRequestError();
    const result: DestroyStoreRequestDto = await this.destroyStoreUseCase.execute(storeId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
