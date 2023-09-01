import { Article } from "src/article/entities/article.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FeatureStatus } from "../feature.enum";

//专栏
@Entity()
export class Feature {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: null })
    name: string

    //专栏状态，默认创建即送审，等待、审核中、成功、失败
    //平时可以数字或者单个字符，以提升实际效率和空间，文档注释最重要，这里纯粹为了看着清晰
    @Column('simple-enum', { 
        enum: [FeatureStatus.waiting, FeatureStatus.checking, FeatureStatus.success, FeatureStatus.failure], 
        default: FeatureStatus.waiting,
    })
    status: FeatureStatus

    //专栏拥有者
    //一个用户又有多个专栏，一个专栏被一个用户拥有
    @ManyToOne(() => User, user => user.features)
    @JoinColumn()
    user: User
    @Column({ default: null })
    userId: number

    //专栏内的文章
    //多篇文章会被收进一个专栏，一个专栏对应多篇文章
    @OneToMany(() => Article, article => article.feature)
    articles: Article[]

    //订阅者
    //一个专栏被多个用户订阅，一个用户可以订阅多个专栏
    @ManyToMany(() => User, user => user.subscribeFeatures)
    @JoinTable()
    subscribes: User[]
}
