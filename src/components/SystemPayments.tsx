
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getMyPayments, PaymentResponse } from '@/api/payments.api';
import { PaymentsTable } from '@/components/PaymentsTable';
import { CreatePaymentDialog } from '@/components/forms/CreatePaymentDialog';
import { useToast } from '@/hooks/use-toast';

const SystemPayments = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();

  const { data: paymentsData, isLoading, refetch } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => getMyPayments(1, 100), // Get more records for client-side filtering
  });

  // Filter payments by status on client side
  const getFilteredPayments = (status: string): PaymentResponse[] => {
    if (!paymentsData?.data) return [];
    
    return paymentsData.data.filter(payment => 
      payment.status.toLowerCase() === status.toLowerCase()
    );
  };

  const pendingPayments = getFilteredPayments('pending');
  const verifiedPayments = getFilteredPayments('verified');
  const rejectedPayments = getFilteredPayments('rejected');

  const handlePaymentCreated = () => {
    setIsCreateDialogOpen(false);
    refetch();
    toast({
      title: "Payment Submitted Successfully",
      description: "Your payment has been submitted and is pending verification.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Payments</h1>
          <p className="text-muted-foreground">
            Manage your payment submissions and view payment history
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Track your payment submissions across different statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Pending
                {pendingPayments.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {pendingPayments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="verified" className="flex items-center gap-2">
                Verified
                {verifiedPayments.length > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {verifiedPayments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                Rejected
                {rejectedPayments.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {rejectedPayments.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <PaymentsTable 
                payments={pendingPayments} 
                isLoading={isLoading}
                status="pending"
              />
            </TabsContent>

            <TabsContent value="verified" className="space-y-4">
              <PaymentsTable 
                payments={verifiedPayments} 
                isLoading={isLoading}
                status="verified"
              />
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <PaymentsTable 
                payments={rejectedPayments} 
                isLoading={isLoading}
                status="rejected"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreatePaymentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onPaymentCreated={handlePaymentCreated}
      />
    </div>
  );
};

export default SystemPayments;
