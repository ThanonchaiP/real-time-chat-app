export type MenuKey = "users" | "chats";

export type Request = {
  page?: number;
  limit?: number;
  search?: string;
};

export type Response<T> = {
  data: T;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
