'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';

import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { getFullName } from '@/lib/utils';

export const getColumns = (t: (key: string) => string): ColumnDef<any>[] => [
  {
    accessorKey: 'fullName',
    header: t('common.full_name'),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return <span>{getFullName(firstName, lastName)}</span>;
    },
  },
  {
    accessorKey: 'role',
    header: t('common.role'),
    cell: ({ row }) => <span>{t(`common.${(row.getValue('role') as string)?.toLowerCase()}`)}</span>,
  },
  {
    accessorKey: 'phoneNumber',
    header: t('common.phone_number'),
    cell: ({ row }) => <span>{row.getValue('phoneNumber') || '-'}</span>,
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
