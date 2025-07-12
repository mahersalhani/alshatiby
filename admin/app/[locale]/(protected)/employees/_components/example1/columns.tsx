'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SquarePen, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getFullName } from '@/lib/utils';

//         {
//             "id": 9,
//             "documentId": "zb1qaxwlgrwwfdounyyv0dgk",
//             "firstName": "ماهر",
//             "createdAt": "2025-07-01T22:49:53.825Z",
//             "updatedAt": "2025-07-01T22:49:53.825Z",
//             "publishedAt": "2025-07-01T22:49:53.822Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "TEACHER",
//             "phoneNumber": ""
//         },

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
    cell: ({}) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <SquarePen className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
