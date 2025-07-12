'use client';

import {
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { getColumns } from './columns';
import TablePagination from './table-pagination';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEmployeeQuery } from '@/hooks/react-query/employee';
import { useQueryState } from '@/hooks/use-query-state';

const ExampleOne = () => {
  const t = useTranslations();
  const { setQuery } = useQueryState({
    pagination: {
      page: 1,
      pageSize: 1,
    },
  });
  const { data, isLoading } = useEmployeeQuery();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const columns = React.useMemo(() => getColumns(t), []);

  const table = useReactTable({
    data: data?.results || [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const nextPagination = typeof updater === 'function' ? updater(data?.pagination) : updater;
      setQuery({
        pagination: {
          page: (nextPagination.pageIndex || 0) + 1,
          pageSize: nextPagination.pageSize,
        },
      });
    },
    pageCount: data?.pagination?.pageCount || -1,
    state: {
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: data?.pagination?.page - 1 || 0,
        pageSize: data?.pagination?.pageSize || 10,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-default-900">Order Records</div>
        <div className="flex-none">
          <Input
            placeholder="Filter Status..."
            // value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
            // onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            //   table.getColumn('status')?.setFilterValue(event.target.value)
            // }
            className="max-w-sm "
          />
        </div>
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
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination table={table} />
    </div>
  );
};
export default ExampleOne;
