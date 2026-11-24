import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type {
  CreateRolePermissionRequestDto,
  CreateRolePermissionResponseDto,
} from "../../../application/dto/role-permission/create-role-permission.dto.ts";
import type {
  DestroyRolePermissionRequestDto,
  DestroyRolePermissionResponseDto,
} from "../../../application/dto/role-permission/destroy-role-permission.dto.ts";
import type {
  GetRolePermissionByIdRequestDto,
  GetRolePermissionByIdResponseDto,
} from "../../../application/dto/role-permission/get-role-permission-by-id.dto.ts";
import type { GetRolePermissionRequestDto, GetRolePermissionResponseDto } from "../../../application/dto/role-permission/get-role-permission.dto.ts";
import type {
  UpdateRolePermissionRequestDto,
  UpdateRolePermissionResponseDto,
} from "../../../application/dto/role-permission/update-role-permission.dto.ts";
import { BadRequestError } from "../../../application/errors/product/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class RolePermissionController extends Controller {
  private readonly getRolePermissionUseCase: IUseCase<GetRolePermissionRequestDto, GetRolePermissionResponseDto>;
  private readonly getRolePermissionByIdUseCase: IUseCase<GetRolePermissionByIdRequestDto, GetRolePermissionByIdResponseDto>;
  private readonly createRolePermissionUseCase: IUseCase<CreateRolePermissionRequestDto, CreateRolePermissionResponseDto>;
  private readonly updateRolePermissionUseCase: IUseCase<UpdateRolePermissionRequestDto, UpdateRolePermissionResponseDto>;
  private readonly destroyRolePermissionUseCase: IUseCase<DestroyRolePermissionRequestDto, DestroyRolePermissionResponseDto>;

  constructor(
    @inject(InjectionToken.ROLE_PERMISSION_GET_USECASE) getRolePermissionUseCase: IUseCase<GetRolePermissionRequestDto, GetRolePermissionResponseDto>,
    @inject(InjectionToken.ROLE_PERMISSION_GET_BY_ID_USECASE)
    getRolePermissionByIdUseCase: IUseCase<GetRolePermissionByIdRequestDto, GetRolePermissionByIdResponseDto>,
    @inject(InjectionToken.ROLE_PERMISSION_CREATE_USECASE)
    createRolePermissionUseCase: IUseCase<CreateRolePermissionRequestDto, CreateRolePermissionResponseDto>,
    @inject(InjectionToken.ROLE_PERMISSION_UPDATE_USECASE)
    updateRolePermissionUseCase: IUseCase<UpdateRolePermissionRequestDto, UpdateRolePermissionResponseDto>,
    @inject(InjectionToken.ROLE_PERMISSION_DESTROY_USECASE)
    destroyRolePermissionUseCase: IUseCase<DestroyRolePermissionRequestDto, DestroyRolePermissionResponseDto>,
  ) {
    super();
    this.getRolePermissionUseCase = getRolePermissionUseCase;
    this.getRolePermissionByIdUseCase = getRolePermissionByIdUseCase;
    this.createRolePermissionUseCase = createRolePermissionUseCase;
    this.updateRolePermissionUseCase = updateRolePermissionUseCase;
    this.destroyRolePermissionUseCase = destroyRolePermissionUseCase;
  }

  async getRolePermission(req: Request, res: Response): Promise<void> {
    const result: GetRolePermissionResponseDto = await this.getRolePermissionUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getRolePermissionById(req: Request, res: Response): Promise<void> {
    const { role_id, permission_id } = req.params;
    const roleId = Number(role_id);
    const permissionId = Number(permission_id);
    if (!Number.isSafeInteger(roleId) || roleId <= 0) throw new BadRequestError();
    if (!Number.isSafeInteger(permissionId) || permissionId <= 0) throw new BadRequestError();
    const dto: GetRolePermissionByIdRequestDto = { role_id: req.body.role_id, permission_id: req.body.permission_id };
    const result: GetRolePermissionByIdResponseDto = await this.getRolePermissionByIdUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createRolePermission(req: Request, res: Response): Promise<void> {
    const dto: CreateRolePermissionRequestDto = { role_id: req.body.role_id, permission_id: req.body.permission_id };
    const result: CreateRolePermissionResponseDto = await this.createRolePermissionUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateRolePermission(req: Request, res: Response): Promise<void> {
    const { role_id, permission_id } = req.params;
    const roleId = Number(role_id);
    const permissionId = Number(permission_id);
    if (!Number.isSafeInteger(roleId) || roleId <= 0) throw new BadRequestError();
    if (!Number.isSafeInteger(permissionId) || permissionId <= 0) throw new BadRequestError();
    const dto: UpdateRolePermissionRequestDto = { role_id: req.body.role_id, permission_id: req.body.permission_id };
    const result: UpdateRolePermissionResponseDto = await this.updateRolePermissionUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyRolePermission(req: Request, res: Response): Promise<void> {
    const { role_id, permission_id } = req.params;
    const roleId = Number(role_id);
    const permissionId = Number(permission_id);
    if (!Number.isSafeInteger(roleId) || roleId <= 0) throw new BadRequestError();
    if (!Number.isSafeInteger(permissionId) || permissionId <= 0) throw new BadRequestError();
    const dto: DestroyRolePermissionRequestDto = { role_id: Number(role_id), permission_id: Number(permission_id) };
    const result: DestroyRolePermissionResponseDto = await this.destroyRolePermissionUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
