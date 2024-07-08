import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { ConfigType } from './config.module';
import { RedisClientType, createClient } from 'redis';
import { ModuleRef } from '@nestjs/core';
import { RedisService } from 'src/file/redis.service';

@Injectable()
export class ConfigService implements OnModuleInit {
    redis: RedisService;
    constructor(
        @Inject('CONFIG_OPTIONS') private config: ConfigType,
        private moduleRef: ModuleRef,
    ) {
        console.log(config);
    }

    onModuleInit() {
        this.redis = this.moduleRef.get(RedisService, { strict: false });
    }
}
