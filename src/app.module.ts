import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from './app.config';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envConfig.dbhost,
      port: envConfig.dbport,
      username: envConfig.dbusername,
      password: envConfig.dbpassword,
      database: envConfig.dbdatabase,
      synchronize: false, //自动同步创建数据库表
      retryDelay: 500,
      retryAttempts: 10,
      autoLoadEntities: true, //自动查找entity实体
    }),
    UserModule,
    FileModule,
    ArticleModule,
    FeatureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
