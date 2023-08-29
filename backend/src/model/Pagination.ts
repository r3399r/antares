export type PaginationParams = {
  limit: string;
  offset: string;
};

export type Pagination<T> = {
  paginate: {
    count: number;
    limit: number;
    offset: number;
  };
  data: T;
};
