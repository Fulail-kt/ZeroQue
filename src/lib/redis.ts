import { Redis } from 'ioredis';
import { z } from 'zod';

const PaymentStatusSchema = z.object({
    status: z.enum(['pending', 'completed', 'failed']),
    lastUpdated: z.string().transform((str) => new Date(str)), // First parse as string, then transform to Date
    attempts: z.number(),
    error: z.string().optional(),
    amount: z.number().optional(),
    timestamp: z.string().optional()
});



type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

// Helper type for the raw stored data


const StoredPaymentStatusSchema = z.object({
    status: z.enum(['pending', 'completed', 'failed']),
    lastUpdated: z.string(), // Date stored as ISO string
    expiresAt: z.string(), // Date stored as ISO string
    attempts: z.number(),
    orderId: z.string(),
    sellerId: z.string(),
    amount: z.number(),
    error: z.string().optional()
  });

type PaymentStatusType = {
    status: 'pending' | 'completed' | 'failed';
    lastUpdated: Date;
    attempts: number;
    orderId: string;
    sellerId: string;
    amount: number;
    expiresAt: Date;
    error?: string;
  };

const REDIS_CONFIG = {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    reconnectOnError: (err: Error) => {
        const targetError = "READONLY";
        return err.message.includes(targetError);
    },
};

const url = "redis://default:0YaWUUqsy7MBTPWJdjNbbkKEFCrO8IJO@redis-19014.c80.us-east-1-2.ec2.redns.redis-cloud.com:19014";
const redis = new Redis(url || REDIS_CONFIG);

redis.on('error', (error: Error) => {
    console.error('Redis connection error:', error);
});

redis.on('connect', () => {
    console.log('Successfully connected to Redis');
});

export const PaymentStore = {
    // async setPaymentStatus(refNumber: string, status: PaymentStatus): Promise<void> {
    //     try {//
    //         // Convert Date to string for storage
    //         const storedStatus: StoredPaymentStatus = {
    //             ...status,
    //             lastUpdated: status.lastUpdated.toISOString()
    //         };

    //         await redis.setex(
    //             `payment:${refNumber}`,
    //             1800,
    //             JSON.stringify(storedStatus)
    //         );
    //     } catch (error) {
    //         console.error(`Failed to set payment status for ${refNumber}:`, error);
    //         throw error;
    //     }
    // },

    async setPaymentStatus(refNumber: string, status: PaymentStatusType): Promise<void> {
        try {
          const storedStatus = {
            ...status,
            lastUpdated: status.lastUpdated.toISOString(),
            expiresAt: status.expiresAt.toISOString(),
          };
    
          await redis.setex(
            `payment:${refNumber}`,
            1800,
            JSON.stringify(storedStatus)
          );
        } catch (error) {
          console.error(`Failed to set payment status for ${refNumber}:`, error);
          throw error;
        }
      },


      async getPaymentStatus(refNumber: string): Promise<PaymentStatusType | null> {
        try {
          const data = await redis.get(`payment:${refNumber}`);
          if (!data) return null;
    
          // Parse and validate the data against our schema
          const parsedData = StoredPaymentStatusSchema.parse(JSON.parse(data));
          
          // Transform the validated data into PaymentStatusType
          return {
            ...parsedData,
            lastUpdated: new Date(parsedData.lastUpdated),
            expiresAt: new Date(parsedData.expiresAt),
          };
        } catch (error) {
          console.error(`Failed to get payment status for ${refNumber}:`, error);
          throw error;
        }
      },
      
    async deletePaymentStatus(refNumber: string): Promise<void> {
        try {
            await redis.del(`payment:${refNumber}`);
        } catch (error) {
            console.error(`Failed to delete payment status for ${refNumber}:`, error);
            throw error;
        }
    },

    async updatePaymentAttempts(refNumber: string): Promise<number> {
        try {
            const key = `payment:attempts:${refNumber}`;
            const attempts = await redis.incr(key);
            await redis.expire(key, 1800);
            return attempts;
        } catch (error) {
            console.error(`Failed to update payment attempts for ${refNumber}:`, error);
            throw error;
        }
    }
};

export default redis;