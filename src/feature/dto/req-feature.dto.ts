import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, Validate } from "class-validator"
import { FeatureStatus } from "../feature.enum"

//创建
export class FeatureCreateDto {
    @ApiProperty({ description: '标题', example: 'nestjs入门' })
    @IsNotEmpty()
    name: string
}

//删除
export class FeatureIdDto {
    @ApiProperty({ description: '专栏id', example: 1 })
    @IsNotEmpty()
    id: number
}

//更新
export class FeatureUpdateDto extends FeatureIdDto {
    @ApiProperty({ description: '标题', example: 'nestjs入门' })
    name: string

    @ApiPropertyOptional({ description: '1等待审核、2审核中、3成功、4失败', example: 1 })
    @Validate((val: FeatureStatus) => !val || (val >= 0 && val <= 4))
    status: FeatureStatus
}

//订阅， request相关dto，最好都用蛇形，避免前端的问题，返回值不需要
export class FeatureJoinDto extends FeatureIdDto {
	@ApiProperty({ description: '文章id', example: 2 })
	@IsNotEmpty()
	article_id: number
}