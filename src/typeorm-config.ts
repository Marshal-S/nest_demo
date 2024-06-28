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
}
export const AppDataSource: any = new DataSource(TypeormConfig as DataSourceOptions)
