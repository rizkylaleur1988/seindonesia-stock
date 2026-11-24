/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export class DateUtil {
  static unixToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }
}
