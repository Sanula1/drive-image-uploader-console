
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/api/client';
import { useApiRequest } from '@/hooks/useApiRequest';

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');

  const { execute: fetchPayments, loading } = useApiRequest(
    async () => {
      const response = await apiClient.get<PaymentResponse>('/payment/my-payments');
      return response;
    }
  );

  const handleLoadPayments = async () => {
    try {
      const data = await fetchPayments();
      setPayments(data.payments || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => payment.status === activeTab);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredPayments = getFilteredPayments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Payments</h1>
        <Button onClick={handleLoadPayments} disabled={loading}>
          {loading ? 'Loading...' : 'Load Payments'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'PENDING' | 'VERIFIED' | 'REJECTED')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="PENDING">
            Pending ({payments.filter(p => p.status === 'PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="VERIFIED">
            Verified ({payments.filter(p => p.status === 'VERIFIED').length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejected ({payments.filter(p => p.status === 'REJECTED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="PENDING" className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                No pending payments found
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Payment #{payment.id}
                    </CardTitle>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="font-semibold">${payment.paymentAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                      <p className="font-semibold">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                      <p className="font-semibold">{formatDate(payment.paymentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Month</p>
                      <p className="font-semibold">{payment.paymentMonth}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reference</p>
                      <p className="font-semibold">{payment.paymentReference}</p>
                    </div>
                    {payment.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                        <p className="text-sm">{payment.notes}</p>
                      </div>
                    )}
                    {payment.paymentSlipUrl && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment Slip</p>
                        <a 
                          href={payment.paymentSlipUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                        >
                          {payment.paymentSlipFilename || 'View Payment Slip'}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="VERIFIED" className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                No verified payments found
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Payment #{payment.id}
                    </CardTitle>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="font-semibold">${payment.paymentAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                      <p className="font-semibold">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                      <p className="font-semibold">{formatDate(payment.paymentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Verified Date</p>
                      <p className="font-semibold">{payment.verifiedAt ? formatDate(payment.verifiedAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Month</p>
                      <p className="font-semibold">{payment.paymentMonth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reference</p>
                      <p className="font-semibold">{payment.paymentReference}</p>
                    </div>
                    {payment.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                        <p className="text-sm">{payment.notes}</p>
                      </div>
                    )}
                    {payment.paymentSlipUrl && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Payment Slip</p>
                        <a 
                          href={payment.paymentSlipUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                        >
                          {payment.paymentSlipFilename || 'View Payment Slip'}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="REJECTED" className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500 dark:text-gray-400">
                No rejected payments found
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Payment #{payment.id}
                    </CardTitle>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                      <p className="font-semibold">${payment.paymentAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                      <p className="font-semibold">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                      <p className="font-semibold">{formatDate(payment.paymentDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rejected Date</p>
                      <p className="font-semibold">{payment.verifiedAt ? formatDate(payment.verifiedAt) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment Month</p>
                      <p className="font-semibold">{payment.paymentMonth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reference</p>
                      <p className="font-semibold">{payment.paymentReference}</p>
                    </div>
                    {payment.rejectionReason && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-red-600 dark:text-red-400">Rejection Reason</p>
                        <p className="text-sm text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                          {payment.rejectionReason}
                        </p>
                      </div>
                    )}
                    {payment.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                        <p className="text-sm">{payment.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
