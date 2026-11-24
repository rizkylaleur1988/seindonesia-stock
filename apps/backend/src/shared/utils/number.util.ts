/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class NumberUtil {
  static minutesToMilliseconds(minutes: number): number {
    if (typeof minutes !== "number" || Number.isNaN(minutes) || minutes < 0) {
      throw new Error("Invalid minutes value. It must be a positive number.");
    }
    return minutes * 60 * 1000;
  }
}
