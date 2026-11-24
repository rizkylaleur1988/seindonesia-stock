import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type {
  ApprovalStockOpnameRequestDto,
  ApprovalStockOpnameResponseDto,
} from "../../../application/dto/stock-opname/approval-stock-opname.dto.ts";
import type { CreateStockOpnameRequestDto, CreateStockOpnameResponseDto } from "../../../application/dto/stock-opname/create-stock-opname.dto.ts";
import type { DestroyStockOpnameRequestDto } from "../../../application/dto/stock-opname/destroy-stock-opname.dto.ts";
import type { GetStockOpnameByIdResponseDto } from "../../../application/dto/stock-opname/get-stock-opname-by-id.dto.ts";
import type { GetStockOpnameRequestDto, GetStockOpnameResponseDto } from "../../../application/dto/stock-opname/get-stock-opname.dto.ts";
import type { UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto } from "../../../application/dto/stock-opname/update-stock-opname.dto.ts";
import { BadRequestError } from "../../../application/errors/stock-opname/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class StockOpnameController extends Controller {
  private readonly getStockOpnameUseCase: IUseCase<GetStockOpnameRequestDto, GetStockOpnameResponseDto>;
  private readonly getStockOpnameByIdUseCase: IUseCase<number, GetStockOpnameByIdResponseDto>;
  private readonly createStockOpnameUseCase: IUseCase<CreateStockOpnameRequestDto, CreateStockOpnameResponseDto>;
  private readonly updateStockOpnameUseCase: IUseCase<UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto>;
  private readonly destroyStockOpnameUseCase: IUseCase<number, DestroyStockOpnameRequestDto>;
  private readonly approvalStockOpnameUseCase: IUseCase<ApprovalStockOpnameRequestDto, ApprovalStockOpnameResponseDto>;

  constructor(
    @inject(InjectionToken.STOCK_OPNAME_GET_USECASE)
    getStockOpnameUseCase: IUseCase<GetStockOpnameRequestDto, GetStockOpnameResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_GET_BY_ID_USECASE) getStockOpnameByIdUseCase: IUseCase<number, GetStockOpnameByIdResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_CREATE_USECASE)
    createStockOpnameUseCase: IUseCase<CreateStockOpnameRequestDto, CreateStockOpnameResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_UPDATE_USECASE)
    updateStockOpnameUseCase: IUseCase<UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto>,
    @inject(InjectionToken.STOCK_OPNAME_DESTROY_USECASE) destroyStockOpnameUseCase: IUseCase<number, DestroyStockOpnameRequestDto>,
    @inject(InjectionToken.STOCK_OPNAME_APPROVAL_USECASE)
    approvalStockOpnameUseCase: IUseCase<ApprovalStockOpnameRequestDto, ApprovalStockOpnameResponseDto>,
  ) {
    super();
    this.getStockOpnameUseCase = getStockOpnameUseCase;
    this.getStockOpnameByIdUseCase = getStockOpnameByIdUseCase;
    this.createStockOpnameUseCase = createStockOpnameUseCase;
    this.updateStockOpnameUseCase = updateStockOpnameUseCase;
    this.destroyStockOpnameUseCase = destroyStockOpnameUseCase;
    this.approvalStockOpnameUseCase = approvalStockOpnameUseCase;
  }

  async getStockOpname(req: Request, res: Response): Promise<void> {
    const result: GetStockOpnameResponseDto = await this.getStockOpnameUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getStockOpnameById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stockOpnameId = Number(id);
    if (!Number.isSafeInteger(stockOpnameId) || stockOpnameId <= 0) throw new BadRequestError();
    const result: GetStockOpnameByIdResponseDto = await this.getStockOpnameByIdUseCase.execute(stockOpnameId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createStockOpname(req: Request, res: Response): Promise<void> {
    const dto: CreateStockOpnameRequestDto = {
      store_id: req.body.store_id,
      stock_opname_shift_id: req.body.stock_opname_shift_id,
      stock_opname_date: req.body.stock_opname_date,
      notes: req.body.notes,
      items: req.body.items,
    };
    const result: CreateStockOpnameResponseDto = await this.createStockOpnameUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateStockOpname(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stockOpnameId = Number(id);
    if (!Number.isSafeInteger(stockOpnameId) || stockOpnameId <= 0) throw new BadRequestError();
    const dto: UpdateStockOpnameRequestDto = {
      id: stockOpnameId,
      store_id: req.body.store_id,
      stock_opname_shift_id: req.body.stock_opname_shift_id,
      stock_opname_date: req.body.stock_opname_date,
      notes: req.body.notes,
      items: req.body.items,
    };
    const result: UpdateStockOpnameResponseDto = await this.updateStockOpnameUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyStockOpname(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const stockOpnameId = Number(id);
    if (!Number.isSafeInteger(stockOpnameId) || stockOpnameId <= 0) throw new BadRequestError();
    const result: DestroyStockOpnameRequestDto = await this.destroyStockOpnameUseCase.execute(stockOpnameId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async approvalStockOpname(req: Request, res: Response): Promise<void> {
    const dto: ApprovalStockOpnameRequestDto = { approval_code: req.body.approval_code, id: req.body.id, notes: req.body.notes };
    const result: ApprovalStockOpnameResponseDto = await this.approvalStockOpnameUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
