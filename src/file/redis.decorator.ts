import { Inject } from "@nestjs/common";
import { createClient } from "redis";
import { envConfig } from "src/app.config";

export const redis_provide_identifier = 'REDIS_CLIENT'
export const InjectMyRedis = () => Inject(redis_provide_identifier);

export const RedisProvider = {
    provide: redis_provide_identifier,
    async useFactory() {
        const client = createClient({
            socket: {
                host: envConfig.REDIS_HOST,
                port: Number(envConfig.REDIS_PORT),
            },
        });
        await client.connect();
        return client;
    },
};