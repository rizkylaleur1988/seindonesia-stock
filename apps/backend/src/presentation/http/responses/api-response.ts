import { getReasonPhrase, StatusCodes } from "http-status-codes";
import type { PaginationType } from "../../../application/dto/pagination.dto.ts";
import {
  API_RESPONSE_KEY_CODE,
  API_RESPONSE_KEY_DATA,
  API_RESPONSE_KEY_MESSAGE,
  API_RESPONSE_KEY_WRAPPER,
  API_RESPONSE_WITH_WRAPPER,
  NODE_ENV,
} from "../../../infrastructure/config/env.config.ts";
import { EnvironmentEnum } from "../../../shared/enums/environment.enum.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

type ResponseData = boolean | object | undefined;

export class ApiResponse {
  private code: number = StatusCodes.INTERNAL_SERVER_ERROR;
  private description: string = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  private wrapperData: string = API_RESPONSE_KEY_DATA;
  private data: ResponseData = undefined;
  private wrapper: string = API_RESPONSE_KEY_WRAPPER;
  private stack: unknown = undefined;
  private error: unknown = undefined;
  private keyCode: string = API_RESPONSE_KEY_CODE;
  private keyMessage: string = API_RESPONSE_KEY_MESSAGE;
  private withWrapper: boolean = API_RESPONSE_WITH_WRAPPER;
  private pagination: PaginationType | undefined = undefined;

  setCode(code: number): this {
    this.code = code;
    return this;
  }

  getCode(): number {
    return this.code;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  getDescription(): string {
    return this.description;
  }

  setData(data: ResponseData): this {
    this.data = data;
    return this;
  }

  getData(): ResponseData {
    return this.data;
  }

  setWrapperData(wrapperData: string): this {
    this.wrapperData = wrapperData;
    return this;
  }

  getWrapperData(): string {
    return this.wrapperData;
  }

  setWrapper(wrapper: string): this {
    this.wrapper = wrapper;
    return this;
  }

  getWrapper(): string {
    return this.wrapper;
  }

  setStack(stack: unknown): this {
    this.stack = stack;
    return this;
  }

  getStack(): unknown {
    return this.stack;
  }

  setError(error: unknown): this {
    this.error = error;
    return this;
  }

  getError(): unknown {
    return this.error;
  }

  setKeyCode(keyCode: string): this {
    this.keyCode = keyCode;
    return this;
  }

  getKeyCode(): string {
    return this.keyCode;
  }

  setKeyMessage(keyMessage: string): this {
    this.keyMessage = keyMessage;
    return this;
  }

  getKeyMessage(): string {
    return this.keyMessage;
  }

  setWithWrapper(withWrapper: boolean): this {
    this.withWrapper = withWrapper;
    return this;
  }

  getWithWrapper(): boolean {
    return this.withWrapper;
  }

  setPagination(pagination: PaginationType): this {
    this.pagination = pagination;
    return this;
  }

  getPagination(): PaginationType | undefined {
    return this.pagination;
  }

  response(): object {
    const baseResponse = {
      [this.getKeyCode()]: this.getCode(),
      [this.getKeyMessage()]: this.getDescription(),
      [this.getWrapperData()]: this.getData(),
      ...(this.getPagination() ? { pagination: this.getPagination() } : undefined),
      ...(NODE_ENV !== EnvironmentEnum.PRODUCTION && { stack: this.getStack(), error: this.getError() }),
    };
    return this.withWrapper ? { [this.getWrapper()]: baseResponse } : baseResponse;
  }
}
