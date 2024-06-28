import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { ResponseData } from 'src/request/response-data';
import { MinioService } from './minio.service';
import { getFilename } from './file.model';
import { getDownloadFileUrl } from 'src/app.config';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { ChunkInfo, uploadByFileHandle } from './file.utils';

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
      url: getDownloadFileUrl(file.path)
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

  async testUpload() {
    return new Promise((resolve, reject) => {
      const filenames = []
      uploadByFileHandle('public/4.mp4', async (err: Error, chunk: ChunkInfo) => {
        if (err) {
          resolve(ResponseData.ok('上传失败'))
          return false
        }
				// let str = chunk.buffer.toString('utf-8')
        try {
          const filename = new Date().getTime().toString()
          await this.minioService.putFile(filename, chunk.buffer)
          filenames.push(filename)
        } catch(err) {
          return false
        }
        if (chunk.isCompleted) {
          const filename = new Date().getTime().toString()
          await this.minioService.compostObject(filename, filenames)
          console.log('成功了')
          resolve(ResponseData.ok('好了'))
        }
        return true
      }, 64 * 1024 * 1024)
    })
  }

  async getAllFiles() {
    return ResponseData.ok(
      await this.fileRepository.find()
    )
  }
}
