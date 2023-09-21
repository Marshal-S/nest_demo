import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, Validate } from "class-validator"
import { ArticleStatus } from "../article.enum"
import { PageDto } from "src/request/page.dto"

//创建
export class ArticleCreateDto {
    @ApiProperty({ description: '标题', example: 'nestjs入门' })
    @IsNotEmpty()
    title: string

    @ApiProperty({ description: '描述', example: '描述' })
    @IsNotEmpty()
    desc: string

    @ApiProperty({ description: '内容', example: '文章内容' })
    @IsNotEmpty()
    content: string

    //专栏id
    @ApiPropertyOptional({ description: '专栏id', example: 1 })
    feature_id: number
}

//删除
export class ArticleIdDto {
    @ApiProperty({ description: '文章id', example: 1 })
    @IsNotEmpty()
    id: number
}

//更新
export class ArticleUpdateDto extends ArticleIdDto {
    @ApiPropertyOptional({ description: '标题', example: 'nestjs入门' })
    @IsNotEmpty()
    title: string

    @ApiPropertyOptional({ description: '描述', example: '描述' })
    desc: string

    @ApiPropertyOptional({ description: '内容', example: '文章内容' })
    content: string

    @ApiPropertyOptional({ description: '0编辑中、1等待审核、2审核中、3成功、4失败', example: 0 })
    @Validate((val: ArticleStatus) => !val || (val >= 0 && val <= 4))
    status: ArticleStatus
}

//收藏
export class ArticleCollectDto extends ArticleIdDto {
    @ApiProperty({ description: '是否收藏：0取消 1收藏', example: 1 })
    @IsNotEmpty()
    is_collect: number
}

export class ArticleQueryDto extends PageDto {
    @ApiPropertyOptional({ description: '文章id', example: 1 })
    id: number

    @ApiPropertyOptional({ description: '模糊查询的名称：搜索标题、描述、内容', example: '标题' })
    name: string

    @ApiPropertyOptional({ description: '根据文章状态查询:编辑中、等待审核、审核中、成功、失败', example: `${JSON.stringify([ArticleStatus.editing, ArticleStatus.success])}` })
    status: ArticleStatus[]

    @ApiPropertyOptional({ description: '用户昵称模糊查询，和其他选项是或的关系，用户只要符合就查出来', example: 'mm' })
    nickname: string
}

export class ArticleTimeDto {
    @ApiPropertyOptional({ description: '日期：年-月-日(2023-12-12)' })
    datetime: string
}