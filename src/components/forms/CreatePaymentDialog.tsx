
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { paymentsApi, PaymentMethod } from '@/api/payments.api';
import { Upload, X } from 'lucide-react';

const paymentSchema = z.object({
  paymentAmount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['BANK_TRANSFER', 'ONLINE_PAYMENT', 'CASH_DEPOSIT']),
  paymentReference: z.string().max(100, 'Reference must be less than 100 characters').optional(),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMonth: z.string().min(1, 'Payment month is required'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CreatePaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePaymentDialog = ({ open, onClose, onSuccess }: CreatePaymentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const paymentMethod = watch('paymentMethod');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF, JPG, JPEG, or PNG files.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('paymentSlip') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      await paymentsApi.createPayment({
        ...data,
        paymentSlip: selectedFile || undefined,
      });
      
      toast({
        title: "Payment submitted successfully!",
        description: "Your payment has been submitted for verification. Take a screenshot and save if needed.",
      });
      
      reset();
      setSelectedFile(null);
      onSuccess();
    } catch (error) {
      toast({
        title: "Error submitting payment",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="paymentAmount">Payment Amount *</Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0.01"
              {...register('paymentAmount', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.paymentAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentAmount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select onValueChange={(value: PaymentMethod) => setValue('paymentMethod', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="ONLINE_PAYMENT">Online Payment</SelectItem>
                <SelectItem value="CASH_DEPOSIT">Cash Deposit</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentReference">Payment Reference</Label>
            <Input
              id="paymentReference"
              {...register('paymentReference')}
              placeholder="Transaction/Reference number"
              maxLength={100}
            />
            {errors.paymentReference && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentReference.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input
              id="paymentDate"
              type="date"
              {...register('paymentDate')}
            />
            {errors.paymentDate && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMonth">Payment Month *</Label>
            <Input
              id="paymentMonth"
              type="month"
              {...register('paymentMonth')}
            />
            {errors.paymentMonth && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMonth.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="paymentSlip">Payment Slip (Optional)</Label>
            <div className="mt-2">
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="paymentSlip" className="cursor-pointer text-blue-600 hover:text-blue-500">
                      Upload a file
                    </label>
                    <input
                      id="paymentSlip"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <p className="mt-1">PDF, JPG, JPEG, PNG (Max 2MB)</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm truncate">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes or comments"
              maxLength={1000}
              rows={3}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
