// 'use client'
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm, Controller } from 'react-hook-form';
// import {
//   CreditCard,
//   Banknote,
//   User,
//   Phone,
//   Mail,
//   Table
// } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from '~/components/ui/card';
// import { Input } from '~/components/ui/input';
// import { Button } from '~/components/ui/button';
// import { Label } from '~/components/ui/label';
// import useCartStore from '~/store/store';
// import { api } from '~/trpc/react';
// // Payment Method Type
// type PaymentMethod = 'cash' | 'online';

// // Coupon Type
// interface Coupon {
//   code: string;
//   discount: number;
// }

// // Form Data Interface
// interface CheckoutFormData {
//   name: string;
//   email: string;
//   phone1: string;
//   phone2?: string;
//   tableNumber?: string;
// }
// const CheckoutPage: React.FC = () => {
//   const router = useRouter();
//   const { cart, clearCart } = useCartStore();

//   // React Hook Form 
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch
//   } = useForm<CheckoutFormData>({
//     defaultValues: {
//       name: '',
//       email: '',
//       phone1: '',
//       phone2: '',
//       tableNumber: ''
//     }
//   });

//   // Payment Method State
//   const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('online');
//   const [couponCode, setCouponCode] = React.useState('');
//   const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);



//   console.log(cart, "Caret")


//   const verifyPayment = api.order.verifyPayment.useMutation({})


//   // Calculate Total
//   const calculateTotal = (): number => {
//     const subtotal = cart.reduce((total, item) =>
//       total + item.price * item.quantity, 0);

//     return appliedCoupon
//       ? subtotal * (1 - appliedCoupon.discount)
//       : subtotal;
//   };

//   // Coupon Validation (Mock implementation)
//   const validateCoupon = () => {
//     const mockCoupons: { [key: string]: Coupon } = {
//       'FIRST10': { code: 'FIRST10', discount: 0.1 },
//       'SAVE20': { code: 'SAVE20', discount: 0.2 }
//     };

//     const coupon = mockCoupons[couponCode.toUpperCase()];

//     if (coupon) {
//       setAppliedCoupon(coupon);
//     } else {
//       alert('Invalid Coupon Code');
//     }
//   };

//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);

//   useEffect(() => {
//     // Check if Razorpay is loaded
//     const checkRazorpayLoaded = () => {
//       if (window.Razorpay) {
//         setRazorpayLoaded(true);
//       } else {
//         setTimeout(checkRazorpayLoaded, 100);
//       }
//     };
//     checkRazorpayLoaded();
//   }, []);

//   const createOrder = api.order.createOrder.useMutation({
//     onSuccess: (data: {
//       orderId: string;
//       razorpayOrderId: string | null;
//       amount: string;
//       currency: string;
//       user: { name: string, email: string, phone: string }
//     }) => {
//       if (!razorpayLoaded) {
//         console.error('Razorpay not loaded');
//         return;
//       }

//       // Razorpay configuration remains the same
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_CoB0vBovJyW2aU",
//         amount: parseInt(data.amount),
//         currency: data.currency,
//         name: "ZEROQUE",
//         description: "Ordering product",
//         order_id: data.razorpayOrderId,
//         handler: async function (response: {
//           razorpay_payment_id: string;
//           razorpay_order_id: string;
//           razorpay_signature: string;
//         }) {
//           try {
//             const verificationResult = await verifyPayment.mutateAsync({
//               orderId: data.orderId.toString(),
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpayOrderId: response.razorpay_order_id,
//               razorpaySignature: response.razorpay_signature,
//             });

//             if (verificationResult.success) {
//               router.push('/order-success');
//             }
//           } catch (error) {
//             console.error("Payment verification failed", error);
//             router.push('/payment-failed');
//           }
//         },
//         prefill: {
//           name: data?.user?.name ?? "ZEROQUE-user",
//           email: data.user.email,
//           contact: data.user.phone,
//         },
//         notes: {
//           orderId: data.orderId,
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();

//       clearCart()
//     },
//     onError: (error) => {
//       console.error("Order creation failed", error);
//     },
//   });


//   // Handle Form Submission
//   const onSubmit = async (data: CheckoutFormData) => {
//     // e.preventDefault()
//     // TODO: Implement actual order submission logic
//     const orderDetails = {
//       ...data,
//       cart,
//       total: calculateTotal(),
//       paymentMethod,
//       coupon: appliedCoupon
//     };

//     console.log('Order Submitted', orderDetails);

//    await createOrder.mutateAsync({
//       name: data.name,
//       email: data.email,
//       phone1: data.phone1,
//       phone2: data.phone2 ?? '',
//       tableNumber: data.tableNumber ?? '',
//       total: calculateTotal(),
//       paymentMethod: paymentMethod,
//       items: cart.map(item => ({
//         id: item.id,
//         title: item.title,
//         quantity: item.quantity,
//         price: item.price
//       }))
//     })



//     // Clear cart and redirect
//     // clearCart();
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Card>
//         <CardHeader>
//           <CardTitle>Checkout</CardTitle>
//         </CardHeader>
//         <CardContent>
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
//             <div>
//               <Label>Payment Method</Label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
//                 {[
//                   { value: 'cash', label: 'Pay on Cash', icon: <Banknote /> },
//                   { value: 'online', label: 'Pay on Online', icon: <CreditCard /> },
//                   // { value: 'qr', label: 'QR Pay', icon: <QrCode /> }
//                 ].map(method => (
//                   <Button
//                     key={method.value}
//                     type="button"
//                     variant={paymentMethod === method.value ? 'default' : 'outline'}
//                     onClick={() => setPaymentMethod(method.value as PaymentMethod)}
//                     className="flex items-center space-x-2"
//                   >
//                     {method.icon}
//                     <span>{method.label}</span>
//                   </Button>
//                 ))}
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
//               )}
//             </div>

//             {/* Order Summary */}
//             <div>
//               <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
//               {cart.map(item => (
//                 <div key={item.id} className="flex justify-between items-center mb-2">
//                   <span>{item.title} x {item.quantity}</span>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//               <div className="border-t pt-2 flex justify-between font-bold">
//                 <span>Total</span>
//                 <span>${calculateTotal().toFixed(2)}</span>
//               </div>
//             </div>
//             <Button 
//   className="w-full" 
//   disabled={!razorpayLoaded || cart.length === 0} 
//   type="submit"
// >
//   {razorpayLoaded ? 'Proceed to Payment' : 'Loading...'}
// </Button>

//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CheckoutPage;

'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  CreditCard,
  Banknote,
  User,
  Phone,
  Mail,
  Table
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import useCartStore from '~/store/store';
import { api } from '~/trpc/react';
import { TRPCError } from '@trpc/server';

// Payment Method Type
type PaymentMethod = 'cash' | 'online';

// Coupon Type
interface Coupon {
  code: string;
  discount: number;
}

// Cart Item Type
interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
}

// Form Data Interface
interface CheckoutFormData {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  tableNumber?: string;
}

// Razorpay Types
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

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

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();

  // React Hook Form 
  const {
    control,
    handleSubmit,
    formState: { errors },
    // Explicitly use setValue and watch if needed
    setValue,
    watch
  } = useForm<CheckoutFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone1: '',
      phone2: '',
      tableNumber: ''
    }
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('online');
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<Coupon | null>(null);

  // Prepare mock coupons with proper typing
  const mockCoupons: Record<string, Coupon> = {
    'FIRST10': { code: 'FIRST10', discount: 0.1 },
    'SAVE20': { code: 'SAVE20', discount: 0.2 }
  };

  const verifyPayment = api.order.verifyPayment.useMutation({});

  // Calculate Total with explicit typing
  const calculateTotal = (): number => {
    const subtotal = cart.reduce((total, item: CartItem) =>
      total + item.price * item.quantity, 0);

    return appliedCoupon
      ? subtotal * (1 - appliedCoupon.discount)
      : subtotal;
  };

  // Coupon Validation with improved typing
  const validateCoupon = () => {
    const coupon = mockCoupons[couponCode.toUpperCase()];

    if (coupon) {
      setAppliedCoupon(coupon);
    } else {
      alert('Invalid Coupon Code');
    }
  };

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Check if Razorpay is loaded with type guard
    const checkRazorpayLoaded = () => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        setRazorpayLoaded(true);
      } else {
        setTimeout(checkRazorpayLoaded, 100);
      }
    };
    checkRazorpayLoaded();
  }, []);

  const createOrder = api.order.createOrder.useMutation({
    onSuccess: (data: {
      orderId: string;
      razorpayOrderId: string | null;
      amount: string;
      currency: string;
      user: { name: string, email: string, phone: string }
    }) => {
      if (!razorpayLoaded) {
        console.error('Razorpay not loaded');
        return;
      }

      // Explicitly type Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_CoB0vBovJyW2aU",
        amount: parseInt(data.amount),
        currency: data.currency,
        name: "ZEROQUE",
        description: "Ordering product",
        order_id: data.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verificationResult = await verifyPayment.mutateAsync({
              orderId: data.orderId.toString(),
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verificationResult.success) {
              router.push('/order-success');
            }
          } catch (error) {
            console.error("Payment verification failed", error);
            router.push('/payment-failed');
          }
        },
        prefill: {
          name: data?.user?.name ?? "ZEROQUE-user",
          email: data.user.email,
          contact: data.user.phone,
        },
        notes: {
          orderId: data.orderId,
        },
        theme: {
          color: "#3399cc",
        },
      };

      //@ts-nocheck
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      clearCart();
    },
    onError: (error: unknown) => {
      console.error("Order creation failed", error);
    },
  });

  // Handle Form Submission with improved typing
  const onSubmit = async (data: CheckoutFormData) => {
    const orderDetails = {
      ...data,
      cart,
      total: calculateTotal(),
      paymentMethod,
      coupon: appliedCoupon
    };

    console.log('Order Submitted', orderDetails);

    try {
      await createOrder.mutateAsync({
        name: data.name,
        email: data.email,
        phone1: data.phone1,
        phone2: data.phone2 ?? '',
        tableNumber: data.tableNumber ?? '',
        total: calculateTotal(),
        paymentMethod: paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price
        }))
      });
    } catch (error) {
      console.error('Order creation failed', error);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <Button 
              className="w-full" 
              disabled={!razorpayLoaded || cart.length === 0} 
              type="submit"
            >
              {razorpayLoaded ? 'Proceed to Payment' : 'Loading...'}
            </Button>
          </form>
        </CardContent>
      </Card> */}

<Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div>
              <Label>Payment Method</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {[
                  { value: 'cash', label: 'Pay on Cash', icon: <Banknote /> },
                  { value: 'online', label: 'Pay on Online', icon: <CreditCard /> },
                  // { value: 'qr', label: 'QR Pay', icon: <QrCode /> }
                ].map(method => (
                  <Button
                    key={method.value}
                    type="button"
                    variant={paymentMethod === method.value ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                    className="flex items-center space-x-2"
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </Button>
                ))}
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
  disabled={!razorpayLoaded || cart.length === 0} 
  type="submit"
>
  {razorpayLoaded ? 'Proceed to Payment' : 'Loading...'}
</Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;