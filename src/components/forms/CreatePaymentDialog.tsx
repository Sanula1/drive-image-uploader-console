
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useApiRequest } from '@/hooks/useApiRequest';
import { createPayment, CreatePaymentRequest } from '@/api/payments.api';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentCreated: () => void;
}

const CreatePaymentDialog = ({ open, onOpenChange, onPaymentCreated }: CreatePaymentDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreatePaymentRequest>({
    defaultValues: {
      paymentAmount: 0,
      paymentMethod: 'BANK_TRANSFER',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
    }
  });

  const { execute: submitPayment, loading } = useApiRequest(createPayment);

  const validateFile = (file: File): string | null => {
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return 'File size must be less than 2MB';
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, JPG, JPEG, and PNG files are allowed';
    }

    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      event.target.value = ''; // Reset file input
      return;
    }

    setSelectedFile(file);
  };

  const onSubmit = async (data: CreatePaymentRequest) => {
    try {
      const paymentData = {
        ...data,
        paymentSlip: selectedFile || undefined
      };

      const response = await submitPayment(paymentData);
      
      toast({
        title: 'Payment Successful!',
        description: `Payment submitted successfully. Payment ID: ${response.data.paymentId}`,
      });

      // Reset form and close dialog
      reset();
      setSelectedFile(null);
      setFileError(null);
      onPaymentCreated();
      
    } catch (error) {
      console.error('Payment submission error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to submit payment',
        variant: 'destructive'
      });
    }
  };

  const handleDialogClose = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      reset();
      setSelectedFile(null);
      setFileError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
          <DialogDescription>
            Submit your payment details with optional payment slip upload
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Payment Amount ($) *</Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('paymentAmount', {
                required: 'Payment amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
                max: { value: 999999.99, message: 'Amount too large' }
              })}
            />
            {errors.paymentAmount && (
              <p className="text-sm text-red-600">{errors.paymentAmount.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              onValueChange={(value) => setValue('paymentMethod', value as any)}
              defaultValue="BANK_TRANSFER"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="ONLINE_PAYMENT">Online Payment</SelectItem>
                <SelectItem value="CASH_DEPOSIT">Cash Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Reference */}
          <div className="space-y-2">
            <Label htmlFor="paymentReference">Payment Reference</Label>
            <Input
              id="paymentReference"
              placeholder="Transaction ID or reference number"
              maxLength={100}
              {...register('paymentReference', {
                maxLength: { value: 100, message: 'Reference too long' }
              })}
            />
            {errors.paymentReference && (
              <p className="text-sm text-red-600">{errors.paymentReference.message}</p>
            )}
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input
              id="paymentDate"
              type="date"
              {...register('paymentDate', {
                required: 'Payment date is required'
              })}
            />
            {errors.paymentDate && (
              <p className="text-sm text-red-600">{errors.paymentDate.message}</p>
            )}
          </div>

          {/* Payment Month */}
          <div className="space-y-2">
            <Label htmlFor="paymentMonth">Payment Month *</Label>
            <Input
              id="paymentMonth"
              type="month"
              {...register('paymentMonth', {
                required: 'Payment month is required'
              })}
            />
            {errors.paymentMonth && (
              <p className="text-sm text-red-600">{errors.paymentMonth.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="paymentSlip">Payment Slip (Optional)</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  id="paymentSlip"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
              
              {selectedFile && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md border border-green-200">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">{selectedFile.name}</span>
                  <span className="text-xs text-green-600">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
              
              {fileError && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-md border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">{fileError}</span>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Allowed: PDF, JPG, JPEG, PNG (Max 2MB)
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information..."
              maxLength={1000}
              rows={3}
              {...register('notes', {
                maxLength: { value: 1000, message: 'Notes too long' }
              })}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Submit Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaymentDialog;
