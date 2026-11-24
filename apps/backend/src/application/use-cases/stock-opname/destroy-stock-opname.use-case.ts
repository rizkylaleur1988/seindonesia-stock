import { inject, injectable } from "tsyringe";
import type { IStockOpnameItemRepository } from "../../../domain/repositories/stock-opname-item.repository.ts";
import type { IStockOpnameRepository } from "../../../domain/repositories/stock-opname.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { DestroyStockOpnameRequestDto } from "../../dto/stock-opname/destroy-stock-opname.dto.ts";
import { NotFoundError } from "../../errors/stock-opname/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DestroyStockOpnameUseCase implements IUseCase<number, DestroyStockOpnameRequestDto> {
  private readonly stockOpnameRepository: IStockOpnameRepository;
  private readonly stockOpnameItemRepository: IStockOpnameItemRepository;

  constructor(
    @inject(InjectionToken.STOCK_OPNAME_REPOSITORY) stockOpnameRepository: IStockOpnameRepository,
    @inject(InjectionToken.STOCK_OPNAME_ITEM_REPOSITORY) stockOpnameItemRepository: IStockOpnameItemRepository,
  ) {
    this.stockOpnameRepository = stockOpnameRepository;
    this.stockOpnameItemRepository = stockOpnameItemRepository;
  }

  async execute(stockOpnameId: number): Promise<DestroyStockOpnameRequestDto> {
    const stockOpname = await this.stockOpnameRepository.findById(stockOpnameId);
    if (!stockOpname) throw new NotFoundError();

    await this.stockOpnameItemRepository.destroyByStockOpname(stockOpnameId);
    await this.stockOpnameRepository.destroy(stockOpnameId);

    return {};
  }
}
