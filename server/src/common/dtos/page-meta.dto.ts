interface PageMetaParams {
  page: number;
  limit: number;
  total: number;
}

export class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPage: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;

  constructor({ page, limit, total }: PageMetaParams) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPage = Math.ceil(total / limit);
    this.hasNextPage = page < this.totalPage;
    this.hasPreviousPage = page > 1;
  }
}
