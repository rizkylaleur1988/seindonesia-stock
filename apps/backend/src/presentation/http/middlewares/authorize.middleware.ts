import type { NextFunction, Request, RequestHandler, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { AuthorizeRequestDto } from "../../../application/dto/auth/authorize.dto.ts";
import type { IUseCase } from "../../../application/interfaces/use-case.interface.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class AuthorizeMiddleware {
  private readonly authorizeUseCase: IUseCase<AuthorizeRequestDto, boolean>;

  constructor(@inject(InjectionToken.AUTH_AUTHORIZE_USECASE) authorizeUseCase: IUseCase<AuthorizeRequestDto, boolean>) {
    this.authorizeUseCase = authorizeUseCase;
  }

  handle(permissionCode: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const userId = req.user?.id ?? 0;
      const payload: AuthorizeRequestDto = { userId, permissionCode };
      await this.authorizeUseCase.execute(payload);
      next();
    };
  }
}
