import { User } from 'src/user/entities/user.entity';
import { ArticleStatus } from './../article.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/req-user.dto';

export class ArticleDto {
    @ApiProperty({ description: 'id', example: 1 })
    id: number

    @ApiProperty({ description: '标题', example: '标题' })
    title: string

    @ApiProperty({ description: '描述', example: '描述' })
    desc: string

    @ApiProperty({ description: '内容', example: '内容' })
    content: string

    //文章状态，默认创建即编辑中、等待审核、审核中、成功、失败
    @ApiProperty({ description: '编辑中、等待审核、审核中、成功、失败', example: ArticleStatus.editing })
    status: ArticleStatus

    @ApiProperty({ description: '创建时间', example: '2022' })
    createTime: Date

    @ApiProperty({ description: '创建时间', example: '2022' })
    updateTime: Date

    @ApiProperty({ description: '用户信息', type: () => UserDto,  example: UserDto })
    user: User
    @ApiProperty({ description: '用户信息', example: 1 })
    userId: number

    @ApiProperty({ description: '收藏数', example: 10 })
    collectCount: number

    @ApiProperty({ description: '所属专栏id', example: 10 })
    featureId: number
}

export class ArticleDetalDto extends ArticleDto {
    @ApiProperty({ description: '是否被收藏', example: 10 })
    isCollect: boolean
}