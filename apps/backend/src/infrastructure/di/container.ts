import "reflect-metadata";
import { container } from "tsyringe";
import type { AuthenticateRequestDto, AuthenticateResponseDto } from "../../application/dto/auth/authenticate.dto.ts";
import type { AuthorizeRequestDto } from "../../application/dto/auth/authorize.dto.ts";
import type { LoginRequestDto, LoginResponseDto } from "../../application/dto/auth/login.dto.ts";
import type { LogoutResponseDto } from "../../application/dto/auth/logout.dto.ts";
import type { MeResponseDto } from "../../application/dto/auth/me.dto.ts";
import type { RefreshRequestDto, RefreshResponseDto } from "../../application/dto/auth/refresh.dto.ts";
import type { CreatePermissionRequestDto, CreatePermissionResponseDto } from "../../application/dto/permission/create-permission.dto.ts";
import type { DestroyPermissionRequestDto } from "../../application/dto/permission/destroy-permission.dto.ts";
import type { GetPermissionByIdResponseDto } from "../../application/dto/permission/get-permission-by-id.dto.ts";
import type { GetPermissionRequestDto, GetPermissionResponseDto } from "../../application/dto/permission/get-permission.dto.ts";
import type { UpdatePermissionRequestDto, UpdatePermissionResponseDto } from "../../application/dto/permission/update-permission.dto.ts";
import type { CreateProductRequestDto, CreateProductResponseDto } from "../../application/dto/product/create-product.dto.ts";
import type { DestroyProductRequestDto } from "../../application/dto/product/destroy-product.dto.ts";
import type { GetProductByIdResponseDto } from "../../application/dto/product/get-product-by-id.dto.ts";
import type { GetProductRequestDto, GetProductResponseDto } from "../../application/dto/product/get-product.dto.ts";
import type { UpdateProductRequestDto, UpdateProductResponseDto } from "../../application/dto/product/update-product.dto.ts";
import type {
  CreateRolePermissionRequestDto,
  CreateRolePermissionResponseDto,
} from "../../application/dto/role-permission/create-role-permission.dto.ts";
import type {
  DestroyRolePermissionRequestDto,
  DestroyRolePermissionResponseDto,
} from "../../application/dto/role-permission/destroy-role-permission.dto.ts";
import type {
  GetRolePermissionByIdRequestDto,
  GetRolePermissionByIdResponseDto,
} from "../../application/dto/role-permission/get-role-permission-by-id.dto.ts";
import type { GetRolePermissionRequestDto, GetRolePermissionResponseDto } from "../../application/dto/role-permission/get-role-permission.dto.ts";
import type {
  UpdateRolePermissionRequestDto,
  UpdateRolePermissionResponseDto,
} from "../../application/dto/role-permission/update-role-permission.dto.ts";
import type { CreateRoleRequestDto, CreateRoleResponseDto } from "../../application/dto/role/create-role.dto.ts";
import type { DestroyRoleRequestDto } from "../../application/dto/role/destroy-role.dto.ts";
import type { GetRoleByIdResponseDto } from "../../application/dto/role/get-role-by-id.dto.ts";
import type { GetRoleRequestDto, GetRoleResponseDto } from "../../application/dto/role/get-role.dto.ts";
import type { UpdateRoleRequestDto, UpdateRoleResponseDto } from "../../application/dto/role/update-role.dto.ts";
import type {
  CreateStockOpnameShiftRequestDto,
  CreateStockOpnameShiftResponseDto,
} from "../../application/dto/stock-opname-shift/create-stock-opname-shift.dto.ts";
import type { DestroyStockOpnameShiftRequestDto } from "../../application/dto/stock-opname-shift/destroy-stock-opname-shift.dto.ts";
import type { GetStockOpnameShiftByIdResponseDto } from "../../application/dto/stock-opname-shift/get-stock-opname-shift-by-id.dto.ts";
import type {
  GetStockOpnameShiftRequestDto,
  GetStockOpnameShiftResponseDto,
} from "../../application/dto/stock-opname-shift/get-stock-opname-shift.dto.ts";
import type {
  UpdateStockOpnameShiftRequestDto,
  UpdateStockOpnameShiftResponseDto,
} from "../../application/dto/stock-opname-shift/update-stock-opname-shift.dto.ts";
import type { ApprovalStockOpnameRequestDto, ApprovalStockOpnameResponseDto } from "../../application/dto/stock-opname/approval-stock-opname.dto.ts";
import type { CreateStockOpnameRequestDto, CreateStockOpnameResponseDto } from "../../application/dto/stock-opname/create-stock-opname.dto.ts";
import type { DestroyStockOpnameRequestDto } from "../../application/dto/stock-opname/destroy-stock-opname.dto.ts";
import type { GetStockOpnameByIdResponseDto } from "../../application/dto/stock-opname/get-stock-opname-by-id.dto.ts";
import type { GetStockOpnameRequestDto, GetStockOpnameResponseDto } from "../../application/dto/stock-opname/get-stock-opname.dto.ts";
import type { UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto } from "../../application/dto/stock-opname/update-stock-opname.dto.ts";
import type { CreateStoreProductRequestDto, CreateStoreProductResponseDto } from "../../application/dto/store-product/create-store-product.dto.ts";
import type { DestroyStoreProductRequestDto } from "../../application/dto/store-product/destroy-store-product.dto.ts";
import type { GetStoreProductByIdResponseDto } from "../../application/dto/store-product/get-store-product-by-id.dto.ts";
import type { GetStoreProductRequestDto, GetStoreProductResponseDto } from "../../application/dto/store-product/get-store-product.dto.ts";
import type { UpdateStoreProductRequestDto, UpdateStoreProductResponseDto } from "../../application/dto/store-product/update-store-product.dto.ts";
import type { CreateStoreRequestDto, CreateStoreResponseDto } from "../../application/dto/store/create-store.dto.ts";
import type { DestroyStoreRequestDto } from "../../application/dto/store/destroy-store.dto.ts";
import type { GetStoreByIdResponseDto } from "../../application/dto/store/get-store-by-id.dto.ts";
import type { GetStoreRequestDto, GetStoreResponseDto } from "../../application/dto/store/get-store.dto.ts";
import type { UpdateStoreRequestDto, UpdateStoreResponseDto } from "../../application/dto/store/update-store.dto.ts";
import type { CreateUserRequestDto, CreateUserResponseDto } from "../../application/dto/user/create-user.dto.ts";
import type { DestroyUserRequestDto } from "../../application/dto/user/destroy-user.dto.ts";
import type { GetUserByIdResponseDto } from "../../application/dto/user/get-user-by-id.dto.ts";
import type { GetUserRequestDto, GetUserResponseDto } from "../../application/dto/user/get-user.dto.ts";
import type { UpdateUserRequestDto, UpdateUserResponseDto } from "../../application/dto/user/update-user.dto.ts";
import { SessionTokenFactory } from "../../application/factories/session-token.factory.ts";
import type { IJwtService } from "../../application/interfaces/security/jwt.interface.ts";
import type { IPasswordHasherService } from "../../application/interfaces/security/password-hasher.interface.ts";
import type { ISessionToken } from "../../application/interfaces/security/session-token.factory.interface.ts";
import type { ITokenHasherService } from "../../application/interfaces/security/token-hasher.interface.ts";
import type { IUnitOfWork } from "../../application/interfaces/unit-of-work.interface.ts";
import type { IUseCase } from "../../application/interfaces/use-case.interface.ts";
import { AuthenticateUseCase } from "../../application/use-cases/auth/authenticate.use-case.ts";
import { AuthorizeUseCase } from "../../application/use-cases/auth/authorize.use-case.ts";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case.ts";
import { LogoutUseCase } from "../../application/use-cases/auth/logout.use-case.ts";
import { MeUseCase } from "../../application/use-cases/auth/me.use-case.ts";
import { RefreshUseCase } from "../../application/use-cases/auth/refresh.use-case.ts";
import { CreatePermissionUseCase } from "../../application/use-cases/permission/create-permission.use-case.ts";
import { DestroyPermissionUseCase } from "../../application/use-cases/permission/destroy-permission.use-case.ts";
import { GetPermissionByIdUseCase } from "../../application/use-cases/permission/get-permission-by-id.use-case.ts";
import { GetPermissionUseCase } from "../../application/use-cases/permission/get-permission.use-case.ts";
import { UpdatePermissionUseCase } from "../../application/use-cases/permission/update-permission.use-case.ts";
import { CreateProductUseCase } from "../../application/use-cases/product/create-product.use-case.ts";
import { DestroyProductUseCase } from "../../application/use-cases/product/destroy-product.use-case.ts";
import { GetProductByIdUseCase } from "../../application/use-cases/product/get-product-by-id.use-case.ts";
import { GetProductUseCase } from "../../application/use-cases/product/get-product.use-case.ts";
import { UpdateProductUseCase } from "../../application/use-cases/product/update-product.use-case.ts";
import { CreateRolePermissionUseCase } from "../../application/use-cases/role-permission/create-role-permission.use-case.ts";
import { DestroyRolePermissionUseCase } from "../../application/use-cases/role-permission/destroy-role-permission.use-case.ts";
import { GetRolePermissionByIdUseCase } from "../../application/use-cases/role-permission/get-role-permission-by-id.use-case.ts";
import { GetRolePermissionUseCase } from "../../application/use-cases/role-permission/get-role-permission.use-case.ts";
import { UpdateRolePermissionUseCase } from "../../application/use-cases/role-permission/update-role-permission.use-case.ts";
import { CreateRoleUseCase } from "../../application/use-cases/role/create-role.use-case.ts";
import { DestroyRoleUseCase } from "../../application/use-cases/role/destroy-role.use-case.ts";
import { GetRoleByIdUseCase } from "../../application/use-cases/role/get-role-by-id.use-case.ts";
import { GetRoleUseCase } from "../../application/use-cases/role/get-role.use-case.ts";
import { UpdateRoleUseCase } from "../../application/use-cases/role/update-role.use-case.ts";
import { CreateStockOpnameShiftUseCase } from "../../application/use-cases/stock-opname-shift/create-stock-opname-shift.use-case.ts";
import { DestroyStockOpnameShiftUseCase } from "../../application/use-cases/stock-opname-shift/destroy-stock-opname-shift.use-case.ts";
import { GetStockOpnameShiftByIdUseCase } from "../../application/use-cases/stock-opname-shift/get-stock-opname-shift-by-id.use-case.ts";
import { GetStockOpnameShiftUseCase } from "../../application/use-cases/stock-opname-shift/get-stock-opname-shift.use-case.ts";
import { UpdateStockOpnameShiftUseCase } from "../../application/use-cases/stock-opname-shift/update-stock-opname-shift.use-case.ts";
import { ApprovalStockOpnameUseCase } from "../../application/use-cases/stock-opname/approval-stock-opname.use-case.ts";
import { CreateStockOpnameUseCase } from "../../application/use-cases/stock-opname/create-stock-opname.use-case.ts";
import { DestroyStockOpnameUseCase } from "../../application/use-cases/stock-opname/destroy-stock-opname.use-case.ts";
import { GetStockOpnameByIdUseCase } from "../../application/use-cases/stock-opname/get-stock-opname-by-id.use-case.ts";
import { GetStockOpnameUseCase } from "../../application/use-cases/stock-opname/get-stock-opname.use-case.ts";
import { UpdateStockOpnameUseCase } from "../../application/use-cases/stock-opname/update-stock-opname.use-case.ts";
import { CreateStoreProductUseCase } from "../../application/use-cases/store-product/create-store-product.use-case.ts";
import { DestroyStoreProductUseCase } from "../../application/use-cases/store-product/destroy-store-product.use-case.ts";
import { GetStoreProductByIdUseCase } from "../../application/use-cases/store-product/get-store-product-by-id.use-case.ts";
import { GetStoreProductUseCase } from "../../application/use-cases/store-product/get-store-product.use-case.ts";
import { UpdateStoreProductUseCase } from "../../application/use-cases/store-product/update-store-product.use-case.ts";
import { CreateStoreUseCase } from "../../application/use-cases/store/create-store.use-case.ts";
import { DestroyStoreUseCase } from "../../application/use-cases/store/destroy-store.use-case.ts";
import { GetStoreByIdUseCase } from "../../application/use-cases/store/get-store-by-id.use-case.ts";
import { GetStoreUseCase } from "../../application/use-cases/store/get-store.use-case.ts";
import { UpdateStoreUseCase } from "../../application/use-cases/store/update-store.use-case.ts";
import { CreateUserUseCase } from "../../application/use-cases/user/create-user.use-case.ts";
import { DestroyUserUseCase } from "../../application/use-cases/user/destroy-user.use-case.ts";
import { GetUserByIdUseCase } from "../../application/use-cases/user/get-user-by-id.use-case.ts";
import { GetUserUseCase } from "../../application/use-cases/user/get-user.use-case.ts";
import { UpdateUserUseCase } from "../../application/use-cases/user/update-user.use-case.ts";
import type { IPermissionRepository } from "../../domain/repositories/permission.repository.ts";
import type { IProductRepository } from "../../domain/repositories/product.repository.ts";
import type { IRolePermissionRepository } from "../../domain/repositories/role-permission.repository.ts";
import type { IRoleRepository } from "../../domain/repositories/role.repository.ts";
import type { IStockOpnameItemRepository } from "../../domain/repositories/stock-opname-item.repository.ts";
import type { IStockOpnameShiftRepository } from "../../domain/repositories/stock-opname-shift.repository.ts";
import type { IStockOpnameRepository } from "../../domain/repositories/stock-opname.repository.ts";
import type { IStoreProductRepository } from "../../domain/repositories/store-product.repository.ts";
import type { IStoreRepository } from "../../domain/repositories/store.repository.ts";
import type { IUserRoleRepository } from "../../domain/repositories/user-role.repository.ts";
import type { IUserSessionRepository } from "../../domain/repositories/user-session.repository.ts";
import type { IUserStoreRepository } from "../../domain/repositories/user-store.repository.ts";
import type { IUserRepository } from "../../domain/repositories/user.repository.ts";
import { InjectionToken } from "../../shared/constants/injection-token.ts";
import { database } from "../database/connection.ts";
import type { DbExecutor } from "../database/db-executor.type.ts";
import { PermissionRepository } from "../database/repositories/permission.repository.ts";
import { ProductRepository } from "../database/repositories/product.repository.ts";
import { RolePermissionRepository } from "../database/repositories/role-permission.repository.ts";
import { RoleRepository } from "../database/repositories/role.repository.ts";
import { StockOpnameItemRepository } from "../database/repositories/stock-opname-item.repository.ts";
import { StockOpnameShiftRepository } from "../database/repositories/stock-opname-shift.repository.ts";
import { StockOpnameRepository } from "../database/repositories/stock-opname.repository.ts";
import { StoreProductRepository } from "../database/repositories/store-product.repository.ts";
import { StoreRepository } from "../database/repositories/store.repository.ts";
import { UserRoleRepository } from "../database/repositories/user-role.repository.ts";
import { UserSessionRepository } from "../database/repositories/user-session.repository.ts";
import { UserStoreRepository } from "../database/repositories/user-store.repository.ts";
import { UserRepository } from "../database/repositories/user.repository.ts";
import { DrizzleUnitOfWork } from "../database/unit-of-work/drizzle-unit-of-work.ts";
import { JwtService } from "../security/jwt.service.ts";
import { PasswordHasherService } from "../security/password-hasher.service.ts";
import { TokenHasherService } from "../security/token-hasher.service.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

container.register<DbExecutor>(InjectionToken.DB_EXECUTOR, { useValue: database });
// use-case
// auth
container.registerSingleton<IUseCase<LoginRequestDto, LoginResponseDto>>(InjectionToken.AUTH_LOGIN_USECASE, LoginUseCase);
container.registerSingleton<IUseCase<AuthenticateRequestDto, AuthenticateResponseDto>>(InjectionToken.AUTH_AUTHENTICATE_USECASE, AuthenticateUseCase);
container.registerSingleton<IUseCase<AuthorizeRequestDto, boolean>>(InjectionToken.AUTH_AUTHORIZE_USECASE, AuthorizeUseCase);
container.registerSingleton<IUseCase<number, MeResponseDto>>(InjectionToken.AUTH_ME_USECASE, MeUseCase);
container.registerSingleton<IUseCase<number, LogoutResponseDto>>(InjectionToken.AUTH_LOGOUT_USECASE, LogoutUseCase);
container.registerSingleton<IUseCase<RefreshRequestDto, RefreshResponseDto>>(InjectionToken.AUTH_REFRESH_USECASE, RefreshUseCase);
// product
container.registerSingleton<IUseCase<GetProductRequestDto, GetProductResponseDto>>(InjectionToken.PRODUCT_GET_USECASE, GetProductUseCase);
container.registerSingleton<IUseCase<number, GetProductByIdResponseDto>>(InjectionToken.PRODUCT_GET_BY_ID_USECASE, GetProductByIdUseCase);
container.registerSingleton<IUseCase<CreateProductRequestDto, CreateProductResponseDto>>(InjectionToken.PRODUCT_CREATE_USECASE, CreateProductUseCase);
container.registerSingleton<IUseCase<UpdateProductRequestDto, UpdateProductResponseDto>>(InjectionToken.PRODUCT_UPDATE_USECASE, UpdateProductUseCase);
container.registerSingleton<IUseCase<number, DestroyProductRequestDto>>(InjectionToken.PRODUCT_DESTROY_USECASE, DestroyProductUseCase);
// role permission

container.registerSingleton<IUseCase<GetRolePermissionRequestDto, GetRolePermissionResponseDto>>(
  InjectionToken.ROLE_PERMISSION_GET_USECASE,
  GetRolePermissionUseCase,
);
container.registerSingleton<IUseCase<GetRolePermissionByIdRequestDto, GetRolePermissionByIdResponseDto>>(
  InjectionToken.ROLE_PERMISSION_GET_BY_ID_USECASE,
  GetRolePermissionByIdUseCase,
);
container.registerSingleton<IUseCase<CreateRolePermissionRequestDto, CreateRolePermissionResponseDto>>(
  InjectionToken.ROLE_PERMISSION_CREATE_USECASE,
  CreateRolePermissionUseCase,
);
container.registerSingleton<IUseCase<UpdateRolePermissionRequestDto, UpdateRolePermissionResponseDto>>(
  InjectionToken.ROLE_PERMISSION_UPDATE_USECASE,
  UpdateRolePermissionUseCase,
);
container.registerSingleton<IUseCase<DestroyRolePermissionRequestDto, DestroyRolePermissionResponseDto>>(
  InjectionToken.ROLE_PERMISSION_DESTROY_USECASE,
  DestroyRolePermissionUseCase,
);
// permission
container.registerSingleton<IUseCase<GetPermissionRequestDto, GetPermissionResponseDto>>(InjectionToken.PERMISSION_GET_USECASE, GetPermissionUseCase);
container.registerSingleton<IUseCase<number, GetPermissionByIdResponseDto>>(InjectionToken.PERMISSION_GET_BY_ID_USECASE, GetPermissionByIdUseCase);
container.registerSingleton<IUseCase<CreatePermissionRequestDto, CreatePermissionResponseDto>>(
  InjectionToken.PERMISSION_CREATE_USECASE,
  CreatePermissionUseCase,
);
container.registerSingleton<IUseCase<UpdatePermissionRequestDto, UpdatePermissionResponseDto>>(
  InjectionToken.PERMISSION_UPDATE_USECASE,
  UpdatePermissionUseCase,
);
container.registerSingleton<IUseCase<number, DestroyPermissionRequestDto>>(InjectionToken.PERMISSION_DESTROY_USECASE, DestroyPermissionUseCase);
// role
container.registerSingleton<IUseCase<GetRoleRequestDto, GetRoleResponseDto>>(InjectionToken.ROLE_GET_USECASE, GetRoleUseCase);
container.registerSingleton<IUseCase<number, GetRoleByIdResponseDto>>(InjectionToken.ROLE_GET_BY_ID_USECASE, GetRoleByIdUseCase);
container.registerSingleton<IUseCase<CreateRoleRequestDto, CreateRoleResponseDto>>(InjectionToken.ROLE_CREATE_USECASE, CreateRoleUseCase);
container.registerSingleton<IUseCase<UpdateRoleRequestDto, UpdateRoleResponseDto>>(InjectionToken.ROLE_UPDATE_USECASE, UpdateRoleUseCase);
container.registerSingleton<IUseCase<number, DestroyRoleRequestDto>>(InjectionToken.ROLE_DESTROY_USECASE, DestroyRoleUseCase);
// store
container.registerSingleton<IUseCase<GetStoreRequestDto, GetStoreResponseDto>>(InjectionToken.STORE_GET_USECASE, GetStoreUseCase);
container.registerSingleton<IUseCase<number, GetStoreByIdResponseDto>>(InjectionToken.STORE_GET_BY_ID_USECASE, GetStoreByIdUseCase);
container.registerSingleton<IUseCase<CreateStoreRequestDto, CreateStoreResponseDto>>(InjectionToken.STORE_CREATE_USECASE, CreateStoreUseCase);
container.registerSingleton<IUseCase<UpdateStoreRequestDto, UpdateStoreResponseDto>>(InjectionToken.STORE_UPDATE_USECASE, UpdateStoreUseCase);
container.registerSingleton<IUseCase<number, DestroyStoreRequestDto>>(InjectionToken.STORE_DESTROY_USECASE, DestroyStoreUseCase);
// store product
container.registerSingleton<IUseCase<GetStoreProductRequestDto, GetStoreProductResponseDto>>(
  InjectionToken.STORE_PRODUCT_GET_USECASE,
  GetStoreProductUseCase,
);
container.registerSingleton<IUseCase<number, GetStoreProductByIdResponseDto>>(
  InjectionToken.STORE_PRODUCT_GET_BY_ID_USECASE,
  GetStoreProductByIdUseCase,
);
container.registerSingleton<IUseCase<CreateStoreProductRequestDto, CreateStoreProductResponseDto>>(
  InjectionToken.STORE_PRODUCT_CREATE_USECASE,
  CreateStoreProductUseCase,
);
container.registerSingleton<IUseCase<UpdateStoreProductRequestDto, UpdateStoreProductResponseDto>>(
  InjectionToken.STORE_PRODUCT_UPDATE_USECASE,
  UpdateStoreProductUseCase,
);
container.registerSingleton<IUseCase<number, DestroyStoreProductRequestDto>>(
  InjectionToken.STORE_PRODUCT_DESTROY_USECASE,
  DestroyStoreProductUseCase,
);
// user
container.registerSingleton<IUseCase<GetUserRequestDto, GetUserResponseDto>>(InjectionToken.USER_GET_USECASE, GetUserUseCase);
container.registerSingleton<IUseCase<number, GetUserByIdResponseDto>>(InjectionToken.USER_GET_BY_ID_USECASE, GetUserByIdUseCase);
container.registerSingleton<IUseCase<CreateUserRequestDto, CreateUserResponseDto>>(InjectionToken.USER_CREATE_USECASE, CreateUserUseCase);
container.registerSingleton<IUseCase<UpdateUserRequestDto, UpdateUserResponseDto>>(InjectionToken.USER_UPDATE_USECASE, UpdateUserUseCase);
container.registerSingleton<IUseCase<number, DestroyUserRequestDto>>(InjectionToken.USER_DESTROY_USECASE, DestroyUserUseCase);
// stock opname shift
container.registerSingleton<IUseCase<GetStockOpnameShiftRequestDto, GetStockOpnameShiftResponseDto>>(
  InjectionToken.STOCK_OPNAME_SHIFT_GET_USECASE,
  GetStockOpnameShiftUseCase,
);
container.registerSingleton<IUseCase<number, GetStockOpnameShiftByIdResponseDto>>(
  InjectionToken.STOCK_OPNAME_SHIFT_GET_BY_ID_USECASE,
  GetStockOpnameShiftByIdUseCase,
);
container.registerSingleton<IUseCase<CreateStockOpnameShiftRequestDto, CreateStockOpnameShiftResponseDto>>(
  InjectionToken.STOCK_OPNAME_SHIFT_CREATE_USECASE,
  CreateStockOpnameShiftUseCase,
);
container.registerSingleton<IUseCase<UpdateStockOpnameShiftRequestDto, UpdateStockOpnameShiftResponseDto>>(
  InjectionToken.STOCK_OPNAME_SHIFT_UPDATE_USECASE,
  UpdateStockOpnameShiftUseCase,
);
container.registerSingleton<IUseCase<number, DestroyStockOpnameShiftRequestDto>>(
  InjectionToken.STOCK_OPNAME_SHIFT_DESTROY_USECASE,
  DestroyStockOpnameShiftUseCase,
);

// stock opname
container.registerSingleton<IUseCase<GetStockOpnameRequestDto, GetStockOpnameResponseDto>>(
  InjectionToken.STOCK_OPNAME_GET_USECASE,
  GetStockOpnameUseCase,
);
container.registerSingleton<IUseCase<number, GetStockOpnameByIdResponseDto>>(
  InjectionToken.STOCK_OPNAME_GET_BY_ID_USECASE,
  GetStockOpnameByIdUseCase,
);
container.registerSingleton<IUseCase<CreateStockOpnameRequestDto, CreateStockOpnameResponseDto>>(
  InjectionToken.STOCK_OPNAME_CREATE_USECASE,
  CreateStockOpnameUseCase,
);
container.registerSingleton<IUseCase<UpdateStockOpnameRequestDto, UpdateStockOpnameResponseDto>>(
  InjectionToken.STOCK_OPNAME_UPDATE_USECASE,
  UpdateStockOpnameUseCase,
);
container.registerSingleton<IUseCase<number, DestroyStockOpnameRequestDto>>(InjectionToken.STOCK_OPNAME_DESTROY_USECASE, DestroyStockOpnameUseCase);
container.registerSingleton<IUseCase<ApprovalStockOpnameRequestDto, ApprovalStockOpnameResponseDto>>(
  InjectionToken.STOCK_OPNAME_APPROVAL_USECASE,
  ApprovalStockOpnameUseCase,
);

// repository
container.registerSingleton<IUserRepository>(InjectionToken.USER_REPOSITORY, UserRepository);
container.registerSingleton<IUserSessionRepository>(InjectionToken.USER_SESSION_REPOSITORY, UserSessionRepository);
container.registerSingleton<IUserRoleRepository>(InjectionToken.USER_ROLE_REPOSITORY, UserRoleRepository);
container.registerSingleton<IUserStoreRepository>(InjectionToken.USER_STORE_REPOSITORY, UserStoreRepository);
container.registerSingleton<IRoleRepository>(InjectionToken.ROLE_REPOSITORY, RoleRepository);
container.registerSingleton<IRolePermissionRepository>(InjectionToken.ROLE_PERMISSION_REPOSITORY, RolePermissionRepository);
container.registerSingleton<IPermissionRepository>(InjectionToken.PERMISSION_REPOSITORY, PermissionRepository);
container.registerSingleton<IProductRepository>(InjectionToken.PRODUCT_REPOSITORY, ProductRepository);
container.registerSingleton<IStoreRepository>(InjectionToken.STORE_REPOSITORY, StoreRepository);
container.registerSingleton<IStoreProductRepository>(InjectionToken.STORE_PRODUCT_REPOSITORY, StoreProductRepository);
container.registerSingleton<IStockOpnameShiftRepository>(InjectionToken.STOCK_OPNAME_SHIFT_REPOSITORY, StockOpnameShiftRepository);
container.registerSingleton<IStockOpnameRepository>(InjectionToken.STOCK_OPNAME_REPOSITORY, StockOpnameRepository);
container.registerSingleton<IStockOpnameItemRepository>(InjectionToken.STOCK_OPNAME_ITEM_REPOSITORY, StockOpnameItemRepository);
// service
container.registerSingleton<IPasswordHasherService>(InjectionToken.PASSWORD_HASHER_SERVICE, PasswordHasherService);
container.registerSingleton<ITokenHasherService>(InjectionToken.TOKEN_HASHER, TokenHasherService);
container.registerSingleton<IJwtService>(InjectionToken.JWT_SERVICE, JwtService);
// factory
container.registerSingleton<ISessionToken>(InjectionToken.SESSION_TOKEN_FACTORY, SessionTokenFactory);
// database
container.registerSingleton<IUnitOfWork>(InjectionToken.UNIT_OF_WORK, DrizzleUnitOfWork);

export { container };
