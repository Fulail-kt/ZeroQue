// import { Redis } from 'ioredis';

// // Initialize Redis client
// const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// // Payment status related methods
// export const PaymentStore = {
//   async setPaymentStatus(refNumber: string, status: PaymentStatus): Promise<void> {
//     await redis.setex(
//       `payment:${refNumber}`,
//       1800, // 30 minutes expiry
//       JSON.stringify(status)
//     );
//   },

//   async getPaymentStatus(refNumber: string): Promise<PaymentStatus | null> {
//     const data = await redis.get(`payment:${refNumber}`);
//     return data ? JSON.parse(data) : null;
//   },

//   async deletePaymentStatus(refNumber: string): Promise<void> {
//     await redis.del(`payment:${refNumber}`);
//   },

//   async updatePaymentAttempts(refNumber: string): Promise<number> {
//     const key = `payment:attempts:${refNumber}`;
//     const attempts = await redis.incr(key);
//     await redis.expire(key, 1800); // 30 minutes expiry
//     return attempts;
//   }
// };

// // Types
// export interface PaymentStatus {
//   status: 'pending' | 'completed' | 'failed';
//   lastUpdated: Date;
//   attempts: number;
//   error?: string;
// }

// export default redis;

import { Redis } from 'ioredis';

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  reconnectOnError: (err: Error) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
};


const url="redis://default:0YaWUUqsy7MBTPWJdjNbbkKEFCrO8IJO@redis-19014.c80.us-east-1-2.ec2.redns.redis-cloud.com:19014"
const redis = new Redis(url||REDIS_CONFIG);

// Add error handling
redis.on('error', (error: Error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

export const PaymentStore = {
  async setPaymentStatus(refNumber: string, status: PaymentStatus): Promise<void> {
    try {
      await redis.setex(
        `payment:${refNumber}`,
        1800,
        JSON.stringify(status)
      );
    } catch (error) {
      console.error(`Failed to set payment status for ${refNumber}:`, error);
      throw error;
    }
  },

  async getPaymentStatus(refNumber: string): Promise<PaymentStatus | null> {
    try {
      const data = await redis.get(`payment:${refNumber}`);
      return data ? JSON.parse(data) : null;
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

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  lastUpdated: Date;
  attempts: number;
  error?: string;
}

export default redis;