export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface PaginationOutput {
  count: number;
  offset: number;
  limit: number;
  prev?: number;
  next?: number;
}