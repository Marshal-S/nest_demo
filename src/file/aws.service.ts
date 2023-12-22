import { Injectable } from '@nestjs/common'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    GetObjectCommand,
    ListPartsCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand,
} from '@aws-sdk/client-s3'
import { envConfig } from 'src/app.config'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

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

    signlPostUpoadPost(filename: string) {
        return createPresignedPost(this.client, {
            Bucket: this.bucketName,
            Key: filename,
            Expires: 24 * 3600, //1天后失效
        })
    }

    signPutUpload(filename: string) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
        })
        return getSignedUrl(this.client, command, {
            expiresIn: 24 * 3600, //限制一天上传完毕
        })
    }

    signedUrl(filename: string) {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
        })
        return getSignedUrl(this.client, command, {
            expiresIn: 7 * 24 * 3600, //7天
        })
    }

    //下面是分段上传的三个步骤，创建、上传、合并(取消)
    async createPartUpload(filename: string) {
        const res = await this.client.send(
            new CreateMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: filename,
            }),
        )
        return {
            // bucketName: res.Bucket, //只连接一个的就没必要了
            key: res.Key,
            upload_id: res.UploadId,
            first_part_number: 1, //默认从第一个开始，告知一下
        }
    }

    partUpload(filename: string, uploadId: string, partNumber: number) {
        return getSignedUrl(
            this.client,
            new UploadPartCommand({
                Bucket: this.bucketName,
                Key: filename,
                PartNumber: partNumber,
                UploadId: uploadId,
            }),
        )
    }

    //查看分段
    listPartUpload(filename: string, uploadId: string) {
        return this.client.send(
            new ListPartsCommand({
                Bucket: this.bucketName,
                Key: filename,
                UploadId: uploadId,
            }),
        )
    }

    async completePartUpload(filename: string, uploadId: string) {
        let listparts = null
        try {
            //获取分段信息，除了用于获取分段参数，也可以用来判断是否上传分段了
            listparts = await this.client.send(
                new ListPartsCommand({
                    Bucket: this.bucketName,
                    Key: filename,
                    UploadId: uploadId,
                }),
            )
        } catch (err) {
            console.log(err)
        }
        if (!listparts?.Parts) {
            return Promise.reject('没有发现上传的分段信息')
        }
        return this.client.send(
            new CompleteMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: filename,
                MultipartUpload: {
                    Parts: listparts.Parts,
                },
                UploadId: uploadId,
            }),
        )
    }

    aboutPartUpload(filename: string, uploadId: string) {
        return this.client.send(
            new AbortMultipartUploadCommand({
                Bucket: this.bucketName,
                Key: filename,
                UploadId: uploadId,
            }),
        )
    }
}
