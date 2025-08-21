
import { apiClient } from './client';

export interface Payment {
  id: string;
  userId: string;
  paymentAmount: string;
  paymentMethod: 'BANK_TRANSFER' | 'CARD' | 'CASH';
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

export interface PaymentResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

class PaymentApiClient {
  async getMyPayments(params?: PaymentQueryParams): Promise<PaymentResponse> {
    const response = await apiClient.get<PaymentResponse>('/payment/my-payments', params);
    return response;
  }
}

export const paymentApi = new PaymentApiClient();
