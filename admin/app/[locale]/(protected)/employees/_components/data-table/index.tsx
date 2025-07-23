'use client';

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { DatabaseBackup, Loader2 } from 'lucide-react';
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
  const { query, setQuery } = useQueryState();
  const pageIndex = query?.pagination?.page - 1 || 0;
  const pageSize = query?.pagination?.pageSize || 20;

  const { data, isLoading } = useEmployeeQuery(query);

  const columns = React.useMemo(() => getColumns(t), [t]);

  const table = useReactTable({
    data: data?.results || [],
    columns,
    manualPagination: true,
    autoResetPageIndex: false,
    autoResetAll: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater: any) => {
      const nextState = updater({
        pageIndex: pageIndex,
        pageSize: pageSize,
      });

      setQuery({
        pagination: {
          page: nextState.pageIndex + 1,
          pageSize: nextState.pageSize,
        },
      });
    },
    pageCount: data?.pagination?.pageCount || -1,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-default-900">{t('employee.list_title')}</div>
        <div className="flex-none">
          <Input
            placeholder={t('common.search')}
            value={query?.search || ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery({
                search: event.target.value,
              })
            }
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
      <TablePagination table={table} />
    </div>
  );
};
export default ExampleOne;
