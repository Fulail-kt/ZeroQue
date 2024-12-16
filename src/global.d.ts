interface Window {
    Razorpay: {
      new(options: RazorpayOptions): RazorpayInstance;
      open: () => void;
    };
  }
  