import * as httpContext from "express-http-context";
import { inject, injectable } from "tsyringe";
import type { StockOpname } from "../../../domain/entities/stock-opname.entity.ts";
import { StockOpnameStatusEnum } from "../../../domain/enums/stock-opname.status.enum.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { ApprovalStockOpnameRequestDto, ApprovalStockOpnameResponseDto } from "../../dto/stock-opname/approval-stock-opname.dto.ts";
import { ForbiddenError } from "../../errors/stock-opname/forbidden.error.ts";
import { NotFoundError } from "../../errors/stock-opname/not-found.error.ts";
import type { IUnitOfWork } from "../../interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class ApprovalStockOpnameUseCase implements IUseCase<ApprovalStockOpnameRequestDto, ApprovalStockOpnameResponseDto> {
  private readonly unitOfWork: IUnitOfWork;

  constructor(@inject(InjectionToken.UNIT_OF_WORK) unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async execute(input: ApprovalStockOpnameRequestDto): Promise<ApprovalStockOpnameResponseDto> {
    const { id: userId, stores, roles } = httpContext.get("user");
    const storeIds = stores.map((item: { id: number }) => item.id);
    const roleCodes = roles.map((item: { code: string }) => item.code);
    const { approval_code, id, notes } = input;
    const approvalStatus = StockOpnameStatusEnum[approval_code as keyof typeof StockOpnameStatusEnum];
    const isStoreStaff = roleCodes.includes("STORE_STAFF");
    const isStoreManager = roleCodes.includes("STORE_MANAGER");
    const isValidApproval =
      (isStoreStaff && [StockOpnameStatusEnum.SUBMITTED, StockOpnameStatusEnum.CANCELLED].includes(approvalStatus)) ||
      (isStoreManager && [StockOpnameStatusEnum.APPROVED, StockOpnameStatusEnum.REJECTED].includes(approvalStatus));

    if (!isValidApproval) throw new ForbiddenError();

    const stockOpname = await this.unitOfWork.execute(async (repositories) => {
      const stockOpname = await repositories.stockOpname.findById(id);
      if (!stockOpname) throw new NotFoundError("Stock opname not found");

      const { store_id, status, stock_opname_date } = stockOpname;

      if (status === StockOpnameStatusEnum.DRAFT && ![StockOpnameStatusEnum.SUBMITTED, StockOpnameStatusEnum.CANCELLED].includes(approvalStatus)) {
        throw new ForbiddenError();
      }

      if (status === StockOpnameStatusEnum.SUBMITTED && ![StockOpnameStatusEnum.APPROVED, StockOpnameStatusEnum.REJECTED].includes(approvalStatus)) {
        throw new ForbiddenError();
      }

      if (!storeIds.includes(store_id)) throw new ForbiddenError();

      await repositories.stockOpname.lockByStoreDate(id, stock_opname_date);

      if (approvalStatus === StockOpnameStatusEnum.APPROVED) {
        const items = await repositories.stockOpnameItem.findByStockOpname(id);
        await Promise.all(
          items.map(async (item) => {
            const product = await repositories.product.findById(item.product_id);
            if (!product) throw new NotFoundError("Product not found");

            const storeProduct = await repositories.storeProduct.findByStoreProduct(store_id, item.product_id);
            if (storeProduct) {
              const previous_stock: number = storeProduct.stock;
              const stock: number = item.counted_qty;
              const latestStock: number = product.stock + (stock - previous_stock);
              await repositories.product.updateStock({ id: product.id, stock: latestStock });
              return await repositories.storeProduct.update({
                id: storeProduct.id,
                store_id: storeProduct.store_id,
                product_id: storeProduct.product_id,
                stock,
                previous_stock,
              });
            }

            const previous_stock: number = 0;
            const latestStock: number = item.counted_qty - previous_stock;
            await repositories.product.updateStock({ id: product.id, stock: latestStock });
            return await repositories.storeProduct.create({ store_id, product_id: item.product_id, stock: item.counted_qty, previous_stock });
          }),
        );
      }

      const payload: Pick<StockOpname, "id" | "status" | "statused_by" | "notes"> = {
        id,
        notes: notes ?? null,
        status: approvalStatus,
        statused_by: userId,
      };
      return await repositories.stockOpname.updateStatus(payload);
    });

    return stockOpname;
  }
}
