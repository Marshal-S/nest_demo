import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FilePresignDto {
    @ApiProperty({ description: '图片大小', example: 1024 })
    @IsNotEmpty()
    size: number;

    @ApiProperty({
        description: '原文件名称',
        example: 'WechatIMG73085.jpg',
    })
    @IsNotEmpty()
    originname: string;

    @ApiProperty({ description: '图片mimetype', example: 'image/png' })
    mimetype: string;

    @ApiPropertyOptional({
        description:
            '是否需要图片固定url：0、(默认)，1、返回固定url 用于富文本',
    })
    unChanged: number;
}

export class RedisDto {
    @ApiProperty({ description: 'hash', example: 'hash_key' })
    hash_key: string;

    @ApiProperty({ description: 'key or hash_key', example: 'key' })
    key: string;

    @ApiPropertyOptional({ description: 'value', example: 'value' })
    value: string;
}
