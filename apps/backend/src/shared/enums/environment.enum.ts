/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export const EnvironmentEnum = {
  LOCAL: "local",
  PRODUCTION: "production",
};

export type EnvironmentEnum = (typeof EnvironmentEnum)[keyof typeof EnvironmentEnum];
