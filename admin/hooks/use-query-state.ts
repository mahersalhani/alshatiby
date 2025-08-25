import { useQueryState as _useQueryState, parseAsInteger, parseAsNumberLiteral, parseAsString } from 'nuqs';
import * as React from 'react';

const PAGE_SIZE_ITEMS = [10, 20, 50, 100];

export function usePaginationState() {
  const [page, setPage] = _useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true,
    })
  );

  const [pageSize, _setPageSize] = _useQueryState(
    'pageSize',
    parseAsNumberLiteral(PAGE_SIZE_ITEMS).withDefault(PAGE_SIZE_ITEMS[0]).withOptions({
      clearOnDefault: true,
    })
  );

  const resetPagination = React.useCallback(() => {
    setPage(1);
    _setPageSize(PAGE_SIZE_ITEMS[0]);
  }, [setPage, _setPageSize]);

  const setPageSize = React.useCallback(
    (size: number) => {
      _setPageSize(size);
      setPage(1);
    },
    [setPage, _setPageSize]
  );

  return {
    pageParams: {
      page,
      pageSize,
    },
    setPage,
    setPageSize,
    resetPagination,
  };
}

export function useSearchState() {
  const [searchText, setSearchText] = _useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({
      clearOnDefault: true,
      throttleMs: 500,
    })
  );

  return { searchText, setSearchText };
}
