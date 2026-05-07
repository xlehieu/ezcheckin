export type APIResponse<T = any> = {
  message: string;
  statusCode: number;
  data: T;
};
export type APIPaginationResponse<T = any> = APIResponse & {
  data: T[];
  meta: {
    total: number;
    current: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
