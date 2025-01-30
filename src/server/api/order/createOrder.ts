
// //// sepereated 


// import { TRPCError } from "@trpc/server";
// import { z } from "zod";
// import { publicProcedure } from "../trpc";
// import { CompanyModel } from "~/server/db/company/company";
// import { OrderModel } from "~/server/db/order/order";
// import QRCode from 'qrcode';
// import crypto from 'crypto';
// import { PaymentStore } from '~/lib/redis';

// // Validation schemas
// const orderInputSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   phone1: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
//   phone2: z.string().optional(),
//   tableNumber: z.string().optional(),
//   items: z.array(
//     z.object({
//       id: z.string(),
//       title: z.string(),
//       price: z.number().positive(),
//       quantity: z.number().positive(),
//     })
//   ),
//   total: z.number().positive(),
//   paymentMethod: z.enum(["cash", "online",'upi']),
//   companyId: z.string(),
//   coupon: z.object({
//     code: z.string().optional(),
//     discount: z.number().optional(),
//   }).optional(),
// });

// // UPI payment intent generation
// async function generateUpiPaymentIntent(order: { 
//   _id: string, 
//   total: number,
//   seller: { 
//     upiId: string,
//     businessName: string 
//   }
// }, retry = 0): Promise<{
//   upiUrl: string;
//   qrCode: string;
//   refNumber: string;
//   expiresAt: Date;
// }> {
//   try {
//     const refNumber = `ORD${order._id.slice(-6)}${Date.now().toString(36)}`;
    
//     const paymentIntent = {
//       pa: order.seller.upiId,
//       pn: order.seller.businessName,
//       tr: refNumber,
//       am: order.total.toString(),
//       cu: 'INR',
//       mc: '5812',
//       tn: `Payment for order ${order._id}`,
//       url: 'your-website.com',
//     };

//     const upiUrl = `upi://pay?${new URLSearchParams(paymentIntent)}`;
//     const qrCode = await QRCode.toDataURL(upiUrl, {
//       errorCorrectionLevel: 'H',
//       margin: 1,
//       width: 300,
//     });

//     const expiresAt = new Date();
//     expiresAt.setMinutes(expiresAt.getMinutes() + 30);

//     // Initialize payment status in Redis
//     await PaymentStore.setPaymentStatus(refNumber, {
//       status: 'pending',
//       lastUpdated: new Date(),
//       attempts: 0,
//     });

//     return {
//       upiUrl,
//       qrCode,
//       refNumber,
//       expiresAt,
//     };
//   } catch (error) {
//     console.error('UPI Intent Generation Error:', error);
    
//     if (retry < 3) {
//       await new Promise(resolve => setTimeout(resolve, 1000 * retry));
//       return generateUpiPaymentIntent(order, retry + 1);
//     }

//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: `Failed to generate UPI payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
//     });
//   }
// }

// // Create order procedure
// export const createOrder = publicProcedure
//   .input(orderInputSchema)
//   .mutation(async ({ input }) => {
//     try {
//       const company = await CompanyModel.findById(input.companyId);
//       if (!company) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Company not found"
//         });
//       }

//       const newOrder = new OrderModel({
//         ...input,
//         payment: {
//           method: input.paymentMethod
//         },
//         status: 'pending',
//         transactionId: crypto.randomBytes(16).toString('hex'),
//         createdAt: new Date(),
//         paymentAttempts: 0,
//         lastPaymentAttempt: null,
//       });

//       const savedOrder = await newOrder.save();
//       const orderId = savedOrder._id.toString();

//       if (input.paymentMethod === 'upi') {
//         const upiResponse = await generateUpiPaymentIntent({
//           _id: orderId,
//           total: savedOrder.total,
//           seller: {
//             upiId: '7400468008@ibl',
//             businessName: "Restaurant"
//           }
//         });

//         return {
//           orderId,
//           upiUrl: upiResponse.upiUrl,
//           qrCode: upiResponse.qrCode,
//           refNumber: upiResponse.refNumber,
//           expiresAt: upiResponse.expiresAt,
//           amount: savedOrder.total.toString(),
//           currency: "INR",
//           paymentMethod: 'upi',
//           user: { 
//             name: input.name, 
//             email: input.email, 
//             phone: input.phone1 ?? input.phone2 ?? '' 
//           }
//         };
//       }
      
//       return {
//         orderId,
//         amount: savedOrder.total.toString(),
//         currency: "INR",
//         paymentMethod: 'cash',
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
//         message: error instanceof Error ? error.message : "Failed to create order"
//       });
//     }
//   });


// import { TRPCError } from "@trpc/server";
// import { z } from "zod";
// import { publicProcedure } from "../trpc";
// import { CompanyModel } from "~/server/db/company/company";
// import { OrderModel } from "~/server/db/order/order";
// import QRCode from 'qrcode';
// import crypto from 'crypto';
// import { PaymentStore } from '~/lib/redis';

// const orderInputSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   phone1: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
//   phone2: z.string().optional(),
//   tableNumber: z.string().optional(),
//   items: z.array(
//     z.object({
//       id: z.string(),
//       title: z.string(),
//       price: z.number().positive(),
//       quantity: z.number().positive(),
//     })
//   ),
//   total: z.number().positive(),
//   paymentMethod: z.enum(["cash", "online", 'upi']),
//   companyId: z.string(),
//   coupon: z.object({
//     code: z.string().optional(),
//     discount: z.number().optional(),
//   }).optional(),
// });

// async function generateUpiPaymentIntent(order: { 
//   _id: string, 
//   total: number,
//   seller: { 
//     upiId: string,
//     businessName: string 
//   }
// }, retry = 0): Promise<{
//   upiUrl: string;
//   qrCode: string;
//   refNumber: string;
//   expiresAt: Date;
// }> {
//   try {
//     const refNumber = `ORD${order._id.slice(-6)}${Date.now().toString(36)}`;
    
//     const paymentIntent = {
//       pa: order.seller.upiId,
//       pn: order.seller.businessName,
//       tr: refNumber,
//       am: order.total.toString(),
//       cu: 'INR',
//       mc: '5812',
//       tn: `Payment for order ${order._id}`,
//       url: 'your-website.com',
//     };

//     const upiUrl = `upi://pay?${new URLSearchParams(paymentIntent)}`;
//     const qrCode = await QRCode.toDataURL(upiUrl, {
//       errorCorrectionLevel: 'H',
//       margin: 1,
//       width: 300,
//     });

//     const expiresAt = new Date();
//     expiresAt.setMinutes(expiresAt.getMinutes() + 30);

//     await PaymentStore.setPaymentStatus(refNumber, {
//       status: 'pending',
//       lastUpdated: new Date(),
//       attempts: 0,
//     });

//     return {
//       upiUrl,
//       qrCode,
//       refNumber,
//       expiresAt,
//     };
//   } catch (error) {
//     console.error('UPI Intent Generation Error:', error);
    
//     if (retry < 3) {
//       await new Promise(resolve => setTimeout(resolve, 1000 * retry));
//       return generateUpiPaymentIntent(order, retry + 1);
//     }

//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: `Failed to generate UPI payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`
//     });
//   }
// }

// export const createOrder = publicProcedure
//   .input(orderInputSchema)
//   .mutation(async ({ input }) => {
//     try {
//       const company = await CompanyModel.findById(input.companyId);
//       if (!company) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: "Company not found"
//         });
//       }

//       const newOrder = new OrderModel({
//         ...input,
//         payment: {
//           method: input.paymentMethod,
//           status: 'pending',
//           attempts: 0,
//           lastAttempt: new Date()
//         },
//         status: 'pending',
//         transactionId: crypto.randomBytes(16).toString('hex'),
//         createdAt: new Date()
//       });

//       if (input.paymentMethod === 'upi') {
//         const upiResponse = await generateUpiPaymentIntent({
//           _id: newOrder._id.toString(),
//           total: newOrder.total,
//           seller: {
//             upiId: '7400468008@ibl',
//             businessName: "Restaurant"
//           }
//         });

//         // Store UPI payment details in the order
//         newOrder.payment.upiUrl = upiResponse.upiUrl;
//         newOrder.payment.qrCode = upiResponse.qrCode;
//         newOrder.payment.refNumber = upiResponse.refNumber;
//         newOrder.payment.expiresAt = upiResponse.expiresAt;
//       }

//       const savedOrder = await newOrder.save();

//       if (input.paymentMethod === 'upi') {
//         return {
//           orderId: savedOrder._id.toString(),
//           upiUrl: savedOrder.payment.upiUrl,
//           qrCode: savedOrder.payment.qrCode,
//           refNumber: savedOrder.payment.refNumber,
//           expiresAt: savedOrder.payment.expiresAt,
//           amount: savedOrder.total.toString(),
//           currency: "INR",
//           paymentMethod: 'upi',
//           user: { 
//             name: input.name, 
//             email: input.email, 
//             phone: input.phone1 ?? input.phone2 ?? '' 
//           }
//         };
//       }
      
//       return {
//         orderId: savedOrder._id.toString(),
//         amount: savedOrder.total.toString(),
//         currency: "INR",
//         paymentMethod: 'cash',
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
//         message: error instanceof Error ? error.message : "Failed to create order"
//       });
//     }
//   });


import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { CompanyModel } from "~/server/db/company/company";
import { OrderModel } from "~/server/db/order/order";
import QRCode from 'qrcode';
import crypto from 'crypto';
import { PaymentStore } from '~/lib/redis';



type PaymentIntentData = {
  pa: string;
  pn: string;
  tr: string;
  am: string;
  cu: string;
  mc: string;
  tn: string;
  mode?: string;
  purpose?: string;
  orgid?: string;
  sign?: string;
};

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
  paymentMethod: z.enum(["cash", "online", 'upi']),
  companyId: z.string(),
  // seller: sellerSchema,
  coupon: z.object({
    code: z.string().optional(),
    discount: z.number().optional(),
  }).optional(),
});


async function generateUpiPaymentIntent(order: { 
  _id: string, 
  total: number,
  seller: { 
    upiId: string,
    businessName: string,
  }
}) {
  try {
    const refNumber = `ORD${order._id.slice(-6)}${Date.now().toString(36)}`;
    
    const intentData = {
      pa: order.seller.upiId??"",
      pn: order.seller.businessName,
      tr: refNumber,
      am: Math.round(order.total).toString(),
      cu: 'INR',
      mc: '5812',
      tn: `Order ${order._id}`,
      mode: '04',
      purpose: 'merchant_payment',
    };

    const upiUrl = `upi://pay?${new URLSearchParams(intentData)}`;
    
    const qrCode = await QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
    });

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return { upiUrl, qrCode, refNumber, expiresAt, intentData };
  } catch (error) {
    throw new Error(`Failed to generate UPI payment: ${error as Error}`);
  }
}
export const createOrder = publicProcedure
  .input(orderInputSchema)
  .mutation(async ({ input }) => {

    console.log(input, "input-------------------")
    try {
      const company = await CompanyModel.findById(input.companyId);
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found"
        });
      }

      // Validate seller UPI ID format
      // if (input.paymentMethod === 'upi' && !company.upiId.includes('@')) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Invalid UPI ID format"
      //   });
      // }

      console.log(company,"company-------------------")
      const seller={
        upiId:company.upiId ?? '' ,
          businessName: company.name ?? 'zeroQ business partner'
      }

      const newOrder = new OrderModel({
        ...input,
        payment: {
          method: input.paymentMethod,
          status: 'pending',
          attempts: 0,
          lastAttempt: new Date()
        },
        seller: seller,
        status: 'pending',
        transactionId: crypto.randomBytes(16).toString('hex'),
        createdAt: new Date()
      });

      if (input.paymentMethod === 'upi') {
        const upiResponse = await generateUpiPaymentIntent({
          _id: newOrder._id.toString(),
          total: newOrder.total,
          seller: seller
        });

        // Store UPI payment details
        newOrder.payment = {
          ...newOrder.payment,
          upiUrl: upiResponse.upiUrl,
          qrCode: upiResponse.qrCode,
          refNumber: upiResponse.refNumber,
          expiresAt: upiResponse.expiresAt,
          intentData: upiResponse.intentData
        };
      }

      const savedOrder = await newOrder.save();

      // Return appropriate response based on payment method
      if (input.paymentMethod === 'upi') {
        return {
          orderId: savedOrder._id.toString(),
          upiUrl: savedOrder.payment.upiUrl,
          qrCode: savedOrder.payment.qrCode,
          refNumber: savedOrder.payment.refNumber,
          expiresAt: savedOrder.payment.expiresAt,
          amount: savedOrder.total.toString(),
          currency: "INR",
          paymentMethod: 'upi',
          seller: {
            businessName: seller.businessName,
            upiId: seller.upiId
          },
          user: { 
            name: input.name, 
            email: input.email, 
            phone: input.phone1 ?? input.phone2 ?? '' 
          }
        };
      }
      
      return {
        orderId: savedOrder._id.toString(),
        amount: savedOrder.total.toString(),
        currency: "INR",
        paymentMethod: input.paymentMethod,
        seller: {
          businessName: seller.businessName,
          upiId: seller.upiId
        },
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
        message: error instanceof Error ? error.message : "Failed to create order"
      });
    }
  });