import { inject, injectable } from "tsyringe";
import { getStockOpnameStatusName } from "../../../domain/enums/stock-opname.status.enum.ts";
import type { IProductRepository } from "../../../domain/repositories/product.repository.ts";
import type { IStockOpnameItemRepository } from "../../../domain/repositories/stock-opname-item.repository.ts";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import type { IStockOpnameRepository } from "../../../domain/repositories/stock-opname.repository.ts";
import type { IStoreProductRepository } from "../../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetStockOpnameByIdResponseDto } from "../../dto/stock-opname/get-stock-opname-by-id.dto.ts";
import { NotFoundError } from "../../errors/stock-opname/not-found.error.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetStockOpnameByIdUseCase implements IUseCase<number, GetStockOpnameByIdResponseDto> {
  private readonly stockOpnameRepository: IStockOpnameRepository;
  private readonly stockOpnameItemRepository: IStockOpnameItemRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly stockOpnameShiftRepository: IStockOpnameShiftRepository;
  private readonly userRepository: IUserRepository;
  private readonly productRepository: IProductRepository;
  private readonly storeProductRepository: IStoreProductRepository;

  constructor(
    @inject(InjectionToken.STOCK_OPNAME_REPOSITORY) stockOpnameRepository: IStockOpnameRepository,
    @inject(InjectionToken.STOCK_OPNAME_ITEM_REPOSITORY) stockOpnameItemRepository: IStockOpnameItemRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY) stockOpnameShiftRepository: IStockOpnameShiftRepository,
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
    @inject(InjectionToken.PRODUCT_REPOSITORY) productRepository: IProductRepository,
    @inject(InjectionToken.STORE_PRODUCT_REPOSITORY) storeProductRepository: IStoreProductRepository,
  ) {
    this.stockOpnameRepository = stockOpnameRepository;
    this.stockOpnameItemRepository = stockOpnameItemRepository;
    this.storeRepository = storeRepository;
    this.stockOpnameShiftRepository = stockOpnameShiftRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.storeProductRepository = storeProductRepository;
  }

  async execute(stockOpnameId: number): Promise<GetStockOpnameByIdResponseDto> {
    const stockOpname = await this.stockOpnameRepository.findById(stockOpnameId);
    if (!stockOpname) throw new NotFoundError();

    const { store_id, stock_opname_shift_id, status, created_by, updated_by, statused_by } = stockOpname;
    const store = await this.storeRepository.findById(store_id);
    const shift = await this.stockOpnameShiftRepository.findById(stock_opname_shift_id);

    const userIds = [...new Set([created_by, updated_by, statused_by])];
    const users = await this.userRepository.findByIds(userIds);
    const userMap = new Map(users.map(({ password, created_at, updated_at, ...item }) => [item.id, item.name]));

    const stockOpnameItem = await this.stockOpnameItemRepository.findByStockOpname(stockOpname.id);
    const productIds = [...new Set(stockOpnameItem.map((item) => item.product_id))];
    const products = await this.productRepository.findByIds(productIds);
    const productMap = new Map(products.map((item) => [item.id, item.name]));

    const storeProducts = await this.storeProductRepository.findByStoreProducts(store_id, productIds);
    const storeProductMap = new Map(storeProducts.map((item) => [item.product_id, item.stock]));

    const items = stockOpnameItem.map((item) => ({
      ...item,
      notes: storeProductMap.get(item.product_id) !== undefined ? "listed" : "unlisted",
      system_qty: storeProductMap.get(item.product_id) ?? 0,
      product_name: productMap.get(item.product_id) ?? "",
    }));

    return {
      ...stockOpname,
      items,
      store,
      shift,
      status_name: getStockOpnameStatusName(status),
      statused_by_user: userMap.get(statused_by) ?? null,
      created_by_user: userMap.get(created_by) ?? null,
      updated_by_user: userMap.get(updated_by) ?? null,
    };
  }
}
