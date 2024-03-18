import * as dotenv from 'dotenv';
import { Redis } from 'ioredis';

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

export async function initializeRedisClient() {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });

  return redisClient;
}
