
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Calendar, DollarSign } from 'lucide-react';
import { paymentsApi, Payment, PaymentStatus } from '@/api/payments.api';
import { CreatePaymentDialog } from '@/components/forms/CreatePaymentDialog';
import { PaymentsTable } from '@/components/PaymentsTable';
import { useToast } from '@/hooks/use-toast';

const SystemPayments = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<PaymentStatus>('PENDING');
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const { data: paymentsData, isLoading, refetch } = useQuery({
    queryKey: ['payments', page],
    queryFn: () => paymentsApi.getMyPayments(page, 10),
  });

  // Filter payments by status
  const filteredPayments = useMemo(() => {
    if (!paymentsData?.data) return [];
    return paymentsData.data.filter(payment => payment.status === activeTab);
  }, [paymentsData?.data, activeTab]);

  // Count payments by status
  const paymentCounts = useMemo(() => {
    if (!paymentsData?.data) return { PENDING: 0, VERIFIED: 0, REJECTED: 0 };
    
    return paymentsData.data.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<PaymentStatus, number>);
  }, [paymentsData?.data]);

  const handlePaymentCreated = () => {
    setShowCreateDialog(false);
    refetch();
    toast({
      title: "Payment submitted successfully",
      description: "Your payment has been submitted for verification.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your payment submissions and track their status
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Submit Payment
        </Button>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentsData?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{paymentCounts.PENDING}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paymentCounts.VERIFIED}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PaymentStatus)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="PENDING" className="flex items-center gap-2">
                Pending
                {paymentCounts.PENDING > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {paymentCounts.PENDING}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="VERIFIED" className="flex items-center gap-2">
                Verified
                {paymentCounts.VERIFIED > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {paymentCounts.VERIFIED}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="flex items-center gap-2">
                Rejected
                {paymentCounts.REJECTED > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {paymentCounts.REJECTED}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="PENDING" className="mt-4">
              <PaymentsTable 
                payments={filteredPayments} 
                isLoading={isLoading}
                status="PENDING"
              />
            </TabsContent>
            
            <TabsContent value="VERIFIED" className="mt-4">
              <PaymentsTable 
                payments={filteredPayments} 
                isLoading={isLoading}
                status="VERIFIED"
              />
            </TabsContent>
            
            <TabsContent value="REJECTED" className="mt-4">
              <PaymentsTable 
                payments={filteredPayments} 
                isLoading={isLoading}
                status="REJECTED"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Payment Dialog */}
      <CreatePaymentDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handlePaymentCreated}
      />
    </div>
  );
};

export default SystemPayments;
