import * as dotenv from 'dotenv';

//嫌麻烦直接使用 env 的类型，没有就没有
// class ConfigEnv {
//     secret: string;
//     prefix: string;
//     serviceUrl: string;

//     //mysql
//     dbhost: string;
//     dbport: number;
//     dbusername: string;
//     dbpassword: string;
//     dbdatabase: string;

//     //minio
//     minioPoint: string;
//     minioPort: number;
//     minioAccessKey: string;
//     minioSecretKey: string;
//     minioBucketName: string;

//     //AWS
//     awsPointPrivate: string;
//     awsPoint: string;
//     awsAccessKey: string;
//     awsSecretKey: string;
//     awsBucketName: string;

//     OSS_POINT: string;
//     OSS_ACCESSKEY: string;
//     OSS_SECRETKEY: string;
//     OSS_BUCKETNAME: string;

//     //redis
//     redisHost: string;
//     redisPort: number;

//     constructor(envConfig: any) {
//         this.secret = envConfig.APP_SECRET;
//         this.prefix = envConfig.APP_PREFIX;

//         this.serviceUrl = envConfig.SERVICE_URL;

//         this.dbhost = envConfig.DB_HOST;
//         this.dbport = envConfig.DB_PORT && Number(envConfig.DB_PORT);
//         this.dbusername = envConfig.DB_USER;
//         this.dbpassword = envConfig.DB_PASSWORD;
//         this.dbdatabase = envConfig.DB_DATABASE;

//         this.minioPoint = envConfig.MINIO_POINT;
//         this.minioPort = envConfig.MINIO_PORT && Number(envConfig.MINIO_PORT);
//         this.minioAccessKey = envConfig.MINIO_ACCESSKEY;
//         this.minioSecretKey = envConfig.MINIO_SECRETKEY;
//         this.minioBucketName = envConfig.MINIO_BUCKETNAME;

//         this.awsPointPrivate = envConfig.AWS_POINT_PRIVATE;
//         this.awsPoint = envConfig.AWS_POINT;
//         this.awsAccessKey = envConfig.AWS_ACCESSKEY;
//         this.awsSecretKey = envConfig.AWS_SECRETKEY;
//         this.awsBucketName = envConfig.AWS_BUCKETNAME;
//         this.OSS_POINT = envConfig.OSS_POINT;
//         this.OSS_ACCESSKEY = envConfig.OSS_ACCESSKEY;
//         this.OSS_SECRETKEY = envConfig.OSS_SECRETKEY;
//         this.OSS_BUCKETNAME = envConfig.OSS_BUCKETNAME;

//         this.redisHost = envConfig.REDIS_HOST;
//         this.redisPort = envConfig.REDIS_PORT && Number(envConfig.REDIS_PORT);
//     }

//     fileUrl(path: string) {
//         return `${envConfig.serviceUrl}/api/file/download?path=${path}`;
//     }
// }

type ConfigEnv = {
    APP_SECRET: string;
    APP_HOST: string;
    APP_PORT: string;
    APP_PREFIX: string;

    SERVICE_URL: string;

    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;

    MINIO_POINT: string;
    MINIO_PORT: string;
    MINIO_ACCESSKEY: string;
    MINIO_SECRETKEY: string;
    MINIO_BUCKETNAME: string;

    AWS_POINT_PRIVATE: string;
    AWS_POINT: string;
    AWS_ACCESSKEY: string;
    AWS_SECRETKEY: string;
    AWS_BUCKETNAME: string;

    OSS_POINT: string;
    OSS_ACCESSKEY: string;
    OSS_SECRETKEY: string;
    OSS_BUCKETNAME: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_DB: string;
    REDIS_USER: string;
    REDIS_PASSWORD: string;
};

//实际上直接声明和环境变量一样的名字更好，代码也少也省事
const envConfig = dotenv.config().parsed as ConfigEnv;

function getDownloadFileUrl(path: string) {
    return `${envConfig.SERVICE_URL}/api/file/download?path=${path}`;
}

export { envConfig, getDownloadFileUrl };
