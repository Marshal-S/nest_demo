import { ConfigurableModuleBuilder, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

export interface ConfigType {
    isGlobal: boolean;
    key: string;
    secret: string;
}
@Module({})
export class ConfigModule {
    //这种配置我们一般在不同模块配置，然后就可以直接在导入的模块使用了
    static register(config: ConfigType) {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: 'CONFIG_OPTIONS',
                    useValue: config,
                },
                ConfigService,
            ],
            exports: [ConfigService],
        };
    }
}
