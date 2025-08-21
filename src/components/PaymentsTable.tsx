
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Payment, PaymentStatus } from '@/api/payments.api';
import { format } from 'date-fns';
import { FileText, Calendar, CreditCard } from 'lucide-react';

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  status: PaymentStatus;
}

export const PaymentsTable = ({ payments, isLoading, status }: PaymentsTableProps) => {
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'VERIFIED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>;
      case 'REJECTED':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'ONLINE_PAYMENT':
        return 'Online Payment';
      case 'CASH_DEPOSIT':
        return 'Cash Deposit';
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <FileText className="h-full w-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No {status.toLowerCase()} payments
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {status === 'PENDING' && "No payments are currently pending review."}
          {status === 'VERIFIED' && "No payments have been verified yet."}
          {status === 'REJECTED' && "No payments have been rejected."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-lg">
                    ${payment.paymentAmount.toFixed(2)}
                  </span>
                  <span className="text-gray-500">
                    via {getPaymentMethodLabel(payment.paymentMethod)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Payment Date: {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</span>
                  </div>
                  <div>
                    Payment Month: {payment.paymentMonth}
                  </div>
                </div>

                {payment.paymentReference && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Reference: {payment.paymentReference}
                  </div>
                )}

                {payment.notes && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Notes: {payment.notes}
                  </div>
                )}

                {payment.uploadedFile && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <FileText className="h-3 w-3" />
                    <span>Attachment: {payment.uploadedFile}</span>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Submitted: {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>

              <div className="ml-4">
                {getStatusBadge(payment.status)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
