import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisFunctionService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  // Redis 데이터 가져오기
  async getJson(key: string): Promise<any> {
    const jsonValue = await this.redisClient.get(key);
    return JSON.parse(jsonValue);
  }

  // Redis 데이터 저장하기
  async setJson(key: string, value: any): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.redisClient.set(key, jsonValue);
  }

  // Redis 기존 저장된 JSON 데이터 value 수정
  async updateJson(
    key: string,
    fieldName: string,
    fieldValue: any,
  ): Promise<void> {
    const jsonValue = await this.redisClient.get(key);
    const objValue = JSON.parse(jsonValue);

    if (Array.isArray(objValue[fieldName])) {
      objValue[fieldName].push(fieldValue);
    } else {
      objValue[fieldName] = fieldValue;
    }

    const newJsonValue = JSON.stringify(objValue);
    await this.redisClient.set(key, newJsonValue);
  }
}
