import { ApiProperty } from "@nestjs/swagger"
import { FeatureStatus } from "../feature.enum"
import { UserDto } from "src/user/dto/req-user.dto"
import { ArticleDto } from "src/article/dto/res-article.dto"

export class FeatureDto {
	@ApiProperty({ description: 'id', example: 1 })
    id: number

	@ApiProperty({ description: '名称', example: '1231' })
    name: string

    //专栏状态，默认创建即送审，等待、审核中、成功、失败
    //平时可以数字或者单个字符，以提升实际效率和空间，文档注释最重要，这里纯粹为了看着清晰
	@ApiProperty({ description: '状态', example: 1 })
    status: FeatureStatus

	@ApiProperty({ description: '用户id', example: 1 })
    userId: number
}

export class FeatureDetailDto extends FeatureDto {
    //专栏拥有者
    @ApiProperty({ description: '用户信息', type: () => UserDto,  example: UserDto })
    user: UserDto

    @ApiProperty({ description: '文章列表', type: () => [ArticleDto],  example: ArticleDto })
    articles: ArticleDto[]

    @ApiProperty({ description: '订阅列表', type: () => [UserDto],  example: UserDto })
    subscribes: UserDto[]
}