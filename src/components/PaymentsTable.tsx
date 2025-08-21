
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentResponse } from '@/api/payments.api';
import DataTable from '@/components/ui/data-table';
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

  const columns = [
    {
      key: 'paymentAmount',
      header: 'Amount',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      render: (value: string) => (
        <Badge variant="outline">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'paymentMonth',
      header: 'Payment Month',
      render: (value: string) => {
        const date = new Date(value + '-01');
        return format(date, 'MMMM yyyy');
      },
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (value: string) => {
        return format(new Date(value), 'dd MMM yyyy');
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => (
        <Badge variant={getStatusBadgeVariant(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'paymentReference',
      header: 'Reference',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (value: string) => {
        return format(new Date(value), 'dd MMM yyyy HH:mm');
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
      title={`${status.charAt(0).toUpperCase() + status.slice(1)} Payments`}
      columns={columns}
      data={payments}
      allowAdd={false}
      allowEdit={false}
      allowDelete={false}
    />
  );
};
