// // src/server/api/routers/order.ts
// import { TRPCError } from "@trpc/server";
// import { z } from "zod";
// import { publicProcedure } from "~/server/api/trpc";
// import { OrderModel, OrderValidationSchema } from "~/server/db/order/order";
// import { sendOrderConfirmationEmail } from "~/utils/nodemailer";

// export const orderRouter = {
//   createOrder: publicProcedure
//     .input(OrderValidationSchema)
//     .mutation(async ({ input }) => {
//       try {
//         // Create new order
//         const newOrder = new OrderModel({
//           ...input,
//           status: 'pending'
//         });

//         // Save order to database
//         const savedOrder = await newOrder.save();

//         if(input.paymentMethod === 'online'){


          
//         }

       
//         // Send order confirmation email
//         await sendOrderConfirmationEmail({
//           to: input.email,
//           orderDetails: {
//             orderId: savedOrder._id.toString(),
//             name: input.name,
//             total: input.total,
//             items: input.cart,
//             paymentMethod: input.paymentMethod
//           }
//         });

//         return {
//           success: true,
//           orderId: savedOrder._id.toString(),
//           message: "Order placed successfully"
//         };
//       } catch (error) {
//         console.error("Order creation error:", error);
//         throw new TRPCError({
//           code: "INTERNAL_SERVER_ERROR",
//           message: "Failed to create order"
//         });
//       }
//     })
// };
// import { TRPCError } from "@trpc/server";
// import { z } from "zod";
// import Razorpay from "razorpay";
// import { publicProcedure } from "~/server/api/trpc";
// import { OrderModel } from "~/server/db/order/order";
// import { sendOrderConfirmationEmail } from "~/utils/nodemailer";
// import crypto from 'crypto';

// const orderInputSchema = z.object({
//     name: z.string().min(2, "Name is required"),
//     email: z.string().email("Invalid email address"),
//     phone1: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
//     phone2: z.string().optional(),
//     tableNumber: z.string().optional(),
//     items: z.array(
//       z.object({
//         id: z.string(),
//         title: z.string(),
//         price: z.number().positive(),
//         quantity: z.number().positive(),
//       })
//     ),
//     total: z.number().positive(),
//     paymentMethod: z.enum(["cash", "online"]),
//     coupon: z
//       .object({
//         code: z.string().optional(),
//         discount: z.number().optional(),
//       })
//       .optional(),
//   });

// // Razorpay Configuration
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_CoB0vBovJyW2aU',
//   key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'kPJWBKuArGEh8fL76NvXFAsQ'
// });

// // Helper function to generate Razorpay payment order
// async function generateRazorpayPaymentOrder(order: { _id: string, total: number }) {
//   try {
//     const options = {
//       amount: Math.round(order.total * 100), // amount in paise
//       currency: "INR",
//       receipt: order._id,
//       payment_capture: 1, // Auto capture payment
//       notes: {
//         userId: "default_user",
//         orderId: order._id
//       }
//     };

//     // Create Razorpay order
//     const razorpayOrder = await razorpay.orders.create(options);

//     console.log('Razorpay Order Created:', razorpayOrder);

//     return {
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency
//     };
//   } catch (error) {
//     console.error('Razorpay Order Creation Error:', error);
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: `Failed to generate Razorpay payment order: ${error instanceof Error ? error.message : 'Unknown error'}`
//     });
//   }
// }

// export const createOrder = publicProcedure
//   .input(orderInputSchema)
//   .mutation(async ({ input }) => {
//     try {
//       // Create new order
//       const newOrder = new OrderModel({
//         ...input,
//         status: 'pending',
//         transactionId: input.paymentMethod === 'online' ? crypto.randomBytes(16).toString('hex') : undefined
//       });

//       // Save order to database
//       const savedOrder = await newOrder.save();

//       console.log(input.paymentMethod, "method");

//       let paymentResponse;
//       if (input.paymentMethod === 'online') {
//         // Generate Razorpay payment order
//         // Convert _id to string explicitly
//         paymentResponse = await generateRazorpayPaymentOrder({
//           _id: savedOrder._id.toString(), 
//           total: savedOrder.total
//         });
//       }

//       console.log(paymentResponse, "response");

//       // Optional: Uncomment to send order confirmation email
//       // await sendOrderConfirmationEmail({
//       //   to: input.email,
//       //   orderDetails: {
//       //     orderId: savedOrder._id.toString(),
//       //     name: input.name,
//       //     total: input.total,
//       //     items: input.cart,
//       //     paymentMethod: input.paymentMethod,
//       //     razorpayOrderId: paymentResponse?.orderId
//       //   }
//       // });

//       return {
//         // Explicitly convert _id to string
//         orderId: savedOrder._id.toString(),
//         razorpayOrderId: paymentResponse?.orderId ?? null,
//         amount: paymentResponse?.amount.toString() ?? "0",
//         currency: paymentResponse?.currency ?? "",
//         user: { name: input.name, email: input.email, phone: input.phone1 ?? input.phone2 }
//       };
//     } catch (error) {
//       console.error("Order creation error:", error);
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to create order"
//       });
//     }
//   });

// import { TRPCError } from "@trpc/server";
// import { z } from "zod";
// import Razorpay from "razorpay";
// import crypto from 'crypto';
// import { publicProcedure } from "~/server/api/trpc";
// import { OrderModel } from "~/server/db/order/order";
// import { sendOrderConfirmationEmail } from "~/utils/nodemailer";
// import { Types } from "mongoose";

// const orderInputSchema = z.object({
//     name: z.string().min(2, "Name is required"),
//     email: z.string().email("Invalid email address"),
//     phone1: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
//     phone2: z.string().optional(),
//     tableNumber: z.string().optional(),
//     items: z.array(
//       z.object({
//         id: z.string(),
//         title: z.string(),
//         price: z.number().positive(),
//         quantity: z.number().positive(),
//       })
//     ),
//     total: z.number().positive(),
//     paymentMethod: z.enum(["cash", "online"]),
//     coupon: z
//       .object({
//         code: z.string().optional(),
//         discount: z.number().optional(),
//       })
//       .optional(),
//   });

// // Razorpay Configuration
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_CoB0vBovJyW2aU',
//   key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'kPJWBKuArGEh8fL76NvXFAsQ'
// });

// // Helper function to generate Razorpay payment order
// async function generateRazorpayPaymentOrder(order: { _id: string, total: number }) {
//   try {
//     const options = {
//       amount: Math.round(order.total * 100), // amount in paise
//       currency: "INR",
//       receipt: order._id,
//       payment_capture: 1, // Auto capture payment
//       notes: {
//         userId: "default_user",
//         orderId: order._id
//       }
//     };

//     // Create Razorpay order
//     const razorpayOrder = await razorpay.orders.create(options);

//     console.log('Razorpay Order Created:', razorpayOrder);

//     return {
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency
//     };
//   } catch (error) {
//     console.error('Razorpay Order Creation Error:', error);
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: `Failed to generate Razorpay payment order: ${error instanceof Error ? error.message : 'Unknown error'}`
//     });
//   }
// }

// export const createOrder = publicProcedure
//   .input(orderInputSchema)
//   .mutation(async ({ input }) => {
//     try {
//       // Create new order
//       const newOrder = new OrderModel({
//         ...input,
//         status: 'pending',
//         transactionId: input.paymentMethod === 'online' 
//           ? crypto.randomBytes(16).toString('hex') 
//           : ''
//       });

//       // Save order to database
//       const savedOrder = await newOrder.save();

//       console.log(input.paymentMethod, "method");

//       let paymentResponse;
//       if (input.paymentMethod === 'online') {
//         // Generate Razorpay payment order
//         // Explicitly convert _id to string
//         paymentResponse = await generateRazorpayPaymentOrder({
//             _id: (savedOrder._id as unknown as Types.ObjectId).toString(),
//           total: savedOrder.total
//         });
//       }

//       console.log(paymentResponse, "response");

//       // Explicitly mark sendOrderConfirmationEmail as used to prevent lint warning
//       void sendOrderConfirmationEmail;

//       // Optional: Uncomment to send order confirmation email
//       // await sendOrderConfirmationEmail({
//       //   to: input.email,
//       //   orderDetails: {
//       //     orderId: savedOrder._id.toString(),
//       //     name: input.name,
//       //     total: input.total,
//       //     items: input.cart,
//       //     paymentMethod: input.paymentMethod,
//       //     razorpayOrderId: paymentResponse?.orderId
//       //   }
//       // });

//       return {
//         // Explicitly convert _id to string using .toString()
//         orderId: (savedOrder._id as unknown as Types.ObjectId).toString(),
//         razorpayOrderId: paymentResponse?.orderId ?? null,
//         amount: paymentResponse?.amount.toString() ?? "0",
//         currency: paymentResponse?.currency ?? "",
//         user: { 
//           name: input.name, 
//           email: input.email, 
//           phone: input.phone1 ?? input.phone2 ?? '' 
//         }
//       };
//     } catch (error) {
//       console.error("Order creation error:", error);
//       throw new TRPCError({
//         code: "INTERNAL_SERVER_ERROR",
//         message: "Failed to create order"
//       });
//     }
//   });


// First, let's update your schema to include seller information
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { CompanyModel } from "~/server/db/company/company";
import { OrderModel } from "~/server/db/order/order";
import { Types } from "mongoose";
import Razorpay from "razorpay";
import crypto from 'crypto';

const sellerSchema = z.object({
  id: z.string(),
  upiId: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/, "Invalid UPI ID"),
  businessName: z.string(),
  phone: z.string()
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_CoB0vBovJyW2aU',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'kPJWBKuArGEh8fL76NvXFAsQ'
});

async function generateRazorpayPaymentOrder(order: { _id: string, total: number }) {
  try {
    const options = {
      amount: Math.round(order.total * 100), // amount in paise
      currency: "INR",
      receipt: order._id,
      payment_capture: 1, // Auto capture payment
      notes: {
        userId: "default_user",
        orderId: order._id
      }
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    console.log('Razorpay Order Created:', razorpayOrder);

    return {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    };
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to generate Razorpay payment order: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

// Update your existing orderInputSchema
const orderInputSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone1: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  phone2: z.string().optional(),
  tableNumber: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      price: z.number().positive(),
      quantity: z.number().positive(),
    })
  ),
  total: z.number().positive(),
  paymentMethod: z.enum(["cash", "online"]), // Add UPI as payment method
  companyId: z.string(), // Add seller ID
  coupon: z
    .object({
      code: z.string().optional(),
      discount: z.number().optional(),
    })
    .optional(),
});

// Add UPI payment generation function
async function generateUpiPaymentIntent(order: { 
  _id: string, 
  total: number,
  seller: { 
    upiId: string,
    businessName: string 
  }
}) {
  try {
    const refNumber = `ORDER_${order._id}_${Date.now()}`;
    
    const paymentIntent = {
      pa: order.seller.upiId,
      pn: order.seller.businessName,
      am: order.total.toString(),
      tn: refNumber,
      cu: 'INR',
      mc: '5812', // Restaurant merchant code
    };

    // Generate UPI URL
    const upiUrl = `upi://pay?${new URLSearchParams(paymentIntent)}`;
    
    return {
      upiUrl,
      refNumber,
    };
  } catch (error) {
    console.error('UPI Intent Generation Error:', error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to generate UPI payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

// Update your createOrder procedure
export const createOrder = publicProcedure
  .input(orderInputSchema)
  .mutation(async ({ input }) => {
    try {
      // Find seller details (implement your seller lookup logic)
      const company = await CompanyModel.findById(input.companyId);
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Seller not found"
        });
      }

      // Create new order
      const newOrder = new OrderModel({
        ...input,
        status: 'pending',
        transactionId: crypto.randomBytes(16).toString('hex')
      });

      // Save order to database
      const savedOrder = await newOrder.save();
      const orderId = (savedOrder._id as unknown as Types.ObjectId).toString();

      let paymentResponse;
       if (input.paymentMethod === 'online') {
        // New UPI flow
        const upiResponse = await generateUpiPaymentIntent({
          _id: orderId,
          total: savedOrder.total,
          seller: {
            upiId: '7400468008@ibl',
            businessName: "new-cafe"
          }
        });
        
        return {
          orderId,
          upiUrl: upiResponse.upiUrl,
          refNumber: upiResponse.refNumber,
          amount: savedOrder.total.toString(),
          currency: "INR",
          paymentMethod: 'upi',
          user: { 
            name: input.name, 
            email: input.email, 
            phone: input.phone1 ?? input.phone2 ?? '' 
          }
        };
      }
      
      // Cash payment
      return {
        orderId,
        amount: savedOrder.total.toString(),
        currency: "INR",
        paymentMethod: 'cash',
        user: { 
          name: input.name, 
          email: input.email, 
          phone: input.phone1 ?? input.phone2 ?? '' 
        }
      };

    } catch (error) {
      console.error("Order creation error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create order"
      });
    }
  });

// Add a verification endpoint for UPI payments
export const verifyUpiPayment = publicProcedure
  .input(z.object({
    orderId: z.string(),
    refNumber: z.string(),
    upiTransactionId: z.string(),
    status: z.enum(['SUCCESS', 'FAILURE'])
  }))
  .mutation(async ({ input }) => {
    try {
      const order = await OrderModel.findById(input.orderId);
      
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found"
        });
      }

      if (input.status === 'SUCCESS') {
        order.status = 'completed';
        order.transactionId = input.upiTransactionId;
      } else {
        order.status = 'failed';
      }

      await order.save();

      return {
        success: input.status === 'SUCCESS',
        order: {
          id: order._id.toString(),
          status: order.status
        }
      };
    } catch (error) {
      console.error("UPI verification error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to verify UPI payment"
      });
    }
  });