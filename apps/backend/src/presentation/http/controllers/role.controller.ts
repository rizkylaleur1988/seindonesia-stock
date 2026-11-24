import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { CreateRoleRequestDto, CreateRoleResponseDto } from "../../../application/dto/role/create-role.dto.ts";
import type { DestroyRoleRequestDto } from "../../../application/dto/role/destroy-role.dto.ts";
import type { GetRoleByIdResponseDto } from "../../../application/dto/role/get-role-by-id.dto.ts";
import type { GetRoleRequestDto, GetRoleResponseDto } from "../../../application/dto/role/get-role.dto.ts";
import type { UpdateRoleRequestDto, UpdateRoleResponseDto } from "../../../application/dto/role/update-role.dto.ts";
import { BadRequestError } from "../../../application/errors/role/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class RoleController extends Controller {
  private readonly getRoleUseCase: IUseCase<GetRoleRequestDto, GetRoleResponseDto>;
  private readonly getRoleByIdUseCase: IUseCase<number, GetRoleByIdResponseDto>;
  private readonly createRoleUseCase: IUseCase<CreateRoleRequestDto, CreateRoleResponseDto>;
  private readonly updateRoleUseCase: IUseCase<UpdateRoleRequestDto, UpdateRoleResponseDto>;
  private readonly destroyRoleUseCase: IUseCase<number, DestroyRoleRequestDto>;

  constructor(
    @inject(InjectionToken.ROLE_GET_USECASE) getRoleUseCase: IUseCase<GetRoleRequestDto, GetRoleResponseDto>,
    @inject(InjectionToken.ROLE_GET_BY_ID_USECASE) getRoleByIdUseCase: IUseCase<number, GetRoleByIdResponseDto>,
    @inject(InjectionToken.ROLE_CREATE_USECASE) createRoleUseCase: IUseCase<CreateRoleRequestDto, CreateRoleResponseDto>,
    @inject(InjectionToken.ROLE_UPDATE_USECASE) updateRoleUseCase: IUseCase<UpdateRoleRequestDto, UpdateRoleResponseDto>,
    @inject(InjectionToken.ROLE_DESTROY_USECASE) destroyRoleUseCase: IUseCase<number, DestroyRoleRequestDto>,
  ) {
    super();
    this.getRoleUseCase = getRoleUseCase;
    this.getRoleByIdUseCase = getRoleByIdUseCase;
    this.createRoleUseCase = createRoleUseCase;
    this.updateRoleUseCase = updateRoleUseCase;
    this.destroyRoleUseCase = destroyRoleUseCase;
  }

  async getRole(req: Request, res: Response): Promise<void> {
    const result: GetRoleResponseDto = await this.getRoleUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const roleId = Number(id);
    if (!Number.isSafeInteger(roleId) || roleId <= 0) throw new BadRequestError();
    const result: GetRoleByIdResponseDto = await this.getRoleByIdUseCase.execute(roleId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createRole(req: Request, res: Response): Promise<void> {
    const dto: CreateRoleRequestDto = { code: req.body.code, name: req.body.name };
    const result: CreateRoleResponseDto = await this.createRoleUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const roleId = Number(id);
    if (!Number.isSafeInteger(roleId) || roleId <= 0) throw new BadRequestError();
    const dto: UpdateRoleRequestDto = { id: roleId, code: req.body.code, name: req.body.name };
    const result: UpdateRoleResponseDto = await this.updateRoleUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const roleId = Number(id);
    if (!Number.isSafeInteger(roleId) || roleId <= 0) throw new BadRequestError();
    const result: DestroyRoleRequestDto = await this.destroyRoleUseCase.execute(roleId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
