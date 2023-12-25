import { Injectable } from "@nestjs/common";
import { Client, CopyDestinationOptions, CopySourceOptions, PostPolicy } from 'minio';
import { envConfig } from "src/app.config";

//正常来说这个文件类应该被导入一会才好，因为模块依赖，这个会被创建多次，设计这个文件可以设置成单例使用，避免导入多次
let minioService: MinioService | null = null

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
            // partSize: 64 * 1024 * 1024, //默认64M
        });
        minioService = this
    }

    static get share() {
        //单例，用于跨场景使用，最好不要多个模块导入该Service
        return minioService
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

    getPresignedUrl(filename: string) {
        return this.client.presignedUrl(
            'GET',
            envConfig.minioBucketName,
            filename,
        )
    }

    getObject(filename: string) {
        return this.client.getObject(
            envConfig.minioBucketName,
            filename,
        )
    }

    //合并文件
    async compostObject(filename: string, sourceList: string[]) {
        let desOptions = new CopyDestinationOptions({
            Bucket: envConfig.minioBucketName,
            Object: filename
        })
        const sources = sourceList.map( function (filename) {
            return new CopySourceOptions({
                Bucket: envConfig.minioBucketName,
                Object: filename
            })
        })
        console.log(sourceList)
        await this.client.composeObject(desOptions, sources)
        await this.client.removeObjects(
            envConfig.minioBucketName,
            sourceList
        )
        return filename
    }

    presignPutUrl(filename: string) {
        return this.client.presignedPutObject(
            envConfig.minioBucketName,
            filename,
        )
    }

    presignPutUrlByFormdata(filename: string) {
        const policy = new PostPolicy()
        policy.setBucket(envConfig.minioBucketName)
        policy.setContentType('multipart/form-data')
        policy.setKey(filename)
        policy.setContentLengthRange(1, 5 * 1024 * 1024 * 1024) //5G
        return this.client.presignedPostPolicy(policy)
    }

    async getTestUrl(): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('我是测试返回的假的url')
            }, 100);
        })
    }
}