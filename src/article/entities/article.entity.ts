import { Feature } from "src/feature/entities/feature.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleStatus } from "../article.enum";

//文章
@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number

    //内容
    @Column({ default: null })
    title: string

    //描述
    @Column({ default: null })
    desc: string

    //内容
    @Column('mediumtext', { default: null })
    content: string

    //文章状态，默认创建即编辑中、等待审核、审核中、成功、失败
    //平时可以数字枚举或者个别字符，以提升实际效率和空间，文档注释最重要，这里纯粹为了看着清晰
    @Column('simple-enum', { 
        enum: [ArticleStatus.editing, ArticleStatus.waiting, ArticleStatus.checking, ArticleStatus.success, ArticleStatus.failure], 
        default: ArticleStatus.editing,
    })
    status: ArticleStatus

    @CreateDateColumn()
    createTime: Date

    @UpdateDateColumn()
    updateTime: Date

    @ManyToOne(() => User, user => user.articles)
    @JoinColumn()
    user: User
    @Column({ default: null })
    userId: number

    //假设需要显示收藏数很频繁，但收藏操作很不频繁，额外维护一个count
    @Column({ default: 0 })
    collectCount: number
    //一篇文章会被多个人收藏，一个人可以收藏多篇文章
    @ManyToMany(() => User, user => user.collects)
    @JoinTable() //多对多，会自动生成两个{nameId} + 主键的新表，表名:当前表名_当前键名_关联表名 例如：article_collects_user
    collects: User[]
    //如果想自定义名字，也可以自定义新表键名
    // @JoinTable({
    //     name: 'article_collects_user', //表名，前后表名，后面键名，方便某时候直接快速查询关系表
    //     joinColumns: [{ name: 'article_id' }], //本表外键，默认是驼峰式
    //     inverseJoinColumns: [{ name: 'user_id' }], //另一个表的外键
    // })

    //文章所属专栏
    //多篇文章会被收进一个专栏，一个专栏对应多篇文章
    @ManyToOne(() => Feature, feature => feature.articles)
    //添加一列外键，多对一要添加多的一方，他要关联查找到所属方，所属方必定包含多个自身，所以不需要单个外键
    //另外可以自定义外键列名 @JoinColumn('feature_id')，不自定义就是默认为 {name}Id
    @JoinColumn()
    feature: Feature
    @Column({ default: null })
    featureId: number

    @Column({ default: false, select: false })
    isDelete: boolean
}
