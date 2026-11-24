import { createHash } from "node:crypto";
import type { ITokenHasherService } from "../../application/interfaces/security/token-hasher.interface.ts";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class TokenHasherService implements ITokenHasherService {
  hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
