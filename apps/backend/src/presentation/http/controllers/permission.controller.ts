import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { CreatePermissionRequestDto, CreatePermissionResponseDto } from "../../../application/dto/permission/create-permission.dto.ts";
import type { DestroyPermissionRequestDto } from "../../../application/dto/permission/destroy-permission.dto.ts";
import type { GetPermissionByIdResponseDto } from "../../../application/dto/permission/get-permission-by-id.dto.ts";
import type { GetPermissionRequestDto, GetPermissionResponseDto } from "../../../application/dto/permission/get-permission.dto.ts";
import type { UpdatePermissionRequestDto, UpdatePermissionResponseDto } from "../../../application/dto/permission/update-permission.dto.ts";
import { BadRequestError } from "../../../application/errors/permission/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class PermissionController extends Controller {
  private readonly getPermissionUseCase: IUseCase<GetPermissionRequestDto, GetPermissionResponseDto>;
  private readonly getPermissionByIdUseCase: IUseCase<number, GetPermissionByIdResponseDto>;
  private readonly createPermissionUseCase: IUseCase<CreatePermissionRequestDto, CreatePermissionResponseDto>;
  private readonly updatePermissionUseCase: IUseCase<UpdatePermissionRequestDto, UpdatePermissionResponseDto>;
  private readonly destroyPermissionUseCase: IUseCase<number, DestroyPermissionRequestDto>;

  constructor(
    @inject(InjectionToken.PERMISSION_GET_USECASE) getPermissionUseCase: IUseCase<GetPermissionRequestDto, GetPermissionResponseDto>,
    @inject(InjectionToken.PERMISSION_GET_BY_ID_USECASE) getPermissionByIdUseCase: IUseCase<number, GetPermissionByIdResponseDto>,
    @inject(InjectionToken.PERMISSION_CREATE_USECASE) createPermissionUseCase: IUseCase<CreatePermissionRequestDto, CreatePermissionResponseDto>,
    @inject(InjectionToken.PERMISSION_UPDATE_USECASE) updatePermissionUseCase: IUseCase<UpdatePermissionRequestDto, UpdatePermissionResponseDto>,
    @inject(InjectionToken.PERMISSION_DESTROY_USECASE) destroyPermissionUseCase: IUseCase<number, DestroyPermissionRequestDto>,
  ) {
    super();
    this.getPermissionUseCase = getPermissionUseCase;
    this.getPermissionByIdUseCase = getPermissionByIdUseCase;
    this.createPermissionUseCase = createPermissionUseCase;
    this.updatePermissionUseCase = updatePermissionUseCase;
    this.destroyPermissionUseCase = destroyPermissionUseCase;
  }

  async getPermission(req: Request, res: Response): Promise<void> {
    const result: GetPermissionResponseDto = await this.getPermissionUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getPermissionById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const permissionId = Number(id);
    if (!Number.isSafeInteger(permissionId) || permissionId <= 0) throw new BadRequestError();
    const result: GetPermissionByIdResponseDto = await this.getPermissionByIdUseCase.execute(permissionId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createPermission(req: Request, res: Response): Promise<void> {
    const dto: CreatePermissionRequestDto = { code: req.body.code, name: req.body.name };
    const result: CreatePermissionResponseDto = await this.createPermissionUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updatePermission(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const permissionId = Number(id);
    if (!Number.isSafeInteger(permissionId) || permissionId <= 0) throw new BadRequestError();
    const dto: UpdatePermissionRequestDto = { id: permissionId, code: req.body.code, name: req.body.name };
    const result: UpdatePermissionResponseDto = await this.updatePermissionUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyPermission(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const permissionId = Number(id);
    if (!Number.isSafeInteger(permissionId) || permissionId <= 0) throw new BadRequestError();
    const result: DestroyPermissionRequestDto = await this.destroyPermissionUseCase.execute(permissionId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
