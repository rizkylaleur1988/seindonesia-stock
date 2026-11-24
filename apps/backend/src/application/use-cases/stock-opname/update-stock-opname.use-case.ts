import * as httpContext from "express-http-context";
import { inject, injectable } from "tsyringe";
import type { Store } from "../../../domain/entities/store.entity.ts";
import { StockOpnameStatusEnum } from "../../../domain/enums/stock-opname.status.enum.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto } from "../../dto/stock-opname/update-stock-opname.dto.ts";
import { BadRequestError } from "../../errors/stock-opname/bad-request.error.ts";
import { ForbiddenError } from "../../errors/stock-opname/forbidden.error.ts";
import { NotFoundError } from "../../errors/stock-opname/not-found.error.ts";
import type { IUnitOfWork } from "../../interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class UpdateStockOpnameUseCase implements IUseCase<UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto> {
  private readonly unitOfWork: IUnitOfWork;

  constructor(@inject(InjectionToken.UNIT_OF_WORK) unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async execute(input: UpdateStockOpnameRequestDto): Promise<UpdateStockOpnameResponseDto> {
    const { id: userId, stores } = httpContext.get("user");
    const { id, store_id, stock_opname_date, stock_opname_shift_id, items, notes } = input;
    const productIds = items.map((item) => item.product_id);

    if (!stores.map((item: Store) => item.id).includes(store_id)) throw new BadRequestError();

    const { stockOpname, stockOpnameItems } = await this.unitOfWork.execute(async (repositories) => {
      await repositories.stockOpname.lockByStoreDate(store_id, stock_opname_date);

      const store = await repositories.store.findById(store_id);
      if (!store) throw new NotFoundError("Store not found");

      const shift = await repositories.stockOpnameShift.findById(stock_opname_shift_id);
      if (!shift) throw new NotFoundError("Stock opname shift not found");

      const products = await repositories.product.findByIds(productIds);
      if (products.length !== productIds.length) throw new NotFoundError("Product not found");

      const stockOpname = await repositories.stockOpname.findById(id);
      if (!stockOpname) throw new NotFoundError("Stock opname not found");

      if (stockOpname.status !== StockOpnameStatusEnum.DRAFT) throw new ForbiddenError("Only DRAFT can be edited");

      const stockOpnameShiftExists = await repositories.stockOpname.findByDateShift(stock_opname_shift_id, stock_opname_date);
      if (stockOpnameShiftExists.length > 0) {
        const statuses = stockOpnameShiftExists.map((item) => item.status);
        if (
          statuses.includes(StockOpnameStatusEnum.APPROVED) ||
          statuses.includes(StockOpnameStatusEnum.DRAFT) ||
          statuses.includes(StockOpnameStatusEnum.SUBMITTED)
        ) {
          throw new ForbiddenError("Stock opname already exists with different ID");
        }
      }

      const stockOpnameUpdated = await repositories.stockOpname.update({
        id,
        store_id,
        stock_opname_shift_id,
        stock_opname_date,
        notes: notes ?? null,
        updated_by: userId,
      });

      await repositories.stockOpnameItem.destroyByStockOpname(id);
      const stockOpnameItems = await repositories.stockOpnameItem.createMany(stockOpname.id, items);

      return { stockOpname: stockOpnameUpdated, stockOpnameItems };
    });
    return { ...stockOpname, items: stockOpnameItems };
  }
}
