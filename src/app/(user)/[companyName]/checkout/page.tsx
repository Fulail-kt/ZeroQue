'use client'


//-------------------------------------WITHOUT LOCAL STORAGE STORING---------------------------------//


// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm, Controller } from 'react-hook-form';
// import {
//   CreditCard, Banknote, User, Phone, 
//   Mail, Table, QrCode, Loader2,
//   AlertCircle, CheckCircle, XCircle
// } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '~/components/ui/card';
// import { Input } from '~/components/ui/input';
// import { Button } from '~/components/ui/button';
// import { Label } from '~/components/ui/label';
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "~/components/ui/alert";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "~/components/ui/dialog";
// import useCartStore from '~/store/store';
// import { api } from '~/trpc/react';
// import useCompanyStore from '~/store/general';

// // Types
// interface PaymentStatus {
//   status: "failed" | "pending" | "completed";
//   lastUpdated: Date;
//   attempts: number;
//   orderStatus: "failed" | "pending" | "completed" | "confirmed" | "preparing" | "ready" | "cancelled";
//   error?: string;
// }

// interface UPIPaymentData {
//   upiUrl: string;
//   orderId: string;
//   qrCode: string;
//   refNumber: string;
//   expiresAt: Date;
// }

// interface CheckoutFormData {
//   name: string;
//   email: string;
//   phone1: string;
//   phone2?: string;
//   tableNumber?: string;
// }

// interface Coupon {
//   code: string;
//   discount: number;
// }

// const CheckoutPage: React.FC = () => {
//   const router = useRouter();
//   const { cart, clearCart } = useCartStore();
//   const { companyId } = useCompanyStore();
  
//   // State management
//   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'|'upi'>('upi');
//   const [couponCode, setCouponCode] = useState('');
//   const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
//   const [upiData, setUpiData] = useState<UPIPaymentData | null>(null);
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//   const [paymentError, setPaymentError] = useState<string | null>(null);
//   const [remainingTime, setRemainingTime] = useState<number>(0);
//   const [verificationAttempted, setVerificationAttempted] = useState(false);

//   // Form setup
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CheckoutFormData>({
//     defaultValues: {
//       name: '',
//       email: '',
//       phone1: '',
//       phone2: '',
//       tableNumber: ''
//     }
//   });

//   // API mutations
//   const verifyPayment = api.order.verifyUpiPayment.useMutation({
//     onSuccess: (data) => {
//       if (data.success) {
//         setPaymentStatus({
//           status: 'completed',
//           lastUpdated: new Date(),
//           attempts: data.order.attempts,
//           orderStatus: data.order.status,
//         });
//         clearCart();
//         setTimeout(() => router.push('/order-success'), 2000);
//       } else {
//         setPaymentStatus({
//           status: 'failed',
//           lastUpdated: new Date(),
//           attempts: data.order.attempts,
//           orderStatus: data.order.status,
//           error: 'Payment verification failed'
//         });
//       }
//     },
//     onError: (error) => {
//       setPaymentError(error.message);
//       setPaymentStatus({
//         status: 'failed',
//         lastUpdated: new Date(),
//         attempts: 0,
//         orderStatus: 'failed',
//         error: error.message
//       });
//     }
//   });

//   const checkPaymentStatus = api.order.checkPaymentStatus.useMutation({
//     onSuccess: (data) => {
//       setPaymentStatus(data);
//       if (data.status === 'completed') {
//         clearCart();
//         router.push('/order-success');
//       } else if (data.status === 'failed') {
//         setPaymentError(data.error ?? 'Payment failed');
//         setTimeout(() => router.push('/payment-failed'), 2000);
//       }
//     },
//     onError: (error) => {
//       console.error('Payment status check failed:', error);
//       setPaymentError('Error checking payment status');
//     }
//   });

//   const createOrder = api.order.createOrder.useMutation({
//     onSuccess: (data) => {
//       setIsProcessing(false);
//       if (data.paymentMethod === 'upi') {
//         setUpiData({
//           upiUrl: data.upiUrl??"",
//           orderId: data.orderId??"",
//           qrCode: data.qrCode??"",
//           refNumber: data.refNumber??"",
//           expiresAt: new Date(data.expiresAt??"")
//         });
//         setShowPaymentDialog(true);
//       } else {
//         clearCart();
//         router.push('/order-success');
//       }
//     },
//     onError: (error) => {
//       setIsProcessing(false);
//       setPaymentError(error.message);
//     }
//   });

//   // Handle UPI verification after app return
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden && upiData && !verificationAttempted) {
//         setVerificationAttempted(true);
//         verifyPayment.mutate({
//           orderId: upiData.orderId,
//           refNumber: upiData.refNumber,
//           upiTransactionId: '', // Will be updated by backend
//           status: 'PENDING'
//         });
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [upiData, verificationAttempted]);

//   // Payment status polling
//   useEffect(() => {
//     let statusInterval: NodeJS.Timeout;
//     let timeoutInterval: NodeJS.Timeout;

//     if (upiData?.orderId && showPaymentDialog) {
//       statusInterval = setInterval(() => {
//         checkPaymentStatus.mutate({
//           refNumber: upiData.refNumber,
//           orderId: upiData.orderId,
//         });
//       }, 3000);

//       const expiryTime = new Date(upiData.expiresAt).getTime();
//       timeoutInterval = setInterval(() => {
//         const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
//         setRemainingTime(remaining);
//         if (remaining === 0) {
//           clearInterval(statusInterval);
//           clearInterval(timeoutInterval);
//           setPaymentError('Payment time expired');
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(statusInterval);
//       clearInterval(timeoutInterval);
//     };
//   }, [upiData, showPaymentDialog]);

//   // Handle UPI payment
//   const handleUPIPayment = () => {
//     if (!upiData?.upiUrl) return;
    
//     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//     if (isMobile) {
//       window.location.href = upiData.upiUrl;
//     }
//   };

//   // Form submission
//   const onSubmit = async (data: CheckoutFormData) => {
//     setIsProcessing(true);
//     setPaymentError(null);
//     setVerificationAttempted(false);

//     try {
//       await createOrder.mutateAsync({
//         ...data,
//         companyId:companyId as string,
//         total: calculateTotal(),
//         paymentMethod,
//         items: cart.map(item => ({
//           id: item.id,
//           title: item.title,
//           quantity: item.quantity,
//           price: item.price
//         }))
//       });


      
//     } catch (error) {
//       setIsProcessing(false);
//       setPaymentError('Failed to create order');
//     }
//   };

//   // Mock coupons (replace with API call in production)
//   const mockCoupons: Record<string, Coupon> = {
//     'FIRST10': { code: 'FIRST10', discount: 0.1 },
//     'SAVE20': { code: 'SAVE20', discount: 0.2 }
//   };

//   const validateCoupon = () => {
//     const coupon = mockCoupons[couponCode.toUpperCase()];
//     if (coupon) {
//       setAppliedCoupon(coupon);
//     } else {
//       setPaymentError('Invalid coupon code');
//     }
//   };

//   const calculateTotal = () => {
//     const subtotal = cart.reduce((total, item) => 
//       total + item.price * item.quantity, 0
//     );
//     return appliedCoupon 
//       ? subtotal * (1 - appliedCoupon.discount) 
//       : subtotal;
//   };


// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm, Controller } from 'react-hook-form';
// import {
//   CreditCard, Banknote, User, Phone, 
//   Mail, Table, QrCode, Loader2,
//   AlertCircle, CheckCircle, XCircle
// } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '~/components/ui/card';
// import { Input } from '~/components/ui/input';
// import { Button } from '~/components/ui/button';
// import { Label } from '~/components/ui/label';
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "~/components/ui/alert";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "~/components/ui/dialog";
// import useCompanyStore from '~/store/general';
// import { api } from '~/trpc/react';
// import useCartStore from '~/store/store';
// import useOrderStore from '~/store/orderStore';

// // Types
// interface PaymentStatus {
//   status: "failed" | "pending" | "completed";
//   lastUpdated: Date;
//   attempts: number;
//   orderStatus: "failed" | "pending" | "completed" | "confirmed" | "preparing" | "ready" | "cancelled";
//   error?: string;
// }

// interface UPIPaymentData {
//   upiUrl: string;
//   orderId: string;
//   qrCode: string;
//   refNumber: string;
//   expiresAt: Date;
// }

// interface CheckoutFormData {
//   name: string;
//   email: string;
//   phone1: string;
//   phone2?: string;
//   tableNumber?: string;
// }

// interface Coupon {
//   code: string;
//   discount: number;
// }

// const CheckoutPage: React.FC = () => {
//   const router = useRouter();
//   const { cart, clearCart } = useCartStore();
//   const { companyId } = useCompanyStore();
//   const {
//     createOrder: createLocalOrder,
//     updatePaymentStatus,
//     updateOrderStatus,
//     incrementPaymentAttempts,
//     setPaymentError: setLocalPaymentError
//   } = useOrderStore();
  
//   // State management
//   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'|'upi'>('upi');
//   const [couponCode, setCouponCode] = useState('');
//   const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
//   const [upiData, setUpiData] = useState<UPIPaymentData | null>(null);
//   const [showPaymentDialog, setShowPaymentDialog] = useState(false);
//   const [paymentError, setPaymentError] = useState<string | null>(null);
//   const [remainingTime, setRemainingTime] = useState<number>(0);
//   const [verificationAttempted, setVerificationAttempted] = useState(false);

//   // Form setup
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CheckoutFormData>({
//     defaultValues: {
//       name: '',
//       email: '',
//       phone1: '',
//       phone2: '',
//       tableNumber: ''
//     }
//   });

//   // API mutations
//   const verifyPayment = api.order.verifyUpiPayment.useMutation({
//     onSuccess: (data) => {
//       if (data.success) {
//         setPaymentStatus({
//           status: 'completed',
//           lastUpdated: new Date(),
//           attempts: data.order.attempts,
//           orderStatus: data.order.status,
//         });
        
//         // Update local store
//         updatePaymentStatus(upiData?.orderId ?? '', 'completed');
//         updateOrderStatus(upiData?.orderId ?? '', 'completed');
        
//         clearCart();
//         setTimeout(() => router.push('/order-success'), 2000);
//       } else {
//         setPaymentStatus({
//           status: 'failed',
//           lastUpdated: new Date(),
//           attempts: data.order.attempts,
//           orderStatus: data.order.status,
//           error: 'Payment verification failed'
//         });
        
//         // Update local store
//         updatePaymentStatus(upiData?.orderId ?? '', 'failed', {
//           error: 'Payment verification failed'
//         });
//         updateOrderStatus(upiData?.orderId ?? '', 'failed');
//       }
//     },
//     onError: (error) => {
//       setPaymentError(error.message);
//       setPaymentStatus({
//         status: 'failed',
//         lastUpdated: new Date(),
//         attempts: 0,
//         orderStatus: 'failed',
//         error: error.message
//       });
      
//       if (upiData?.orderId) {
//         setLocalPaymentError(upiData.orderId, error.message);
//       }
//     }
//   });

//   const checkPaymentStatus = api.order.checkPaymentStatus.useMutation({
//     onSuccess: (data) => {
//       setPaymentStatus(data);
      
//       if (upiData?.orderId) {
//         updatePaymentStatus(upiData.orderId, data.status, {
//           lastAttempt: new Date(),
//           error: data.error
//         });
        
//         if (data.status === 'completed') {
//           updateOrderStatus(upiData.orderId, 'completed');
//           clearCart();
//           router.push('/order-success');
//         } else if (data.status === 'failed') {
//           updateOrderStatus(upiData.orderId, 'failed');
//           setPaymentError(data.error ?? 'Payment failed');
//           setTimeout(() => router.push('/payment-failed'), 2000);
//         }
//       }
//     },
//     onError: (error) => {
//       console.error('Payment status check failed:', error);
//       setPaymentError('Error checking payment status');
//       if (upiData?.orderId) {
//         setLocalPaymentError(upiData.orderId, error.message);
//       }
//     }
//   });

//   const createOrder = api.order.createOrder.useMutation({
//     onSuccess: (data) => {
//       setIsProcessing(false);
      
//       // Create order in local store
//       const localOrder = createLocalOrder({
//         companyId: companyId as string,
//         name: data.user.name,
//         email: data.user.email,
//         phone1: data.user.phone,
//         items: cart.map(item => ({
//           id: item.id,
//           title: item.title,
//           price: item.price,
//           quantity: item.quantity
//         })),
//         total: Number(data.amount),
//         payment: {
//           method: data.paymentMethod as 'cash' | 'online' | 'upi',
//           status: 'pending',
//           attempts: 0,
//           ...(data.paymentMethod === 'upi' ? {
//             refNumber: data.refNumber,
//             qrCode: data.qrCode,
//             upiUrl: data.upiUrl,
//             expiresAt: new Date(data.expiresAt ?? '')
//           } : {})
//         },
//         status: 'pending',
//         paymentAttempts: 0,
//       });

//       if (data.paymentMethod === 'upi') {
//         setUpiData({
//           upiUrl: data.upiUrl ?? "",
//           orderId: data.orderId,
//           qrCode: data.qrCode ?? "",
//           refNumber: data.refNumber ?? "",
//           expiresAt: new Date(data.expiresAt ?? "")
//         });
//         setShowPaymentDialog(true);
//       } else {
//         clearCart();
//         router.push('/order-success');
//       }
//     },
//     onError: (error) => {
//       setIsProcessing(false);
//       setPaymentError(error.message);
//     }
//   });

//   // Handle UPI verification after app return
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden && upiData && !verificationAttempted) {
//         setVerificationAttempted(true);
//         verifyPayment.mutate({
//           orderId: upiData.orderId,
//           refNumber: upiData.refNumber,
//           upiTransactionId: '',
//           status: 'PENDING'
//         });
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [upiData, verificationAttempted]);

//   // Payment status polling
//   useEffect(() => {
//     let statusInterval: NodeJS.Timeout;
//     let timeoutInterval: NodeJS.Timeout;

//     if (upiData?.orderId && showPaymentDialog) {
//       statusInterval = setInterval(() => {
//         incrementPaymentAttempts(upiData.orderId);
//         checkPaymentStatus.mutate({
//           refNumber: upiData.refNumber,
//           orderId: upiData.orderId,
//         });
//       }, 3000);

//       const expiryTime = new Date(upiData.expiresAt).getTime();
//       timeoutInterval = setInterval(() => {
//         const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
//         setRemainingTime(remaining);
//         if (remaining === 0) {
//           clearInterval(statusInterval);
//           clearInterval(timeoutInterval);
//           setPaymentError('Payment time expired');
//           if (upiData.orderId) {
//             setLocalPaymentError(upiData.orderId, 'Payment time expired');
//           }
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(statusInterval);
//       clearInterval(timeoutInterval);
//     };
//   }, [upiData, showPaymentDialog]);

//   // Handle UPI payment
//   const handleUPIPayment = () => {
//     if (!upiData?.upiUrl) return;
    
//     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//     if (isMobile) {
//       window.location.href = upiData.upiUrl;
//     }
//   };

//   // Form submission
//   const onSubmit = async (data: CheckoutFormData) => {
//     setIsProcessing(true);
//     setPaymentError(null);
//     setVerificationAttempted(false);

//     try {
//       await createOrder.mutateAsync({
//         ...data,
//         companyId: companyId as string,
//         total: calculateTotal(),
//         paymentMethod,
//         items: cart.map(item => ({
//           id: item.id,
//           title: item.title,
//           quantity: item.quantity,
//           price: item.price
//         }))
//       });
//     } catch (error) {
//       setIsProcessing(false);
//       setPaymentError('Failed to create order');
//     }
//   };

//   // Mock coupons (replace with API call in production)
//   const mockCoupons: Record<string, Coupon> = {
//     'FIRST10': { code: 'FIRST10', discount: 0.1 },
//     'SAVE20': { code: 'SAVE20', discount: 0.2 }
//   };

//   const validateCoupon = () => {
//     const coupon = mockCoupons[couponCode.toUpperCase()];
//     if (coupon) {
//       setAppliedCoupon(coupon);
//     } else {
//       setPaymentError('Invalid coupon code');
//     }
//   };

//   const calculateTotal = () => {
//     const subtotal = cart.reduce((total, item) => 
//       total + item.price * item.quantity, 0
//     );
//     return appliedCoupon 
//       ? subtotal * (1 - appliedCoupon.discount) 
//       : subtotal;
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Checkout</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {paymentError && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{paymentError}</AlertDescription>
//             </Alert>
//           )}
          
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Personal Information Section */}
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Name</Label>
//                 <div className="flex items-center space-x-2">
//                   <User className="text-muted-foreground" />
//                   <Controller
//                     name="name"
//                     control={control}
//                     rules={{ required: 'Name is required' }}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         placeholder="Full Name"
//                         aria-invalid={errors.name ? "true" : "false"}
//                       />
//                     )}
//                   />
//                 </div>
//                 {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//               </div>

//               <div>
//                 <Label>Email</Label>
//                 <div className="flex items-center space-x-2">
//                   <Mail className="text-muted-foreground" />
//                   <Controller
//                     name="email"
//                     control={control}
//                     rules={{
//                       required: 'Email is required',
//                       pattern: {
//                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                         message: "Invalid email address"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="email"
//                         placeholder="Email Address"
//                         aria-invalid={errors.email ? "true" : "false"}
//                       />
//                     )}
//                   />
//                 </div>
//                 {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//               </div>

//               <div>
//                 <Label>Primary Phone</Label>
//                 <div className="flex items-center space-x-2">
//                   <Phone className="text-muted-foreground" />
//                   <Controller
//                     name="phone1"
//                     control={control}
//                     rules={{
//                       required: 'Primary phone is required',
//                       pattern: {
//                         value: /^[0-9]{10}$/,
//                         message: "Phone number must be 10 digits"
//                       }
//                     }}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="tel"
//                         placeholder="Primary Phone"
//                         aria-invalid={errors.phone1 ? "true" : "false"}
//                       />
//                     )}
//                   />
//                 </div>
//                 {errors.phone1 && <p className="text-red-500 text-sm">{errors.phone1.message}</p>}
//               </div>

//               <div>
//                 <Label>Secondary Phone (Optional)</Label>
//                 <div className="flex items-center space-x-2">
//                   <Phone className="text-muted-foreground" />
//                   <Controller
//                     name="phone2"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         type="tel"
//                         placeholder="Secondary Phone"
//                       />
//                     )}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>Table Number (Optional)</Label>
//                 <div className="flex items-center space-x-2">
//                   <Table className="text-muted-foreground" />
//                   <Controller
//                     name="tableNumber"
//                     control={control}
//                     render={({ field }) => (
//                       <Input
//                         {...field}
//                         placeholder="Table Number"
//                       />
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method Section */}
//             <div className="space-y-4">
//               <Label>Payment Method</Label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Button
//                   type="button"
//                   variant={paymentMethod === 'cash' ? 'default' : 'outline'}
//                   onClick={() => setPaymentMethod('cash')}
//                   className="flex items-center justify-center space-x-2"
//                 >
//                   <Banknote className="h-4 w-4" />
//                   <span>Pay with Cash</span>
//                 </Button>
//                 <Button
//                   type="button"
//                   variant={paymentMethod === 'upi' ? 'default' : 'outline'}
//                   onClick={() => setPaymentMethod('upi')}
//                   className="flex items-center justify-center space-x-2"
//                 >
//                   <QrCode className="h-4 w-4" />
//                   <span>Pay with UPI</span>
//                 </Button>
//               </div>
//             </div>

//             {/* Coupon Section */}
//             <div>
//               <Label>Coupon Code (Optional)</Label>
//               <div className="flex space-x-2">
//                 <Input
//                   placeholder="Enter Coupon Code"
//                   value={couponCode}
//                   onChange={(e) => setCouponCode(e.target.value)}
//                 />
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   onClick={validateCoupon}
//                 >
//                   Apply
//                 </Button>
//               </div>
//               {appliedCoupon && (
//                 <p className="text-green-600 mt-2">
//                   Coupon {appliedCoupon.code} applied: {appliedCoupon.discount * 100}% off
//                 </p>
//                 )}
//                 </div>
    
//                 {/* Order Summary */}
//                 <div>
//                   <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
//                   {cart.map(item => (
//                     <div key={item.id} className="flex justify-between items-center mb-2">
//                       <span>{item.title} x {item.quantity}</span>
//                       <span>${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                   <div className="border-t pt-2 flex justify-between font-bold">
//                     <span>Total</span>
//                     <span>${calculateTotal().toFixed(2)}</span>
//                   </div>
//                 </div>
    
//                 <Button 
//                   className="w-full"
//                   disabled={isProcessing || cart.length === 0}
//                   type="submit"
//                 >
//                   {isProcessing ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     'Complete Order'
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
    
//           {/* Payment Dialog */}
//           <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Complete UPI Payment</DialogTitle>
//               </DialogHeader>
              
//               <div className="space-y-4">
//                 {/* QR Code Display */}
//                 {upiData?.qrCode && (
//                   <div className="flex justify-center">
//                     <img 
//                       src={upiData.qrCode} 
//                       alt="Payment QR Code"
//                       className="max-w-[200px]"
//                     />
//                   </div>
//                 )}
    
//                 {/* Reference Number */}
//                 {upiData?.refNumber && (
//                   <div className="text-center text-sm text-muted-foreground">
//                     Reference Number: {upiData.refNumber}
//                   </div>
//                 )}
    
//                 {/* Payment Status */}
//                 <Alert variant={
//                   paymentStatus?.status === 'completed' ? 'default' :
//                   paymentStatus?.status === 'failed' ? 'destructive' : 
//                   'default'
//                 }>
//                   <div className="flex items-center space-x-2">
//                     {paymentStatus?.status === 'completed' ? (
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                     ) : paymentStatus?.status === 'failed' ? (
//                       <XCircle className="h-4 w-4 text-red-500" />
//                     ) : (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     )}
//                     <AlertTitle>
//                       {paymentStatus?.status === 'completed' ? 'Payment Successful' :
//                        paymentStatus?.status === 'failed' ? 'Payment Failed' :
//                        'Awaiting Payment'}
//                     </AlertTitle>
//                   </div>
//                   <AlertDescription>
//                     {remainingTime > 0 && (
//                       <p>Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</p>
//                     )}
//                     {paymentStatus?.error && (
//                       <p className="text-red-500">{paymentStatus.error}</p>
//                     )}
//                     {paymentStatus && paymentStatus?.attempts > 0 && (
//                       <p>Verification attempts: {paymentStatus?.attempts}</p>
//                     )}
//                   </AlertDescription>
//                 </Alert>
    
//                 {/* Payment Instructions */}
//                 <div className="text-sm space-y-2">
//                   <p>Please complete the payment using your preferred UPI app:</p>
//                   <ol className="list-decimal ml-4 space-y-1">
//                     <li>Open your UPI app</li>
//                     <li>Scan the QR code or click "Open UPI App"</li>
//                     <li>Complete the payment in your app</li>
//                     <li>Wait for confirmation (do not close this window)</li>
//                   </ol>
//                 </div>
    
//                 {/* Payment Actions */}
//                 <div className="space-y-2">
//                   <Button
//                     className="w-full"
//                     onClick={handleUPIPayment}
//                     disabled={!upiData?.upiUrl || paymentStatus?.status === 'completed'}
//                   >
//                     Open UPI App
//                   </Button>
                  
//                   {/* Only show retry for failed payments */}
//                   {paymentStatus?.status === 'failed' && (
//                     <Button
//                       variant="secondary"
//                       className="w-full"
//                       onClick={() => {
//                         setVerificationAttempted(false);
//                         verifyPayment.mutate({
//                           orderId: upiData?.orderId ?? '',
//                           refNumber: upiData?.refNumber ?? '',
//                           upiTransactionId: '',
//                           status: 'PENDING'
//                         });
//                       }}
//                     >
//                       Retry Verification
//                     </Button>
//                   )}
    
//                   <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={() => {
//                       setShowPaymentDialog(false);
//                       if (paymentStatus?.status === 'pending') {
//                         router.push('/orders'); // Redirect to orders page for pending payments
//                       }
//                     }}
//                   >
//                     {paymentStatus?.status === 'pending' ? 'View Orders' : 'Close'}
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>
//       );
//     };
    
//     export default CheckoutPage;



import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  CreditCard, Banknote, User, Phone, 
  Mail, Table, QrCode, Loader2,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useCompanyStore from '~/store/general';
import { api } from '~/trpc/react';
import useCartStore from '~/store/store';
import useOrderStore from '~/store/orderStore';

// Types
interface PaymentStatus {
  status: "failed" | "pending" | "completed";
  lastUpdated: Date;
  attempts: number;
  orderStatus: "failed" | "pending" | "completed" | "confirmed" | "preparing" | "ready" | "cancelled";
  error?: string;
}

interface UPIPaymentData {
  upiUrl: string;
  orderId: string;
  qrCode: string;
  refNumber: string;
  expiresAt: Date;
}

interface CheckoutFormData {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
}

interface Coupon {
  code: string;
  discount: number;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart, getCartItemIds } = useCartStore();
  const { companyId } = useCompanyStore();
  const {
    createOrder: createLocalOrder,
    updatePaymentStatus,
    updateOrderStatus,
    incrementPaymentAttempts,
    setPaymentError: setLocalPaymentError,getPendingOrders,clearOrders
  } = useOrderStore();
  
  // State management
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'|'upi'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [upiData, setUpiData] = useState<UPIPaymentData | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CheckoutFormData | undefined>(undefined);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone1: '',
      phone2: '',
      tableNumber: ''
    }
  });

//   useEffect(()=>{
// clearOrders()
//   },[])

  // Check pending orders mutation
  const checkPendingOrders = api.order.checkPendingOrders.useMutation({
    onSuccess: async(data) => {
      if (data.hasPendingOrder && data.pendingOrder) {
        // Set UPI data from existing order and show payment dialog
        console.log("pending",data)
        const pendingUpiData = {
          upiUrl: data.pendingOrder.upiUrl ?? "",
          orderId: data.pendingOrder.orderId ?? "",
          qrCode: data.pendingOrder.qrCode ?? "",
          refNumber: data.pendingOrder.refNumber ?? "",
          expiresAt: new Date(data.pendingOrder.expiresAt ?? "")
        };
        
        setUpiData(pendingUpiData);
        setShowPaymentDialog(true);
        setIsProcessing(false);
        
        // Start payment status checking for pending order
        checkPaymentStatus.mutate({
          refNumber: pendingUpiData.refNumber,
          orderId: pendingUpiData.orderId,
        });
      } else {
        // No pending order, proceed with new order creation
       await createNewOrder(pendingFormData);
      }
    },
    onError: (error) => {
      setPaymentError('Error checking pending orders: ' + error.message);
      setIsProcessing(false);
    }
  });
  // API mutations
  const verifyPayment = api.order.verifyUpiPayment.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setPaymentStatus({
          status: 'completed',
          lastUpdated: new Date(),
          attempts: data.order.attempts,
          orderStatus: data.order.status,
        });
        
        updatePaymentStatus(upiData?.orderId ?? '', 'completed');
        updateOrderStatus(upiData?.orderId ?? '', 'completed');
        
        clearCart();
        setTimeout(() => router.push('/order-success'), 2000);
      } else {
        setPaymentStatus({
          status: 'failed',
          lastUpdated: new Date(),
          attempts: data.order.attempts,
          orderStatus: data.order.status,
          error: 'Payment verification failed'
        });
        
        updatePaymentStatus(upiData?.orderId ?? '', 'failed', {
          error: 'Payment verification failed'
        });
        updateOrderStatus(upiData?.orderId ?? '', 'failed');
      }
    },
    onError: (error) => {
      setPaymentError(error.message);
      setPaymentStatus({
        status: 'failed',
        lastUpdated: new Date(),
        attempts: 0,
        orderStatus: 'failed',
        error: error.message
      });
      
      if (upiData?.orderId) {
        setLocalPaymentError(upiData.orderId, error.message);
      }
    }
  });

  const checkPaymentStatus = api.order.checkPaymentStatus.useMutation({
    onSuccess: (data) => {
      setPaymentStatus(data);
      
      if (upiData?.orderId) {
        updatePaymentStatus(upiData.orderId, data.status, {
          lastAttempt: new Date(),
          error: data.error
        });
        
        if (data.status === 'completed') {
          updateOrderStatus(upiData.orderId, 'completed');
          clearCart();
          router.push('/order-success');
        } else if (data.status === 'failed') {
          updateOrderStatus(upiData.orderId, 'failed');
          setPaymentError(data.error ?? 'Payment failed');
          setTimeout(() => router.push('/payment-failed'), 2000);
        }
      }
    },
    onError: (error) => {
      console.error('Payment status check failed:', error);
      setPaymentError('Error checking payment status');
      if (upiData?.orderId) {
        setLocalPaymentError(upiData.orderId, error.message);
      }
    }
  });

  const createOrder = api.order.createOrder.useMutation({
    onSuccess: (data) => {
      setIsProcessing(false);
      
      const localOrder = createLocalOrder({
        companyId: companyId!,
        name: data.user.name,
        email: data.user.email,
        phone1: data.user.phone,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        total: Number(data.amount),
        payment: {
          method: data.paymentMethod as 'cash' | 'online' | 'upi',
          status: 'pending',
          attempts: 0,
          ...(data.paymentMethod === 'upi' ? {
            refNumber: data.refNumber,
            qrCode: data.qrCode,
            upiUrl: data.upiUrl,
            expiresAt: new Date(data.expiresAt ?? '')
          } : {})
        },
        status: 'pending',
        paymentAttempts: 0,
      });

      if (data.paymentMethod === 'upi') {
        setUpiData({
          upiUrl: data.upiUrl ?? "",
          orderId: data.orderId,
          qrCode: data.qrCode ?? "",
          refNumber: data.refNumber ?? "",
          expiresAt: new Date(data.expiresAt ?? "")
        });
        setShowPaymentDialog(true);
      } else {
        clearCart();
        router.push('/order-success');
      }
    },
    onError: (error) => {
      setIsProcessing(false);
      setPaymentError(error.message);
    }
  });

  // Create new order function
  // const createNewOrder = async (formData?: CheckoutFormData) => {
  //   if (!formData) return;
    
  //   try {
  //     await createOrder.mutateAsync({
  //       ...formData,
  //       companyId: companyId as string,
  //       total: calculateTotal(),
  //       paymentMethod,
  //       items: cart.map(item => ({
  //         id: item.id,
  //         title: item.title,
  //         quantity: item.quantity,
  //         price: item.price
  //       }))
  //     });
  //   } catch (error) {
  //     setIsProcessing(false);
  //     setPaymentError('Failed to create order');
  //   }
  // };
    // Create new order function
    const createNewOrder = async (formData?: CheckoutFormData) => {
      if (!formData) return;
      
      try {
        await createOrder.mutateAsync({
          ...formData,
          companyId: companyId!,
          total: calculateTotal(),
          paymentMethod,
          items: cart.map(item => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        });
      } catch (error) {
        setIsProcessing(false);
        setPaymentError('Failed to create order');
      }
    };

  // Handle UPI verification after app return
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && upiData && !verificationAttempted) {
        setVerificationAttempted(true);
        verifyPayment.mutate({
          orderId: upiData.orderId,
          refNumber: upiData.refNumber,
          upiTransactionId: '',
          status: 'PENDING'
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [upiData, verificationAttempted]);

  // Payment status polling
  useEffect(() => {
    let statusInterval: NodeJS.Timeout;
    let timeoutInterval: NodeJS.Timeout;

    if (upiData?.orderId && showPaymentDialog) {
      statusInterval = setInterval(() => {
        incrementPaymentAttempts(upiData.orderId);
        checkPaymentStatus.mutate({
          refNumber: upiData.refNumber,
          orderId: upiData.orderId,
        });
      }, 3000);

      const expiryTime = new Date(upiData.expiresAt).getTime();
      timeoutInterval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
        setRemainingTime(remaining);
        if (remaining === 0) {
          clearInterval(statusInterval);
          clearInterval(timeoutInterval);
          setPaymentError('Payment time expired');
          if (upiData.orderId) {
            setLocalPaymentError(upiData.orderId, 'Payment time expired');
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(statusInterval);
      clearInterval(timeoutInterval);
    };
  }, [upiData, showPaymentDialog]);

  // Handle UPI payment
  const handleUPIPayment = () => {
    if (!upiData?.upiUrl) return;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = upiData.upiUrl;
    }
  };

  // Form submission with pending order check
  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    setPaymentError(null);
    setVerificationAttempted(false);
    setPendingFormData(data); // Store form data temporarily

    // Check for pending orders first
    const cartItemIds = getCartItemIds();
    await checkPendingOrders.mutateAsync({
      companyId: companyId!,
      itemIds: cartItemIds,
      email:data.email,
      date: new Date().toISOString().split('T')[0] ?? "",
    });
  };



  // Mock coupons (replace with API call in production)
  const mockCoupons: Record<string, Coupon> = {
    'FIRST10': { code: 'FIRST10', discount: 0.1 },
    'SAVE20': { code: 'SAVE20', discount: 0.2 }
  };

  const validateCoupon = () => {
    const coupon = mockCoupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      setPaymentError('Invalid coupon code');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => 
      total + item.price * item.quantity, 0
    );
    return appliedCoupon 
      ? subtotal * (1 - appliedCoupon.discount) 
      : subtotal;
  };

  // Component JSX remains the same as before
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <div className="flex items-center space-x-2">
                  <User className="text-muted-foreground" />
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Full Name"
                        aria-invalid={errors.name ? "true" : "false"}
                      />
                    )}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <Label>Email</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="text-muted-foreground" />
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email Address"
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    )}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div>
                <Label>Primary Phone</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="text-muted-foreground" />
                  <Controller
                    name="phone1"
                    control={control}
                    rules={{
                      required: 'Primary phone is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits"
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Primary Phone"
                        aria-invalid={errors.phone1 ? "true" : "false"}
                      />
                    )}
                  />
                </div>
                {errors.phone1 && <p className="text-red-500 text-sm">{errors.phone1.message}</p>}
              </div>

              <div>
                <Label>Secondary Phone (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Phone className="text-muted-foreground" />
                  <Controller
                    name="phone2"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Secondary Phone"
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <Label>Table Number (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Table className="text-muted-foreground" />
                  <Controller
                    name="tableNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Table Number"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-4">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="flex items-center justify-center space-x-2"
                >
                  <Banknote className="h-4 w-4" />
                  <span>Pay with Cash</span>
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('upi')}
                  className="flex items-center justify-center space-x-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Pay with UPI</span>
                </Button>
              </div>
            </div>

            {/* Coupon Section */}
            <div>
              <Label>Coupon Code (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={validateCoupon}
                >
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <p className="text-green-600 mt-2">
                  Coupon {appliedCoupon.code} applied: {appliedCoupon.discount * 100}% off
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full"
              disabled={isProcessing || cart.length === 0}
              type="submit"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Order'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete UPI Payment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* QR Code Display */}
            {upiData?.qrCode && (
              <div className="flex justify-center">
                <img 
                  src={upiData.qrCode} 
                  alt="Payment QR Code"
                  className="max-w-[200px]"
                />
              </div>
            )}

            {/* Reference Number */}
            {upiData?.refNumber && (
              <div className="text-center text-sm text-muted-foreground">
                Reference Number: {upiData.refNumber}
              </div>
            )}

            {/* Payment Status */}
            <Alert variant={
              paymentStatus?.status === 'completed' ? 'default' :
              paymentStatus?.status === 'failed' ? 'destructive' : 
              'default'
            }>
              <div className="flex items-center space-x-2">
                {paymentStatus?.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : paymentStatus?.status === 'failed' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <AlertTitle>
                  {paymentStatus?.status === 'completed' ? 'Payment Successful' :
                   paymentStatus?.status === 'failed' ? 'Payment Failed' :
                   'Awaiting Payment'}
                </AlertTitle>
              </div>
              <AlertDescription>
                {remainingTime > 0 && (
                  <p>Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</p>
                )}
                {paymentStatus?.error && (
                  <p className="text-red-500">{paymentStatus.error}</p>
                )}
                {paymentStatus && paymentStatus?.attempts > 0 && (
                  <p>Verification attempts: {paymentStatus?.attempts}</p>
                )}
              </AlertDescription>
            </Alert>

            {/* Payment Instructions */}
            <div className="text-sm space-y-2">
              <p>Please complete the payment using your preferred UPI app:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Open your UPI app</li>
                <li>{`Scan the QR code or click "Open UPI App"`}</li>
                <li>Complete the payment in your app</li>
                <li>Wait for confirmation (do not close this window)</li>
              </ol>
            </div>

            {/* Payment Actions */}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleUPIPayment}
                disabled={!upiData?.upiUrl || paymentStatus?.status === 'completed'}
              >
                Open UPI App
              </Button>
              
              {/* Only show retry for failed payments */}
              {paymentStatus?.status === 'failed' && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setVerificationAttempted(false);
                    verifyPayment.mutate({
                      orderId: upiData?.orderId ?? '',
                      refNumber: upiData?.refNumber ?? '',
                      upiTransactionId: '',
                      status: 'PENDING'
                    });
                  }}
                >
                  Retry Verification
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowPaymentDialog(false);
                  if (paymentStatus?.status === 'pending') {
                    router.push('/orders'); // Redirect to orders page for pending payments
                  }
                }}
              >
                {paymentStatus?.status === 'pending' ? 'View Orders' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;