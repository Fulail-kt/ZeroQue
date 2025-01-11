import { api } from '~/trpc/react';

// Define a proper type for the payment status
interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export class PaymentManager {
  private checkStatusInterval: NodeJS.Timeout | null = null;
  private timeoutInterval: NodeJS.Timeout | null = null;

  constructor(
    private onStatusUpdate: (status: PaymentStatus) => void,
    private onError: (error: string) => void,
    private onExpiry: () => void,
    private onSuccess: () => void
  ) {}

  async verifyUPIPayment(params: {
    orderId: string;
    refNumber: string;
    upiTransactionId: string;
    status: 'SUCCESS' | 'FAILURE' | 'PENDING';
    errorMessage?: string;
  }) {
    try {
      const verifyPayment = api.order.verifyUpiPayment.useMutation();
      const result = await verifyPayment.mutateAsync(params);
      return result;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  startPaymentStatusCheck(orderId: string, refNumber: string, expiryTime: Date): void {
    const checkPaymentStatus = api.order.checkPaymentStatus.useMutation();
    
    // Use a wrapper function to handle the async operation
    const checkStatus = () => {
      void (async () => {
        try {
          const result = await checkPaymentStatus.mutateAsync({
            refNumber,
            orderId,
          });

          this.onStatusUpdate(result);

          if (result.status === 'completed') {
            this.cleanup();
            this.onSuccess();
          } else if (result.status === 'failed') {
            this.cleanup();
            this.onError(result.error ?? 'Payment failed');
          }
        } catch (error) {
          console.error('Payment status check failed:', error);
          this.onError('Failed to check payment status');
        }
      })();
    };

    this.checkStatusInterval = setInterval(checkStatus, 3000);

    // Update remaining time
    this.timeoutInterval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(expiryTime).getTime() - Date.now()) / 1000));
      if (remaining === 0) {
        this.cleanup();
        this.onExpiry();
      }
    }, 1000);
  }

  cleanup(): void {
    if (this.checkStatusInterval) {
      clearInterval(this.checkStatusInterval);
      this.checkStatusInterval = null;
    }
    if (this.timeoutInterval) {
      clearInterval(this.timeoutInterval);
      this.timeoutInterval = null;
    }
  }
}

export const handleUPICallback = async (params: URLSearchParams) => {
  const txnId = params.get('txnId');
  const orderId = params.get('orderId');
  const refNumber = params.get('refNumber');
  const status = params.get('Status');

  if (!txnId || !orderId || !refNumber || !status) {
    throw new Error('Invalid UPI callback parameters');
  }

  // Create a payment manager with proper handlers
  const paymentManager = new PaymentManager(
    (status) => { console.log('Payment status updated:', status); },
    (error) => { console.error('Payment error:', error); },
    () => { console.log('Payment expired'); },
    () => { console.log('Payment successful'); }
  );

  return await paymentManager.verifyUPIPayment({
    orderId,
    refNumber,
    upiTransactionId: txnId,
    status: status as 'SUCCESS' | 'FAILURE' | 'PENDING',
  });
};