import argon2 from "argon2";
import type { IPasswordHasherService } from "../../application/interfaces/security/password-hasher.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class PasswordHasherService implements IPasswordHasherService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
