import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { MinioService } from "./minio.service"
import { FilePresignDto } from "./dto/req-file.dto"
import { File } from "./entities/file.entity"
import { ResponseData } from "src/request/response-data"
import { env } from "process"
import { envConfig } from "src/app.config"
import { Response } from "express"


@Injectable()
export class FileExService {
	constructor(
		@InjectRepository(File)
		private fileRepository: Repository<File>,
		private minioService: MinioService
	) { }

	async presignByFormData(body: FilePresignDto) {
		const list = body.originname.split('.')
		const ext =
			list.length > 1 ? '.' + body.originname.split('.').at(-1) : ''
		const filename = `${new Date().getTime()}${ext}`
		const presign_data = await this.minioService.presignPutUrlByFormdata(
			filename,
		)
		// 在此处自定义保存后的文件名称
		const file = new File()
		file.originalname = body.originname
		file.filename = filename
		file.mimetype = body.mimetype
		file.size = body.size
		await this.fileRepository.save(file)
		return ResponseData.ok({
			...file,
			presign_data,
			url: body.unChanged
				? envConfig.fileUrl(filename)
				: undefined,
		})
	}

	async presignByOss(body: FilePresignDto) {
		const list = body.originname.split('.')
		const ext =
			list.length > 1 ? '.' + body.originname.split('.').at(-1) : ''
		const filename = `${new Date().getTime()}${ext}`
		const url = await this.minioService.presignPutUrl(
			filename,
		)
		// 在此处自定义保存后的文件名称
		const file = new File()
		file.originalname = body.originname
		file.filename = filename
		file.mimetype = body.mimetype
		file.size = body.size
		await this.fileRepository.save(file)
		return ResponseData.ok({
			...file,
			presign_url: url,
			url: body.unChanged
				? envConfig.fileUrl(filename)
				: undefined,
		})
	}

	async download(path: string, res: Response) {
		//重定向
		if (path) {
			res.redirect(await this.minioService.getPresignedUrl(path))
		}
	}
}