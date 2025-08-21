
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Download, Calendar, DollarSign, FileText } from 'lucide-react';
import { paymentApi, type Payment, type PaymentResponse } from '@/api/payment.api';
import { useApiRequest } from '@/hooks/useApiRequest';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedTab, setSelectedTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [total, setTotal] = useState(0);

  const { execute: fetchPayments, loading } = useApiRequest(
    paymentApi.getMyPayments.bind(paymentApi),
    { showLoading: true }
  );

  const handleFetchPayments = async () => {
    try {
      const response = await fetchPayments({ status: selectedTab }) as PaymentResponse;
      setPayments(response.payments);
      setTotal(response.total);
      toast.success(`Loaded ${response.payments.length} ${selectedTab.toLowerCase()} payments`);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value as 'PENDING' | 'VERIFIED' | 'REJECTED');
    setPayments([]); // Clear previous data
  };

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      PENDING: 'default',
      VERIFIED: 'secondary',
      REJECTED: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status}
      </Badge>
    );
  };

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Payment #{payment.id}</CardTitle>
          {getStatusBadge(payment.status)}
        </div>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {format(new Date(payment.paymentDate), 'PPP')}
          <span className="mx-2">•</span>
          <span>Month: {payment.paymentMonth}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">Amount:</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            ${payment.paymentAmount}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Method:</span>
          <span>{payment.paymentMethod.replace('_', ' ')}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Reference:</span>
          <span className="font-mono text-sm">{payment.paymentReference}</span>
        </div>

        {payment.paymentSlipUrl && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Payment Slip:</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(payment.paymentSlipUrl!, '_blank')}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        )}

        {payment.verifiedBy && payment.verifiedAt && (
          <>
            <Separator />
            <div className="text-sm text-muted-foreground">
              <div>Verified by: User #{payment.verifiedBy}</div>
              <div>Verified at: {format(new Date(payment.verifiedAt), 'PPpp')}</div>
            </div>
          </>
        )}

        {payment.rejectionReason && (
          <>
            <Separator />
            <div className="text-sm">
              <div className="font-medium text-red-600">Rejection Reason:</div>
              <div className="text-red-700">{payment.rejectionReason}</div>
            </div>
          </>
        )}

        {payment.notes && (
          <>
            <Separator />
            <div className="text-sm">
              <div className="flex items-center gap-1 font-medium mb-1">
                <FileText className="h-4 w-4" />
                Notes:
              </div>
              <div className="text-muted-foreground">{payment.notes}</div>
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground">
          Created: {format(new Date(payment.createdAt), 'PPpp')}
          {payment.updatedAt !== payment.createdAt && (
            <span> • Updated: {format(new Date(payment.updatedAt), 'PPpp')}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Payments</h1>
          <p className="text-muted-foreground">
            View and manage your payment history
          </p>
        </div>
        <Button 
          onClick={handleFetchPayments}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Load Payments
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="PENDING">
            Pending
          </TabsTrigger>
          <TabsTrigger value="VERIFIED">
            Verified
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="PENDING" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pending Payments</h2>
              {total > 0 && (
                <Badge variant="outline">{total} payments</Badge>
              )}
            </div>
            {payments.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground">No pending payments found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click "Load Payments" to fetch your payment data
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="VERIFIED" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Verified Payments</h2>
              {total > 0 && (
                <Badge variant="outline">{total} payments</Badge>
              )}
            </div>
            {payments.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground">No verified payments found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click "Load Payments" to fetch your payment data
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="REJECTED" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Rejected Payments</h2>
              {total > 0 && (
                <Badge variant="outline">{total} payments</Badge>
              )}
            </div>
            {payments.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-muted-foreground">No rejected payments found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click "Load Payments" to fetch your payment data
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
