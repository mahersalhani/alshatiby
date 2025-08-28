'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/data-table';
import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { usePrograms } from '@/hooks/resources/program';
import { Program } from '@/lib/type';

function getColumns(t: (key: string) => string): ColumnDef<Program>[] {
  return [
    {
      accessorKey: 'name',
      header: t('common.full_name'),
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/programs/${row.original.documentId}`}>
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


export function ProgramsDataTable() {
  const t = useTranslations();
  const { data, isLoading } = usePrograms();

  return <DataTable columns={getColumns(t)} data={data} isLoading={isLoading} />;
}
