export type APIResponse<T = any> = {
  message: string;
  statusCode: number;
  data: T;
};
