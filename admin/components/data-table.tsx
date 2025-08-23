'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, DatabaseBackup, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePaginationState, useSearchState } from '@/hooks/use-query-state';
import { PaginatedResponse } from '@/lib/type';

function SearchInput() {
  const t = useTranslations();
  const { searchText, setSearchText } = useSearchState();

  return (
    <div className="flex-none">
      <Input
        placeholder={t('common.search')}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}

function Pagination({ pageCount }: { pageCount: number }) {
  const { pageParams, setPage } = usePaginationState();

  const pageIndex = pageParams.page + 1;
  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < pageCount - 1;

  return (
    <div className="flex items-center justify-end py-4 px-10">
      <div className="flex items-center gap-2 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(pageIndex - 1)}
          disabled={!canGoPrev}
          className="w-8 h-8 rtl:rotate-180"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: pageCount }, (_, index) => (
          <Button
            key={`basic-data-table-${index}`}
            onClick={() => setPage(index)}
            size="icon"
            className="w-8 h-8"
            variant={pageIndex === index ? 'default' : 'outline'}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(pageIndex + 1)}
          disabled={!canGoNext}
          className="w-8 h-8 rtl:rotate-180"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function DataTable<TData, TValue>({
  columns,
  isLoading,
  data,
}: {
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  data?: PaginatedResponse<TData>;
}) {
  const t = useTranslations();

  const rows = useMemo(() => data?.results || [], [data]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-default-900">{t('employee.list_title')}</div>
        <SearchInput />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="my-10">
                  <Loader2 className="mx-auto h-16 w-16 text-muted-foreground animate-spin" />
                  <div className="mt-2 text-lg text-muted-foreground font-bold">{t('common.loading')}</div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="my-10">
                  <DatabaseBackup className="mx-auto h-16 w-16 text-muted-foreground" />
                  <div className="mt-2 text-lg text-muted-foreground font-bold">{t('common.no_results')}</div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination pageCount={data?.pagination.pageCount ?? 0} />
    </div>
  );
}
