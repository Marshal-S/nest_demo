import { Controller, Post, UploadedFile, UseInterceptors, Get, Query, Res, Body } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/user/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { APIResponse } from 'src/request/response';
import { Response } from 'express'
import { ApiFileBody, ApiFileConsumes } from './file.decorator';
import { ResFileDto } from './dto/res-file.dto';
import { join } from 'path';
import { FileExService } from './fileEx.service';
import { FilePresignDto } from './dto/req-file.dto';
import { File } from './entities/file.entity';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileExService: FileExService
  ) { }

  @ApiOperation({
    summary: '上传文件到磁盘'
  })
  @ApiFileConsumes()
  @ApiFileBody()
  @Public()
  @APIResponse()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    //存放文件到数据库，这时已经存放完毕了，我们将一些信息放到数据库，为了好方便建立关系
    return this.fileService.upload(file); //如果想与 user 建立联系，可以继续往后写
  }

  //使用该方法时需要注释掉 disk 的逻辑，因为没有利用本地文件信息，会出先不一样的对象
  //使用该方法时，如果想利用本地的，minio 可以使用 fPutObject上传，这样两端都有
  @ApiOperation({
    summary: '上传文件到 minio'
  })
  @ApiFileConsumes()
  @ApiFileBody()
  @Public()
  @APIResponse(ResFileDto)
  @Post('upload_minio')
  @UseInterceptors(FileInterceptor('file'))
  uploadMinio(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.uploadMinio(file)
  }

  //同时支持两个一个当备份服务器
  @ApiOperation({
    summary: '上传文件到 disk 和 minio'
  })
  @ApiFileConsumes()
  @ApiFileBody()
  @Public()
  @APIResponse(ResFileDto)
  @Post('upload_disk_minio')
  @UseInterceptors(FileInterceptor('file'))
  uploadMinioEx(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.uploadMinioEx(file)
  }

  @ApiOperation({
    summary: '获取单个文件信息',
  })
  @Public()
  @APIResponse()
  @Get('download')
  getFile(@Query('path') path: string, @Res() res: Response) {
      res.sendFile(join(__dirname, `../../${path}`)) //小文件
      // res.download(join(__dirname, `../../${path}`)) //大文件走这个
  }

  @ApiOperation({
    summary: '测试文件分割',
  })
  @Public()
  @APIResponse()
  @Post()
  testFileChunk() {
      return this.fileService.testUpload()
  }


  @ApiOperation({
    summary: '上传前的预签名（form_data）',
  })
  @Public()
  @APIResponse(ResFileDto)
  @Post('presign')
  presignByFormData(@Body() body: FilePresignDto) {
      return this.fileExService.presignByFormData(body)
  }

  @ApiOperation({
    summary: '上传前的预签名（oss）',
  })
  @Public()
  @APIResponse(ResFileDto)
  @Post('presign_oss')
  presignByOss(@Body() body: FilePresignDto) {
      return this.fileExService.presignByOss(body)
  }

  @ApiOperation({
    summary: '固定url文件读取文件信息接口(重定向)',
  })
  @Public()
  @APIResponse()
  @Get('download_url')
  getFileInfo(@Query('path') path: string, @Res() res: Response) {
      this.fileExService.download(path, res)
  }

  @ApiOperation({
    summary: '获取所有文件信息',
  })
  @Public()
  @APIResponse([File])
  @Get('all_files')
  getAllFiles() {
      return this.fileService.getAllFiles()
  }

}
