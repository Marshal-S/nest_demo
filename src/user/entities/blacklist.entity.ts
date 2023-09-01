import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('black_list')  //默认带的 entity
export class BlackList {
	@PrimaryGeneratedColumn()
    id: number

    //作为主键且创建时自动生成，默认自增
    @Column({ unique: true, default: null })
    userId: number

	@CreateDateColumn()
	createDate: Date
}