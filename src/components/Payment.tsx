
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

interface Payment {
  id: string;
  userId: string;
  paymentAmount: string;
  paymentMethod: string;
  paymentReference: string;
  paymentSlipUrl: string | null;
  paymentSlipFilename: string | null;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  paymentDate: string;
  paymentMonth: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

const Payment = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');

  const { data: paymentData, isLoading, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: async (): Promise<PaymentResponse> => {
      const response = await apiClient.get('/payment/my-payments');
      return response;
    },
    enabled: false // Don't auto-fetch, only when button is clicked
  });

  const handleLoadPayments = () => {
    refetch();
  };

  const getFilteredPayments = (status: string) => {
    if (!paymentData?.payments) return [];
    return paymentData.payments.filter(payment => payment.status === status);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'default',
      VERIFIED: 'default',
      REJECTED: 'destructive'
    } as const;

    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (!user) {
    return <div>Please log in to view payments</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Manage your payment history and status</p>
        </div>
        <Button onClick={handleLoadPayments} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load Payments'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="PENDING">
            Pending ({getFilteredPayments('PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="VERIFIED">
            Verified ({getFilteredPayments('VERIFIED').length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejected ({getFilteredPayments('REJECTED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="PENDING">
          <PaymentList 
            payments={getFilteredPayments('PENDING')} 
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            formatAmount={formatAmount}
          />
        </TabsContent>

        <TabsContent value="VERIFIED">
          <PaymentList 
            payments={getFilteredPayments('VERIFIED')} 
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            formatAmount={formatAmount}
          />
        </TabsContent>

        <TabsContent value="REJECTED">
          <PaymentList 
            payments={getFilteredPayments('REJECTED')} 
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            formatAmount={formatAmount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PaymentListProps {
  payments: Payment[];
  getStatusBadge: (status: string) => React.ReactElement;
  formatDate: (date: string) => string;
  formatAmount: (amount: string) => string;
}

const PaymentList: React.FC<PaymentListProps> = ({ 
  payments, 
  getStatusBadge, 
  formatDate, 
  formatAmount 
}) => {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No payments found for this status</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Payment #{payment.id}
              </CardTitle>
              {getStatusBadge(payment.status)}
            </div>
            <CardDescription>
              {payment.paymentMonth} • {formatDate(payment.paymentDate)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-2xl font-bold">{formatAmount(payment.paymentAmount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm">{payment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Reference</p>
                <p className="text-sm">{payment.paymentReference}</p>
              </div>
              {payment.rejectionReason && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm font-medium text-red-600">Rejection Reason</p>
                  <p className="text-sm text-red-600">{payment.rejectionReason}</p>
                </div>
              )}
              {payment.notes && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm">{payment.notes}</p>
                </div>
              )}
              {payment.paymentSlipUrl && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm font-medium">Payment Slip</p>
                  <a 
                    href={payment.paymentSlipUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    View Payment Slip
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Payment;
