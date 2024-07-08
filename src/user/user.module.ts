import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Auth } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/app.config';
import { AuthService } from './service/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './user.guard';
import { UserController } from './user.controller';
import { ArticleService } from 'src/article/article.service';
import { Article } from 'src/article/entities/article.entity';
import { Feature } from 'src/feature/entities/feature.entity';
import { FeatureService } from 'src/feature/feature.service';
import { BlackList } from './entities/blacklist.entity';
import { UserMiddleware } from './user.middleware';
import { ArticleController } from 'src/article/article.controller';
import { MinioService } from 'src/file/minio.service';
import { Order } from 'src/order/entities/order.entity';
import { OrderService } from 'src/order/order.service';
import { OrderModule } from 'src/order/order.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Auth,
            BlackList,
            Article,
            Feature,
            Order,
        ]),
        JwtModule.register({
            global: true, //设置为全局
            secret: envConfig.APP_SECRET,
            signOptions: {
                expiresIn: '7d', //失效时长设置为7天
            },
        }),
        forwardRef(() => OrderModule),
        // ConfigModule.register({
        //     host: 'host',
        //     port: 123,
        //     // username: envConfig.REDIS_USER,
        //     // password: envConfig.REDIS_PASSWORD,
        //     db: envConfig.REDIS_DB && Number(envConfig.REDIS_DB),
        // }),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        AuthService,
        ArticleService,
        FeatureService,
        {
            provide: APP_GUARD,
            useClass: UserGuard,
        },
    ],
    exports: [UserService, AuthService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UserMiddleware)
            .forRoutes(UserController, ArticleController);
    }
}
