'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge, SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/data-table';
import { Link } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { usePayments } from '@/hooks/resources/payment';
import type { PaymentRecord } from '@/lib/type';

function getColumns(t: (key: string) => string): ColumnDef<PaymentRecord>[] {
  return [
    {
      accessorKey: 'title',
      header: t('payment.description'),
      cell: ({ row }) => <span>{row.original.title || t('payment.no_title')}</span>,
    },
    {
      accessorKey: 'student',
      header: t('payment.student'),
      cell: ({ row }) => <span>{row.original.student?.name || '-'}</span>,
    },
    {
      accessorKey: 'amount',
      header: t('payment.amount'),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.amount ? `${row.original.amount} ${row.original.currency}` : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'paymentType',
      header: t('payment.payment_type'),
      cell: ({ row }) => (
        <Badge color="primary" className="capitalize">
          {row.original.paymentType ? t(`payment.${row.original.paymentType.toLowerCase()}`) : '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'startDate',
      header: t('payment.start_date'),
      cell: ({ row }) => (
        <span>
          {row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'endDate',
      header: t('payment.end_date'),
      cell: ({ row }) => (
        <span>
          {row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/students/${row.original.student?.documentId}`}>
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

export function PaymentDataTable() {
  const t = useTranslations();
  const { data, isLoading } = usePayments();

  return <DataTable columns={getColumns(t)} data={data} isLoading={isLoading} title={t('payment.list_title')} />;
}
