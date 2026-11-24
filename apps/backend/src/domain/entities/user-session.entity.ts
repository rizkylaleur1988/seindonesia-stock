/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export type UserSession = {
  id: number;
  user_id: number;
  access_token_hash: string;
  refresh_token_hash: string;
  access_token_expires_at: Date;
  refresh_token_expires_at: Date;
};
