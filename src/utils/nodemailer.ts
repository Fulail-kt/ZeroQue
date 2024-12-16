import { env } from "~/env";
import nodemailer from "nodemailer";


// Verification email sending utility
export const sendVerificationEmail = async ({
  to,
  name,
  token
}: {
  to: string;
  name: string;
  token: string;
}) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_HOST,
      pass: env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    rateDelta: 4000, 
  });

  // Construct verification link
  const verificationLink = `${process.env.NEXT_AUTH_URL}/verify?token=${token}`;

  try {
    // Send email
    const info = await transporter.sendMail({
      from: {
        name:  "ZEROQUE",
        address: env.EMAIL_HOST
      },
      to,
      subject: "Verify Your Email Address",
      html: generateVerificationEmailTemplate(name, verificationLink),
      text: `Verify your email by clicking this link: ${verificationLink}`,
    });

    console.log("Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};



// Add this to your existing email utility file

export const sendOrderConfirmationEmail = async ({
  to,
  orderDetails
}: {
  to: string;
  orderDetails: {
    orderId: string;
    name: string;
    total: number;
    items: Array<{
      title: string;
      quantity: number;
      price: number;
    }>;
    paymentMethod: string;
    paymentLink:string;
  };
}) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_HOST,
      pass: env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    rateDelta: 4000, 
  });

  try {
    // Send email
    const info = await transporter.sendMail({
      from: {
        name: "ZEROQUE",
        address: env.EMAIL_HOST
      },
      to,
      subject: `Order Confirmation - Order #${orderDetails.orderId}`,
      html: generateOrderConfirmationEmailTemplate(orderDetails),
    });

    console.log("Order confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

const generateOrderConfirmationEmailTemplate = (orderDetails: {
  orderId: string;
  name: string;
  total: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ZEROQUE</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 30px;
        }
        .order-details {
            background-color: #f4f6f9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .item-list {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
        }
        .item-list th, .item-list td {
            border-bottom: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
        }
        .total {
            font-weight: bold;
            text-align: right;
            padding: 10px;
            background-color: #f4f6f9;
        }
        .footer {
            background-color: #f4f6f9;
            color: #6b7280;
            text-align: center;
            padding: 15px;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ZEROQUE</h1>
            <p>Order Confirmation</p>
        </div>
        <div class="content">
            <p>Hi ${orderDetails.name},</p>
            <p>Thank you for your order! We're processing it right away.</p>
            
            <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> #${orderDetails.orderId}</p>
                <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
                
                <table class="item-list">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails.items.map(item => `
                            <tr>
                                <td>${item.title}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>$${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">
                    Total: $${orderDetails.total.toFixed(2)}
                </div>
            </div>

            <p>We appreciate your business! If you have any questions about your order, please contact our support team.</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} ZEROQUE. All rights reserved.
            <br>Questions? Contact our support team.
        </div>
    </div>
</body>
</html>
`;

const generateVerificationEmailTemplate = (
    name: string, 
    verificationLink: string
  ) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your ZEROQUE Account</title>
      <style>
          body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f6f9;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
          .header {
              background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
              color: white;
              text-align: center;
              padding: 20px;
          }
          .content {
              padding: 30px;
              text-align: center;
          }
          .btn {
              display: inline-block;
              background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
              color: white !important;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: 600;
              transition: transform 0.2s;
          }
          .btn:hover {
              transform: scale(1.05);
          }
          .footer {
              background-color: #f4f6f9;
              color: #6b7280;
              text-align: center;
              padding: 15px;
              font-size: 0.8em;
          }
          @media (max-width: 600px) {
              .container {
                  margin: 0;
                  width: 100%;
                  border-radius: 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>ZEROQUE</h1>
          </div>
          <div class="content">
              <h2>Verify Your Email</h2>
              <p>Hi ${name},</p>
              <p>Welcome to ZEROQUE! Click the button below to verify your email address and get started:</p>
              <a href="${verificationLink}" class="btn">Verify Email</a>
              <p style="color: #6b7280;">If the button doesn't work, copy and paste this link:</p>
              <p style="word-break: break-all; color: #2575fc;">${verificationLink}</p>
              <p style="color: #6b7280; font-size: 0.9em;">This link expires in 24 hours</p>
          </div>
          <div class="footer">
              © ${new Date().getFullYear()} ZEROQUE. All rights reserved.
              <br>If you didn't create an account, please ignore this email.
          </div>
      </div>
  </body>
  </html>
  `;