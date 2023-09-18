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
import { join } from 'path';
import { unlinkSync } from 'fs';

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
    //解决乱码问题
    file.originalname = Buffer.from(mFile.originalname, "latin1")
      .toString("utf8")
    file.filename = mFile.filename;
    file.mimetype = mFile.mimetype;
    file.size = mFile.size;
    file.path = mFile.path; //如果没开上传功能这个path会不存在
    await this.fileRepository.save(file)
    return ResponseData.ok({
      ...file,
      url: envConfig.fileUrl(file.path)
    })
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
      return ResponseData.fail('请选择文件')
    }
    let url = null
    const linkPath = join(__dirname, `../../${mFile.path}`)
    try {
        await this.minioService.fPutFile(mFile.filename, mFile.path)
        url = await this.minioService.presignedUrl(mFile.filename)
    } catch (err) {
        unlinkSync(linkPath)
        return ResponseData.fail()
    }
    unlinkSync(linkPath)
    const file = new File()
    file.filename = mFile.filename
    file.mimetype = mFile.mimetype
    file.size = mFile.size
    await this.fileRepository.save(file)
    return ResponseData.ok({
        ...file,
        url,
    })
  }
}
