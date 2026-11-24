import type { Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { inject, injectable } from "tsyringe";
import type { LoginRequestDto, LoginResponseDto } from "../../../application/dto/auth/login.dto.ts";
import type { LogoutResponseDto } from "../../../application/dto/auth/logout.dto.ts";
import type { MeResponseDto } from "../../../application/dto/auth/me.dto.ts";
import type { RefreshRequestDto, RefreshResponseDto } from "../../../application/dto/auth/refresh.dto.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { resetLoginClientLimiter } from "../middlewares/rate-limiters/login-client.limiter.ts";
import { resetLoginIpLimiter } from "../middlewares/rate-limiters/login-ip.limiter.ts";
import { Controller } from "./base/controller.base.ts";
/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class AuthController extends Controller {
  private readonly loginUseCase: IUseCase<LoginRequestDto, LoginResponseDto>;
  private readonly meUseCase: IUseCase<number, MeResponseDto>;
  private readonly logoutUseCase: IUseCase<number, LogoutResponseDto>;
  private readonly refreshUseCase: IUseCase<RefreshRequestDto, RefreshResponseDto>;

  constructor(
    @inject(InjectionToken.AUTH_LOGIN_USECASE) loginUseCase: IUseCase<LoginRequestDto, LoginResponseDto>,
    @inject(InjectionToken.AUTH_ME_USECASE) meUseCase: IUseCase<number, MeResponseDto>,
    @inject(InjectionToken.AUTH_LOGOUT_USECASE) logoutUseCase: IUseCase<number, LogoutResponseDto>,
    @inject(InjectionToken.AUTH_REFRESH_USECASE) refreshUseCase: IUseCase<RefreshRequestDto, RefreshResponseDto>,
  ) {
    super();
    this.loginUseCase = loginUseCase;
    this.meUseCase = meUseCase;
    this.logoutUseCase = logoutUseCase;
    this.refreshUseCase = refreshUseCase;
  }

  async login(req: Request, res: Response): Promise<void> {
    const dto: LoginRequestDto = { email: req.body.email, password: req.body.password };
    const result: LoginResponseDto = await this.loginUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    if (statusCode === StatusCodes.OK) {
      resetLoginClientLimiter(req);
      resetLoginIpLimiter(req);
    }
    res.status(statusCode).json(data);
  }

  async me(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? 0;
    const result: MeResponseDto = await this.meUseCase.execute(userId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id ?? 0;
    const result: LogoutResponseDto = await this.logoutUseCase.execute(userId);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const dto: RefreshRequestDto = { refreshToken: req.body.refreshToken };
    const result: RefreshResponseDto = await this.refreshUseCase.execute(dto);
    const statusCode: StatusCodes = StatusCodes.OK;
    const message: string = getReasonPhrase(statusCode);
    const data = this.apiResponse().setCode(statusCode).setDescription(message).setData(result).response();
    res.status(statusCode).json(data);
  }
}
