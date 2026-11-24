import * as httpContext from "express-http-context";
import { inject, injectable } from "tsyringe";
import type { StockOpname } from "../../../domain/entities/stock-opname.entity.ts";
import type { Store } from "../../../domain/entities/store.entity.ts";
import { StockOpnameStatusEnum } from "../../../domain/enums/stock-opname.status.enum.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { CreateStockOpnameRequestDto, CreateStockOpnameResponseDto } from "../../dto/stock-opname/create-stock-opname.dto.ts";
import { BadRequestError } from "../../errors/stock-opname/bad-request.error.ts";
import { ConflictError } from "../../errors/stock-opname/conflict.error.ts";
import { ForbiddenError } from "../../errors/stock-opname/forbidden.error.ts";
import { NotFoundError } from "../../errors/stock-opname/not-found.error.ts";
import type { IUnitOfWork } from "../../interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class CreateStockOpnameUseCase implements IUseCase<CreateStockOpnameRequestDto, CreateStockOpnameResponseDto> {
  private readonly unitOfWork: IUnitOfWork;

  constructor(@inject(InjectionToken.UNIT_OF_WORK) unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async execute(input: CreateStockOpnameRequestDto): Promise<CreateStockOpnameResponseDto> {
    const { id: userId, stores } = httpContext.get("user");
    const { store_id, stock_opname_date, stock_opname_shift_id, items, notes } = input;
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

      const exists = await repositories.stockOpname.findByStoreDateShiftActive(store_id, stock_opname_date, stock_opname_shift_id);
      if (exists) throw new ConflictError("Stock opname for this shift already exists");

      const latestStockOpname = await repositories.stockOpname.findLatestActiveByStoreDate(store_id, stock_opname_date);
      if (latestStockOpname) {
        const latestShift = await repositories.stockOpnameShift.findById(latestStockOpname.stock_opname_shift_id);
        if (!latestShift) throw new NotFoundError("Stock opname shift not found");
        if (shift.ordering <= latestShift.ordering) throw new ForbiddenError("Stock opname must follow the previous shift order");
        if (latestStockOpname.status !== StockOpnameStatusEnum.APPROVED) throw new ForbiddenError("Previous stock opname must be approved first");
      }

      const payload: Pick<
        StockOpname,
        "store_id" | "stock_opname_shift_id" | "stock_opname_date" | "notes" | "status" | "statused_by" | "created_by" | "updated_by"
      > = {
        store_id,
        stock_opname_shift_id,
        stock_opname_date,
        notes: notes ?? null,
        status: StockOpnameStatusEnum.DRAFT,
        statused_by: userId,
        created_by: userId,
        updated_by: userId,
      };
      const stockOpname = await repositories.stockOpname.create(payload);
      const stockOpnameItems = await repositories.stockOpnameItem.createMany(stockOpname.id, items);

      return { stockOpname, stockOpnameItems };
    });

    return { ...stockOpname, items: stockOpnameItems };
  }
}
