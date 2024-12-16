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


import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { publicProcedure } from "~/server/api/trpc";
import { OrderModel } from "~/server/db/order/order";
import { sendOrderConfirmationEmail } from "~/utils/nodemailer";
import crypto from 'crypto';

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
    paymentMethod: z.enum(["cash", "online"]),
    coupon: z
      .object({
        code: z.string().optional(),
        discount: z.number().optional(),
      })
      .optional(),
  });

// Razorpay Configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_CoB0vBovJyW2aU',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'kPJWBKuArGEh8fL76NvXFAsQ'
});

// Helper function to generate Razorpay payment order
async function generateRazorpayPaymentOrder(order: any) {
  try {
    const options = {
      amount: Math.round(order.total * 100), // amount in paise
      currency: "INR",
      receipt: order._id.toString(),
      payment_capture: 1, // Auto capture payment
      notes: {
        userId: order.userId || "default_user",
        orderId: order._id.toString()
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

export const createOrder = publicProcedure
  .input(orderInputSchema)
  .mutation(async ({ input }) => {
    try {
      // Create new order
      const newOrder = new OrderModel({
        ...input,
        status: 'pending',
        transactionId: input.paymentMethod === 'online' ? crypto.randomBytes(16).toString('hex') : undefined
      });

      // Save order to database
      const savedOrder = await newOrder.save();

      console.log(input.paymentMethod, "method");

      let paymentResponse;
      if (input.paymentMethod === 'online') {
        // Generate Razorpay payment order
        paymentResponse = await generateRazorpayPaymentOrder(savedOrder);
      }

      console.log(paymentResponse, "response");

      // Optional: Uncomment to send order confirmation email
      // await sendOrderConfirmationEmail({
      //   to: input.email,
      //   orderDetails: {
      //     orderId: savedOrder._id.toString(),
      //     name: input.name,
      //     total: input.total,
      //     items: input.cart,
      //     paymentMethod: input.paymentMethod,
      //     razorpayOrderId: paymentResponse?.orderId
      //   }
      // });

      return {
        orderId: savedOrder._id.toString(),
        razorpayOrderId: paymentResponse?.orderId??null,
        amount: paymentResponse?.amount.toString()??"0",
        currency: paymentResponse?.currency??"",
        user:{name:input.name,email:input.email,phone:input.phone1??input.phone2}
      };
    } catch (error) {
      console.error("Order creation error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create order"
      });
    }
  });