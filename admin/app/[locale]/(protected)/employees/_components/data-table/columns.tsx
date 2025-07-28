'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';

import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';

export const getColumns = (t: (key: string) => string): ColumnDef<any>[] => [
  {
    accessorKey: 'fullName',
    header: t('common.full_name'),
    cell: ({ row }) => {
      const { name } = row.original;
      return <span>{name}</span>;
    },
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
    cell: ({ row }) => <span className="text-sm lowercase">{row.original?.user?.email || '-'}</span>,
  },
  {
    id: 'actions',
    header: t('common.actions'),
    cell: ({ row }) => {
      const { documentId } = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/employees/${documentId}`}>
            <Button variant="ghost" size="icon">
              <SquarePen className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
