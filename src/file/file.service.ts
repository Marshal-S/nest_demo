import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { ResponseData } from 'src/request/response-data';
import { MinioService } from './minio.service';
import { getFilename } from './file.model';
import { ReqFileIdDto, ReqFilesIdDto } from './dto/req-file.dto';
import { ResFileDto } from './dto/res-file.dto';
import { envConfig } from 'src/app.config';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private minioService: MinioService
  ) {}
  
  async upload(
    mFile: Express.Multer.File
  ) {
    if (!mFile) {
      return ResponseData.fail('请选择文件');
    }
    let file = new File()
    file.filename = mFile.filename;
    file.mimetype = mFile.mimetype;
    file.size = mFile.size;
    file.path = mFile.path; //如果没开上传功能这个path会不存在
    await this.fileRepository.save(file)
    return ResponseData.ok(file)
  }

  async uploadMinio(
    mFile: Express.Multer.File
  ) {
    if (!mFile) {
      return ResponseData.fail('请选择文件');
    }
    let url = null
    let filename = getFilename(mFile.originalname)
    try {
      await this.minioService.putFile(filename, mFile.buffer);
      url = await this.minioService.presignedUrl(filename)
    } catch(err) {
      console.log(err)
      return ResponseData.fail()
    }
    let file = new File()
    file.filename = filename;
    file.mimetype = mFile.mimetype;
    file.size = mFile.size;
    await this.fileRepository.save(file)
    return ResponseData.ok({
      ...file,
      url
    });
  }

  async uploadMinioEx(
    mFile: Express.Multer.File
  ) {
    if (!mFile) {
      return ResponseData.fail('请选择文件');
    }
    try {
      await this.minioService.fPutFile(mFile.filename, mFile.path);
    } catch(err) {
      return ResponseData.fail()
    }
    let file = new File()
    file.filename = mFile.filename;
    file.mimetype = mFile.mimetype;
    file.size = mFile.size;
    file.path = mFile.path;
    await this.fileRepository.save(file)
    return ResponseData.ok(file);
  }
}
