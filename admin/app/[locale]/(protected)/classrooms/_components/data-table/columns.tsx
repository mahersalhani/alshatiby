'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SquarePen } from 'lucide-react';

import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';

export const getColumns = (t: (key: string) => string): ColumnDef<any>[] => [
  {
    accessorKey: 'classroomName',
    header: t('common.classroom_name'),
    cell: ({ row }) => {
      const { classroomName } = row.original;
      return <span>{classroomName}</span>;
    },
  },
  {
    accessorKey: 'teacher',
    header: t('common.teacher'),
    cell: ({ row }) => {
      const { teacher } = row.original;
      return <span>{teacher?.name}</span>;
    },
  },
  {
    accessorKey: 'studentCount',
    header: t('common.student_count'),
    cell: ({ row }) => {
      const { studentCount } = row.original;
      return <span>{studentCount}</span>;
    },
  },
  {
    id: 'actions',
    header: t('common.actions'),
    cell: ({ row }) => {
      const { documentId } = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/classroom/${documentId}`}>
            <Button variant="ghost" size="icon">
              <SquarePen className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
