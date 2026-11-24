/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type MeResponseDto = {
  id: number;
  name: string;
  email: string;
  roles: { id: number; code: string; name: string }[];
  permissions: { id: number; code: string; name: string }[];
  stores: { id: number; code: string; name: string }[];
};
