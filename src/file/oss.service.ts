import { Injectable } from '@nestjs/common'
import { envConfig } from 'src/app.config'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const oss = require('ali-oss')

@Injectable()
export class OSSService {
    static client: any
    host: string
    constructor() {
        if (!OSSService.client) {
            OSSService.client = new oss({
                accessKeyId: envConfig.OSS_ACCESSKEY,
                accessKeySecret: envConfig.OSS_SECRETKEY,
                bucket: envConfig.OSS_BUCKETNAME,
                endpoint: envConfig.OSS_POINT,
                secure: true,
            })
        }
        this.host = `https://${envConfig.OSS_BUCKETNAME}.${envConfig.OSS_POINT}`
    }

    signUpload(filename: string) {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        const res = OSSService.client.calculatePostSignature({
            expiration: date.toISOString(), //1天时间
            conditions: [
                ['content-length-range', 0, 200 * 1024 * 1024], //设置上传文件的大小限制 200m。
            ],
        })
        return {
            url: this.host,
            fields: {
                key: filename,
                ...res,
            },
        }
    }

    signedUrl(filename: string) {
        return OSSService.client.signatureUrl(filename, {
            expires: 7 * 24 * 3600, //7天
        })
    }
}
