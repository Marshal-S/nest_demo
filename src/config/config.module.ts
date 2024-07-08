import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { RedisService } from 'src/file/redis.service';

export interface ConfigType {
    host: string;
    port: number;
    username?: string;
    password?: string;
    db?: number;
}

@Global()
@Module({})
export class ConfigModule {
    //这种配置我们一般在不同模块配置，然后就可以直接在导入的模块使用了
    static register(config: ConfigType): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: 'CONFIG_OPTIONS',
                    useValue: config,
                },
                ConfigService,
                // RedisService,
            ],
            exports: [ConfigService],
        };
    }
}
