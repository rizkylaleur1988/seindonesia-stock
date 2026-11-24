import { inject, injectable } from "tsyringe";
import type { StockOpnameShift } from "../../../domain/entities/stock-opname-shift.entity.ts";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type {
  CreateStockOpnameShiftRequestDto,
  CreateStockOpnameShiftResponseDto,
} from "../../dto/stock-opname-shift/create-stock-opname-shift.dto.ts";
import { CodeExistsError } from "../../errors/stock-opname-shift/code-exists.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateStockOpnameShiftUseCase implements IUseCase<CreateStockOpnameShiftRequestDto, CreateStockOpnameShiftResponseDto> {
  private readonly stockOpnameShiftRepository: IStockOpnameShiftRepository;

  constructor(@inject(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY) stockOpnameShiftRepository: IStockOpnameShiftRepository) {
    this.stockOpnameShiftRepository = stockOpnameShiftRepository;
  }

  async execute(input: CreateStockOpnameShiftRequestDto): Promise<CreateStockOpnameShiftResponseDto> {
    const { code, name, ordering } = input;
    const codeExists = await this.stockOpnameShiftRepository.findByCode(code);
    if (codeExists) throw new CodeExistsError();

    const orderingExists = await this.stockOpnameShiftRepository.findByOrdering(ordering);
    if (orderingExists) throw new CodeExistsError();

    const payload: Pick<StockOpnameShift, "code" | "name" | "ordering"> = { code, name, ordering };
    const stockOpnameShift = await this.stockOpnameShiftRepository.create(payload);
    const { id, created_at, updated_at } = stockOpnameShift;

    return { id, code, name, ordering, created_at, updated_at };
  }
}
