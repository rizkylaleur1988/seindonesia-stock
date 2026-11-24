/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IPasswordHasherService {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}
