import { Blob } from "buffer";
import { User } from "src/user/entities/user.entity";
import { Binary, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 0 })
    size: number;

    @Column({ default: null })
    filename: string;

    @Column({ default: null })
    mimetype: string

    //图片路径，客户端使用时，需要拼接 host
    @Column({ default: null })
    path: string

    //我们跟用户建立关系，直到是谁创建的，图片出问题方便追寻，这里不用即可，需要时引用到关系表最好
    // @ManyToOne(() => User, user => user)
    // @JoinColumn()
    // user: User

    @CreateDateColumn()
    timestamp: Date
}
