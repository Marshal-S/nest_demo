import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ReqFileIdDto {
	@ApiProperty({ description: '文件id', example: 1 })
	@IsNotEmpty()
	id: number
}

export class ReqFilesIdDto {
	@ApiProperty({ description: '文件id', example: [1] })
	@IsNotEmpty()
	ids: number[]
}

