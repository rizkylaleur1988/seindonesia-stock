import { inject, injectable } from "tsyringe";
import type { UserSession } from "../../domain/entities/user-session.entity.ts";
import { InjectionToken } from "../../shared/constants/injection-token.ts";
import { DateUtil } from "../../shared/utils/date.util.ts";
import { TokenGenerationError } from "../errors/auth/token-generation.error.ts";
import type { IJwtService } from "../interfaces/security/jwt.interface.ts";
import type { ISessionToken, IToken } from "../interfaces/security/session-token.factory.interface.ts";
import type { ITokenHasherService } from "../interfaces/security/token-hasher.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class SessionTokenFactory implements ISessionToken {
  private readonly jwtService: IJwtService;
  private readonly tokenHasherService: ITokenHasherService;

  constructor(
    @inject(InjectionToken.TOKEN_HASHER) tokenHasherService: ITokenHasherService,
    @inject(InjectionToken.JWT_SERVICE) jwtService: IJwtService,
  ) {
    this.tokenHasherService = tokenHasherService;
    this.jwtService = jwtService;
  }

  create(userId: number): IToken {
    const { accessToken, accessTokenExpiryTime, refreshToken, refreshTokenExpiryTime } = this.jwtService.setup(userId);
    if (!accessTokenExpiryTime || !refreshTokenExpiryTime) throw new TokenGenerationError();
    return { accessToken, accessTokenExpiryTime, refreshToken, refreshTokenExpiryTime };
  }

  payload(userId: number, tokens: IToken): Omit<UserSession, "id" | "created_at" | "updated_at"> {
    return {
      user_id: userId,
      access_token_hash: this.tokenHasherService.hash(tokens.accessToken),
      refresh_token_hash: this.tokenHasherService.hash(tokens.refreshToken),
      access_token_expires_at: DateUtil.unixToDate(tokens.accessTokenExpiryTime),
      refresh_token_expires_at: DateUtil.unixToDate(tokens.refreshTokenExpiryTime),
    };
  }
}
