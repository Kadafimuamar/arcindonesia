import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/utils/constants";

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export function normalizePagination(
  page: number | string | null | undefined,
  pageSize: number | string | null | undefined,
): PaginationParams {
  const parsedPage = Number(page ?? 1);
  const parsedPageSize = Number(pageSize ?? DEFAULT_PAGE_SIZE);

  return {
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1,
    pageSize:
      Number.isFinite(parsedPageSize) && parsedPageSize > 0
        ? Math.min(Math.floor(parsedPageSize), MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE,
  };
}
