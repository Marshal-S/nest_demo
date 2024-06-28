import { Inject } from "@nestjs/common";

export const redis_provide_identifier = 'REDIS_CLIENT'
export const InjectMyRedis = () => Inject(redis_provide_identifier);