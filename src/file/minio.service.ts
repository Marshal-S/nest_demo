import { Injectable } from "@nestjs/common";
import { Client } from 'minio';
import { envConfig } from "src/app.config";

@Injectable()
export class MinioService {
    private client: Client;
    constructor() {
        this.client = new Client({
            endPoint: envConfig.minioPoint,
            port: envConfig.minioPort,
            useSSL: false,
            accessKey: envConfig.minioAccessKey,
            secretKey: envConfig.minioSecretKey,
        });
    }

    //上传文件
    putFile(filename: string, buffer: Buffer) {
        //如果想两个端都存在文件，可以使用 fPutObject 逻辑更简单
        return this.client.putObject(
            envConfig.minioBucketName,
			filename,
            buffer
        )
        //{ etag: '4889457ca823d079a800e4a5f427b353', versionId: null }
    }

    fPutFile(filename: string, path: string) {
        return this.client.fPutObject(
            envConfig.minioBucketName,
            filename,
            path
        )
    }

    //获取url签名,默认7天，可以设置时间，数据库获取图片url时，可以通过这个获取
    presignedUrl(filename: string) {
        return this.client.presignedUrl(
            'GET',
            envConfig.minioBucketName,
            filename,
            //  7 * 24 * 60 ^ 60 //时长 s 默认7天
        )
    }
    
}