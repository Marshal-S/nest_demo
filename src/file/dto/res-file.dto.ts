import { ApiProperty } from '@nestjs/swagger';

export class ResFileDto {
	@ApiProperty({ description: '文件id', example: 1 })
	id: number

    @ApiProperty({ description: '图片大小', example: 1024 })
    size: number;

    @ApiProperty({ description: '图片名称，可用于签名 bucket 中的图片', example: '123123.jpg' })
    filename: string;

    @ApiProperty({ description: '图片mimetype', example: 'image/png' })
    mimetype: string

    //图片路径，客户端 disk 存储使用时，需要拼接 host 才行
    @ApiProperty({ description: 'disk图片路径', example: 'public' })
    path: string

    @ApiProperty({ description: '创建时间', example: '2012...' })
    timestamp: Date

	@ApiProperty({ description: '图片签名url，存在期限7天', example: 'http://www.baidu.com/1.png' })
    url: string
}
