'use client';

import { SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/data-table';
import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { useClassrooms } from '@/hooks/resources/classroom';

export function ClassroomsDataTable() {
  const t = useTranslations();
  const { data, isLoading } = useClassrooms();

  return (
    <DataTable
      columns={[
        {
          accessorKey: 'classroomName',
          header: t('common.classroom_name'),
          cell: ({ row }) => <span>{row.original.classroomName}</span>,
        },
        {
          accessorKey: 'teacher',
          header: t('common.teacher'),
          cell: ({ row }) => <span>{row.original.teacher?.name}</span>,
        },
        {
          accessorKey: 'studentCount',
          header: t('common.student_count'),
          cell: ({ row }) => <span>{row.original.studentCount}</span>,
        },
        {
          id: 'actions',
          header: t('common.actions'),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Link href={`/classrooms/${row.original.documentId}`}>
                <Button variant="ghost" size="icon">
                  <SquarePen className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ),
        },
      ]}
      data={data}
      isLoading={isLoading}
    />
  );
}

// function getColumns(t: (key: string) => string): ColumnDef<Classroom>[] {
//   return [
//     {
//       accessorKey: 'classroomName',
//       header: t('common.classroom_name'),
//       cell: ({ row }) => <span>{row.original.classroomName}</span>,
//     },
//     {
//       accessorKey: 'teacher',
//       header: t('common.teacher'),
//       cell: ({ row }) => <span>{row.original.teacher?.name}</span>,
//     },
//     {
//       accessorKey: 'studentCount',
//       header: t('common.student_count'),
//       cell: ({ row }) => <span>{row.original.studentCount}</span>,
//     },
//     {
//       id: 'actions',
//       header: t('common.actions'),
//       cell: ({ row }) => (
//         <div className="flex items-center gap-2">
//           <Link href={`/classroom/${row.original.documentId}`}>
//             <Button variant="ghost" size="icon">
//               <SquarePen className="h-4 w-4" />
//             </Button>
//           </Link>
//         </div>
//       ),
//     },
//   ];
// }

// export function EmployeesDataTable() {
//   const t = useTranslations();
//   const { data, isLoading } = useClassrooms();

// const columns = useMemo(
//   () =>
//     [
//       {
//         accessorKey: 'classroomName',
//         header: t('common.classroom_name'),
//         cell: ({ row }) => <span>{row.original.classroomName}</span>,
//       },
//       {
//         accessorKey: 'teacher',
//         header: t('common.teacher'),
//         cell: ({ row }) => <span>{row.original.teacher?.name}</span>,
//       },
//       {
//         accessorKey: 'studentCount',
//         header: t('common.student_count'),
//         cell: ({ row }) => <span>{row.original.studentCount}</span>,
//       },
//       {
//         id: 'actions',
//         header: t('common.actions'),
//         cell: ({ row }) => (
//           <div className="flex items-center gap-2">
//             <Link href={`/classroom/${row.original.documentId}`}>
//               <Button variant="ghost" size="icon">
//                 <SquarePen className="h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//         ),
//       },
//     ] as ColumnDef<Classroom>[],
//   [t]
// );

// return (
//   <DataTable
//     // columns={getColumns(t)}
//     columns={columns}
//     data={data}
//     isLoading={isLoading}
//   />
// );
// return <DataTable columns={columns} data={data} isLoading={isLoading} />;
// }
