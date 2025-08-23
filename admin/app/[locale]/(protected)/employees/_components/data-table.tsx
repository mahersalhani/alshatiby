'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/data-table';
import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { useEmployees } from '@/hooks/resources/employee';
import type { Employee } from '@/lib/type';

function getColumns(t: (key: string) => string): ColumnDef<Employee>[] {
  return [
    {
      accessorKey: 'fullName',
      header: t('common.full_name'),
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'role',
      header: t('common.role'),
      cell: ({ row }) => <span>{t(`Form.${(row.getValue('role') as string)?.toLowerCase()}`)}</span>,
    },
    {
      accessorKey: 'phoneNumber',
      header: t('common.phone_number'),
      cell: ({ row }) => <span>{row.getValue('phoneNumber') || '-'}</span>,
    },
    {
      accessorKey: 'email',
      header: t('common.email'),
      cell: ({ row }) => <span className="text-sm lowercase">{row.original?.email || '-'}</span>,
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/employees/${row.original.documentId}`}>
              <Button variant="ghost" size="icon">
                <SquarePen className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
}


export function EmployeesDataTable() {
  const t = useTranslations();
  const { data, isLoading } = useEmployees();

  return <DataTable columns={getColumns(t)} data={data} isLoading={isLoading} />;
}
