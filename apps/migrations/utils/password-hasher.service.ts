import argon2 from "argon2";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class PasswordHasherService {
  /**
   * Description placeholder
   *
   * @async
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} hash
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  async verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
