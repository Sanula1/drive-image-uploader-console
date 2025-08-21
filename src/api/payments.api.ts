
import { apiClient } from './client';

export interface PaymentMethod {
  BANK_TRANSFER: 'BANK_TRANSFER';
  ONLINE_PAYMENT: 'ONLINE_PAYMENT';
  CASH_DEPOSIT: 'CASH_DEPOSIT';
}

export type PaymentMethodType = 'BANK_TRANSFER' | 'ONLINE_PAYMENT' | 'CASH_DEPOSIT';

export interface CreatePaymentRequest {
  paymentAmount: number;
  paymentMethod: PaymentMethodType;
  paymentReference?: string;
  paymentDate: string;
  paymentMonth: string;
  notes?: string;
}

export interface CreatePaymentFormData extends CreatePaymentRequest {
  paymentSlip?: File;
}

export interface PaymentResponse {
  id: string;
  paymentAmount: number;
  paymentMethod: PaymentMethodType;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  paymentDate: string;
  paymentMonth: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  uploadedFile?: string;
}

export interface PaymentListResponse {
  data: PaymentResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePaymentSuccessResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    status: string;
    uploadedFile?: string;
  };
}

export const createPayment = async (paymentData: CreatePaymentFormData): Promise<CreatePaymentSuccessResponse> => {
  const formData = new FormData();
  
  formData.append('paymentAmount', paymentData.paymentAmount.toString());
  formData.append('paymentMethod', paymentData.paymentMethod);
  formData.append('paymentDate', paymentData.paymentDate);
  formData.append('paymentMonth', paymentData.paymentMonth);
  
  if (paymentData.paymentReference) {
    formData.append('paymentReference', paymentData.paymentReference);
  }
  
  if (paymentData.notes) {
    formData.append('notes', paymentData.notes);
  }
  
  if (paymentData.paymentSlip) {
    formData.append('paymentSlip', paymentData.paymentSlip);
  }

  return apiClient.post<CreatePaymentSuccessResponse>('/payment', formData);
};

export const getMyPayments = async (page = 1, limit = 10): Promise<PaymentListResponse> => {
  return apiClient.get<PaymentListResponse>(`/payment/my-payments?page=${page}&limit=${limit}`);
};
