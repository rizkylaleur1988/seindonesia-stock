import compression from "compression";
import type { Request, Response } from "express";

/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class CompressionUtil {
  static customCompressionFilter(req: Request, res: Response): boolean {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  }
}
