import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

    //流水号（不含时间）OG_自增数字，一直累加
    @Index()
    @Column({ unique: true })
    code: string;

    //流水号（包含时间）OG_时间戳到日_自增数字，第二日自增数字会归零
    @Index()
    @Column({ unique: true })
    code_ex: string;

    @Column()
    name: string;

    @CreateDateColumn()
    created_time: Date;
}
