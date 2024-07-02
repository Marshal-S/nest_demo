import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { envConfig } from "./app.config"
import { DataSource, DataSourceOptions } from "typeorm"
import { Order } from "./order/entities/order.entity"
import { Article } from "./article/entities/article.entity"
import { User } from "./user/entities/user.entity"
import { Feature } from "./feature/entities/feature.entity"
import { BlackList } from "./user/entities/blacklist.entity"
import { Auth } from "./user/entities/auth.entity"

export const TypeormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT && Number(envConfig.DB_PORT),
    username: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_DATABASE,
    synchronize: false, //自动同步创建数据库表
    retryDelay: 500,
    retryAttempts: 10,
    autoLoadEntities: true, //自动查找entity实体
    // migrations: [],
	entities: [
        Order,
        File,
        Article,
		User,
		Feature,
		BlackList,
		Auth,
    ],
    // logging: true,
    // logging: "all",
    logger: 'file',
    //开了这个不开logging类型，查询时间超过设定ms的会保存，可以设置环境变量调整
    maxQueryExecutionTime: 500,
    // cache: true, //允许使用cache，默认使用一个新表作为缓存
    // cache: {
    //     type: 'ioredis',
    //     duration: 30000, //设置30s
    //     options: {
    //         host: envConfig.REDIS_HOST,
    //         port: Number(envConfig.REDIS_PORT),
    //     },
    // },
}
export const AppDataSource: any = new DataSource(TypeormConfig as DataSourceOptions)
