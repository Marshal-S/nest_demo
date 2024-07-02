import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './app.config';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { FeatureModule } from './feature/feature.module';
import { UserController } from './user/user.controller';
import { ArticleController } from './article/article.controller';
import { UserMiddleware } from './user/user.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { OrderModule } from './order/order.module';
import { TypeormConfig } from './typeorm-config';
import { AppMiddleware } from './app.middleware';

@Module({
    imports: [
        // TypeOrmModule.forRoot({
        //     type: 'mysql',
        //     host: envConfig.DB_HOST,
        //     port: envConfig.DB_PORT && Number(envConfig.DB_PORT),
        //     username: envConfig.DB_USER,
        //     password: envConfig.DB_PASSWORD,
        //     database: envConfig.DB_DATABASE,
        //     synchronize: true, //自动同步创建数据库表
        //     retryDelay: 500,
        //     retryAttempts: 10,
        //     autoLoadEntities: true, //自动查找entity实体
        //     // cache: true, //允许使用cache，默认使用一个新表作为缓存
        //     // cache: {
        //     //     type: 'ioredis',
        //     //     duration: 30000, //设置30s
        //     //     options: {
        //     //         host: envConfig.REDIS_HOST,
        //     //         port: Number(envConfig.REDIS_PORT),
        //     //     },
        //     // },
        // }),
        TypeOrmModule.forRoot(TypeormConfig),
        RedisModule.forRoot({
            //closeClient: true, //redis挂了，nestjs也挂掉
            //readyLog: true, 在客户端展示日志
            config: {
                host: envConfig.REDIS_HOST,
                port: Number(envConfig.REDIS_PORT),
                db: Number(envConfig.REDIS_DB),
            },
        }),
        FileModule,
        UserModule,
        ArticleModule,
        FeatureModule,
        OrderModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
// export class AppModule {}
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AppMiddleware)
            .forRoutes('*');
    }
}
