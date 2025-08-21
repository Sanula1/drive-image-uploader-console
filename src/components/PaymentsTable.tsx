
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentResponse } from '@/api/payments.api';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

interface PaymentsTableProps {
  payments: PaymentResponse[];
  isLoading: boolean;
  status: string;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ 
  payments, 
  isLoading, 
  status 
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(amount);
  };

  const columns: ColumnDef<PaymentResponse>[] = [
    {
      accessorKey: 'paymentAmount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.paymentAmount),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.paymentMethod.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'paymentMonth',
      header: 'Payment Month',
      cell: ({ row }) => {
        const date = new Date(row.original.paymentMonth + '-01');
        return format(date, 'MMMM yyyy');
      },
    },
    {
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => {
        return format(new Date(row.original.paymentDate), 'dd MMM yyyy');
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'paymentReference',
      header: 'Reference',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.paymentReference || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Submitted',
      cell: ({ row }) => {
        return format(new Date(row.original.createdAt), 'dd MMM yyyy HH:mm');
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-8 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {status} payments found
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={payments}
    />
  );
};
