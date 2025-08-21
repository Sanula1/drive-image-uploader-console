
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/hooks/use-toast';
import { useApiRequest } from '@/hooks/useApiRequest';
import { getMyPayments, Payment } from '@/api/payments.api';
import { Plus, CreditCard, FileText, DollarSign } from 'lucide-react';
import CreatePaymentDialog from './forms/CreatePaymentDialog';

const SystemPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentTab, setCurrentTab] = useState('pending');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const { toast } = useToast();

  const { execute: fetchPayments, loading } = useApiRequest(getMyPayments);

  const loadPayments = async (page: number = 1) => {
    try {
      const response = await fetchPayments(page, pagination.limit);
      setPayments(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Filter payments by status on client side
  const getFilteredPayments = (status: string) => {
    return payments.filter(payment => 
      payment.status.toLowerCase() === status.toLowerCase()
    );
  };

  // Get counts for each status
  const getCounts = () => {
    const pending = payments.filter(p => p.status === 'PENDING').length;
    const verified = payments.filter(p => p.status === 'VERIFIED').length;
    const rejected = payments.filter(p => p.status === 'REJECTED').length;
    
    return { pending, verified, rejected };
  };

  const counts = getCounts();

  // Column definitions for the data table
  const columns = [
    {
      accessorKey: 'id',
      header: 'Payment ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue('id')}</span>
      )
    },
    {
      accessorKey: 'paymentAmount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-medium">
          ${Number(row.getValue('paymentAmount')).toFixed(2)}
        </span>
      )
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => {
        const method = row.getValue('paymentMethod') as string;
        return (
          <Badge variant="outline">
            {method.replace('_', ' ')}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = status === 'VERIFIED' ? 'default' : 
                      status === 'REJECTED' ? 'destructive' : 'secondary';
        return (
          <Badge variant={variant}>
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => (
        <span>{new Date(row.getValue('paymentDate')).toLocaleDateString()}</span>
      )
    },
    {
      accessorKey: 'paymentMonth',
      header: 'Payment Month',
      cell: ({ row }) => (
        <span>{row.getValue('paymentMonth')}</span>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <span>{new Date(row.getValue('createdAt')).toLocaleDateString()}</span>
      )
    }
  ];

  const handlePaymentCreated = () => {
    setShowCreateDialog(false);
    loadPayments(1); // Reload payments from first page
    toast({
      title: 'Success',
      description: 'Payment submitted successfully',
    });
  };

  const handlePageChange = (newPage: number) => {
    loadPayments(newPage);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Payments
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your payment submissions and track payment status
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Make Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              All payment submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Payments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{counts.verified}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${getFilteredPayments('pending').reduce((sum, p) => sum + p.paymentAmount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and manage your payment submissions by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                Pending
                {counts.pending > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {counts.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="verified" className="flex items-center gap-2">
                Verified
                {counts.verified > 0 && (
                  <Badge variant="default" className="ml-1">
                    {counts.verified}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                Rejected
                {counts.rejected > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {counts.rejected}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <DataTable
                columns={columns}
                data={getFilteredPayments('pending')}
                loading={loading}
                pagination={{
                  page: pagination.page,
                  totalPages: pagination.totalPages,
                  onPageChange: handlePageChange
                }}
              />
            </TabsContent>

            <TabsContent value="verified" className="mt-6">
              <DataTable
                columns={columns}
                data={getFilteredPayments('verified')}
                loading={loading}
                pagination={{
                  page: pagination.page,
                  totalPages: pagination.totalPages,
                  onPageChange: handlePageChange
                }}
              />
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              <DataTable
                columns={columns}
                data={getFilteredPayments('rejected')}
                loading={loading}
                pagination={{
                  page: pagination.page,
                  totalPages: pagination.totalPages,
                  onPageChange: handlePageChange
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Payment Dialog */}
      <CreatePaymentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onPaymentCreated={handlePaymentCreated}
      />
    </div>
  );
};

export default SystemPayments;
