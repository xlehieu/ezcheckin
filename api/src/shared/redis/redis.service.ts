import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://localhost:6379',
    );

    this.client = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      enableOfflineQueue: true,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async set(
    key: string,
    value: string | object,
    ttlSeconds?: number,
  ): Promise<void> {
    try {
      const serialized =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;

      try {
        return JSON.parse(data);
      } catch {
        return data as T;
      }
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      throw error;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error setting expiration for key ${key}:`, error);
      throw error;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      throw error;
    }
  }

  async hSet(key: string, field: string, value: string | object): Promise<number> {
    try {
      const serialized =
        typeof value === 'string' ? value : JSON.stringify(value);
      return await this.client.hset(key, field, serialized);
    } catch (error) {
      this.logger.error(`Error setting hash field ${key}:${field}:`, error);
      throw error;
    }
  }

  async hGet<T = any>(key: string, field: string): Promise<T | null> {
    try {
      const data = await this.client.hget(key, field);
      if (!data) return null;

      try {
        return JSON.parse(data);
      } catch {
        return data as T;
      }
    } catch (error) {
      this.logger.error(`Error getting hash field ${key}:${field}:`, error);
      throw error;
    }
  }

  async hDelete(key: string, ...fields: string[]): Promise<number> {
    try {
      return await this.client.hdel(key, ...fields);
    } catch (error) {
      this.logger.error(`Error deleting hash fields ${key}:`, error);
      throw error;
    }
  }

  async hExists(key: string, field: string): Promise<boolean> {
    try {
      const result = await this.client.hexists(key, field);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Error checking hash field existence ${key}:${field}:`,
        error,
      );
      throw error;
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      throw error;
    }
  }

  async decrement(key: string, amount: number = 1): Promise<number> {
    try {
      return await this.client.decrby(key, amount);
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}:`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }
}
