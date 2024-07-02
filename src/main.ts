import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './request/filter/http-exception.filter';
import { TransformInterceptor } from './request/filter/transform.interceptor';
import * as session from 'express-session';
import * as express from 'express';
import { envConfig } from './app.config';
import { join } from 'path';
import { json } from 'express';
import * as winston from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file'; //导入winston的滚动扩展

const createLogger = () => {
    //直接转化nestjs的log，使用时需要保存log，使用 Nestjs 的 Logger.log、warn、error，测试debug仍然使用 console.log
    return WinstonModule.createLogger({
        instance: winston.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        utilities.format.nestLike(),
                    ),
                }),
                //后面的按级别添加，提示级别越低包含信息越多
                //error日志存储到/logs/warn-日期.log文件中
                new winston.transports.DailyRotateFile({
                    level: 'error', //错误级别
                    dirname: 'logs',
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '10m',
                    maxFiles: '14d',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple(),
                    ),
                }),
                //级别稍低，warn、error日志存储到/logs/warn-日期.log文件中
                new winston.transports.DailyRotateFile({
                    level: 'warn', //包含error，设置这个可以不设置error
                    dirname: 'logs',
                    filename: 'warn-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '10m',
                    maxFiles: '14d',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple(),
                    ),
                }),
                //级别较低log、warning、error都会存在，日志存储到/logs/info-日期.log文件中
                new winston.transports.DailyRotateFile({
                    level: 'info',
                    dirname: 'logs',
                    filename: 'info-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '10m',
                    maxFiles: '14d',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.simple(),
                    ),
                }),
            ],
        }),
    });
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(createLogger());
    // const app = await NestFactory.create(AppModule, { cors: true }); //创建顺道设置跨域
    //设置跨域支持，能跨域访问其他网站
    app.enableCors();
    //设置全局前缀
    app.setGlobalPrefix('api');
    //设置校验
    app.useGlobalPipes(new ValidationPipe());
    app.use(json({ limit: '10mb' })); //默认就是100kb
    app.use(
        session({
            secret: envConfig.APP_SECRET,
            resave: false,
            saveUninitialized: false,
        }),
    );
    //设置我们的public文件夹可以直接访问
    app.use('/public', express.static(join(__dirname, '../public')));
    const options = new DocumentBuilder()
        .setTitle('nest demo api')
        .setDescription('This is nest demo api')
        .setVersion('1.0')
        .build();
    //设置文档
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
    // //注册全局错误过滤器(校验和自己抛出的异常)
    // app.useGlobalFilters(new HttpExceptionFilter());
    // //添加成功后的参数过滤器
    // app.useGlobalInterceptors(new TransformInterceptor())
    await app.listen(4000);
}

bootstrap();
