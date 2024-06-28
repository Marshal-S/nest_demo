import { envConfig } from 'src/app.config';
import { createClient, RedisClientType } from '@redis/client';
import { Injectable } from '@nestjs/common';

//虽然这么写，但是实际不这么用
@Injectable()
export class RedisService {
    client: RedisClientType;
    constructor() {
        this.client = createClient({
            socket: {
                host: envConfig.REDIS_HOST,
                port: Number(envConfig.REDIS_PORT),
            },
            // url: `redis://alice:foobared@awesome.redis.server:6380`,
            // username: '',
            // password: '',
            //默认就是这个，一般一个项目就用一个，可能多个项目用一台redis服务器，看情况来就行
            // database: 0, 
        })
        this.client.connect()
    }

    //根据 hash 设置 value值
    async set(key: string, val: string) {
        await this.client.set(key, val);
    }
    
    //根据 hash 获取内容
    async get(key: string) {
        return await this.client.get(key);
    }
    
    //根据某个hash 删除
    async delete(key: string) {
        await this.client.del(key);
    }
    
    //根据 hash 设置 一个大对象的某个 key 和 值，key 和 value
    async hSet(hash: string, key: string, val: string) {
        await this.client.hSet(hash, key, val);
    }
    
    //根据 hash 获取对应的大对象 或 某个key对应的值
    async hGet(hash: string, key?: string) {
        if (key) {
            return await this.client.hGet(hash, key);
        }
        return await this.client.hGetAll(hash)
    }

    //获取某个大对象的所有values
    async hGetVals(hash: string) {
        return await this.client.hVals(hash);
    }
    
    //删除hash对应的对象某个key、对象
    async hDelete(hash: string, key?: string) {
        if (key) {
            return await this.client.hDel(hash, key);
        }
        return await this.client.del(hash);
    }

    quit() {
        this.client.quit();
    }
}