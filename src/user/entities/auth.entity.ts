import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm"
import { User } from "./user.entity"

//为什么要单独创建，基于不同角度，这里是为了安全性，比较隐私的单独放在一个表，也方便管理
//另外也不能每次查询都要单独过滤出密码给用户返回吧，如果查询时隐藏，那么就无法对比
@Entity()  //默认带的 entity
export class Auth {
    //作为主键且创建时自动生成，默认自增
    @PrimaryGeneratedColumn()
    id: number

    //密码
    @Column({ length: 30, default: null }) //可以设置长度30个字节
    password: string

    //身份证
    @Column({ length: 20, default: null})
    idCard: string

    @VersionColumn() //自动记录内容更新次数，某些计次场景会用到
    version: number

    @CreateDateColumn({ type: 'timestamp' })
    createTime: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updateTime: Date

    @OneToOne(() => User, (user) => user.auth)
    @JoinColumn() //添加外键，建立表关联，会自动生成userId，这个id就是外键为另一个user表的primaryid
    user: User
    
    //这样给外键赋值时无需传递对象了，并且获取时还可以额外获得该属性，不需内容时无需连表查询
    //并不会减少字段，数据库实际会存放该字段，实际使用会更多地减少我们的查询逻辑
    @Column({ default: null })
    userId: number
}