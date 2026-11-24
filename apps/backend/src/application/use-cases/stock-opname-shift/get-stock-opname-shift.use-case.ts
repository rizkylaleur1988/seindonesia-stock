import { inject, injectable } from "tsyringe";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetStockOpnameShiftRequestDto, GetStockOpnameShiftResponseDto } from "../../dto/stock-opname-shift/get-stock-opname-shift.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetStockOpnameShiftUseCase implements IUseCase<GetStockOpnameShiftRequestDto, GetStockOpnameShiftResponseDto> {
  private readonly stockOpnameShiftRepository: IStockOpnameShiftRepository;

  constructor(@inject(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY) stockOpnameShiftRepository: IStockOpnameShiftRepository) {
    this.stockOpnameShiftRepository = stockOpnameShiftRepository;
  }

  async execute(input: GetStockOpnameShiftRequestDto): Promise<GetStockOpnameShiftResponseDto> {
    return await this.stockOpnameShiftRepository.datagrid(input);
  }
}
