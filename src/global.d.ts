// Global Window Interface
interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
  
  // Razorpay Response Type
  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  // Razorpay Options Interface
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string | null;
    handler: (response: RazorpayResponse) => Promise<void>;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    notes: {
      orderId: string;
    };
    theme: {
      color: string;
    };
  }