
import { apiClient, ApiResponse } from './client';

export interface PaymentMethod {
  BANK_TRANSFER: 'BANK_TRANSFER';
  ONLINE_PAYMENT: 'ONLINE_PAYMENT';
  CASH_DEPOSIT: 'CASH_DEPOSIT';
}

export interface CreatePaymentRequest {
  paymentAmount: number;
  paymentMethod: 'BANK_TRANSFER' | 'ONLINE_PAYMENT' | 'CASH_DEPOSIT';
  paymentReference?: string;
  paymentDate: string;
  paymentMonth: string;
  notes?: string;
  paymentSlip?: File;
}

export interface Payment {
  id: string;
  paymentAmount: number;
  paymentMethod: 'BANK_TRANSFER' | 'ONLINE_PAYMENT' | 'CASH_DEPOSIT';
  paymentReference?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  paymentDate: string;
  paymentMonth: string;
  notes?: string;
  createdAt: string;
  uploadedFile?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    status: string;
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

export const createPayment = async (paymentData: CreatePaymentRequest): Promise<PaymentResponse> => {
  const formData = new FormData();
  
  // Add all payment data to FormData
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

  // For file uploads, we need to use fetch directly
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const token = localStorage.getItem('access_token');
  
  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Payment creation failed: ${response.status}`);
  }

  return await response.json();
};

export const getMyPayments = async (page: number = 1, limit: number = 10): Promise<PaymentsListResponse> => {
  return apiClient.get<PaymentsListResponse>('/payments/my-payments', { page, limit });
};

export const getPaymentById = async (paymentId: string): Promise<Payment> => {
  return apiClient.get<Payment>(`/payments/${paymentId}`);
};
