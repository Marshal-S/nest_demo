import { Injectable } from '@nestjs/common'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3'
import { envConfig } from 'src/app.config'

@Injectable()
export class AWSService {
    client: S3Client
    bucketName: string
    constructor() {
        this.client = new S3Client({
            region: 'tianjin1',
            endpoint: envConfig.awsPoint,
            credentials: {
                accessKeyId: envConfig.awsAccessKey,
                secretAccessKey: envConfig.awsSecretKey,
            },
        })
        this.bucketName = envConfig.awsBucketName
    }

    //获取text文本(转化utf8)
    getObjectText(filename: string) {
        return new Promise<string>((resolve, reject) => {
            this.client
                .send(
                    new GetObjectCommand({
                        Bucket: this.bucketName,
                        Key: filename,
                    }),
                )
                .then(async function (obj) {
                    resolve(await obj?.Body.transformToString('utf-8'))
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    async signUpload(filename: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
        })
        const url = await getSignedUrl(this.client, command, {
            expiresIn: 24 * 3600, //限制一天上传完毕
        })
        console.log(url)
    }

    async signedUrl(filename: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
        })
        const url = await getSignedUrl(this.client, command, {
            expiresIn: 7 * 24 * 3600, //7天
        })
        return url
    }
}
