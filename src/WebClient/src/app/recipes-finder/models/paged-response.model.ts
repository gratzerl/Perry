export interface PagedResponse<T> {
  items: T[],
  totalCount: number,
  pageSize: number,
  currentPageNumber: number,
  totalPages: number,
  hasNext: boolean,
  hasPrevious: boolean
}
