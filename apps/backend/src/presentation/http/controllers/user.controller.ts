import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { CreateUserRequestDto, CreateUserResponseDto } from "../../../application/dto/user/create-user.dto.ts";
import type { DestroyUserRequestDto } from "../../../application/dto/user/destroy-user.dto.ts";
import type { GetUserByIdResponseDto } from "../../../application/dto/user/get-user-by-id.dto.ts";
import type { GetUserRequestDto, GetUserResponseDto } from "../../../application/dto/user/get-user.dto.ts";
import type { UpdateUserRequestDto, UpdateUserResponseDto } from "../../../application/dto/user/update-user.dto.ts";
import { BadRequestError } from "../../../application/errors/user/bad-request.error.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UserController extends Controller {
  private readonly getUserUseCase: IUseCase<GetUserRequestDto, GetUserResponseDto>;
  private readonly getUserByIdUseCase: IUseCase<number, GetUserByIdResponseDto>;
  private readonly createUserUseCase: IUseCase<CreateUserRequestDto, CreateUserResponseDto>;
  private readonly updateUserUseCase: IUseCase<UpdateUserRequestDto, UpdateUserResponseDto>;
  private readonly destroyUserUseCase: IUseCase<number, DestroyUserRequestDto>;

  constructor(
    @inject(InjectionToken.USER_GET_USECASE) getUserUseCase: IUseCase<GetUserRequestDto, GetUserResponseDto>,
    @inject(InjectionToken.USER_GET_BY_ID_USECASE) getUserByIdUseCase: IUseCase<number, GetUserByIdResponseDto>,
    @inject(InjectionToken.USER_CREATE_USECASE)
    createUserUseCase: IUseCase<CreateUserRequestDto, CreateUserResponseDto>,
    @inject(InjectionToken.USER_UPDATE_USECASE)
    updateUserUseCase: IUseCase<UpdateUserRequestDto, UpdateUserResponseDto>,
    @inject(InjectionToken.USER_DESTROY_USECASE) destroyUserUseCase: IUseCase<number, DestroyUserRequestDto>,
  ) {
    super();
    this.getUserUseCase = getUserUseCase;
    this.getUserByIdUseCase = getUserByIdUseCase;
    this.createUserUseCase = createUserUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.destroyUserUseCase = destroyUserUseCase;
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const result: GetUserResponseDto = await this.getUserUseCase.execute(req.query);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result.rows).setPagination(result.pagination).response();
    res.status(statusCode).json(data);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = Number(id);
    if (!Number.isSafeInteger(userId) || userId <= 0) throw new BadRequestError();
    const result: GetUserByIdResponseDto = await this.getUserByIdUseCase.execute(userId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const dto: CreateUserRequestDto = { name: req.body.name, email: req.body.email, roles: req.body.roles, stores: req.body.stores };
    const result: CreateUserResponseDto = await this.createUserUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.CREATED;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = Number(id);
    if (!Number.isSafeInteger(userId) || userId <= 0) throw new BadRequestError();
    const dto: UpdateUserRequestDto = {
      id: userId,
      name: req.body.name,
      email: req.body.email,
      roles: req.body.roles,
      stores: req.body.stores,
    };
    const result: UpdateUserResponseDto = await this.updateUserUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async destroyUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = Number(id);
    if (!Number.isSafeInteger(userId) || userId <= 0) throw new BadRequestError();
    const result: DestroyUserRequestDto = await this.destroyUserUseCase.execute(userId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
