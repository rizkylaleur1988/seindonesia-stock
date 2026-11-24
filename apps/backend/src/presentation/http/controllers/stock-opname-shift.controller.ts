import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type {
  CreateStockOpnameShiftRequestDto,
  CreateStockOpnameShiftResponseDto,
} from "../../../application/dto/stock-opname-shift/create-stock-opname-shift.dto.ts";
import type { DestroyStockOpnameShiftRequestDto } from "../../../application/dto/stock-opname-shift/destroy-stock-opname-shift.dto.ts";
import type { GetStockOpnameShiftByIdResponseDto } from "../../../application/dto/stock-opname-shift/get-stock-opname-shift-by-id.dto.ts";
import type {
  GetStockOpnameShiftRequestDto,
  GetStockOpnameShiftResponseDto,
} from "../../../application/dto/stock-opname-shift/get-stock-opname-shift.dto.ts";
import type {
  UpdateStockOpnameShiftRequestDto,
  UpdateStockOpnameShiftResponseDto,
} from "../../../application/dto/stock-opname-shift/update-stock-opname-shift.dto.ts";
import { BadRequestError } from "../../../application/errors/stock-opname-shift/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StockOpnameShiftController extends Controller {
  private readonly getStockOpnameShiftUseCase: IUseCase<GetStockOpnameShiftRequestDto, GetStockOpnameShiftResponseDto>;
  private readonly getStockOpnameShiftByIdUseCase: IUseCase<number, GetStockOpnameShiftByIdResponseDto>;
  private readonly createStockOpnameShiftUseCase: IUseCase<CreateStockOpnameShiftRequestDto, CreateStockOpnameShiftResponseDto>;
  private readonly updateStockOpnameShiftUseCase: IUseCase<UpdateStockOpnameShiftRequestDto, UpdateStockOpnameShiftResponseDto>;
  private readonly destroyStockOpnameShiftUseCase: IUseCase<number, DestroyStockOpnameShiftRequestDto>;

  constructor(
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_GET_USECASE)
    getStockOpnameShiftUseCase: IUseCase<GetStockOpnameShiftRequestDto, GetStockOpnameShiftResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_GET_BY_ID_USECASE) getStockOpnameShiftByIdUseCase: IUseCase<number, GetStockOpnameShiftByIdResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_CREATE_USECASE)
    createStockOpnameShiftUseCase: IUseCase<CreateStockOpnameShiftRequestDto, CreateStockOpnameShiftResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_UPDATE_USECASE)
    updateStockOpnameShiftUseCase: IUseCase<UpdateStockOpnameShiftRequestDto, UpdateStockOpnameShiftResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_DESTROY_USECASE) destroyStockOpnameShiftUseCase: IUseCase<number, DestroyStockOpnameShiftRequestDto>,
  ) {
    super();
    this.getStockOpnameShiftUseCase = getStockOpnameShiftUseCase;
    this.getStockOpnameShiftByIdUseCase = getStockOpnameShiftByIdUseCase;
    this.createStockOpnameShiftUseCase = createStockOpnameShiftUseCase;
    this.updateStockOpnameShiftUseCase = updateStockOpnameShiftUseCase;
    this.destroyStockOpnameShiftUseCase = destroyStockOpnameShiftUseCase;
  }

  async getStockOpnameShift(req: Request, res: Response): Promise<void> {
    const result: GetStockOpnameShiftResponseDto = await this.getStockOpnameShiftUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getStockOpnameShiftById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stockOpnameShiftId = Number(id);
    if (!Number.isSafeInteger(stockOpnameShiftId) || stockOpnameShiftId <= 0) throw new BadRequestError();
    const result: GetStockOpnameShiftByIdResponseDto = await this.getStockOpnameShiftByIdUseCase.execute(stockOpnameShiftId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createStockOpnameShift(req: Request, res: Response): Promise<void> {
    const dto: CreateStockOpnameShiftRequestDto = { code: req.body.code, name: req.body.name, ordering: req.body.ordering };
    const result: CreateStockOpnameShiftResponseDto = await this.createStockOpnameShiftUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateStockOpnameShift(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stockOpnameShiftId = Number(id);
    if (!Number.isSafeInteger(stockOpnameShiftId) || stockOpnameShiftId <= 0) throw new BadRequestError();
    const dto: UpdateStockOpnameShiftRequestDto = { id: stockOpnameShiftId, code: req.body.code, name: req.body.name, ordering: req.body.ordering };
    const result: UpdateStockOpnameShiftResponseDto = await this.updateStockOpnameShiftUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyStockOpnameShift(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stockOpnameShiftId = Number(id);
    if (!Number.isSafeInteger(stockOpnameShiftId) || stockOpnameShiftId <= 0) throw new BadRequestError();
    const result: DestroyStockOpnameShiftRequestDto = await this.destroyStockOpnameShiftUseCase.execute(stockOpnameShiftId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
