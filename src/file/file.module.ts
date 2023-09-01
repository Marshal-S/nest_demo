import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MinioService } from './minio.service';
import dayjs = require('dayjs');
import { getFilename } from './file.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage: diskStorage({
        // 配置文件上传后的文件夹路径
        destination: `./public/uploads/${dayjs().format('YYYY-MM-DD')}`,
        filename: (req, file, cb) => {
          //文件上传之后的回调，文件为空不走
          //用我们根据时间生成的文件名
          return cb(null, getFilename(file.originalname));
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService, 
    MinioService,
  ]
})
export class FileModule {}
