import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Auth } from "./auth.entity"
import { Feature } from "src/feature/entities/feature.entity"
import { Article } from "src/article/entities/article.entity"

@Entity()  //默认带的 entity
export class User {
    //作为主键且创建时自动生成，默认自增
    @PrimaryGeneratedColumn()
    id: number

    //用户名
    @Column({ unique: true, default: null })
    account: string

    //默认数据库的列，会根据 ts 类型，自动创建自定类型，默认字符串 255 byte，也就是255个unicode字符
    @Column({default: null})
    nickname: string

    //可以设置唯一值，参数可以点进去看详情
    @Column({ unique: true, default: null })
    wxId: string

    //设置默认值
    @Column({ default: null })
    age: number

    //设置枚举，实际推荐数字 + 文档即可，方便又实惠
    // @Column('simple-enum', { enum: ['0', 'woman', 'unknow'], default: 'unknow' })
    // sex: string
    @Column('simple-enum', { enum: [1, 2, 0], default: 0 })
    sex: number

    @Column({ default: null }) //默认最大字符串255字节，能储存255个unicode字符
    mobile: string

    //默认都是可变字节，如果设置最大长度比较小，但内容比较大，也能写入，但是效率可能会变低
    //默认最大字节数比较大，65535为text，另一个更大，也可以根据自行设置大小
    // @Column('mediumtext', {default: null})
    @Column('text', { default: null })
    desc: string

    @Column()
    income: string

    //下面是创建内容自动生成，和更新时自动更新的时间戳，分别代表该条记录创建时间和上次更新时间
    @CreateDateColumn({ type: 'timestamp' })
    createTime: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updateTime: Date

    //用户隐私信息表
    @OneToOne(() => Auth, auth => auth.user)
    auth: Auth
    
    //我发布的文章，一个用户多篇文章，一对多
    @OneToMany(() => Article, article => article.user)
    articles: Article[]

    //我的专栏
    //一个用户又有多个专栏，一个专栏被一个用户拥有
    @OneToMany(() => Feature, feature => feature.user)
    features: Feature[]

    //我订阅的专栏
    //一个专栏被多个用户订阅，一个用户可以订阅多个专栏
    @ManyToMany(() => Feature, feature => feature.subscribes)
    subscribeFeatures: Feature[]

    //收藏文章
    //一篇文章会被多个人收藏，一个人可以收藏多篇文章
    @ManyToMany(() => Article, article => article.collects)
    collects: Article[]
}