/*
 * Author Mochamad Rizki <rizkylaleur1988@gmail.com>
 * Copyright (c) 2026
 */

export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
