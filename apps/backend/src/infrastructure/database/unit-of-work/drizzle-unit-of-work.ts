import { injectable } from "tsyringe";
import type { ITransactionRepositories, IUnitOfWork } from "../../../application/interfaces/unit-of-work.interface.ts";
import { database } from "../connection.ts";
import { ProductRepository } from "../repositories/product.repository.ts";
import { StockOpnameItemRepository } from "../repositories/stock-opname-item.repository.ts";
import { StockOpnameShiftRepository } from "../repositories/stock-opname-shift.repository.ts";
import { StockOpnameRepository } from "../repositories/stock-opname.repository.ts";
import { StoreProductRepository } from "../repositories/store-product.repository.ts";
import { StoreRepository } from "../repositories/store.repository.ts";
import { UserRoleRepository } from "../repositories/user-role.repository.ts";
import { UserStoreRepository } from "../repositories/user-store.repository.ts";
import { UserRepository } from "../repositories/user.repository.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

@injectable()
export class DrizzleUnitOfWork implements IUnitOfWork {
  async execute<T>(callback: (repositories: ITransactionRepositories) => Promise<T>): Promise<T> {
    return database.transaction(async (tx) => {
      const repositories: ITransactionRepositories = {
        users: new UserRepository(tx),
        userRoles: new UserRoleRepository(tx),
        userStores: new UserStoreRepository(tx),
        store: new StoreRepository(tx),
        stockOpnameShift: new StockOpnameShiftRepository(tx),
        stockOpname: new StockOpnameRepository(tx),
        stockOpnameItem: new StockOpnameItemRepository(tx),
        product: new ProductRepository(tx),
        storeProduct: new StoreProductRepository(tx),
      };
      return callback(repositories);
    });
  }
}
