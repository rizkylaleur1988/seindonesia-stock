import type { NextFunction, Request, Response } from "express";
import * as httpContext from "express-http-context";
import { inject, injectable } from "tsyringe";
import type { AuthenticateRequestDto, AuthenticateResponseDto } from "../../../application/dto/auth/authenticate.dto.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import { InvalidBearerTokenError } from "../errors/invalid-bearer-token.error.ts";
import { MissingBearerTokenError } from "../errors/missing-bearer-token.error.ts";
import { Middleware } from "./base/middleware.base.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class AuthenticateMiddleware extends Middleware {
  private readonly authenticateUseCase: IUseCase<AuthenticateRequestDto, AuthenticateResponseDto>;

  constructor(@inject(InjectionToken.AUTH_AUTHENTICATE_USECASE) authenticateUseCase: IUseCase<AuthenticateRequestDto, AuthenticateResponseDto>) {
    super();
    this.authenticateUseCase = authenticateUseCase;
  }

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { authorization } = req.headers;
    if (!authorization) throw new MissingBearerTokenError();

    const [tokenType, token] = authorization.trim().split(/\s+/);
    if (tokenType !== "Bearer" || !token) throw new InvalidBearerTokenError();

    const input: AuthenticateRequestDto = { tokenType: "access", token };
    const user = await this.authenticateUseCase.execute(input);

    req.user = { id: user.user_id, email: user.email, stores: user.stores, roles: user.roles };
    httpContext.set("user", req.user);

    next();
  }
}
