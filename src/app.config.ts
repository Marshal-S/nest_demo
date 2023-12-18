import * as dotenv from 'dotenv';

class ConfigEnv  {
    secret: string;
    prefix: string;
    serviceUrl: string;
    
    //mysql
    dbhost: string;
    dbport: number;
    dbusername: string;
    dbpassword: string;
    dbdatabase: string;

    //minio
    minioPoint: string;
    minioPort: number
    minioAccessKey: string;
    minioSecretKey: string;
    minioBucketName: string;

    //AWS
    awsPoint: string
    awsAccessKey: string
    awsSecretKey: string
    awsBucketName: string

    //redis
    redisHost: string
    redisPort: number

    constructor(envConfig: any) {
        this.secret = envConfig.APP_SECRET;
        this.prefix = envConfig.APP_PREFIX

        this.serviceUrl = envConfig.SERVICE_URL

        this.dbhost = envConfig.DB_HOST;
        this.dbport = envConfig.DB_PORT && Number(envConfig.DB_PORT); 
        this.dbusername = envConfig.DB_USER;
        this.dbpassword = envConfig.DB_PASSWORD;
        this.dbdatabase = envConfig.DB_DATABASE;

        this.minioPoint = envConfig.MINIO_POINT;
        this.minioPort = envConfig.MINIO_PORT && Number(envConfig.MINIO_PORT);
        this.minioAccessKey = envConfig.MINIO_ACCESSKEY;
        this.minioSecretKey = envConfig.MINIO_SECRETKEY;
        this.minioBucketName = envConfig.MINIO_BUCKETNAME;

        this.awsPoint = envConfig.AWS_POINT
        this.awsAccessKey = envConfig.AWS_ACCESSKEY
        this.awsSecretKey = envConfig.AWS_SECRETKEY
        this.awsBucketName = envConfig.AWS_BUCKETNAME
    }

    fileUrl(path: string) {
        return `${envConfig.serviceUrl}/api/file/download?path=${path}`;
    }
}

const envConfig = new ConfigEnv(dotenv.config().parsed);

export { envConfig };