import { inject, injectable } from "tsyringe";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyStockOpnameShiftRequestDto } from "../../dto/stock-opname-shift/destroy-stock-opname-shift.dto.ts";
import { NotFoundError } from "../../errors/stock-opname-shift/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyStockOpnameShiftUseCase implements IUseCase<number, DestroyStockOpnameShiftRequestDto> {
  private readonly stockOpnameShiftRepository: IStockOpnameShiftRepository;

  constructor(@inject(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY) stockOpnameShiftRepository: IStockOpnameShiftRepository) {
    this.stockOpnameShiftRepository = stockOpnameShiftRepository;
  }

  async execute(stockOpnameShiftId: number): Promise<DestroyStockOpnameShiftRequestDto> {
    const stockOpnameShift = await this.stockOpnameShiftRepository.findById(stockOpnameShiftId);
    if (!stockOpnameShift) throw new NotFoundError();

    await this.stockOpnameShiftRepository.destroy(stockOpnameShiftId);

    return {};
  }
}
