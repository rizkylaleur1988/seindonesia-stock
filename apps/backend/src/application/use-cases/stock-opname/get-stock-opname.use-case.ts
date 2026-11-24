import { inject, injectable } from "tsyringe";
import { getStockOpnameStatusName } from "../../../domain/enums/stock-opname.status.enum.ts";
import type { IStockOpnameShiftRepository } from "../../../domain/repositories/stock-opname-shift.repository.ts";
import type { IStockOpnameRepository } from "../../../domain/repositories/stock-opname.repository.ts";
import type { IStoreRepository } from "../../../domain/repositories/store.repository.ts";
import type { IUserRepository } from "../../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../../shared/constants/injection-token.ts";
import type { GetStockOpnameRequestDto, GetStockOpnameResponseDto } from "../../dto/stock-opname/get-stock-opname.dto.ts";
import type { IUseCase } from "../../interfaces/use-case.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class GetStockOpnameUseCase implements IUseCase<GetStockOpnameRequestDto, GetStockOpnameResponseDto> {
  private readonly stockOpnameRepository: IStockOpnameRepository;
  private readonly storeRepository: IStoreRepository;
  private readonly stockOpnameShiftRepository: IStockOpnameShiftRepository;
  private readonly userRepository: IUserRepository;

  constructor(
    @inject(InjectionToken.STOCK_OPNAME_REPOSITORY) stockOpnameRepository: IStockOpnameRepository,
    @inject(InjectionToken.STORE_REPOSITORY) storeRepository: IStoreRepository,
    @inject(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY) stockOpnameShiftRepository: IStockOpnameShiftRepository,
    @inject(InjectionToken.USER_REPOSITORY) userRepository: IUserRepository,
  ) {
    this.stockOpnameRepository = stockOpnameRepository;
    this.storeRepository = storeRepository;
    this.stockOpnameShiftRepository = stockOpnameShiftRepository;
    this.userRepository = userRepository;
  }

  async execute(input: GetStockOpnameRequestDto): Promise<GetStockOpnameResponseDto> {
    const results = await this.stockOpnameRepository.datagrid(input);
    const storeIds = results.rows.map((item) => item.store_id);
    const stockOpnameShiftIds = results.rows.map((item) => item.stock_opname_shift_id);
    const userIds = [...new Set(results.rows.flatMap((item) => [item.statused_by, item.created_by, item.updated_by]))];
    const [stores, stockOpnameShifts, users] = await Promise.all([
      storeIds.length > 0 ? this.storeRepository.findByIds(storeIds) : Promise.resolve([]),
      stockOpnameShiftIds.length > 0 ? this.stockOpnameShiftRepository.findByIds(stockOpnameShiftIds) : Promise.resolve([]),
      userIds.length > 0 ? this.userRepository.findByIds(userIds) : Promise.resolve([]),
    ]);
    const storeMap = new Map(stores.map(({ created_at, updated_at, ...item }) => [item.id, item]));
    const stockOpnameShiftMap = new Map(stockOpnameShifts.map(({ created_at, updated_at, ...item }) => [item.id, item]));
    const userMap = new Map(users.map(({ password, created_at, updated_at, ...item }) => [item.id, item]));
    results.rows = results.rows.map((item) => ({
      ...item,
      store: storeMap.get(item.store_id) ?? null,
      stock_opname_shift: stockOpnameShiftMap.get(item.stock_opname_shift_id) ?? null,
      statused_by_user: userMap.get(item.statused_by) ?? null,
      created_by_user: userMap.get(item.created_by) ?? null,
      updated_by_user: userMap.get(item.updated_by) ?? null,
      status_name: getStockOpnameStatusName(item.status),
    }));
    return results;
  }
}
