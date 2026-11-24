import { inject, injectable } from "tsyringe";
import type { StockOpnameShift } from "../../../domain/entities/stock-opname-shift.entity.ts";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type {
  UpdateStockOpnameShiftRequestDto,
  UpdateStockOpnameShiftResponseDto,
} from "../../dto/stock-opname-shift/update-stock-opname-shift.dto.ts";
import { CodeExistsError } from "../../errors/stock-opname-shift/code-exists.error.ts";
import { NotFoundError } from "../../errors/stock-opname-shift/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateStockOpnameShiftUseCase implements IUseCase<UpdateStockOpnameShiftRequestDto, UpdateStockOpnameShiftResponseDto> {
  private readonly stockOpnameShiftRepository: IStockOpnameShiftRepository;

  constructor(@inject(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY) stockOpnameShiftRepository: IStockOpnameShiftRepository) {
    this.stockOpnameShiftRepository = stockOpnameShiftRepository;
  }

  async execute(input: UpdateStockOpnameShiftRequestDto): Promise<UpdateStockOpnameShiftResponseDto> {
    const { id, code, name, ordering } = input;
    const stockOpnameShift = await this.stockOpnameShiftRepository.findById(id);
    if (!stockOpnameShift) throw new NotFoundError();

    const codeExists = await this.stockOpnameShiftRepository.findByCodeUnlessId(id, code);
    if (codeExists) throw new CodeExistsError();

    const orderingExists = await this.stockOpnameShiftRepository.findByOrderingUnlessId(id, ordering);
    if (orderingExists) throw new CodeExistsError("Stock opname ordering already exists");

    const payload: Pick<StockOpnameShift, "id" | "code" | "name"> = { id, code, name };
    const updated = await this.stockOpnameShiftRepository.update(payload);
    const { created_at, updated_at } = updated;

    return { id, code, name, ordering, created_at, updated_at };
  }
}
