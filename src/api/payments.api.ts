
import { apiClient } from './client';

export type PaymentMethod = 'BANK_TRANSFER' | 'ONLINE_PAYMENT' | 'CASH_DEPOSIT';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Payment {
  id: string;
  paymentAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentDate: string;
  paymentMonth: string;
  notes?: string;
  status: PaymentStatus;
  createdAt: string;
  uploadedFile?: string;
}

export interface CreatePaymentRequest {
  paymentAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentDate: string;
  paymentMonth: string;
  notes?: string;
  paymentSlip?: File;
}

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    status: PaymentStatus;
    uploadedFile?: string;
  };
}

export interface PaymentsListResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const paymentsApi = {
  async createPayment(data: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    const formData = new FormData();
    
    formData.append('paymentAmount', data.paymentAmount.toString());
    formData.append('paymentMethod', data.paymentMethod);
    formData.append('paymentDate', data.paymentDate);
    formData.append('paymentMonth', data.paymentMonth);
    
    if (data.paymentReference) {
      formData.append('paymentReference', data.paymentReference);
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    if (data.paymentSlip) {
      formData.append('paymentSlip', data.paymentSlip);
    }

    const response = await apiClient.post('/payment', formData);
    
    return response.data;
  },

  async getMyPayments(page: number = 1, limit: number = 10): Promise<PaymentsListResponse> {
    const response = await apiClient.get(`/payment/my-payments?page=${page}&limit=${limit}`);
    return response.data;
  }
};
