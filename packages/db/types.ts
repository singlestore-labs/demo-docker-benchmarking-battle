export type Direction = "asc" | "desc";

export type Sort<T extends string> = [T, Direction][];

export type WithPagination<T extends object[]> = [T, { limit: number; offset: number; count: number }];
