import type { IProductRepository } from "../../domain/repositories/product.repository.ts";
import type { IStockOpnameItemRepository } from "../../domain/repositories/stock-opname-item.repository.ts";
import type { IStockOpnameShiftRepository } from "../../domain/repositories/stock-opname-shift.repository.ts";
import type { IStockOpnameRepository } from "../../domain/repositories/stock-opname.repository.ts";
import type { IStoreProductRepository } from "../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../domain/repositories/store.repository.ts";
import type { IUserRoleRepository } from "../../domain/repositories/user-role.repository.ts";
import type { IUserStoreRepository } from "../../domain/repositories/user-store.repository.ts";
import type { IUserRepository } from "../../domain/repositories/user.repository.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface ITransactionRepositories {
  users: IUserRepository;
  userRoles: IUserRoleRepository;
  userStores: IUserStoreRepository;
  store: IStoreRepository;
  stockOpnameShift: IStockOpnameShiftRepository;
  stockOpname: IStockOpnameRepository;
  stockOpnameItem: IStockOpnameItemRepository;
  product: IProductRepository;
  storeProduct: IStoreProductRepository;
}

export interface IUnitOfWork {
  execute<T>(callback: (repositories: ITransactionRepositories) => Promise<T>): Promise<T>;
}
