'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge, SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/data-table';
import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { useStudents } from '@/hooks/resources/student';
import type { Student } from '@/lib/type';

function getColumns(t: (key: string) => string): ColumnDef<Student>[] {
  return [
    {
      accessorKey: 'fullName',
      header: t('common.full_name'),
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'gender',
      header: t('common.gender'),
      cell: ({ row }) => (
        <Badge
          color={row.original.gender ? row.original.gender.toLowerCase() === 'male' ? 'primary' : 'destructive' : 'destructive'}
          className="capitalize"
        >
          {row.original.gender ? t(`common.${row.original.gender.toLowerCase()}`) : '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: t('common.phone_number'),
      cell: ({ row }) => <span>{row.original.phoneNumber ?? '-'}</span>,
    },
    {
      accessorKey: 'email',
      header: t('common.email'),
      cell: ({ row }) => <span className="text-sm lowercase">{row.original.user?.email ?? '-'}</span>,
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/students/${row.original.documentId}`}>
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

export function StudentsDataTable() {
  const t = useTranslations();
  const { data, isLoading } = useStudents();

  return <DataTable columns={getColumns(t)} data={data} isLoading={isLoading} />;
}
