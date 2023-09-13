import { envConfig } from "src/app.config";
import { AfterLoad, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    //设置一个大类型,8个字节，默认int只有4个字节，small 2 字节，mediumint 3字节
    @Column('bigint', { default: 0})
    size: number;

    @Column({ default: null })
    filename: string;

    @Column({ default: null })
    mimetype: string

    //图片路径，客户端使用时，需要拼接 host
    @Column({ default: null })
    path: string

    //设置一个bool类型实际就是tinyint，1字节
    @Column('bool', { default: 0})
    isDelete: number

    //我们跟用户建立关系，直到是谁创建的，图片出问题方便追寻，这里不用即可，需要时引用到关系表最好
    // @ManyToOne(() => User, user => user)
    // @JoinColumn()
    // user: User

    @CreateDateColumn()
    timestamp: Date

    url: string

    @AfterLoad()
    generateUrl() {
        this.url = envConfig.fileUrl(this.path)
    }
}
